/* ============================================================
   GIT PLAYGROUND — simulátor Gitu
   Skutočný DAG commitov, staging area, vetvy, trojcestný merge
   s konfliktmi, reset/revert, remote a stash. Všetko v prehliadači.
   ============================================================ */
(function () {
  'use strict';

  const HEX = '0123456789abcdef';
  const sha = (n = 7) => Array.from({ length: n },
    () => HEX[Math.floor(Math.random() * 16)]).join('');

  const SUBORY_START = {
    'README.md': '# Môj projekt\n\nPrvý projekt v Gite.',
    'app.py': 'print("Ahoj!")',
  };

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

  function vyrobEngine() {
    const stav = {
      init: false,
      subory: Object.assign({}, SUBORY_START),  // pracovný adresár: meno -> obsah
      staging: null,                            // null = nič nepripravené; inak {meno: obsah}
      commity: {},                              // id -> {id, sprava, rodicia[], strom{}, cas}
      vetvy: {},                                // meno -> commit id
      HEAD: { vetva: 'main', commit: null },    // vetva alebo detached (vetva:null)
      remote: null,                             // {meno, url, vetvy:{}}
      stash: [],
      konflikt: null,                           // {subory:[], zdroj}
      historia: [],
      // príznaky pre misie — čo sa naozaj stalo
      vyriesilKonflikt: false,
      videlDetached: false,
      pouzilRevert: false,
    };

    const O = (text, cls) => ({ text, cls });
    const chyba = t => [O(t, 'err')];
    const bezRepa = () => chyba('fatal: not a git repository (or any of the parent directories): .git\nZačni príkazom: git init');

    const maSubor = f => Object.prototype.hasOwnProperty.call(stav.subory, f) &&
                         typeof stav.subory[f] === 'string';

    /* ── pomocníky nad grafom commitov ── */
    const hlavaCommit = () => stav.HEAD.vetva ? stav.vetvy[stav.HEAD.vetva] : stav.HEAD.commit;
    const strom = id => (id && stav.commity[id]) ? stav.commity[id].strom : {};

    function predkovia(id) {
      const von = new Set();
      const front = id ? [id] : [];
      while (front.length) {
        const x = front.shift();
        if (!x || von.has(x)) continue;
        von.add(x);
        (stav.commity[x].rodicia || []).forEach(r => front.push(r));
      }
      return von;
    }

    function spolocnyPredok(a, b) {
      const pa = predkovia(a);
      const front = b ? [b] : [];
      const videne = new Set();
      while (front.length) {
        const x = front.shift();
        if (!x || videne.has(x)) continue;
        videne.add(x);
        if (pa.has(x)) return x;
        (stav.commity[x].rodicia || []).forEach(r => front.push(r));
      }
      return null;
    }

    function novyCommit(sprava, stromObsah, rodicia) {
      const id = sha(7);
      stav.commity[id] = {
        id, sprava, rodicia: rodicia.filter(Boolean),
        strom: Object.assign({}, stromObsah), cas: Date.now(),
      };
      return id;
    }

    /* ── porovnanie pracovného adresára / stagingu / HEAD ── */
    function zmeny() {
      const h = strom(hlavaCommit());
      const s = stav.staging;
      const pripravene = [], nepripravene = [], nesledovane = [];

      const vsetky = new Set([...Object.keys(h), ...Object.keys(stav.subory),
                              ...(s ? Object.keys(s) : [])]);
      vsetky.forEach(f => {
        const vHead = h[f], vStage = s ? s[f] : undefined, vPrac = stav.subory[f];
        const sledovany = vHead !== undefined || vStage !== undefined;

        if (s && vStage !== undefined && vStage !== vHead) {
          pripravene.push({ f, typ: vHead === undefined ? 'new file' : 'modified' });
        } else if (s && vStage === undefined && vHead !== undefined) {
          pripravene.push({ f, typ: 'deleted' });
        }

        const zaklad = (s && Object.prototype.hasOwnProperty.call(s, f)) ? vStage : vHead;
        if (vPrac === undefined && zaklad !== undefined) {
          if (!(s && vStage === undefined && vHead !== undefined)) nepripravene.push({ f, typ: 'deleted' });
        } else if (vPrac !== undefined && !sledovany) {
          nesledovane.push(f);
        } else if (vPrac !== undefined && zaklad !== undefined && vPrac !== zaklad) {
          nepripravene.push({ f, typ: 'modified' });
        }
      });
      return { pripravene, nepripravene, nesledovane };
    }

    function cisto() {
      const z = zmeny();
      return !z.pripravene.length && !z.nepripravene.length && !z.nesledovane.length;
    }

    /* ── git status ── */
    function status() {
      const z = zmeny();
      const von = [];
      if (stav.HEAD.vetva) von.push(O(`On branch ${stav.HEAD.vetva}`));
      else von.push(O(`HEAD detached at ${stav.HEAD.commit}`, 'warn'));

      if (stav.remote && stav.HEAD.vetva) {
        const lokal = stav.vetvy[stav.HEAD.vetva];
        const vzdial = stav.remote.vetvy[stav.HEAD.vetva];
        if (vzdial === undefined) von.push(O(`Your branch is based on '${stav.remote.meno}/${stav.HEAD.vetva}', but the upstream is gone.`, 'dim'));
        else if (lokal !== vzdial) {
          const napred = predkovia(lokal).size - predkovia(vzdial).size;
          if (napred > 0) von.push(O(`Your branch is ahead of '${stav.remote.meno}/${stav.HEAD.vetva}' by ${napred} commit${napred === 1 ? '' : 's'}.`, 'dim'));
        } else von.push(O(`Your branch is up to date with '${stav.remote.meno}/${stav.HEAD.vetva}'.`, 'dim'));
      }

      if (stav.konflikt) {
        von.push(O('You have unmerged paths.', 'err'));
        von.push(O('  (fix conflicts and run "git commit")', 'dim'));
        von.push(O(''));
        von.push(O('Unmerged paths:', 'head'));
        stav.konflikt.subory.forEach(f => von.push(O(`\tboth modified:   ${f}`, 'err')));
        von.push(O(''));
        return von;
      }

      if (!hlavaCommit() && !z.pripravene.length) {
        von.push(O(''));
        von.push(O('No commits yet', 'dim'));
      }

      if (z.pripravene.length) {
        von.push(O(''));
        von.push(O('Changes to be committed:', 'head'));
        von.push(O('  (use "git restore --staged <file>..." to unstage)', 'dim'));
        z.pripravene.forEach(x => von.push(O(`\t${(x.typ + ':').padEnd(13)}${x.f}`, 'ok')));
      }
      if (z.nepripravene.length) {
        von.push(O(''));
        von.push(O('Changes not staged for commit:', 'head'));
        von.push(O('  (use "git add <file>..." to update what will be committed)', 'dim'));
        z.nepripravene.forEach(x => von.push(O(`\t${(x.typ + ':').padEnd(13)}${x.f}`, 'err')));
      }
      if (z.nesledovane.length) {
        von.push(O(''));
        von.push(O('Untracked files:', 'head'));
        von.push(O('  (use "git add <file>..." to include in what will be committed)', 'dim'));
        z.nesledovane.forEach(f => von.push(O(`\t${f}`, 'err')));
      }
      if (cisto()) {
        von.push(O(''));
        von.push(O('nothing to commit, working tree clean', 'ok'));
      }
      return von;
    }

    /* ── git add ── */
    function add(ciele) {
      if (!ciele.length) return chyba('Nothing specified, nothing added.\nMožno si chcel: git add .');
      stav.staging = stav.staging || Object.assign({}, strom(hlavaCommit()));
      const von = [];
      if (ciele.includes('.') || ciele.includes('-A') || ciele.includes('--all')) {
        Object.keys(stav.staging).forEach(f => { if (!maSubor(f)) delete stav.staging[f]; });
        Object.keys(stav.subory).forEach(f => {
          if (!ignorovany(f)) stav.staging[f] = stav.subory[f];
        });
        if (stav.konflikt) { stav.konflikt = null; stav.vyriesilKonflikt = true; }
        return von;
      }
      for (const f of ciele) {
        if (f.startsWith('-')) continue;
        if (!maSubor(f)) {
          const bolVHead = strom(hlavaCommit())[f] !== undefined;
          if (bolVHead) { delete stav.staging[f]; continue; }
          return chyba(`fatal: pathspec '${f}' did not match any files`);
        }
        stav.staging[f] = stav.subory[f];
        if (stav.konflikt && stav.konflikt.subory.includes(f)) {
          stav.konflikt.subory = stav.konflikt.subory.filter(x => x !== f);
          if (!stav.konflikt.subory.length) { stav.konflikt = null; stav.vyriesilKonflikt = true; }
        }
      }
      return von;
    }

    function ignorovany(f) {
      const gi = stav.subory['.gitignore'];
      if (!gi) return false;
      return gi.split('\n').map(r => r.trim()).filter(r => r && !r.startsWith('#'))
        .some(vzor => {
          if (vzor.endsWith('/')) return f.startsWith(vzor);
          if (vzor.startsWith('*')) return f.endsWith(vzor.slice(1));
          return f === vzor || f.startsWith(vzor + '/');
        });
    }

    /* ── git commit ── */
    function commit(args) {
      let sprava = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-m' || args[i] === '--message') sprava = args[++i];
        else if (args[i] === '-am' || args[i] === '-ma') { add(['.']); sprava = args[++i]; }
        else if (args[i] === '-a') add(['.']);
      }
      if (stav.konflikt) {
        return chyba(`error: Committing is not possible because you have unmerged files.\nNajprv konflikt vyrieš v editore, potom: git add ${stav.konflikt.subory[0]}`);
      }
      if (!sprava) return chyba('Aborting commit due to empty commit message.\nPouži: git commit -m "popis zmeny"');
      const z = zmeny();
      if (!z.pripravene.length) {
        return [O(`On branch ${stav.HEAD.vetva || '(detached)'}`),
                O('nothing to commit, working tree clean', 'dim'),
                O('Najprv priprav zmeny: git add <súbor>', 'warn')];
      }
      const rodic = hlavaCommit();
      const rodicia = stav.zluc ? [rodic, stav.zluc] : [rodic];
      const id = novyCommit(sprava, stav.staging, rodicia);
      stav.zluc = null;
      if (stav.HEAD.vetva) stav.vetvy[stav.HEAD.vetva] = id;
      else stav.HEAD.commit = id;
      stav.staging = null;
      const pocet = z.pripravene.length;
      return [
        O(`[${stav.HEAD.vetva || 'detached HEAD'} ${id}] ${sprava}`, 'ok'),
        O(` ${pocet} file${pocet === 1 ? '' : 's'} changed`, 'dim'),
      ];
    }

    /* ── git log ── */
    function log(args) {
      const h = hlavaCommit();
      if (!h) return chyba(`fatal: your current branch '${stav.HEAD.vetva}' does not have any commits yet`);
      const oneline = args.includes('--oneline');
      const zoznam = [];
      const front = [h], videne = new Set();
      while (front.length) {
        const id = front.shift();
        if (!id || videne.has(id)) continue;
        videne.add(id);
        zoznam.push(stav.commity[id]);
        (stav.commity[id].rodicia || []).forEach(r => front.push(r));
      }
      zoznam.sort((a, b) => b.cas - a.cas);
      const menovky = id => {
        const m = Object.entries(stav.vetvy).filter(([, c]) => c === id).map(([n]) => n);
        if (stav.HEAD.vetva && stav.vetvy[stav.HEAD.vetva] === id) {
          return ` (HEAD -> ${stav.HEAD.vetva}${m.filter(x => x !== stav.HEAD.vetva).map(x => ', ' + x).join('')})`;
        }
        return m.length ? ` (${m.join(', ')})` : '';
      };
      const von = [];
      zoznam.forEach(c => {
        if (oneline) von.push(O(`${c.id}${menovky(c.id)} ${c.sprava}`));
        else {
          von.push(O(`commit ${c.id}${menovky(c.id)}`, 'head'));
          von.push(O('Author: Martin <martin@akademia.sk>', 'dim'));
          von.push(O(''));
          von.push(O('    ' + c.sprava));
          von.push(O(''));
        }
      });
      return von;
    }

    /* ── vetvy ── */
    function branch(args) {
      const zmazat = args.find(a => a === '-d' || a === '-D');
      const mena = args.filter(a => !a.startsWith('-'));
      if (zmazat) {
        const m = mena[0];
        if (!stav.vetvy[m]) return chyba(`error: branch '${m}' not found.`);
        if (stav.HEAD.vetva === m) return chyba(`error: Cannot delete branch '${m}' checked out at '/projekt'`);
        delete stav.vetvy[m];
        return [O(`Deleted branch ${m}.`, 'ok')];
      }
      if (!mena.length) {
        return Object.keys(stav.vetvy).sort().map(m =>
          O((m === stav.HEAD.vetva ? '* ' : '  ') + m, m === stav.HEAD.vetva ? 'ok' : null));
      }
      const m = mena[0];
      if (stav.vetvy[m]) return chyba(`fatal: a branch named '${m}' already exists`);
      if (!hlavaCommit()) return chyba(`fatal: not a valid object name: '${stav.HEAD.vetva}'\n(najprv sprav prvý commit)`);
      stav.vetvy[m] = hlavaCommit();
      return [];
    }

    function prepni(ciel, vytvor) {
      if (vytvor) {
        if (stav.vetvy[ciel]) return chyba(`fatal: a branch named '${ciel}' already exists`);
        if (!hlavaCommit()) return chyba('fatal: you are on a branch yet to be born (najprv sprav commit)');
        stav.vetvy[ciel] = hlavaCommit();
        stav.HEAD = { vetva: ciel, commit: null };
        return [O(`Switched to a new branch '${ciel}'`, 'ok')];
      }
      if (stav.vetvy[ciel] !== undefined) {
        const z = zmeny();
        if (z.nepripravene.length || z.pripravene.length) {
          return chyba(`error: Your local changes to the following files would be overwritten by checkout:\n\t${(z.nepripravene[0] || z.pripravene[0]).f}\nPlease commit your changes or stash them before you switch branches.`);
        }
        stav.HEAD = { vetva: ciel, commit: null };
        stav.subory = Object.assign({}, strom(stav.vetvy[ciel]));
        stav.staging = null;
        return [O(`Switched to branch '${ciel}'`, 'ok')];
      }
      if (stav.commity[ciel]) {
        stav.HEAD = { vetva: null, commit: ciel };
        stav.subory = Object.assign({}, strom(ciel));
        stav.videlDetached = true;
        return [
          O(`Note: switching to '${ciel}'.`, 'warn'),
          O(''),
          O("You are in 'detached HEAD' state. You can look around, make experimental", 'dim'),
          O('changes and commit them, and you can discard any commits you make in this', 'dim'),
          O('state without impacting any branches by switching back to a branch.', 'dim'),
          O(''),
          O(`HEAD is now at ${ciel} ${stav.commity[ciel].sprava}`),
        ];
      }
      return chyba(`error: pathspec '${ciel}' did not match any file(s) known to git`);
    }

    /* ── git merge (trojcestný, s konfliktmi) ── */
    function merge(args) {
      const zdroj = args.filter(a => !a.startsWith('-'))[0];
      if (!zdroj) return chyba('fatal: No commit specified and merge.defaultToUpstream not set.');
      if (stav.vetvy[zdroj] === undefined) return chyba(`merge: ${zdroj} - not something we can merge`);
      if (stav.konflikt) return chyba('error: Merging is not possible because you have unmerged files.');

      const nas = hlavaCommit(), ich = stav.vetvy[zdroj];
      if (nas === ich) return [O('Already up to date.')];

      const zaklad = spolocnyPredok(nas, ich);

      // fast-forward: naša vetva je predkom tej druhej
      if (zaklad === nas) {
        stav.vetvy[stav.HEAD.vetva] = ich;
        stav.subory = Object.assign({}, strom(ich));
        stav.staging = null;
        return [O('Updating ' + String(nas).slice(0, 7) + '..' + ich, 'dim'),
                O('Fast-forward', 'ok')];
      }
      if (zaklad === ich) return [O('Already up to date.')];

      // trojcestné zlúčenie na úrovni súborov
      const b = strom(zaklad), n = strom(nas), i = strom(ich);
      const vysledok = {}, konfliktne = [];
      new Set([...Object.keys(b), ...Object.keys(n), ...Object.keys(i)]).forEach(f => {
        const vb = b[f], vn = n[f], vi = i[f];
        if (vn === vi) { if (vn !== undefined) vysledok[f] = vn; }
        else if (vn === vb) { if (vi !== undefined) vysledok[f] = vi; }
        else if (vi === vb) { if (vn !== undefined) vysledok[f] = vn; }
        else {
          konfliktne.push(f);
          vysledok[f] = `<<<<<<< HEAD\n${vn ?? ''}\n=======\n${vi ?? ''}\n>>>>>>> ${zdroj}`;
        }
      });

      stav.subory = Object.assign({}, vysledok);

      if (konfliktne.length) {
        stav.konflikt = { subory: konfliktne, zdroj };
        stav.zluc = ich;
        stav.staging = null;
        return [
          O(`Auto-merging ${konfliktne[0]}`, 'dim'),
          ...konfliktne.map(f => O(`CONFLICT (content): Merge conflict in ${f}`, 'err')),
          O('Automatic merge failed; fix conflicts and then commit the result.', 'err'),
          O('Otvor súbor v editore vpravo, nechaj správnu verziu a zmaž značky <<<<<<<, =======, >>>>>>>', 'warn'),
        ];
      }

      const id = novyCommit(`Merge branch '${zdroj}'`, vysledok, [nas, ich]);
      stav.vetvy[stav.HEAD.vetva] = id;
      stav.staging = null;
      return [O(`Merge made by the 'ort' strategy.`, 'ok'), O(` ${Object.keys(vysledok).length} files changed`, 'dim')];
    }

    /* ── reset / revert / restore ── */
    function reset(args) {
      const rezim = args.find(a => a.startsWith('--')) || '--mixed';
      const ciel = args.find(a => !a.startsWith('-')) || 'HEAD';
      let id = hlavaCommit();
      const m = /^HEAD([~^])(\d*)$/.exec(ciel);
      if (m) {
        let kolko = m[1] === '^' ? 1 : parseInt(m[2] || '1', 10);
        while (kolko-- > 0 && id) id = (stav.commity[id].rodicia || [])[0];
        if (!id) return chyba(`fatal: ambiguous argument '${ciel}': unknown revision`);
      } else if (ciel !== 'HEAD') {
        if (!stav.commity[ciel]) return chyba(`fatal: ambiguous argument '${ciel}': unknown revision or path not in the working tree.`);
        id = ciel;
      }
      if (stav.HEAD.vetva) stav.vetvy[stav.HEAD.vetva] = id; else stav.HEAD.commit = id;

      if (rezim === '--hard') {
        stav.subory = Object.assign({}, strom(id));
        stav.staging = null;
        return [O(`HEAD is now at ${id} ${stav.commity[id] ? stav.commity[id].sprava : ''}`, 'warn')];
      }
      if (rezim === '--soft') {
        stav.staging = stav.staging || Object.assign({}, stav.subory);
        return [];
      }
      stav.staging = null;   // --mixed
      const z = zmeny();
      const von = [];
      if (z.nepripravene.length) {
        von.push(O('Unstaged changes after reset:', 'head'));
        z.nepripravene.forEach(x => von.push(O(`M\t${x.f}`)));
      }
      return von;
    }

    function revert(args) {
      const ciel = args.filter(a => !a.startsWith('-'))[0] || 'HEAD';
      let id = hlavaCommit();
      if (ciel !== 'HEAD') {
        if (!stav.commity[ciel]) return chyba(`fatal: bad revision '${ciel}'`);
        id = ciel;
      }
      if (!id) return chyba('fatal: your current branch does not have any commits yet');
      const c = stav.commity[id];
      const rodic = (c.rodicia || [])[0];
      const novy = novyCommit(`Revert "${c.sprava}"`, strom(rodic), [hlavaCommit()]);
      if (stav.HEAD.vetva) stav.vetvy[stav.HEAD.vetva] = novy; else stav.HEAD.commit = novy;
      stav.subory = Object.assign({}, strom(novy));
      stav.staging = null;
      stav.pouzilRevert = true;
      return [O(`[${stav.HEAD.vetva || 'detached'} ${novy}] Revert "${c.sprava}"`, 'ok')];
    }

    /* ── remote ── */
    function push(args) {
      if (!stav.remote) return chyba("fatal: No configured push destination.\nPridaj remote: git remote add origin https://github.com/ty/projekt.git");
      const vetva = stav.HEAD.vetva;
      if (!vetva) return chyba('fatal: You are not currently on a branch.');
      const nastavUpstream = args.includes('-u') || args.includes('--set-upstream');
      const lokal = stav.vetvy[vetva];
      if (!lokal) return chyba('error: src refspec does not match any (nemáš žiadny commit)');
      if (stav.remote.vetvy[vetva] === lokal) return [O('Everything up-to-date', 'dim')];
      stav.remote.vetvy[vetva] = lokal;
      const von = [
        O(`Enumerating objects: ${Object.keys(stav.commity).length}, done.`, 'dim'),
        O(`To ${stav.remote.url}`, 'dim'),
        O(`   ${sha(7)}..${lokal}  ${vetva} -> ${vetva}`, 'ok'),
      ];
      if (nastavUpstream) von.push(O(`branch '${vetva}' set up to track '${stav.remote.meno}/${vetva}'.`, 'dim'));
      return von;
    }

    /* ── stash ── */
    function stash(args) {
      const pod = args[0] || 'push';
      if (pod === 'list') {
        return stav.stash.length
          ? stav.stash.map((s, i) => O(`stash@{${i}}: WIP on ${s.vetva}: ${s.popis}`))
          : [O('(žiadne odložené zmeny)', 'dim')];
      }
      if (pod === 'pop' || pod === 'apply') {
        if (!stav.stash.length) return chyba('No stash entries found.');
        const s = pod === 'pop' ? stav.stash.shift() : stav.stash[0];
        stav.subory = Object.assign({}, s.subory);
        return [O(`On branch ${stav.HEAD.vetva}`), O('Changes not staged for commit:', 'head'),
                O(`  (obnovené zo stash@{0})`, 'dim')];
      }
      if (cisto()) return [O('No local changes to save', 'dim')];
      stav.stash.unshift({ vetva: stav.HEAD.vetva, subory: Object.assign({}, stav.subory),
                           popis: stav.commity[hlavaCommit()] ? stav.commity[hlavaCommit()].sprava : 'no commits' });
      stav.subory = Object.assign({}, strom(hlavaCommit()));
      stav.staging = null;
      return [O(`Saved working directory and index state WIP on ${stav.HEAD.vetva}`, 'ok')];
    }

    /* ── diff ── */
    function diff(args) {
      const staged = args.includes('--staged') || args.includes('--cached');
      const z = zmeny();
      const zoznam = staged ? z.pripravene : z.nepripravene;
      if (!zoznam.length) return [O(staged ? '(nič pripravené na commit)' : '(žiadne nepripravené zmeny)', 'dim')];
      const von = [];
      zoznam.forEach(x => {
        const stary = staged ? strom(hlavaCommit())[x.f] : (stav.staging ? stav.staging[x.f] : strom(hlavaCommit())[x.f]);
        const novy = staged ? (stav.staging ? stav.staging[x.f] : '') : stav.subory[x.f];
        von.push(O(`diff --git a/${x.f} b/${x.f}`, 'head'));
        von.push(O(`--- a/${x.f}`, 'dim'));
        von.push(O(`+++ b/${x.f}`, 'dim'));
        const st = String(stary ?? '').split('\n'), no = String(novy ?? '').split('\n');
        st.forEach(r => { if (!no.includes(r)) von.push(O('-' + r, 'err')); });
        no.forEach(r => { if (!st.includes(r)) von.push(O('+' + r, 'ok')); });
      });
      return von;
    }

    /* ── rozcestník ── */
    function spusti(riadok) {
      const cely = riadok.trim();
      if (!cely) return [];
      stav.historia.push(cely);
      const t = rozdel(cely);

      // pomocné shell príkazy nad pracovným adresárom
      if (t[0] === 'ls') return [O(Object.keys(stav.subory).sort().join('  ') || '(prázdno)')];
      if (t[0] === 'pwd') return [O('/home/martin/projekt')];
      if (t[0] === 'cat') {
        const f = t[1];
        if (!f) return chyba('cat: chýba názov súboru');
        return maSubor(f) ? stav.subory[f].split('\n').map(l => O(l))
                          : chyba(`cat: ${f}: No such file or directory`);
      }
      if (t[0] === 'touch') {
        if (!t[1]) return chyba('touch: chýba názov súboru');
        if (!maSubor(t[1])) stav.subory[t[1]] = '';
        return [];
      }
      if (t[0] === 'rm') {
        const f = t.filter(x => !x.startsWith('-'))[1];
        if (!maSubor(f)) return chyba(`rm: ${f}: No such file or directory`);
        delete stav.subory[f];
        return [];
      }
      if (t[0] === 'echo') {
        const m = /^echo\s+(.*?)\s*(>>?)\s*(\S+)$/.exec(cely);
        if (m) {
          const text = m[1].replace(/^["']|["']$/g, '');
          const f = m[3];
          stav.subory[f] = m[2] === '>>' ? ((stav.subory[f] || '') + '\n' + text) : text;
          return [];
        }
        return [O(t.slice(1).join(' '))];
      }
      if (t[0] === 'help' || t[0] === 'pomoc') {
        return [
          O('Dostupné príkazy v Git Playgrounde:', 'head'),
          O('  git init                     založí repozitár'),
          O('  git status                   čo je zmenené / pripravené'),
          O('  git add <súbor> | .          priprav zmeny (staging)'),
          O('  git commit -m "správa"       ulož snímku'),
          O('  git log [--oneline]          história commitov'),
          O('  git diff [--staged]          čo presne sa zmenilo'),
          O('  git branch [meno] [-d meno]  vetvy'),
          O('  git switch <vetva> | -c nová (alebo git checkout [-b])'),
          O('  git merge <vetva>            zlúč vetvu do aktuálnej'),
          O('  git reset [--soft|--mixed|--hard] HEAD~1'),
          O('  git revert HEAD              bezpečné vrátenie commitu'),
          O('  git stash [pop|list]         odlož rozrobené'),
          O('  git remote add origin <url>  ·  git push [-u origin main]'),
          O('  ls, cat, touch, rm, echo "text" > súbor, clear, reset'),
        ];
      }
      if (t[0] !== 'git') return chyba(`${t[0]}: command not found (v Playgrounde funguje git, ls, cat, touch, rm, echo, help)`);

      const pod = t[1], a = t.slice(2);
      if (!pod || pod === 'help' || pod === '--help' || a.includes('--help')) return spusti('help');

      if (pod === 'init') {
        if (stav.init) return [O('Reinitialized existing Git repository in /projekt/.git/', 'dim')];
        stav.init = true;
        stav.vetvy = { main: null };
        stav.HEAD = { vetva: 'main', commit: null };
        return [O('Initialized empty Git repository in /home/martin/projekt/.git/', 'ok')];
      }
      if (!stav.init) return bezRepa();

      switch (pod) {
        case 'status': return status();
        case 'add': return add(a);
        case 'commit': return commit(a);
        case 'log': return log(a);
        case 'diff': return diff(a);
        case 'branch': return branch(a);
        case 'checkout': {
          if (a[0] === '-b') return prepni(a[1], true);
          if (a[0] === '--') { const f = a[1]; if (maSubor(f) || strom(hlavaCommit())[f]) { stav.subory[f] = strom(hlavaCommit())[f]; return [O(`Updated 1 path from the index`, 'dim')]; } }
          return prepni(a[0], false);
        }
        case 'switch': {
          if (a[0] === '-c' || a[0] === '--create') return prepni(a[1], true);
          return prepni(a[0], false);
        }
        case 'merge': return merge(a);
        case 'reset': return reset(a);
        case 'revert': return revert(a);
        case 'restore': {
          const staged = a.includes('--staged');
          const f = a.filter(x => !x.startsWith('-'))[0];
          if (staged) {
            if (!stav.staging) return [];
            if (f === '.' ) { stav.staging = null; return []; }
            const h = strom(hlavaCommit());
            if (h[f] === undefined) delete stav.staging[f]; else stav.staging[f] = h[f];
            return [];
          }
          const zaklad = stav.staging && stav.staging[f] !== undefined ? stav.staging[f] : strom(hlavaCommit())[f];
          if (zaklad === undefined) return chyba(`error: pathspec '${f}' did not match any file(s) known to git`);
          stav.subory[f] = zaklad;
          return [];
        }
        case 'stash': return stash(a);
        case 'remote': {
          if (a[0] === 'add') {
            if (stav.remote) return chyba(`error: remote ${a[1]} already exists.`);
            stav.remote = { meno: a[1] || 'origin', url: a[2] || 'https://github.com/ty/projekt.git', vetvy: {} };
            return [];
          }
          if (a[0] === '-v' || !a.length) {
            return stav.remote
              ? [O(`${stav.remote.meno}\t${stav.remote.url} (fetch)`), O(`${stav.remote.meno}\t${stav.remote.url} (push)`)]
              : [O('(žiadny remote — pridaj: git remote add origin <url>)', 'dim')];
          }
          return chyba(`error: Unknown subcommand: ${a[0]}`);
        }
        case 'push': return push(a);
        case 'pull': case 'fetch':
          return stav.remote ? [O('Already up to date.', 'dim')]
                             : chyba('fatal: No remote repository specified.');
        case 'rm': {
          const f = a.filter(x => !x.startsWith('-'))[0];
          if (!maSubor(f)) return chyba(`fatal: pathspec '${f}' did not match any files`);
          delete stav.subory[f];
          stav.staging = stav.staging || Object.assign({}, strom(hlavaCommit()));
          delete stav.staging[f];
          return [O(`rm '${f}'`)];
        }
        case 'config': return [];
        default:
          return chyba(`git: '${pod}' is not a git command. See 'git --help'.`);
      }
    }

    /* ── dáta pre kreslenie grafu ── */
    function graf() {
      const ids = Object.keys(stav.commity);
      const zoradene = ids.map(id => stav.commity[id]).sort((a, b) => a.cas - b.cas);
      return {
        commity: zoradene.map(c => ({
          id: c.id, sprava: c.sprava, rodicia: c.rodicia,
          vetvy: Object.entries(stav.vetvy).filter(([, x]) => x === c.id).map(([n]) => n),
          head: hlavaCommit() === c.id,
        })),
        HEAD: stav.HEAD, vetvy: stav.vetvy,
      };
    }

    return {
      stav, spusti, graf,
      zmeny, hlavaCommit,
      reset() {
        stav.init = false;
        stav.subory = Object.assign({}, SUBORY_START);
        stav.staging = null;
        stav.commity = {};
        stav.vetvy = {};
        stav.HEAD = { vetva: 'main', commit: null };
        stav.remote = null;
        stav.stash = [];
        stav.konflikt = null;
        stav.zluc = null;
        stav.historia.length = 0;
        stav.vyriesilKonflikt = false;
        stav.videlDetached = false;
        stav.pouzilRevert = false;
      },
    };
  }

  window.GIT = { vyrobEngine, SUBORY_START };
})();
