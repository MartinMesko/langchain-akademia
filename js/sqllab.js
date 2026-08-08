/* ============================================================
   SQL PLAYGROUND — misie
   Dataset je firemná AI appka (zákazníci, dokumenty, dopyty),
   takže dotazy dávajú zmysel aj v kontexte kurzu.
   ============================================================ */
window.SQL_MISIE = [
  {
    id: 's1', xp: 15, titul: 'Rozhliadni sa v databáze',
    zadanie: 'Skôr než niečo napíšeš, zisti, čo v databáze vôbec je. Vypíš zoznam tabuliek a potom celý obsah tabuľky <code>zakaznici</code>.',
    ciel: 'Použil si <code>\\dt</code> aj <code>SELECT * FROM zakaznici</code>',
    tipy: [
      'Zoznam tabuliek: <code>\\dt</code> (v psql je to štandardná skratka).',
      'Stĺpce konkrétnej tabuľky: <code>\\d zakaznici</code>.',
      'Celý obsah: <code>SELECT * FROM zakaznici</code> — hviezdička znamená „všetky stĺpce".',
    ],
    kontrola(e) {
      const h = e.stav.historia;
      if (!h.some(c => /^\\dt|^SHOW\s+TABLES/i.test(c))) return { ok: false, preco: 'Ešte si nevypísal zoznam tabuliek cez \\dt.' };
      if (!h.some(c => /^SELECT\s+\*\s+FROM\s+zakaznici/i.test(c))) return { ok: false, preco: 'Vypíš celú tabuľku: SELECT * FROM zakaznici' };
      return { ok: true };
    },
  },
  {
    id: 's2', xp: 20, titul: 'Filtruj a vyber stĺpce',
    zadanie: 'Vypíš <b>iba meno a plán</b> tých zákazníkov, ktorí majú plán <code>pro</code> <b>a zároveň</b> sú aktívni.',
    ciel: 'Dotaz vrátil práve zákazníkov s plánom pro, ktorí sú aktívni',
    tipy: [
      'Stĺpce vymenuješ za SELECT oddelené čiarkou: <code>SELECT meno, plan …</code>',
      'Filter je <code>WHERE</code>, spojenie podmienok <code>AND</code>. Text patrí do apostrofov: <code>\'pro\'</code>.',
      'Riešenie: <code>SELECT meno, plan FROM zakaznici WHERE plan = \'pro\' AND aktivny = true</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ si nespustil žiadny SELECT.' };
      if (v.riadky.length !== 1) return { ok: false, preco: `Dotaz vrátil ${v.riadky.length} riadkov — má vrátiť práve jedného zákazníka (pro + aktívny).` };
      if (v.stlpce.includes('id') || v.stlpce.length > 2) return { ok: false, preco: 'Vyber iba stĺpce meno a plan, nie všetky.' };
      const r = v.riadky[0];
      if (!String(Object.values(r).join(' ')).includes('Jana')) return { ok: false, preco: 'Výsledok nesedí — skontroluj podmienku (plan = \'pro\' AND aktivny = true).' };
      return { ok: true };
    },
  },
  {
    id: 's3', xp: 25, titul: 'Zoraď a obmedz',
    zadanie: 'Vypíš <b>tri najdrahšie dopyty</b> — stĺpce <code>otazka</code> a <code>tokeny</code> z tabuľky <code>dopyty</code>, zoradené od najväčšieho počtu tokenov.',
    ciel: 'Výsledok má 3 riadky zoradené zostupne podľa tokenov',
    tipy: [
      'Zoradenie: <code>ORDER BY tokeny DESC</code> (DESC = zostupne).',
      'Obmedzenie počtu: <code>LIMIT 3</code> — vždy až na konci dotazu.',
      'Riešenie: <code>SELECT otazka, tokeny FROM dopyty ORDER BY tokeny DESC LIMIT 3</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ žiadny výsledok.' };
      if (v.riadky.length !== 3) return { ok: false, preco: `Výsledok má ${v.riadky.length} riadkov — použi LIMIT 3.` };
      const t = v.riadky.map(r => Number(r.tokeny ?? r['d.tokeny']));
      if (t.some(isNaN)) return { ok: false, preco: 'Vo výsledku chýba stĺpec tokeny.' };
      if (!(t[0] >= t[1] && t[1] >= t[2])) return { ok: false, preco: 'Výsledok nie je zoradený zostupne — pridaj ORDER BY tokeny DESC.' };
      if (t[0] !== 5200) return { ok: false, preco: 'Najdrahší dopyt má 5200 tokenov — skontroluj zoradenie.' };
      return { ok: true };
    },
  },
  {
    id: 's4', xp: 30, titul: 'Spoj dve tabuľky (JOIN)',
    zadanie: 'Tabuľka <code>dopyty</code> pozná len <code>zakaznik_id</code>. Spoj ju so <code>zakaznici</code> a vypíš <b>meno zákazníka a jeho otázku</b>.',
    ciel: 'Výsledok obsahuje meno zákazníka aj text otázky',
    tipy: [
      'JOIN spája riadky podľa spoločnej hodnoty: <code>JOIN dopyty ON zakaznici.id = dopyty.zakaznik_id</code>.',
      'Tabuľkám sa dajú dať prezývky: <code>FROM zakaznici z JOIN dopyty d ON z.id = d.zakaznik_id</code>.',
      'Riešenie: <code>SELECT z.meno, d.otazka FROM zakaznici z JOIN dopyty d ON z.id = d.zakaznik_id</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ žiadny výsledok.' };
      if (!e.stav.historia.some(c => /JOIN/i.test(c))) return { ok: false, preco: 'Ešte si nepoužil JOIN.' };
      const text = JSON.stringify(v.riadky);
      if (!/Jana|Peter|Martin|Lucia/.test(text)) return { ok: false, preco: 'Vo výsledku chýbajú mená zákazníkov.' };
      if (!/otázka|záru|reklam|zmluv|limity|začať|plán/i.test(text)) return { ok: false, preco: 'Vo výsledku chýbajú otázky z tabuľky dopyty.' };
      return { ok: true };
    },
  },
  {
    id: 's5', xp: 30, titul: 'Spočítaj podľa skupín',
    zadanie: 'Koľko zákazníkov je na ktorom pláne? Vypíš <b>plán a počet zákazníkov</b>, zoradené od najpočetnejšieho.',
    ciel: 'Výsledok má jeden riadok na každý plán s počtom',
    tipy: [
      'Zoskupenie: <code>GROUP BY plan</code> — vytvorí jeden riadok na každú hodnotu.',
      'Počítanie: <code>COUNT(*)</code>, pomenovanie stĺpca: <code>AS pocet</code>.',
      'Riešenie: <code>SELECT plan, COUNT(*) AS pocet FROM zakaznici GROUP BY plan ORDER BY pocet DESC</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ žiadny výsledok.' };
      if (!e.stav.historia.some(c => /GROUP\s+BY/i.test(c))) return { ok: false, preco: 'Ešte si nepoužil GROUP BY.' };
      if (v.riadky.length !== 3) return { ok: false, preco: `Výsledok má ${v.riadky.length} riadkov — plány sú tri (free, pro, enterprise).` };
      const cisla = v.riadky.map(r => Object.values(r).find(x => typeof x === 'number'));
      if (cisla.some(x => x === undefined)) return { ok: false, preco: 'Chýba stĺpec s počtom — pridaj COUNT(*).' };
      return { ok: true };
    },
  },
  {
    id: 's6', xp: 35, titul: 'Koľko nás stojí ktorý zákazník',
    zadanie: 'Spoj zákazníkov s ich dopytmi a vypíš <b>meno a súčet tokenov</b>. Nechaj len tých, ktorí spolu minuli <b>viac než 1000 tokenov</b>, a zoraď od najväčšieho.',
    ciel: 'Výsledok obsahuje len zákazníkov so súčtom nad 1000',
    tipy: [
      'Súčet cez skupiny: <code>SUM(d.tokeny)</code> + <code>GROUP BY z.meno</code>.',
      'Filter <b>po</b> zoskupení sa píše cez <code>HAVING</code> (nie WHERE — to filtruje pred zoskupením).',
      'Riešenie: <code>SELECT z.meno, SUM(d.tokeny) AS spolu FROM zakaznici z JOIN dopyty d ON z.id = d.zakaznik_id GROUP BY z.meno HAVING SUM(d.tokeny) &gt; 1000 ORDER BY spolu DESC</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ žiadny výsledok.' };
      if (!e.stav.historia.some(c => /HAVING/i.test(c))) return { ok: false, preco: 'Filter po zoskupení sa robí cez HAVING.' };
      if (v.riadky.length !== 2) return { ok: false, preco: `Výsledok má ${v.riadky.length} riadkov — nad 1000 tokenov sú práve dvaja zákazníci.` };
      const sucty = v.riadky.map(r => Object.values(r).find(x => typeof x === 'number'));
      if (sucty[0] !== 5840) return { ok: false, preco: 'Prvý má byť zákazník s 5840 tokenmi — pridaj ORDER BY … DESC.' };
      return { ok: true };
    },
  },
  {
    id: 's7', xp: 30, titul: 'Izolácia dát medzi zákazníkmi',
    zadanie: 'Toto je ten filter, o ktorom je celá lekcia 36. Vypíš názvy dokumentov, ktoré patria <b>iba firme <code>firma-a</code></b> — presne takto sa v RAG appke bráni, aby jeden zákazník videl dokumenty druhého.',
    ciel: 'Výsledok obsahuje len dokumenty firmy <code>firma-a</code>',
    tipy: [
      'Filter na stĺpec <code>firma</code>: <code>WHERE firma = \'firma-a\'</code>',
      'V produkcii sa hodnota nikdy neberie z promptu, ale z overenej session — inak si filter len odporúčanie.',
      'Riešenie: <code>SELECT nazov FROM dokumenty WHERE firma = \'firma-a\'</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ žiadny výsledok.' };
      if (v.riadky.length !== 2) return { ok: false, preco: `Výsledok má ${v.riadky.length} riadkov — firma-a má práve dva dokumenty.` };
      const text = JSON.stringify(v.riadky);
      if (/cennik|web-scrape|manual/.test(text)) return { ok: false, preco: 'Vo výsledku sú aj cudzie dokumenty — to je presne ten únik dát, ktorému chceme zabrániť.' };
      return { ok: true };
    },
  },
  {
    id: 's8', xp: 30, titul: 'Hľadanie podľa vzoru',
    zadanie: 'Nájdi všetky dokumenty, ktorých názov <b>končí na <code>.pdf</code></b>, a vypíš názov aj počet chunkov — zoradené od najväčšieho dokumentu.',
    ciel: 'Výsledok obsahuje iba PDF dokumenty, zoradené podľa počtu chunkov',
    tipy: [
      'Vzor sa hľadá cez <code>LIKE</code>, kde <code>%</code> znamená „čokoľvek": <code>WHERE nazov LIKE \'%.pdf\'</code>',
      'Nezabudni na <code>ORDER BY pocet_chunkov DESC</code>.',
      'Riešenie: <code>SELECT nazov, pocet_chunkov FROM dokumenty WHERE nazov LIKE \'%.pdf\' ORDER BY pocet_chunkov DESC</code>',
    ],
    kontrola(e) {
      const v = e.stav.poslednyVysledok;
      if (!v) return { ok: false, preco: 'Zatiaľ žiadny výsledok.' };
      if (!e.stav.historia.some(c => /LIKE/i.test(c))) return { ok: false, preco: 'Použi LIKE so vzorom \'%.pdf\'.' };
      if (v.riadky.length !== 3) return { ok: false, preco: `Výsledok má ${v.riadky.length} riadkov — PDF súbory sú tri.` };
      const ch = v.riadky.map(r => Number(r.pocet_chunkov));
      if (!(ch[0] >= ch[1] && ch[1] >= ch[2])) return { ok: false, preco: 'Zoraď zostupne podľa pocet_chunkov.' };
      return { ok: true };
    },
  },
  {
    id: 's9', xp: 30, titul: 'Zápis, oprava a zmazanie',
    zadanie: 'Vlož nového zákazníka s <code>id = 10</code>, potom mu <b>zmeň plán</b> na <code>pro</code> a nakoniec ho <b>zmaž</b>. Všímaj si, čo databáza po každom kroku odpovie.',
    ciel: 'Zákazník s id 10 bol vložený, upravený a znova zmazaný',
    tipy: [
      'Vloženie: <code>INSERT INTO zakaznici (id, meno, firma, plan, aktivny) VALUES (10, \'Test\', \'firma-c\', \'free\', true)</code>',
      'Zmena: <code>UPDATE zakaznici SET plan = \'pro\' WHERE id = 10</code> — <b>nikdy nezabudni na WHERE!</b>',
      'Zmazanie: <code>DELETE FROM zakaznici WHERE id = 10</code>',
    ],
    kontrola(e) {
      const h = e.stav.historia;
      if (!h.some(c => /^INSERT/i.test(c))) return { ok: false, preco: 'Ešte si nikoho nevložil cez INSERT.' };
      if (!h.some(c => /^UPDATE.*WHERE/i.test(c))) return { ok: false, preco: 'Uprav plán cez UPDATE … SET … WHERE id = 10.' };
      if (!h.some(c => /^DELETE.*WHERE/i.test(c))) return { ok: false, preco: 'Nakoniec záznam zmaž cez DELETE … WHERE id = 10.' };
      if (e.stav.tabulky.zakaznici.riadky.some(r => r.id === 10)) {
        return { ok: false, preco: 'Zákazník s id 10 tam ešte je — zmaž ho.' };
      }
      if (e.stav.tabulky.zakaznici.riadky.length !== 5) {
        return { ok: false, preco: `V tabuľke je ${e.stav.tabulky.zakaznici.riadky.length} zákazníkov namiesto pôvodných 5 — použi reset a skús znova.` };
      }
      return { ok: true };
    },
  },
  {
    id: 's10', xp: 35, titul: 'Index a prečo na ňom záleží',
    zadanie: 'Pozri sa cez <code>EXPLAIN</code>, ako databáza vykoná dotaz <code>SELECT * FROM dopyty WHERE zakaznik_id = 1</code>. Potom nad tým stĺpcom <b>vytvor index</b> a spusti EXPLAIN znova — plán sa zmení.',
    ciel: 'Existuje index nad <code>dopyty(zakaznik_id)</code> a videl si oba plány',
    tipy: [
      'Plán dotazu: <code>EXPLAIN SELECT * FROM dopyty WHERE zakaznik_id = 1</code> — uvidíš „Seq Scan" (prechod celej tabuľky).',
      'Index: <code>CREATE INDEX idx_dopyty_zakaznik ON dopyty (zakaznik_id)</code>',
      'Po vytvorení spusti EXPLAIN znova — teraz uvidíš „Index Scan". Pri miliónoch riadkov je to rozdiel medzi sekundami a milisekundami.',
    ],
    kontrola(e) {
      const explainy = e.stav.historia.filter(c => /^EXPLAIN/i.test(c)).length;
      if (!explainy) return { ok: false, preco: 'Začni príkazom EXPLAIN SELECT * FROM dopyty WHERE zakaznik_id = 1.' };
      if (!e.stav.indexy.some(i => i.stlpec === 'zakaznik_id')) {
        return { ok: false, preco: 'Ešte neexistuje index nad dopyty(zakaznik_id).' };
      }
      if (explainy < 2) return { ok: false, preco: 'Spusti EXPLAIN aj po vytvorení indexu, nech vidíš rozdiel.' };
      return { ok: true };
    },
  },
];
