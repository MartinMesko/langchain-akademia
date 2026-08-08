/* ============================================================
   DOCKER PLAYGROUND — simulátor Docker enginu
   Beží celý v prehliadači: udržiava stav (images, kontajnery,
   volumes, siete, súbory) a vracia výstup, ktorý zodpovedá
   skutočnému Dockeru. Nič sa nikam neposiela.
   ============================================================ */
(function () {
  'use strict';

  /* ── Pomocníky ─────────────────────────────────────────── */
  const HEX = '0123456789abcdef';
  const nahodneId = (n = 12) => Array.from({ length: n },
    () => HEX[Math.floor(Math.random() * 16)]).join('');

  const ADJ = ['vibrant', 'clever', 'eager', 'jolly', 'nifty', 'quirky',
               'serene', 'bold', 'witty', 'zen', 'happy', 'gifted'];
  const NOUN = ['tesla', 'curie', 'turing', 'hopper', 'lovelace', 'bohr',
                'newton', 'darwin', 'galileo', 'einstein', 'mendel', 'noether'];
  const nahodne = a => a[Math.floor(Math.random() * a.length)];

  function odvtedy(ms) {
    const s = Math.max(1, Math.round((Date.now() - ms) / 1000));
    if (s < 60) return `${s} second${s === 1 ? '' : 's'}`;
    const m = Math.round(s / 60);
    if (m < 60) return `${m} minute${m === 1 ? '' : 's'}`;
    const h = Math.round(m / 60);
    return `${h} hour${h === 1 ? '' : 's'}`;
  }

  function tabulka(hlavicka, riadky) {
    const sirky = hlavicka.map((h, i) =>
      Math.max(h.length, ...riadky.map(r => String(r[i] ?? '').length)));
    const riadok = bunky => bunky
      .map((b, i) => String(b ?? '').padEnd(i === bunky.length - 1 ? 0 : sirky[i] + 3))
      .join('').replace(/\s+$/, '');
    return [riadok(hlavicka), ...riadky.map(riadok)];
  }

  /* ── Katalóg obrazov („registry") ──────────────────────── */
  const KATALOG = {
    'hello-world': {
      tag: 'latest', velkost: '13.3kB', cmd: '"/hello"', dlhobeziaci: false,
      logy: [
        '', 'Hello from Docker!',
        'This message shows that your installation appears to be working correctly.', '',
      ],
    },
    'nginx': {
      tag: 'latest', velkost: '187MB', cmd: '"/docker-entrypoint.…"',
      dlhobeziaci: true, port: 80,
      logy: [
        '/docker-entrypoint.sh: Configuration complete; ready for start up',
        'nginx/1.27.3',
        'start worker processes',
      ],
    },
    'redis': {
      tag: '7', velkost: '117MB', cmd: '"docker-entrypoint.s…"',
      dlhobeziaci: true, port: 6379,
      logy: [
        '1:C Redis is starting, version=7.4.1',
        '1:M Ready to accept connections tcp',
      ],
    },
    'postgres': {
      tag: '16', velkost: '432MB', cmd: '"docker-entrypoint.s…"',
      dlhobeziaci: true, port: 5432, vyzaduje: ['POSTGRES_PASSWORD'],
      logy: [
        'PostgreSQL init process complete; ready for start up.',
        'database system is ready to accept connections',
      ],
      chybaLogy: [
        'Error: Database is uninitialized and superuser password is not specified.',
        '       You must specify POSTGRES_PASSWORD to a non-empty value for the',
        '       superuser. For example, -e POSTGRES_PASSWORD=password on "docker run".',
      ],
    },
    'python': {
      tag: '3.12-slim', velkost: '130MB', cmd: '"python3"', dlhobeziaci: false,
      logy: [],
    },
    'node': {
      tag: '20-alpine', velkost: '135MB', cmd: '"node"', dlhobeziaci: false, logy: [],
    },
    'mongo': {
      tag: '7', velkost: '795MB', cmd: '"docker-entrypoint.s…"',
      dlhobeziaci: true, port: 27017,
      logy: ['Waiting for connections on port 27017'],
    },
  };

  const SUBORY_START = {
    'Dockerfile': `# Napíš sem svoj Dockerfile (v Playgrounde ho vieš upraviť v editore)
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]`,
    'app.py': `print("Ahoj z kontajnera!")`,
    'requirements.txt': `langchain==0.3.25
langchain-openai==0.3.18
fastapi==0.115.0`,
    '.dockerignore': `.git
__pycache__
.env
*.md`,
    'docker-compose.yml': `services:
  api:
    image: moja-appka:1.0
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://cache:6379
    depends_on:
      - cache
  cache:
    image: redis:7`,
  };

  /* ── Parsovanie príkazového riadka ─────────────────────── */
  function rozdel(riadok) {
    const von = [];
    let cur = '', q = null;
    for (const ch of riadok.trim()) {
      if (q) { if (ch === q) q = null; else cur += ch; }
      else if (ch === '"' || ch === "'") q = ch;
      else if (/\s/.test(ch)) { if (cur) { von.push(cur); cur = ''; } }
      else cur += ch;
    }
    if (cur) von.push(cur);
    return von;
  }

  /* ── Engine ────────────────────────────────────────────── */
  function vyrobEngine() {
    const stav = {
      obrazy: [],       // {repo, tag, id, velkost, vytvorene, vlastny}
      kontajnery: [],   // {id, meno, obraz, stav, porty, env, volumes, logy, vytvorene, exitCode, cmd}
      volumes: [],      // {meno, vytvorene}
      siete: [
        { meno: 'bridge', driver: 'bridge' },
        { meno: 'host', driver: 'host' },
        { meno: 'none', driver: 'null' },
      ],
      subory: Object.assign({}, SUBORY_START),
      historia: [],           // všetky zadané príkazy
      // príznaky skutočne vykonaných vecí — misie sa kontrolujú podľa nich,
      // nie podľa toho, čo si používateľ napísal do terminálu
      logyVidene: [],         // obrazy kontajnerov, ktorých logy si naozaj videl
      spadnutyPostgres: false,
      buildZlyhal: false,
      composeSpustenych: 0,
      composeZhodeny: false,
    };

    const O = (text, cls) => ({ text, cls });
    const chyba = t => [O(t, 'err')];
    // bezpečné hľadanie súboru — nesmie sa dostať na Object.prototype (cat toString…)
    const maSubor = f => Object.prototype.hasOwnProperty.call(stav.subory, f) &&
                         typeof stav.subory[f] === 'string';

    const najdiObraz = (repo, tag) => stav.obrazy.find(o =>
      o.repo === repo && (!tag || o.tag === tag));

    function najdiKontajner(kluc) {
      return stav.kontajnery.find(k =>
        k.meno === kluc || k.id === kluc || k.id.startsWith(kluc));
    }

    function pridajObraz(repo, tag, velkost, vlastny) {
      const existuje = najdiObraz(repo, tag);
      if (existuje) return existuje;
      const o = { repo, tag, id: nahodneId(12), velkost, vytvorene: Date.now(), vlastny: !!vlastny };
      stav.obrazy.unshift(o);
      return o;
    }

    function rozlozObraz(spec) {
      const [repo, tag] = spec.includes(':') ? spec.split(':') : [spec, null];
      return { repo, tag: tag || (KATALOG[repo] ? KATALOG[repo].tag : 'latest') };
    }

    /* ── docker pull ── */
    function pull(spec) {
      const { repo, tag } = rozlozObraz(spec);
      const kat = KATALOG[repo];
      if (!kat) return chyba(`Error response from daemon: pull access denied for ${repo}, repository does not exist or may require 'docker login'`);
      if (najdiObraz(repo, tag)) {
        return [O(`${tag}: Pulling from library/${repo}`),
                O('Status: Image is up to date for ' + repo + ':' + tag, 'dim')];
      }
      pridajObraz(repo, tag, kat.velkost);
      return [
        O(`${tag}: Pulling from library/${repo}`),
        O('a2318d6c47ec: Pull complete', 'dim'),
        O('9f4a2b1c8e30: Pull complete', 'dim'),
        O(`Digest: sha256:${nahodneId(12)}${nahodneId(12)}`, 'dim'),
        O(`Status: Downloaded newer image for ${repo}:${tag}`, 'ok'),
        O(`docker.io/library/${repo}:${tag}`, 'dim'),
      ];
    }

    /* ── docker run ── */
    function run(args) {
      const opt = { detach: false, porty: [], env: {}, volumes: [], meno: null,
                    rm: false, it: false, siet: null, workdir: null, restart: null };
      let i = 0;
      for (; i < args.length; i++) {
        const a = args[i];
        if (a === '-d' || a === '--detach') opt.detach = true;
        else if (a === '--rm') opt.rm = true;
        else if (a === '-it' || a === '-ti' || a === '-i' || a === '-t') opt.it = true;
        else if (a === '-p' || a === '--publish') {
          const h = args[++i];
          if (!h) return chyba(`flag needs an argument: 'p' in -p\nSee 'docker run --help'.`);
          opt.porty.push(h);
        }
        else if (a.startsWith('-p') && a.length > 2) opt.porty.push(a.slice(2));
        else if (a === '-e' || a === '--env') {
          const kv = args[++i] || '';
          const j = kv.indexOf('=');
          if (j > 0) opt.env[kv.slice(0, j)] = kv.slice(j + 1);
          else if (kv) opt.env[kv] = '';
        }
        else if (a === '-v' || a === '--volume') {
          const v = args[++i];
          if (!v) return chyba(`flag needs an argument: 'v' in -v\nSee 'docker run --help'.`);
          opt.volumes.push(v);
        }
        else if (a === '--name') {
          opt.meno = args[++i];
          if (!opt.meno) return chyba(`flag needs an argument: --name`);
          if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(opt.meno)) {
            return chyba(`docker: Error response from daemon: Invalid container name (${opt.meno}), only [a-zA-Z0-9][a-zA-Z0-9_.-] are allowed.`);
          }
        }
        else if (a === '--network' || a === '--net') {
          opt.siet = args[++i];
          if (!opt.siet) return chyba(`flag needs an argument: --network`);
          if (!stav.siete.some(s => s.meno === opt.siet)) {
            return chyba(`docker: Error response from daemon: network ${opt.siet} not found.\nVytvor ju najprv: docker network create ${opt.siet}`);
          }
        }
        else if (a === '-w' || a === '--workdir') opt.workdir = args[++i];
        else if (a === '-u' || a === '--user' || a === '--entrypoint' ||
                 a === '-m' || a === '--memory' || a === '--env-file' || a === '--restart') {
          const hodnota = args[++i];
          if (a === '--restart') opt.restart = hodnota;
        }
        else if (a === '--read-only' || a === '--init' || a === '--privileged') { /* prijmeme, netreba modelovať */ }
        else if (a.startsWith('-')) return chyba(`docker: unknown flag: ${a}\nNapíš help pre zoznam podporovaných prepínačov.`);
        else break;
      }
      const spec = args[i];
      if (!spec) return chyba(`"docker run" requires at least 1 argument.\nUsage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`);
      const prikaz = args.slice(i + 1);
      const { repo, tag } = rozlozObraz(spec);
      const kat = KATALOG[repo];
      let obraz = najdiObraz(repo, tag);
      const von = [];

      if (!obraz) {
        if (!kat) return chyba(`Unable to find image '${repo}:${tag}' locally\ndocker: Error response from daemon: pull access denied for ${repo}.`);
        von.push(O(`Unable to find image '${repo}:${tag}' locally`, 'dim'));
        von.push(O(`${tag}: Pulling from library/${repo}`, 'dim'));
        von.push(O(`Status: Downloaded newer image for ${repo}:${tag}`, 'dim'));
        obraz = pridajObraz(repo, tag, kat.velkost);
      }

      if (opt.meno && stav.kontajnery.some(k => k.meno === opt.meno)) {
        return chyba(`docker: Error response from daemon: Conflict. The container name "/${opt.meno}" is already in use.`);
      }

      // konflikt portov
      for (const p of opt.porty) {
        const hostPort = String(p).split(':')[0];
        const kolizia = stav.kontajnery.find(k => k.stav === 'running' &&
          k.porty.some(x => String(x).split(':')[0] === hostPort));
        if (kolizia) return chyba(`docker: Error response from daemon: driver failed programming external connectivity: Bind for 0.0.0.0:${hostPort} failed: port is already allocated.`);
      }

      // volumes: pomenované sa vytvoria automaticky
      opt.volumes.forEach(v => {
        const meno = String(v).split(':')[0];
        if (meno && !meno.startsWith('.') && !meno.startsWith('/') &&
            !stav.volumes.some(x => x.meno === meno)) {
          stav.volumes.push({ meno, vytvorene: Date.now() });
        }
      });

      const profil = kat || { dlhobeziaci: false, logy: [], cmd: '"…"' };
      // prázdna hodnota sa počíta ako chýbajúca — presne ako v skutočnom postgres obraze
      const chybaEnv = (profil.vyzaduje || []).filter(k => !opt.env[k]);
      const vlastnyBezDlhobezneho = obraz.vlastny;

      const k = {
        id: nahodneId(12),
        meno: opt.meno || `${nahodne(ADJ)}_${nahodne(NOUN)}`,
        obraz: `${repo}:${tag}`,
        porty: opt.porty.slice(),
        env: Object.assign({}, opt.env),
        volumes: opt.volumes.slice(),
        siet: opt.siet || 'bridge',
        vytvorene: Date.now(),
        cmd: prikaz.length ? `"${prikaz.join(' ')}"` : (profil.cmd || '"…"'),
        logy: [],
        rm: opt.rm,
      };

      if (chybaEnv.length) {
        k.stav = 'exited'; k.exitCode = 1;
        k.logy = (profil.chybaLogy || [`Error: chýba premenná ${chybaEnv[0]}`]).slice();
        if (repo === 'postgres') stav.spadnutyPostgres = true;
      } else if (prikaz.length) {
        // vlastný príkaz prebíja CMD obrazu — aj pri vlastných (built) obrazoch
        k.stav = 'exited'; k.exitCode = 0;
        k.logy = [prikaz.join(' ').replace(/^echo\s+/, '')];
      } else if (vlastnyBezDlhobezneho) {
        // vlastný image z Dockerfile: beží, ak má CMD servera, inak dobehne
        const df = stav.subory['Dockerfile'] || '';
        const server = /uvicorn|gunicorn|flask|fastapi|http\.server|node\s|npm start/i.test(df);
        k.stav = server ? 'running' : 'exited';
        k.exitCode = server ? null : 0;
        k.logy = server
          ? ['INFO:     Started server process [1]', 'INFO:     Application startup complete.']
          : [String(stav.subory['app.py'] || '').match(/print\("(.*?)"\)/)?.[1] || 'Kontajner dobehol.'];
      } else if (profil.dlhobeziaci) {
        k.stav = 'running'; k.exitCode = null; k.logy = (profil.logy || []).slice();
      } else {
        k.stav = 'exited'; k.exitCode = 0; k.logy = (profil.logy || []).slice();
      }

      stav.kontajnery.unshift(k);

      if (opt.detach) {
        von.push(O(k.id + nahodneId(52)));
        if (k.stav === 'exited' && k.exitCode === 1) {
          von.push(O(`⚠ Kontajner '${k.meno}' hneď skončil s chybou. Pozri: docker logs ${k.meno}`, 'warn'));
        }
        if (k.rm && k.stav === 'exited') stav.kontajnery = stav.kontajnery.filter(x => x !== k);
        return von;
      }

      // beh v popredí
      k.logy.forEach(l => von.push(O(l)));
      if (opt.it) {
        von.push(O('(interaktívny režim: v Playgrounde nie je shell — použi docker exec)', 'dim'));
        k.stav = 'exited'; k.exitCode = 0;
      } else if (k.stav === 'running') {
        von.push(O('^C', 'dim'));
        von.push(O('Kontajner bežal v popredí a Ctrl+C ho ukončil. Nabudúce pridaj -d (detach).', 'warn'));
        k.stav = 'exited'; k.exitCode = 0;
      }
      if (k.rm) stav.kontajnery = stav.kontajnery.filter(x => x !== k);
      return von;
    }

    /* ── docker build ── */
    function build(args) {
      let tagSpec = null, kontext = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-t' || args[i] === '--tag') {
          tagSpec = args[++i];
          if (!tagSpec) return chyba(`flag needs an argument: 't' in -t`);
          if (tagSpec === '.' || tagSpec.startsWith('/') || tagSpec.startsWith('./')) {
            return chyba(`invalid reference format: "${tagSpec}" nie je platné meno obrazu (za -t patrí meno:tag, kontext je až na konci)`);
          }
        }
        else if (!args[i].startsWith('-')) kontext = args[i];
      }
      if (kontext === null) return chyba(`"docker build" requires exactly 1 argument.\nUsage:  docker build [OPTIONS] PATH\nNezabudni na bodku na konci: docker build -t meno:tag .`);
      if (kontext !== '.') return chyba(`unable to prepare context: path "${kontext}" not found`);
      const df = stav.subory['Dockerfile'];
      if (!df || !df.trim()) return chyba('ERROR: failed to read dockerfile: open Dockerfile: no such file or directory');

      const riadky = df.split('\n').map(r => r.trim())
        .filter(r => r && !r.startsWith('#'));
      const prvy = riadky[0] || '';
      if (!/^FROM\s/i.test(prvy)) {
        stav.buildZlyhal = true;   // pre kontrolu misie 9
        return chyba('ERROR: failed to solve: dockerfile parse error: no build stage in current context (Dockerfile musí začínať inštrukciou FROM)');
      }
      const zaklad = prvy.split(/\s+/)[1];
      const { repo, tag } = rozlozObraz(zaklad);
      if (!KATALOG[repo]) return chyba(`ERROR: failed to solve: ${zaklad}: not found (neznámy základný obraz)`);

      // COPY musí kopírovať existujúce súbory
      for (const r of riadky) {
        const m = /^COPY\s+(\S+)\s+(\S+)/i.exec(r);
        if (m && m[1] !== '.' && !stav.subory[m[1]]) {
          return chyba(`ERROR: failed to compute cache key: "/${m[1]}" not found: not found`);
        }
      }

      const kroky = riadky.filter(r => /^(FROM|RUN|COPY|WORKDIR|ENV|EXPOSE|CMD|ENTRYPOINT|ARG|USER)\s/i.test(r));
      const von = [O(`[+] Building 12.4s (${kroky.length + 3}/${kroky.length + 3}) FINISHED`, 'ok')];
      von.push(O(' => [internal] load build definition from Dockerfile', 'dim'));
      von.push(O(` => => transferring dockerfile: ${df.length}B`, 'dim'));
      von.push(O(` => [internal] load metadata for docker.io/library/${repo}:${tag}`, 'dim'));
      kroky.forEach((r, i) => {
        const cislo = i === 0 ? `[${i + 1}/${kroky.length}]` : `[${i + 1}/${kroky.length}]`;
        von.push(O(` => ${cislo} ${r.length > 66 ? r.slice(0, 63) + '…' : r}`, 'dim'));
      });
      von.push(O(' => exporting to image', 'dim'));

      if (!najdiObraz(repo, tag)) pridajObraz(repo, tag, KATALOG[repo].velkost);
      if (tagSpec) {
        const c = rozlozObraz(tagSpec);
        const novy = pridajObraz(c.repo, c.tag, '142MB', true);
        novy.vlastny = true;
        von.push(O(` => => naming to docker.io/library/${c.repo}:${c.tag}`, 'dim'));
        von.push(O(`Image ${c.repo}:${c.tag} je hotový.`, 'ok'));
      } else {
        von.push(O('Tip: bez -t nemá image meno. Skús: docker build -t moja-appka:1.0 .', 'warn'));
      }
      return von;
    }

    /* ── docker compose ── */
    function compose(args) {
      const pod = args[0];
      const yml = stav.subory['docker-compose.yml'];
      if (!yml) return chyba('no configuration file provided: not found');

      if (pod === 'up') {
        const detach = args.includes('-d') || args.includes('--detach');
        const sluzby = [];
        let aktualna = null, vSekciiSluzby = false, vPortoch = false;
        yml.split('\n').forEach(r => {
          // sledujeme, v ktorej top-level sekcii sme (services / volumes / networks)
          const top = /^([a-z0-9_-]+):\s*$/i.exec(r);
          if (top) { vSekciiSluzby = top[1] === 'services'; aktualna = null; return; }
          if (!vSekciiSluzby) return;
          const m = /^  ([a-z0-9_-]+):\s*$/i.exec(r);
          if (m) { aktualna = { meno: m[1], image: null, build: false, porty: [] }; sluzby.push(aktualna); vPortoch = false; return; }
          if (!aktualna) return;
          const mi = /^\s+image:\s*(\S+)/.exec(r);
          if (mi) { aktualna.image = mi[1].replace(/["']/g, ''); return; }
          if (/^\s+build:/.test(r)) { aktualna.build = true; return; }
          if (/^\s+ports:/.test(r)) { vPortoch = true; return; }
          if (/^\s+[a-z_]+:/i.test(r)) { vPortoch = false; return; }
          const mp = /^\s+-\s*["']?(\d+:\d+)["']?/.exec(r);
          if (mp && vPortoch) aktualna.porty.push(mp[1]);
        });
        if (!sluzby.length) return chyba('services must be a mapping (skontroluj docker-compose.yml — kľúč services a odsadenie o 2 medzery)');

        const von = [O(`[+] Running ${sluzby.length + 1}/${sluzby.length + 1}`, 'ok')];
        if (!stav.siete.some(s => s.meno === 'akademia_default')) {
          stav.siete.push({ meno: 'akademia_default', driver: 'bridge' });
          von.push(O(' ✔ Network akademia_default  Created', 'ok'));
        }
        sluzby.forEach(s => {
          const meno = `akademia-${s.meno}-1`;
          if (stav.kontajnery.some(k => k.meno === meno)) {
            von.push(O(` ✔ Container ${meno}  Running`, 'dim'));
            return;
          }
          const { repo, tag } = rozlozObraz(s.image || (s.build ? 'moja-appka:1.0' : 'nginx'));
          const kat = KATALOG[repo];
          const vlastny = najdiObraz(repo, tag)?.vlastny;
          if (!kat && !vlastny && !s.build) {
            von.push(O(` ✘ Container ${meno}  Error: image ${s.image} not found`, 'err'));
            return;
          }
          if (!kat && !vlastny && s.build) pridajObraz(repo, tag, '142MB', true);
          if (kat && !najdiObraz(repo, tag)) pridajObraz(repo, tag, kat.velkost);
          const cmdZDockerfile = /CMD\s+\[([^\]]+)\]/i.exec(stav.subory['Dockerfile'] || '');
          stav.kontajnery.unshift({
            id: nahodneId(12), meno, obraz: `${repo}:${tag}`,
            porty: s.porty, env: {}, volumes: [], vytvorene: Date.now(),
            cmd: (kat && kat.cmd) ||
                 (cmdZDockerfile ? `"${cmdZDockerfile[1].replace(/["']/g, '').replace(/,\s*/g, ' ')}"` : '"…"'),
            stav: 'running', exitCode: null,
            logy: (kat && kat.logy) || ['Application startup complete.'],
            compose: true,
          });
          von.push(O(` ✔ Container ${meno}  Started`, 'ok'));
        });
        stav.composeSpustenych = stav.kontajnery.filter(k => k.compose).length;
        if (!detach) von.push(O('Tip: bez -d by ti compose obsadil terminál logmi.', 'warn'));
        return von;
      }

      if (pod === 'down') {
        const kolko = stav.kontajnery.filter(k => k.compose).length;
        if (!kolko) return [O('No containers to remove', 'dim')];
        const von = stav.kontajnery.filter(k => k.compose)
          .map(k => O(` ✔ Container ${k.meno}  Removed`, 'ok'));
        stav.kontajnery = stav.kontajnery.filter(k => !k.compose);
        stav.composeZhodeny = true;
        stav.siete = stav.siete.filter(s => s.meno !== 'akademia_default');
        von.push(O(' ✔ Network akademia_default  Removed', 'ok'));
        if (args.includes('-v') || args.includes('--volumes')) {
          stav.volumes.length = 0;
          von.push(O(' ✔ Volume dbdata  Removed', 'warn'));
        }
        return [O(`[+] Running ${kolko + 1}/${kolko + 1}`, 'ok'), ...von];
      }

      if (pod === 'ps') {
        const r = stav.kontajnery.filter(k => k.compose)
          .map(k => [k.meno, k.obraz, k.cmd, k.stav === 'running' ? 'running' : 'exited',
                     k.porty.map(p => {
                       const [h, c] = String(p).split(':');
                       return `0.0.0.0:${h}->${c}/tcp`;
                     }).join(', ')]);
        if (!r.length) return [O('no such service', 'dim')];
        return tabulka(['NAME', 'IMAGE', 'COMMAND', 'SERVICE', 'PORTS'], r).map(x => O(x));
      }

      if (pod === 'logs') {
        const von = [];
        stav.kontajnery.filter(k => k.compose).forEach(k =>
          k.logy.forEach(l => von.push(O(`${k.meno}  | ${l}`))));
        return von.length ? von : [O('(žiadne logy)', 'dim')];
      }

      return chyba(`docker compose: '${pod || ''}' is not a compose command.\nSkús: up -d, down, ps, logs`);
    }

    /* ── výpisy ── */
    function ps(vsetky) {
      const zoznam = stav.kontajnery.filter(k => vsetky || k.stav === 'running');
      const riadky = zoznam.map(k => [
        k.id.slice(0, 12), k.obraz, k.cmd, odvtedy(k.vytvorene) + ' ago',
        k.stav === 'running' ? `Up ${odvtedy(k.vytvorene)}`
          : `Exited (${k.exitCode ?? 0}) ${odvtedy(k.vytvorene)} ago`,
        k.porty.map(p => {
          const [h, c] = String(p).split(':');
          return `0.0.0.0:${h}->${c}/tcp`;
        }).join(', '),
        k.meno,
      ]);
      return tabulka(['CONTAINER ID', 'IMAGE', 'COMMAND', 'CREATED', 'STATUS', 'PORTS', 'NAMES'], riadky)
        .map((t, i) => O(t, i === 0 ? 'head' : null));
    }

    function images() {
      const riadky = stav.obrazy.map(o => [
        o.repo, o.tag, o.id.slice(0, 12), odvtedy(o.vytvorene) + ' ago', o.velkost]);
      return tabulka(['REPOSITORY', 'TAG', 'IMAGE ID', 'CREATED', 'SIZE'], riadky)
        .map((t, i) => O(t, i === 0 ? 'head' : null));
    }

    /* ── docker exec ── */
    const EXEC_ODPOVEDE = {
      'ls': 'app.py  requirements.txt',
      'pwd': '/app',
      'whoami': 'root',
      'env': null,   // vypíše env kontajnera
      'python --version': 'Python 3.12.7',
      'python3 --version': 'Python 3.12.7',
      'redis-cli ping': 'PONG',
      'nginx -v': 'nginx version: nginx/1.27.3',
      'hostname': null,
      'date': new Date().toUTCString(),
    };

    function exec(args) {
      let i = 0;
      while (i < args.length && args[i].startsWith('-')) i++;   // flagy pred kontajnerom (-it…)
      const kluc = args[i];
      if (!kluc) return chyba('"docker exec" requires at least 2 arguments.');
      const k = najdiKontajner(kluc);
      if (!k) return chyba(`Error response from daemon: No such container: ${kluc}`);
      if (k.stav !== 'running') return chyba(`Error response from daemon: container ${k.meno} is not running`);
      const prikaz = args.slice(i + 1).join(' ');   // zvyšok je príkaz aj s prepínačmi
      if (!prikaz) return chyba('"docker exec" requires at least 2 arguments.');
      if (prikaz === 'env') {
        const e = Object.entries(k.env).map(([a, b]) => O(`${a}=${b}`));
        return [O('PATH=/usr/local/bin:/usr/bin:/bin'), O('HOSTNAME=' + k.id.slice(0, 12)), ...e];
      }
      if (prikaz === 'hostname') return [O(k.id.slice(0, 12))];
      if (prikaz === 'bash' || prikaz === 'sh' || prikaz === '/bin/bash') {
        return [O('(interaktívny shell nie je v Playgrounde dostupný — skús napr. docker exec ' + k.meno + ' ls)', 'dim')];
      }
      if (prikaz.startsWith('cat')) {
        const f = prikaz.slice(3).trim().replace(/^\.?\//, '');
        if (!f) return chyba('cat: chýba názov súboru (skús: cat Dockerfile)');
        return maSubor(f) ? stav.subory[f].split('\n').map(l => O(l))
                          : chyba(`cat: ${f}: No such file or directory`);
      }
      if (Object.prototype.hasOwnProperty.call(EXEC_ODPOVEDE, prikaz)) {
        return [O(EXEC_ODPOVEDE[prikaz])];
      }
      // známy program s prepínačmi (ls -la, echo ahoj…) — nevydávaj to za chýbajúci program
      const program = prikaz.split(' ')[0];
      if (program === 'echo') return [O(prikaz.slice(5))];
      if (Object.prototype.hasOwnProperty.call(EXEC_ODPOVEDE, program)) {
        return [O(EXEC_ODPOVEDE[program]),
                O(`(Playground nepozná variant „${prikaz}" — výstup je zjednodušený)`, 'dim')];
      }
      return chyba(`OCI runtime exec failed: exec failed: unable to start container process: exec: "${program}": executable file not found in $PATH`);
    }

    /* ── hlavný rozcestník ─────────────────────────────────── */
    function spusti(riadok) {
      const cely = riadok.trim();
      if (!cely) return [];
      stav.historia.push(cely);
      const t = rozdel(cely);

      // pomocné shell príkazy
      if (t[0] === 'ls') return [O(Object.keys(stav.subory).join('  '))];
      if (t[0] === 'pwd') return [O('/home/martin/projekt')];
      if (t[0] === 'cat') {
        const f = (t[1] || '').replace(/^\.?\//, '');
        if (!f) return chyba('cat: chýba názov súboru (skús: cat Dockerfile)');
        return maSubor(f) ? stav.subory[f].split('\n').map(l => O(l))
                          : chyba(`cat: ${t[1]}: No such file or directory`);
      }
      if (t[0] === 'help' || t[0] === 'pomoc') {
        return [
          O('Dostupné príkazy v Playgrounde:', 'head'),
          O('  docker pull <obraz>              stiahne obraz'),
          O('  docker images                    zoznam obrazov'),
          O('  docker run [-d] [-p 8080:80] [--name x] [-e K=V] [-v vol:/cesta] <obraz>'),
          O('  docker ps [-a]                   bežiace / všetky kontajnery'),
          O('  docker logs <kontajner>          výpis logov'),
          O('  docker exec <kontajner> <prikaz> príkaz vnútri kontajnera'),
          O('  docker stop|start|restart|rm <kontajner>'),
          O('  docker rmi <obraz>               zmaže obraz'),
          O('  docker build -t meno:tag .       postaví obraz z Dockerfile'),
          O('  docker inspect <kontajner>       podrobnosti'),
          O('  docker volume ls|create|rm       trvalé úložiská'),
          O('  docker network ls                siete'),
          O('  docker compose up -d|down|ps|logs'),
          O('  docker stats                     spotreba zdrojov'),
          O('  docker system prune -f           upratovanie'),
          O('  ls, cat <subor>, clear, reset    pomocné príkazy'),
        ];
      }
      if (t[0] !== 'docker') {
        return chyba(`${t[0]}: command not found (v Playgrounde funguje docker, ls, cat, help)`);
      }

      let pod = t[1];
      let a = t.slice(2);

      // nápoveda v akomkoľvek tvare (docker help, docker --help, docker run --help)
      if (!pod || pod === 'help' || pod === '--help' || pod === '-h' || a.includes('--help') || a.includes('-h')) {
        return spusti('help');
      }

      // "docker container ls|rm|stop|start|logs|inspect" = alias na krátky tvar
      if (pod === 'container') {
        const mapa = { ls: 'ps', ps: 'ps', rm: 'rm', stop: 'stop', start: 'start',
                       logs: 'logs', inspect: 'inspect', exec: 'exec', prune: 'prune' };
        const novy = mapa[a[0]];
        if (!novy) return chyba(`docker container: '${a[0] || ''}' is not a docker command.`);
        pod = novy; a = a.slice(1);
      }

      switch (pod) {
        case '--version':
        case 'version':
          return [O('Docker version 27.3.1, build ce12230')];
        case 'pull': return a[0] ? pull(a[0]) : chyba('"docker pull" requires exactly 1 argument.');
        case 'run': return run(a);
        case 'create': {
          const r = run(['-d', ...a]);
          return r;
        }
        case 'ps': return ps(a.includes('-a') || a.includes('--all'));
        case 'images': return images();
        case 'image':
          if (a[0] === 'ls') return images();
          if (a[0] === 'rm') return rmi(a.slice(1));
          return chyba(`docker image: '${a[0] || ''}' is not a docker command.`);
        case 'logs': {
          const k = najdiKontajner(a.filter(x => !x.startsWith('-'))[0]);
          if (!k) return chyba(`Error response from daemon: No such container: ${a[0] || ''}`);
          const obrazBezTagu = k.obraz.split(':')[0];
          if (!stav.logyVidene.includes(obrazBezTagu)) stav.logyVidene.push(obrazBezTagu);
          return k.logy.length ? k.logy.map(l => O(l)) : [O('(kontajner zatiaľ nič nevypísal)', 'dim')];
        }
        case 'stop': {
          if (!a.length) return chyba('"docker stop" requires at least 1 argument.');
          return a.map(x => {
            const k = najdiKontajner(x);
            if (!k) return O(`Error response from daemon: No such container: ${x}`, 'err');
            k.stav = 'exited'; k.exitCode = 0;
            return O(x);
          });
        }
        case 'start': {
          if (!a.length) return chyba('"docker start" requires at least 1 argument.');
          return a.filter(x => !x.startsWith('-')).map(x => {
            const k = najdiKontajner(x);
            if (!k) return O(`Error response from daemon: No such container: ${x}`, 'err');
            const kat = KATALOG[k.obraz.split(':')[0]];
            const dlho = (kat && kat.dlhobeziaci) || /uvicorn|gunicorn|flask/i.test(stav.subory['Dockerfile'] || '');
            k.vytvorene = Date.now();
            // jednorazový obraz (hello-world, python bez príkazu) hneď zase dobehne
            k.stav = dlho ? 'running' : 'exited';
            k.exitCode = dlho ? null : 0;
            return O(x);
          });
        }
        case 'restart': {
          const k = najdiKontajner(a[0]);
          if (!k) return chyba(`Error response from daemon: No such container: ${a[0] || ''}`);
          k.stav = 'running'; k.exitCode = null; k.vytvorene = Date.now();
          return [O(a[0])];
        }
        case 'rm': {
          const nasilu = a.includes('-f') || a.includes('--force');
          const ciele = a.filter(x => !x.startsWith('-'));
          if (!ciele.length) return chyba('"docker rm" requires at least 1 argument.');
          return ciele.map(x => {
            const k = najdiKontajner(x);
            if (!k) return O(`Error response from daemon: No such container: ${x}`, 'err');
            if (k.stav === 'running' && !nasilu) {
              return O(`Error response from daemon: cannot remove container "${k.meno}": container is running: stop it first alebo použi -f`, 'err');
            }
            stav.kontajnery = stav.kontajnery.filter(y => y !== k);
            return O(x);
          });
        }
        case 'rmi': return rmi(a);
        case 'build': return build(a);
        case 'tag': {
          const [zdroj, ciel] = a;
          if (!zdroj || !ciel) return chyba('"docker tag" requires exactly 2 arguments.');
          const z = rozlozObraz(zdroj), c = rozlozObraz(ciel);
          const o = najdiObraz(z.repo, z.tag);
          if (!o) return chyba(`Error response from daemon: No such image: ${zdroj}`);
          const novy = pridajObraz(c.repo, c.tag, o.velkost, o.vlastny);
          novy.id = o.id;
          return [];
        }
        case 'push': return [O(`The push refers to repository [docker.io/${a[0] || 'obraz'}]`),
                             O('denied: requested access to the resource is denied (v Playgrounde nie si prihlásený)', 'err')];
        case 'exec': return exec(a);
        case 'inspect': {
          const k = najdiKontajner(a[0]);
          if (!k) return chyba(`Error: No such object: ${a[0] || ''}`);
          const json = {
            Id: k.id, Name: '/' + k.meno, State: { Status: k.stav, ExitCode: k.exitCode ?? 0 },
            Config: { Image: k.obraz, Env: Object.entries(k.env).map(([x, y]) => `${x}=${y}`) },
            Mounts: k.volumes, NetworkSettings: { Ports: k.porty },
          };
          return JSON.stringify([json], null, 2).split('\n').map(l => O(l));
        }
        case 'volume': {
          if (a[0] === 'ls') {
            return tabulka(['DRIVER', 'VOLUME NAME'], stav.volumes.map(v => ['local', v.meno]))
              .map((x, i) => O(x, i === 0 ? 'head' : null));
          }
          if (a[0] === 'create') {
            const meno = a[1] || nahodneId(8);
            if (!stav.volumes.some(v => v.meno === meno)) stav.volumes.push({ meno, vytvorene: Date.now() });
            return [O(meno)];
          }
          if (a[0] === 'rm') {
            const meno = a[1];
            const pouziva = stav.kontajnery.find(k => k.volumes.some(v => String(v).split(':')[0] === meno));
            if (pouziva) return chyba(`Error response from daemon: remove ${meno}: volume is in use - [${pouziva.id}]`);
            stav.volumes = stav.volumes.filter(v => v.meno !== meno);
            return [O(meno)];
          }
          return chyba(`docker volume: '${a[0] || ''}' is not a docker command.`);
        }
        case 'network': {
          if (a[0] === 'ls') {
            return tabulka(['NETWORK ID', 'NAME', 'DRIVER', 'SCOPE'],
              stav.siete.map(s => [nahodneId(12), s.meno, s.driver, 'local']))
              .map((x, i) => O(x, i === 0 ? 'head' : null));
          }
          if (a[0] === 'create') {
            const meno = a[1];
            if (!meno) return chyba('"docker network create" requires exactly 1 argument.');
            if (stav.siete.some(s => s.meno === meno)) {
              return chyba(`Error response from daemon: network with name ${meno} already exists`);
            }
            stav.siete.push({ meno, driver: 'bridge' });
            return [O(nahodneId(12) + nahodneId(52))];
          }
          return chyba(`docker network: '${a[0] || ''}' is not a docker command.`);
        }
        case 'stats': {
          const bez = stav.kontajnery.filter(k => k.stav === 'running');
          if (!bez.length) return [O('(nič nebeží)', 'dim')];
          return tabulka(['CONTAINER ID', 'NAME', 'CPU %', 'MEM USAGE / LIMIT', 'MEM %'],
            bez.map(k => [k.id.slice(0, 12), k.meno,
              (Math.random() * 3).toFixed(2) + '%',
              `${(Math.random() * 200 + 20).toFixed(1)}MiB / 7.75GiB`,
              (Math.random() * 3).toFixed(2) + '%']))
            .map((x, i) => O(x, i === 0 ? 'head' : null));
        }
        case 'compose': return compose(a);
        case 'system': {
          if (a[0] === 'prune') {
            const vsetkyObrazy = a.includes('-a') || a.includes('--all') || a.includes('-af');
            const zmazane = stav.kontajnery.filter(k => k.stav !== 'running');
            stav.kontajnery = stav.kontajnery.filter(k => k.stav === 'running');
            // bez -a sa mažú IBA visiace (dangling) obrazy, nie otagované
            const nepouzite = stav.obrazy.filter(o =>
              (vsetkyObrazy || o.tag === '<none>') &&
              !stav.kontajnery.some(k => k.obraz === `${o.repo}:${o.tag}`));
            stav.obrazy = stav.obrazy.filter(o => !nepouzite.includes(o));
            const naMB = v => parseFloat(String(v).replace(/[^\d.]/g, '')) *
              (/kB/i.test(v) ? 0.001 : /GB/i.test(v) ? 1000 : 1);
            const miesto = zmazane.length * 12 + nepouzite.reduce((s, o) => s + naMB(o.velkost), 0);
            const von = [];
            if (zmazane.length) {
              von.push(O('Deleted Containers:', 'head'));
              zmazane.forEach(k => von.push(O(k.id, 'dim')));
            }
            if (nepouzite.length) {
              von.push(O('Deleted Images:', 'head'));
              nepouzite.forEach(o => von.push(O(`untagged: ${o.repo}:${o.tag}`, 'dim')));
            }
            von.push(O(`Total reclaimed space: ${miesto ? miesto.toFixed(1) + 'MB' : '0B'}`, 'ok'));
            if (!vsetkyObrazy && stav.obrazy.length) {
              von.push(O('Tip: otagované nepoužité obrazy zmaže až docker system prune -a -f', 'dim'));
            }
            return von;
          }
          if (a[0] === 'df') {
            return tabulka(['TYPE', 'TOTAL', 'ACTIVE', 'SIZE'], [
              ['Images', stav.obrazy.length, stav.kontajnery.length, '1.2GB'],
              ['Containers', stav.kontajnery.length, stav.kontajnery.filter(k => k.stav === 'running').length, '48MB'],
              ['Local Volumes', stav.volumes.length, stav.volumes.length, '112MB'],
            ]).map((x, i) => O(x, i === 0 ? 'head' : null));
          }
          return chyba(`docker system: '${a[0] || ''}' is not a docker command.`);
        }
        default:
          return chyba(`docker: '${pod || ''}' is not a docker command.\nSee 'docker --help' alebo napíš help.`);
      }
    }

    function rmi(a) {
      const ciele = a.filter(x => !x.startsWith('-'));
      const nasilu = a.includes('-f');
      if (!ciele.length) return chyba('"docker rmi" requires at least 1 argument.');
      return ciele.map(spec => {
        const { repo, tag } = rozlozObraz(spec);
        const o = najdiObraz(repo, tag);
        if (!o) return O(`Error response from daemon: No such image: ${spec}`, 'err');
        const pouziva = stav.kontajnery.find(k => k.obraz === `${o.repo}:${o.tag}`);
        if (pouziva && !nasilu) {
          return O(`Error response from daemon: conflict: unable to remove repository reference "${spec}" (must force) - container ${pouziva.id.slice(0, 12)} is using it`, 'err');
        }
        stav.obrazy = stav.obrazy.filter(x => x !== o);
        return O(`Untagged: ${o.repo}:${o.tag}`);
      });
    }

    return {
      stav,
      spusti,
      reset() {
        stav.obrazy.length = 0;
        stav.kontajnery.length = 0;
        stav.volumes.length = 0;
        stav.siete = [
          { meno: 'bridge', driver: 'bridge' },
          { meno: 'host', driver: 'host' },
          { meno: 'none', driver: 'null' },
        ];
        stav.subory = Object.assign({}, SUBORY_START);
        stav.historia.length = 0;
        stav.logyVidene.length = 0;
        stav.spadnutyPostgres = false;
        stav.buildZlyhal = false;
        stav.composeSpustenych = 0;
        stav.composeZhodeny = false;
      },
    };
  }

  window.DOCKER = { vyrobEngine, KATALOG, SUBORY_START };
})();
