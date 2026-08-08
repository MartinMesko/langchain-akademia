/* ============================================================
   DOCKER PLAYGROUND — misie (interaktívne cvičenia)
   Každá misia má cieľ, ktorý sa kontroluje priamo proti stavu
   simulovaného enginu — nie porovnávaním textu príkazu.
   Preto ju vyriešiš akoukoľvek správnou cestou.
   ============================================================ */
window.DOCKER_MISIE = [
  {
    id: 'm1', xp: 15, titul: 'Rozhliadni sa',
    zadanie: 'Každý Docker prieskum začína otázkou „čo tu vlastne beží?". Zisti verziu Dockera a vypíš zoznam <b>bežiacich</b> kontajnerov.',
    ciel: 'Spustený <code>docker --version</code> aj <code>docker ps</code>',
    tipy: [
      'Verziu vypíše <code>docker --version</code>.',
      'Bežiace kontajnery vypíše <code>docker ps</code> (bez prepínača <code>-a</code>).',
      'Riešenie: <code>docker --version</code> a potom <code>docker ps</code>.',
    ],
    kontrola(e) {
      const h = e.stav.historia;
      const verzia = h.some(c => /^docker\s+(--version|version)\b/.test(c));
      const ps = h.some(c => /^docker\s+ps\s*$/.test(c.trim()));
      if (!verzia) return { ok: false, preco: 'Zatiaľ si nezistil verziu Dockera.' };
      if (!ps) return { ok: false, preco: 'Ešte chýba výpis bežiacich kontajnerov cez docker ps.' };
      return { ok: true };
    },
  },
  {
    id: 'm2', xp: 15, titul: 'Stiahni si obraz',
    zadanie: 'Stiahni z registry obraz <code>nginx</code> a over, že ho máš lokálne.',
    ciel: 'Obraz <code>nginx</code> je v zozname lokálnych obrazov',
    tipy: [
      'Sťahovanie robí <code>docker pull</code>.',
      'Lokálne obrazy vypíše <code>docker images</code>.',
      'Riešenie: <code>docker pull nginx</code>, potom <code>docker images</code>.',
    ],
    kontrola(e) {
      if (!e.stav.obrazy.some(o => o.repo === 'nginx')) {
        return { ok: false, preco: 'Obraz nginx zatiaľ nemáš stiahnutý.' };
      }
      if (!e.stav.historia.some(c => /^docker\s+(images|image\s+ls)/.test(c))) {
        return { ok: false, preco: 'Obraz máš — ešte si ho vypíš cez docker images.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'm3', xp: 20, titul: 'Prvý web server',
    zadanie: 'Spusti nginx <b>na pozadí</b> pod menom <code>web</code> tak, aby bol dostupný na porte <b>8080</b> tvojho počítača (v kontajneri počúva na 80).',
    ciel: 'Beží kontajner <code>web</code> z obrazu nginx s mapovaním 8080→80',
    tipy: [
      'Na pozadí = prepínač <code>-d</code> (detach).',
      'Meno nastavíš cez <code>--name web</code>, port cez <code>-p HOST:KONTAJNER</code>.',
      'Riešenie: <code>docker run -d -p 8080:80 --name web nginx</code>',
    ],
    kontrola(e) {
      const k = e.stav.kontajnery.find(x => x.meno === 'web');
      if (!k) return { ok: false, preco: 'Kontajner s menom web zatiaľ neexistuje (--name web).' };
      if (!k.obraz.startsWith('nginx')) return { ok: false, preco: 'Kontajner web nebeží z obrazu nginx.' };
      if (k.stav !== 'running') return { ok: false, preco: 'Kontajner web nebeží — spustil si ho bez -d? Skús ho zmazať a spustiť znova s -d.' };
      if (!k.porty.some(p => String(p) === '8080:80')) return { ok: false, preco: 'Chýba mapovanie portu -p 8080:80.' };
      return { ok: true };
    },
  },
  {
    id: 'm4', xp: 20, titul: 'Nazri dovnútra',
    zadanie: 'Zisti, čo tvoj bežiaci nginx vypísal pri štarte, a spusti vnútri kontajnera príkaz, ktorý ukáže jeho hostname.',
    ciel: 'Použité <code>docker logs</code> aj <code>docker exec</code> na bežiacom kontajneri',
    tipy: [
      'Logy kontajnera ukáže <code>docker logs &lt;meno&gt;</code>.',
      'Príkaz vnútri spustíš cez <code>docker exec &lt;meno&gt; &lt;príkaz&gt;</code>.',
      'Riešenie: <code>docker logs web</code> a <code>docker exec web hostname</code>',
    ],
    kontrola(e) {
      const h = e.stav.historia;
      if (!h.some(c => /^docker\s+logs\s+\S+/.test(c))) return { ok: false, preco: 'Ešte si nepozrel logy cez docker logs.' };
      if (!h.some(c => /^docker\s+exec\s+/.test(c))) return { ok: false, preco: 'Ešte si nespustil príkaz vnútri kontajnera cez docker exec.' };
      return { ok: true };
    },
  },
  {
    id: 'm5', xp: 25, titul: 'Upraceme po sebe',
    zadanie: 'Zastav kontajner <code>web</code> a úplne ho odstráň. Over, že už nie je ani medzi zastavenými.',
    ciel: 'Kontajner <code>web</code> neexistuje a použil si <code>docker ps -a</code>',
    tipy: [
      'Bežiaci kontajner treba najprv zastaviť: <code>docker stop web</code>.',
      'Odstránenie: <code>docker rm web</code>. (Skratka pre oboje naraz: <code>docker rm -f web</code>.)',
      'Kontrola: <code>docker ps -a</code> vypíše aj zastavené kontajnery.',
    ],
    kontrola(e) {
      if (e.stav.kontajnery.some(x => x.meno === 'web')) {
        return { ok: false, preco: 'Kontajner web ešte existuje — zastav ho a zmaž.' };
      }
      if (!e.stav.historia.some(c => /^docker\s+(rm|container\s+rm)\s/.test(c))) {
        return { ok: false, preco: 'Kontajner musíš odstrániť príkazom docker rm.' };
      }
      if (!e.stav.historia.some(c => /^docker\s+ps\s+-a/.test(c))) {
        return { ok: false, preco: 'Ešte over cez docker ps -a, že je naozaj preč.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'm6', xp: 30, titul: 'Databáza, ktorá spadla',
    zadanie: 'Spusti PostgreSQL: <code>docker run -d --name db postgres:16</code>. Kontajner ti hneď skončí — <b>zisti z logov prečo</b>, potom ho zmaž a spusti znova správne (heslo sa dáva premennou prostredia <code>POSTGRES_PASSWORD</code>).',
    ciel: 'Beží kontajner <code>db</code> z postgres s nastaveným <code>POSTGRES_PASSWORD</code> — a logy si si pozrel',
    tipy: [
      'Keď kontajner hneď skončí, prvá vec je vždy <code>docker logs db</code>.',
      'Premennú prostredia pridáš prepínačom <code>-e KLUC=hodnota</code>.',
      'Riešenie: <code>docker rm db</code>, potom <code>docker run -d --name db -e POSTGRES_PASSWORD=tajne postgres:16</code>',
    ],
    kontrola(e) {
      if (!e.stav.historia.some(c => /^docker\s+logs\s/.test(c))) {
        return { ok: false, preco: 'Najprv zisti z logov, prečo kontajner skončil (docker logs db).' };
      }
      const k = e.stav.kontajnery.find(x => x.meno === 'db');
      if (!k) return { ok: false, preco: 'Kontajner db neexistuje — spusti postgres pod menom db.' };
      if (!k.env.POSTGRES_PASSWORD) return { ok: false, preco: 'Kontajneru db chýba premenná POSTGRES_PASSWORD (-e POSTGRES_PASSWORD=…).' };
      if (k.stav !== 'running') return { ok: false, preco: 'Kontajner db nebeží. Zmaž ho (docker rm db) a spusti nanovo s -d a heslom.' };
      return { ok: true };
    },
  },
  {
    id: 'm7', xp: 30, titul: 'Dáta, ktoré prežijú',
    zadanie: 'Kontajner je pominuteľný — dáta nesmú byť. Spusti databázu s <b>pomenovaným volume</b> <code>dbdata</code> pripojeným do <code>/var/lib/postgresql/data</code> a over, že volume existuje.',
    ciel: 'Bežiaci postgres má pripojený volume <code>dbdata</code> a použil si <code>docker volume ls</code>',
    tipy: [
      'Volume sa pripája prepínačom <code>-v MENO:/cesta/v/kontajneri</code>.',
      'Ak už máš kontajner db, najprv ho zmaž: <code>docker rm -f db</code>.',
      'Riešenie: <code>docker run -d --name db -e POSTGRES_PASSWORD=tajne -v dbdata:/var/lib/postgresql/data postgres:16</code>, potom <code>docker volume ls</code>',
    ],
    kontrola(e) {
      const k = e.stav.kontajnery.find(x => x.obraz.startsWith('postgres') && x.stav === 'running');
      if (!k) return { ok: false, preco: 'Nebeží žiadny postgres kontajner.' };
      if (!k.volumes.some(v => String(v).split(':')[0] === 'dbdata')) {
        return { ok: false, preco: 'Kontajneru chýba pripojený volume dbdata (-v dbdata:/var/lib/postgresql/data).' };
      }
      if (!e.stav.volumes.some(v => v.meno === 'dbdata')) return { ok: false, preco: 'Volume dbdata neexistuje.' };
      if (!e.stav.historia.some(c => /^docker\s+volume\s+ls/.test(c))) {
        return { ok: false, preco: 'Ešte si over zoznam volumes cez docker volume ls.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'm8', xp: 35, titul: 'Postav vlastný obraz',
    zadanie: 'V editore vpravo máš <code>Dockerfile</code>. Skontroluj ho a postav z neho obraz s menom <code>moja-appka</code> a tagom <code>1.0</code>.',
    ciel: 'Existuje lokálny obraz <code>moja-appka:1.0</code>',
    tipy: [
      'Obsah Dockerfilu si vypíšeš aj v termináli: <code>cat Dockerfile</code>.',
      'Build sa spúšťa v adresári s Dockerfilom — preto tá bodka na konci (kontext).',
      'Riešenie: <code>docker build -t moja-appka:1.0 .</code>',
    ],
    kontrola(e) {
      const o = e.stav.obrazy.find(x => x.repo === 'moja-appka' && x.tag === '1.0');
      if (!o) return { ok: false, preco: 'Obraz moja-appka:1.0 zatiaľ neexistuje (pozor na -t meno:tag a bodku na konci).' };
      return { ok: true };
    },
  },
  {
    id: 'm9', xp: 35, titul: 'Rozbi a oprav Dockerfile',
    zadanie: 'V editore <b>zmaž prvý riadok <code>FROM …</code></b> a skús build — Docker ti to odmietne. Prečítaj si chybu, vráť riadok späť a postav obraz s tagom <code>moja-appka:2.0</code>.',
    ciel: 'Videl si chybu buildu a napokon existuje obraz <code>moja-appka:2.0</code>',
    tipy: [
      'Každý Dockerfile musí začínať inštrukciou <code>FROM</code> — určuje základný obraz.',
      'Po oprave editora spusti build znova s novým tagom.',
      'Riešenie: vráť <code>FROM python:3.12-slim</code> a spusti <code>docker build -t moja-appka:2.0 .</code>',
    ],
    kontrola(e) {
      if (!e.stav.obrazy.some(x => x.repo === 'moja-appka' && x.tag === '2.0')) {
        return { ok: false, preco: 'Obraz moja-appka:2.0 ešte neexistuje.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'm10', xp: 40, titul: 'Celý stack cez Compose',
    zadanie: 'V editore prepni na <code>docker-compose.yml</code> — sú tam dve služby (api + cache). Spusti celý stack <b>na pozadí</b>, over, že bežia obe, a potom ho celý zhoď.',
    ciel: 'Spustený <code>compose up -d</code>, overený <code>compose ps</code> a nakoniec <code>compose down</code>',
    tipy: [
      'Compose spustí všetky služby naraz: <code>docker compose up -d</code>.',
      'Stav služieb: <code>docker compose ps</code>.',
      'Zhodenie aj s odstránením kontajnerov: <code>docker compose down</code>.',
    ],
    kontrola(e) {
      const h = e.stav.historia;
      if (!h.some(c => /^docker\s+compose\s+up.*-d/.test(c))) return { ok: false, preco: 'Ešte si nespustil stack cez docker compose up -d.' };
      if (!h.some(c => /^docker\s+compose\s+ps/.test(c))) return { ok: false, preco: 'Over stav služieb cez docker compose ps.' };
      if (!h.some(c => /^docker\s+compose\s+down/.test(c))) return { ok: false, preco: 'Nakoniec stack zhoď cez docker compose down.' };
      if (e.stav.kontajnery.some(k => k.compose)) return { ok: false, preco: 'Compose kontajnery ešte bežia — zhoď ich cez docker compose down.' };
      return { ok: true };
    },
  },
  {
    id: 'm11', xp: 30, titul: 'Konflikt portu',
    zadanie: 'Spusti dva nginx kontajnery na <b>tom istom</b> hostiteľskom porte 9000 — druhý ti Docker odmietne. Prečítaj chybu a spusti ten druhý na porte 9001 tak, aby napokon bežali <b>oba naraz</b>.',
    ciel: 'Bežia dva nginx kontajnery, každý na inom hostiteľskom porte',
    tipy: [
      'Jeden hostiteľský port môže naraz obsadiť len jeden kontajner.',
      'Kontajnerový port môže byť rovnaký (80) — mení sa len ten pred dvojbodkou.',
      'Riešenie: <code>docker run -d -p 9000:80 --name w1 nginx</code> a <code>docker run -d -p 9001:80 --name w2 nginx</code>',
    ],
    kontrola(e) {
      const bezi = e.stav.kontajnery.filter(k => k.stav === 'running' && k.obraz.startsWith('nginx'));
      if (bezi.length < 2) return { ok: false, preco: `Bežia zatiaľ ${bezi.length} nginx kontajnery, treba dva naraz.` };
      const porty = bezi.flatMap(k => k.porty.map(p => String(p).split(':')[0]));
      if (new Set(porty).size < 2) return { ok: false, preco: 'Oba kontajnery musia mať namapovaný iný hostiteľský port.' };
      return { ok: true };
    },
  },
  {
    id: 'm12', xp: 40, titul: 'Veľké upratovanie',
    zadanie: 'Na záver sprav poriadok: <b>zastav a odstráň všetky kontajnery</b> a zmaž nepoužívané obrazy tak, aby ti neostal žiadny kontajner (ani zastavený).',
    ciel: 'Žiadny kontajner v <code>docker ps -a</code>',
    tipy: [
      'Zastavené kontajnery a nepoužité obrazy pozametá <code>docker system prune -f</code>.',
      'Bežiace kontajnery prune nezmaže — tie treba najprv zastaviť (<code>docker stop</code>) alebo <code>docker rm -f</code>.',
      'Riešenie: postupne <code>docker rm -f &lt;meno&gt;</code> pre bežiace, potom <code>docker system prune -f</code>.',
    ],
    kontrola(e) {
      if (e.stav.kontajnery.length) {
        const bezi = e.stav.kontajnery.filter(k => k.stav === 'running').length;
        return { ok: false, preco: `Ostáva ${e.stav.kontajnery.length} kontajnerov${bezi ? ` (z toho ${bezi} bežiacich — tie prune nezmaže)` : ''}.` };
      }
      return { ok: true };
    },
  },
];
