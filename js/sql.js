/* ============================================================
   SQL PLAYGROUND — mini SQL engine nad pevným datasetom
   Podporuje SELECT (WHERE, JOIN, GROUP BY, HAVING, ORDER BY,
   LIMIT, agregácie), INSERT, UPDATE, DELETE a EXPLAIN.
   Dataset je firemná AI appka: zákazníci, dokumenty, dopyty.
   ============================================================ */
(function () {
  'use strict';

  /* ── Dataset ─────────────────────────────────────────────── */
  function vyrobData() {
    return {
      zakaznici: {
        stlpce: ['id', 'meno', 'firma', 'plan', 'aktivny'],
        typy: { id: 'int', meno: 'text', firma: 'text', plan: 'text', aktivny: 'bool' },
        riadky: [
          { id: 1, meno: 'Jana Nováková', firma: 'firma-a', plan: 'pro', aktivny: true },
          { id: 2, meno: 'Peter Kováč', firma: 'firma-a', plan: 'free', aktivny: true },
          { id: 3, meno: 'Eva Horváthová', firma: 'firma-b', plan: 'pro', aktivny: false },
          { id: 4, meno: 'Martin Baláž', firma: 'firma-b', plan: 'enterprise', aktivny: true },
          { id: 5, meno: 'Lucia Tóthová', firma: 'firma-c', plan: 'free', aktivny: true },
        ],
      },
      dokumenty: {
        stlpce: ['id', 'nazov', 'firma', 'pocet_chunkov', 'dovera'],
        typy: { id: 'int', nazov: 'text', firma: 'text', pocet_chunkov: 'int', dovera: 'text' },
        riadky: [
          { id: 1, nazov: 'zmluva.pdf', firma: 'firma-a', pocet_chunkov: 42, dovera: 'interny' },
          { id: 2, nazov: 'faq.md', firma: 'firma-a', pocet_chunkov: 12, dovera: 'interny' },
          { id: 3, nazov: 'cennik.pdf', firma: 'firma-b', pocet_chunkov: 8, dovera: 'interny' },
          { id: 4, nazov: 'web-scrape.txt', firma: 'firma-b', pocet_chunkov: 130, dovera: 'externy' },
          { id: 5, nazov: 'manual.pdf', firma: 'firma-c', pocet_chunkov: 64, dovera: 'interny' },
        ],
      },
      dopyty: {
        stlpce: ['id', 'zakaznik_id', 'otazka', 'tokeny', 'cena_usd'],
        typy: { id: 'int', zakaznik_id: 'int', otazka: 'text', tokeny: 'int', cena_usd: 'real' },
        riadky: [
          { id: 1, zakaznik_id: 1, otazka: 'Aká je záručná doba?', tokeny: 820, cena_usd: 0.0012 },
          { id: 2, zakaznik_id: 1, otazka: 'Ako uplatním reklamáciu?', tokeny: 1450, cena_usd: 0.0021 },
          { id: 3, zakaznik_id: 2, otazka: 'Koľko stojí pro plán?', tokeny: 300, cena_usd: 0.0004 },
          { id: 4, zakaznik_id: 4, otazka: 'Zhrň mi zmluvu', tokeny: 5200, cena_usd: 0.0078 },
          { id: 5, zakaznik_id: 4, otazka: 'Aké sú limity API?', tokeny: 640, cena_usd: 0.0009 },
          { id: 6, zakaznik_id: 5, otazka: 'Ako začať?', tokeny: 210, cena_usd: 0.0003 },
        ],
      },
    };
  }

  /* ── Pomocníky ───────────────────────────────────────────── */
  const hodnota = (s) => {
    const t = String(s).trim();
    if (/^'(.*)'$/.test(t) || /^"(.*)"$/.test(t)) return t.slice(1, -1);
    if (/^-?\d+$/.test(t)) return parseInt(t, 10);
    if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
    if (/^(true|false)$/i.test(t)) return t.toLowerCase() === 'true';
    if (/^null$/i.test(t)) return null;
    return { stlpec: t };            // odkaz na stĺpec
  };

  const bezMedzier = s => String(s).replace(/\s+/g, '');

  function cit(r, v) {
    if (!(v && typeof v === 'object' && 'stlpec' in v)) return v;
    const s = v.stlpec.trim();
    // výraz so zátvorkou (agregácia, funkcia) — hľadá sa ako celok, nie ako tabuľka.stĺpec
    if (s.includes('(')) {
      if (r[s] !== undefined) return r[s];
      const k = Object.keys(r).find(x => bezMedzier(x) === bezMedzier(s));
      return k ? r[k] : undefined;
    }
    if (r[s] !== undefined) return r[s];                 // presný názov (aj „d.tokeny")
    if (s.includes('.')) return r[s.split('.').pop()];   // inak bez prefixu tabuľky
    return r[s];
  }

  /* ── Parsovanie a vyhodnotenie WHERE ─────────────────────── */
  function vyhodnotPodmienku(riadok, vyraz) {
    const v = vyraz.trim();
    // zátvorky
    if (/^\(.*\)$/.test(v)) {
      let hlbka = 0, cele = true;
      for (let i = 0; i < v.length; i++) {
        if (v[i] === '(') hlbka++;
        else if (v[i] === ')') { hlbka--; if (hlbka === 0 && i < v.length - 1) { cele = false; break; } }
      }
      if (cele) return vyhodnotPodmienku(riadok, v.slice(1, -1));
    }
    // OR má nižšiu prioritu než AND
    for (const op of [' OR ', ' AND ']) {
      let hlbka = 0;
      const horny = v.toUpperCase();
      for (let i = 0; i <= v.length - op.length; i++) {
        if (v[i] === '(') hlbka++;
        else if (v[i] === ')') hlbka--;
        else if (hlbka === 0 && horny.startsWith(op, i)) {
          const l = vyhodnotPodmienku(riadok, v.slice(0, i));
          const p = vyhodnotPodmienku(riadok, v.slice(i + op.length));
          return op === ' OR ' ? (l || p) : (l && p);
        }
      }
    }
    if (/^NOT\s+/i.test(v)) return !vyhodnotPodmienku(riadok, v.replace(/^NOT\s+/i, ''));

    let m;
    if ((m = /^(\S+)\s+IS\s+(NOT\s+)?NULL$/i.exec(v))) {
      const h = cit(riadok, { stlpec: m[1] });
      return m[2] ? (h !== null && h !== undefined) : (h === null || h === undefined);
    }
    if ((m = /^(\S+)\s+(NOT\s+)?LIKE\s+(.+)$/i.exec(v))) {
      const h = String(cit(riadok, { stlpec: m[1] }) ?? '');
      const vzor = String(hodnota(m[3]));
      const re = new RegExp('^' + vzor.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
      return m[2] ? !re.test(h) : re.test(h);
    }
    if ((m = /^(\S+)\s+(NOT\s+)?IN\s*\((.+)\)$/i.exec(v))) {
      const h = cit(riadok, { stlpec: m[1] });
      const zoznam = m[3].split(',').map(x => hodnota(x));
      const je = zoznam.some(x => x === h);
      return m[2] ? !je : je;
    }
    if ((m = /^(.+?)\s*(>=|<=|!=|<>|=|>|<)\s*(.+)$/.exec(v))) {
      const l = cit(riadok, hodnota(m[1])), p = cit(riadok, hodnota(m[3]));
      switch (m[2]) {
        case '=': return l == p;
        case '!=': case '<>': return l != p;
        case '>': return l > p;
        case '<': return l < p;
        case '>=': return l >= p;
        case '<=': return l <= p;
      }
    }
    // holý stĺpec ako boolean
    const h = cit(riadok, { stlpec: v });
    return !!h;
  }

  /* ── Agregácie a funkcie ─────────────────────────────────── */
  const AGG = /^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(.+?)\s*\)$/i;
  const FUNKCIA = /^(ROUND|UPPER|LOWER|LENGTH|ABS)\s*\(\s*([\s\S]+?)\s*(?:,\s*(-?\d+)\s*)?\)$/i;

  // vyhodnotí výraz zo SELECT/HAVING: agregáciu, funkciu (aj vnorenú) alebo stĺpec
  function vyhodnotVyraz(vyraz, riadok, skupina) {
    const v = String(vyraz).trim();
    const am = AGG.exec(v);
    if (am && skupina) return agreguj(am[1].toUpperCase(), am[2].trim(), skupina);
    const fm = FUNKCIA.exec(v);
    if (fm) {
      const vnutro = vyhodnotVyraz(fm[2], riadok, skupina);
      const n = fm[3] !== undefined ? parseInt(fm[3], 10) : 0;
      switch (fm[1].toUpperCase()) {
        case 'ROUND': { const x = Number(vnutro); if (isNaN(x)) return null;
          const k = Math.pow(10, n); return Math.round(x * k) / k; }
        case 'UPPER': return vnutro === null || vnutro === undefined ? null : String(vnutro).toUpperCase();
        case 'LOWER': return vnutro === null || vnutro === undefined ? null : String(vnutro).toLowerCase();
        case 'LENGTH': return vnutro === null || vnutro === undefined ? null : String(vnutro).length;
        case 'ABS': return Math.abs(Number(vnutro));
      }
    }
    if (/^\d+(\.\d+)?$/.test(v) || /^'.*'$/.test(v)) return hodnota(v);
    return cit(riadok, { stlpec: v });
  }

  function neznamaFunkcia(vyraz) {
    const v = String(vyraz).trim();
    return v.includes('(') && !AGG.test(v) && !FUNKCIA.test(v);
  }
  function agreguj(fn, stlpec, riadky) {
    if (fn === 'COUNT') return stlpec === '*' ? riadky.length
      : riadky.filter(r => cit(r, { stlpec }) !== null && cit(r, { stlpec }) !== undefined).length;
    const cisla = riadky.map(r => Number(cit(r, { stlpec }))).filter(x => !isNaN(x));
    if (!cisla.length) return null;
    switch (fn) {
      case 'SUM': return Math.round(cisla.reduce((a, b) => a + b, 0) * 1e6) / 1e6;
      case 'AVG': return Math.round(cisla.reduce((a, b) => a + b, 0) / cisla.length * 100) / 100;
      case 'MIN': return Math.min(...cisla);
      case 'MAX': return Math.max(...cisla);
    }
  }

  /* ── Engine ──────────────────────────────────────────────── */
  function vyrobEngine() {
    const stav = {
      tabulky: vyrobData(),
      indexy: [],            // {tabulka, stlpec}
      historia: [],
      poslednyVysledok: null,
    };

    const O = (text, cls) => ({ text, cls });
    const chyba = t => [O(t, 'err')];

    function tabulka(meno) {
      const kluc = Object.keys(stav.tabulky).find(t => t.toLowerCase() === String(meno).toLowerCase());
      return kluc ? stav.tabulky[kluc] : null;
    }

    function vykresli(stlpce, riadky) {
      if (!riadky.length) return [O('(0 riadkov)', 'dim')];
      const sirky = stlpce.map(s => Math.max(s.length,
        ...riadky.map(r => String(r[s] ?? 'NULL').length)));
      const ciara = '+' + sirky.map(w => '-'.repeat(w + 2)).join('+') + '+';
      const riadok = (bunky, cls) => O('| ' + bunky.map((b, i) =>
        String(b ?? 'NULL').padEnd(sirky[i])).join(' | ') + ' |', cls);
      const von = [O(ciara, 'dim'), riadok(stlpce, 'head'), O(ciara, 'dim')];
      riadky.forEach(r => von.push(riadok(stlpce.map(s => r[s]))));
      von.push(O(ciara, 'dim'));
      von.push(O(`(${riadky.length} riadk${riadky.length === 1 ? 'ov' : riadky.length < 5 ? 'y' : 'ov'})`, 'dim'));
      return von;
    }

    const stlpceVysPomocne = vybery => vybery.map(v => {
      const as = /\s+AS\s+(\w+)$/i.exec(v);
      return as ? as[1] : v.replace(/\s+AS\s+\w+$/i, '').trim();
    });

    /* ── SELECT ── */
    function select(dopyt) {
      const re = /^SELECT\s+(?<sel>[\s\S]+?)\s+FROM\s+(?<from>[\s\S]+?)(?:\s+WHERE\s+(?<where>[\s\S]+?))?(?:\s+GROUP\s+BY\s+(?<group>[\s\S]+?))?(?:\s+HAVING\s+(?<having>[\s\S]+?))?(?:\s+ORDER\s+BY\s+(?<order>[\s\S]+?))?(?:\s+LIMIT\s+(?<limit>\d+))?$/i;
      const m = re.exec(dopyt.trim());
      if (!m) return chyba('ERROR: syntax error — očakávam SELECT stĺpce FROM tabuľka [WHERE …] [GROUP BY …] [ORDER BY …] [LIMIT n]');
      const g = m.groups;

      // FROM + JOIN
      const fromCast = g.from.trim();
      const joinRe = /^(\S+)(?:\s+(?:AS\s+)?(\w+))?((?:\s+(?:INNER|LEFT)?\s*JOIN\s+[\s\S]+)?)$/i;
      const fm = joinRe.exec(fromCast);
      if (!fm) return chyba('ERROR: nerozumiem časti FROM');
      const zaklad = tabulka(fm[1]);
      if (!zaklad) return chyba(`ERROR: relation "${fm[1]}" does not exist\nDostupné tabuľky: ${Object.keys(stav.tabulky).join(', ')}`);

      let riadky = zaklad.riadky.map(r => Object.assign({}, r));
      let stlpceVsetky = zaklad.stlpce.slice();

      const joiny = [...(fm[3] || '').matchAll(/(INNER|LEFT)?\s*JOIN\s+(\S+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+(\S+)\s*=\s*(\S+)/gi)];
      for (const j of joiny) {
        const typ = (j[1] || 'INNER').toUpperCase();
        const t2 = tabulka(j[2]);
        if (!t2) return chyba(`ERROR: relation "${j[2]}" does not exist`);
        const [lavy, pravy] = [j[4], j[5]].map(x => x.includes('.') ? x.split('.')[1] : x);
        const spojene = [];
        riadky.forEach(r => {
          const zhody = t2.riadky.filter(r2 => (r[lavy] ?? r[pravy]) === (r2[pravy] ?? r2[lavy]));
          if (zhody.length) {
            zhody.forEach(r2 => {
              const kopia = Object.assign({}, r);
              t2.stlpce.forEach(s => { kopia[s] = kopia[s] === undefined ? r2[s] : kopia[s]; });
              spojene.push(kopia);
            });
          } else if (typ === 'LEFT') {
            const kopia = Object.assign({}, r);
            t2.stlpce.forEach(s => { if (kopia[s] === undefined) kopia[s] = null; });
            spojene.push(kopia);
          }
        });
        riadky = spojene;
        t2.stlpce.forEach(s => { if (!stlpceVsetky.includes(s)) stlpceVsetky.push(s); });
      }

      // WHERE
      if (g.where) {
        try { riadky = riadky.filter(r => vyhodnotPodmienku(r, g.where)); }
        catch (e) { return chyba('ERROR: nerozumiem podmienke vo WHERE'); }
      }

      // výber stĺpcov
      const vybery = g.sel.split(/,(?![^()]*\))/).map(s => s.trim());
      const bezAlias = v => v.replace(/\s+AS\s+\w+$/i, '').trim();
      const maAgregaciu = vybery.some(v => AGG.test(bezAlias(v)) ||
        (FUNKCIA.test(bezAlias(v)) && AGG.test(FUNKCIA.exec(bezAlias(v))[2].trim())));
      const zla = vybery.map(bezAlias).find(neznamaFunkcia);
      if (zla) return chyba(`ERROR: function ${zla.split('(')[0].trim()}() does not exist\nPlayground pozná: COUNT, SUM, AVG, MIN, MAX, ROUND, UPPER, LOWER, LENGTH, ABS`);

      function menoStlpca(v) {
        const as = /\s+AS\s+(\w+)$/i.exec(v);
        if (as) return as[1];
        return v.replace(/\s+AS\s+\w+$/i, '').trim();
      }
      function vyrazBezAs(v) { return v.replace(/\s+AS\s+\w+$/i, '').trim(); }

      let vysledok, stlpceVys;

      if (g.group || maAgregaciu) {
        const kluce = g.group ? g.group.split(',').map(s => s.trim()) : [];
        const skupiny = new Map();
        riadky.forEach(r => {
          const k = kluce.map(s => cit(r, { stlpec: s })).join('\u0001');
          if (!skupiny.has(k)) skupiny.set(k, []);
          skupiny.get(k).push(r);
        });
        if (!kluce.length) skupiny.set('', riadky);

        vysledok = [...skupiny.values()].map(grp => {
          const out = {};
          vybery.forEach(v => {
            const vyraz = vyrazBezAs(v), meno = menoStlpca(v);
            out[meno] = vyhodnotVyraz(vyraz, grp[0], grp);
            // sprístupni hodnotu aj pod pôvodným výrazom, nech ju nájde HAVING
            if (meno !== vyraz) out[vyraz] = out[meno];
          });
          out.__grp = grp;
          return out;
        });
        if (g.having) {
          // agregácie v HAVING sa dopočítajú nad skupinou, aj keď nie sú v SELECT
          [...g.having.matchAll(new RegExp(AGG.source, 'gi'))].forEach(am => {
            vysledok.forEach(r => {
              if (r[am[0]] === undefined) r[am[0]] = agreguj(am[1].toUpperCase(), am[2].trim(), r.__grp);
            });
          });
          vysledok = vysledok.filter(r => {
            try { return vyhodnotPodmienku(r, g.having); } catch (e) { return true; }
          });
        }
        vysledok.forEach(r => {
          delete r.__grp;
          Object.keys(r).forEach(k => { if (!stlpceVysPomocne(vybery).includes(k)) delete r[k]; });
        });
        stlpceVys = vybery.map(menoStlpca);
      } else if (vybery.length === 1 && vybery[0] === '*') {
        vysledok = riadky;
        stlpceVys = stlpceVsetky.filter(s => riadky.some(r => r[s] !== undefined));
      } else {
        stlpceVys = vybery.map(menoStlpca);
        vysledok = riadky.map(r => {
          const out = {};
          vybery.forEach(v => {
            const vyraz = vyrazBezAs(v), meno = menoStlpca(v);
            out[meno] = vyhodnotVyraz(vyraz, r, null);
          });
          return out;
        });
      }

      // ORDER BY
      if (g.order) {
        const casti = g.order.split(',').map(s => s.trim());
        vysledok.sort((a, b) => {
          for (const c of casti) {
            const mo = /^(.+?)(?:\s+(ASC|DESC))?$/i.exec(c);
            const cely = mo[1].trim();
            const smer = (mo[2] || 'ASC').toUpperCase() === 'DESC' ? -1 : 1;
            const najdi = r => {
              if (r[cely] !== undefined) return r[cely];
              const kratky = cely.replace(/^.*\./, '');
              if (r[kratky] !== undefined) return r[kratky];
              const k = Object.keys(r).find(x => x.replace(/^.*\./, '') === kratky);
              return k ? r[k] : undefined;
            };
            const x = najdi(a), y = najdi(b);
            if (x === y) continue;
            if (x === null || x === undefined) return 1;
            if (y === null || y === undefined) return -1;
            return (x > y ? 1 : -1) * smer;
          }
          return 0;
        });
      }
      if (g.limit) vysledok = vysledok.slice(0, parseInt(g.limit, 10));

      stav.poslednyVysledok = { stlpce: stlpceVys, riadky: vysledok };
      return vykresli(stlpceVys, vysledok);
    }

    /* ── INSERT / UPDATE / DELETE ── */
    function insert(dopyt) {
      const m = /^INSERT\s+INTO\s+(\S+)\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)$/i.exec(dopyt.trim());
      if (!m) return chyba('ERROR: syntax — INSERT INTO tabuľka (stĺpce) VALUES (hodnoty)');
      const t = tabulka(m[1]);
      if (!t) return chyba(`ERROR: relation "${m[1]}" does not exist`);
      const stlpce = m[2].split(',').map(s => s.trim());
      const hodnoty = m[3].split(/,(?![^(]*\))/).map(s => hodnota(s));
      const neznamy = stlpce.find(s => !t.stlpce.includes(s));
      if (neznamy) return chyba(`ERROR: column "${neznamy}" of relation "${m[1]}" does not exist`);
      const r = {};
      t.stlpce.forEach(s => { r[s] = null; });
      stlpce.forEach((s, i) => { r[s] = hodnoty[i]; });
      if (r.id !== null && t.riadky.some(x => x.id === r.id)) {
        return chyba(`ERROR: duplicate key value violates unique constraint "${m[1]}_pkey"\nDETAIL: Key (id)=(${r.id}) already exists.`);
      }
      if (r.id === null) r.id = Math.max(0, ...t.riadky.map(x => x.id)) + 1;
      t.riadky.push(r);
      return [O('INSERT 0 1', 'ok')];
    }

    function update(dopyt) {
      const m = /^UPDATE\s+(\S+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i.exec(dopyt.trim());
      if (!m) return chyba('ERROR: syntax — UPDATE tabuľka SET stĺpec = hodnota [WHERE …]');
      const t = tabulka(m[1]);
      if (!t) return chyba(`ERROR: relation "${m[1]}" does not exist`);
      const prirad = m[2].split(/,(?![^(]*\))/).map(s => {
        const p = /^(.+?)\s*=\s*(.+)$/.exec(s.trim());
        return p ? { stlpec: p[1].trim(), hodn: hodnota(p[2]) } : null;
      }).filter(Boolean);
      let n = 0;
      t.riadky.forEach(r => {
        if (m[3] && !vyhodnotPodmienku(r, m[3])) return;
        prirad.forEach(p => { r[p.stlpec] = cit(r, p.hodn); });
        n++;
      });
      const von = [O(`UPDATE ${n}`, n ? 'ok' : 'dim')];
      if (!m[3] && n > 1) von.push(O('⚠ UPDATE bez WHERE zmenil všetky riadky — v produkcii klasická katastrofa.', 'warn'));
      return von;
    }

    function zmaz(dopyt) {
      const m = /^DELETE\s+FROM\s+(\S+)(?:\s+WHERE\s+([\s\S]+))?$/i.exec(dopyt.trim());
      if (!m) return chyba('ERROR: syntax — DELETE FROM tabuľka [WHERE …]');
      const t = tabulka(m[1]);
      if (!t) return chyba(`ERROR: relation "${m[1]}" does not exist`);
      const pred = t.riadky.length;
      t.riadky = m[2] ? t.riadky.filter(r => !vyhodnotPodmienku(r, m[2])) : [];
      const n = pred - t.riadky.length;
      const von = [O(`DELETE ${n}`, n ? 'ok' : 'dim')];
      if (!m[2]) von.push(O('⚠ DELETE bez WHERE zmazal celú tabuľku.', 'warn'));
      return von;
    }

    /* ── rozcestník ── */
    function spusti(riadok) {
      const cely = riadok.trim().replace(/;+\s*$/, '');
      if (!cely) return [];
      stav.historia.push(cely);
      const prve = (cely.split(/\s+/)[0] || '').toUpperCase();

      if (prve === 'HELP' || prve === 'POMOC') {
        return [
          O('Dostupné v SQL Playgrounde:', 'head'),
          O('  SELECT stĺpce FROM tabuľka [WHERE …] [GROUP BY …] [HAVING …] [ORDER BY … ASC|DESC] [LIMIT n]'),
          O('  JOIN:      SELECT z.meno, d.otazka FROM zakaznici z JOIN dopyty d ON z.id = d.zakaznik_id'),
          O('  Agregácie: COUNT(*), SUM(x), AVG(x), MIN(x), MAX(x)'),
          O('  Podmienky: =, !=, >, <, >=, <=, AND, OR, NOT, LIKE \'%text%\', IN (…), IS NULL'),
          O('  Zmeny:     INSERT INTO … VALUES …  ·  UPDATE … SET … WHERE …  ·  DELETE FROM … WHERE …'),
          O('  Ostatné:   \\dt (zoznam tabuliek)  ·  \\d tabuľka (stĺpce)  ·  EXPLAIN <dopyt>  ·  clear, reset'),
        ];
      }
      if (cely === '\\dt' || /^SHOW\s+TABLES$/i.test(cely)) {
        return vykresli(['tabuľka', 'riadkov', 'stĺpce'],
          Object.entries(stav.tabulky).map(([m, t]) =>
            ({ 'tabuľka': m, 'riadkov': t.riadky.length, 'stĺpce': t.stlpce.join(', ') })));
      }
      if (/^\\d\s+\S+/.test(cely)) {
        const t = tabulka(cely.split(/\s+/)[1]);
        if (!t) return chyba('Taká tabuľka neexistuje. Zoznam: \\dt');
        return vykresli(['stĺpec', 'typ'], t.stlpce.map(s => ({ 'stĺpec': s, 'typ': t.typy[s] })));
      }
      if (prve === 'EXPLAIN') {
        const vnutro = cely.replace(/^EXPLAIN\s+/i, '');
        const m = /FROM\s+(\S+)/i.exec(vnutro);
        const t = m ? tabulka(m[1]) : null;
        if (!t) return chyba('EXPLAIN potrebuje platný SELECT.');
        const w = /WHERE\s+(\w+)/i.exec(vnutro);
        const maIndex = w && stav.indexy.some(i => i.tabulka.toLowerCase() === m[1].toLowerCase() && i.stlpec === w[1]);
        return [
          O(maIndex
            ? `Index Scan using idx_${m[1]}_${w[1]} on ${m[1]}  (cost=0.15..8.20 rows=1)`
            : `Seq Scan on ${m[1]}  (cost=0.00..${(t.riadky.length * 1.2).toFixed(2)} rows=${t.riadky.length})`,
            maIndex ? 'ok' : 'warn'),
          O(maIndex
            ? '  → index sa použil: databáza nemusí prejsť celú tabuľku'
            : '  → sekvenčný prechod: pri miliónoch riadkov by to bolelo. Skús CREATE INDEX.', 'dim'),
        ];
      }
      if (/^CREATE\s+INDEX/i.test(cely)) {
        const m = /ON\s+(\S+)\s*\(\s*(\w+)\s*\)/i.exec(cely);
        if (!m) return chyba('ERROR: syntax — CREATE INDEX nazov ON tabuľka (stĺpec)');
        if (!tabulka(m[1])) return chyba(`ERROR: relation "${m[1]}" does not exist`);
        stav.indexy.push({ tabulka: m[1], stlpec: m[2] });
        return [O('CREATE INDEX', 'ok')];
      }

      switch (prve) {
        case 'SELECT': return select(cely);
        case 'INSERT': return insert(cely);
        case 'UPDATE': return update(cely);
        case 'DELETE': return zmaz(cely);
        case 'DROP': case 'TRUNCATE':
          return chyba('V Playgrounde je DROP/TRUNCATE vypnutý — na vyčistenie použi príkaz reset.');
        default:
          return chyba(`ERROR: syntax error at or near "${cely.split(/\s+/)[0]}"\nNapíš HELP pre prehľad.`);
      }
    }

    return {
      stav, spusti,
      schema() {
        return Object.entries(stav.tabulky).map(([meno, t]) => ({
          meno, riadkov: t.riadky.length,
          stlpce: t.stlpce.map(s => ({ meno: s, typ: t.typy[s] })),
          indexy: stav.indexy.filter(i => i.tabulka.toLowerCase() === meno).map(i => i.stlpec),
        }));
      },
      reset() {
        stav.tabulky = vyrobData();
        stav.indexy.length = 0;
        stav.historia.length = 0;
        stav.poslednyVysledok = null;
      },
    };
  }

  window.SQL = { vyrobEngine };
})();
