/* ============================================================
   LANGGRAPH PLAYGROUND — krokovateľný beh grafu
   Graf staviaš príkazmi (add_node / add_edge / add_conditional_edges),
   potom ho krokuješ a pri každom uzle vidíš, ako sa mení STAV.
   Rozhodovanie uzlov je pravidlové (deterministické) — učí sa
   mechanika grafu, nie správanie modelu.
   ============================================================ */
(function () {
  'use strict';

  /* ── Katalóg uzlov: čo ktorý robí so stavom ──────────────── */
  const UZLY = {
    klasifikuj: {
      popis: 'Podľa otázky určí tému (matematika / dokumenty / ostatné)',
      farba: '#8fb8d6',
      krok(s) {
        const o = String(s.otazka || '').toLowerCase();
        const tema = /\d|\+|\*|spočítaj|koľko je/.test(o) ? 'matematika'
                   : /dokument|zmluv|faq|súbor|manuál/.test(o) ? 'dokumenty'
                   : 'ostatne';
        return { zmeny: { tema }, log: `téma = ${tema}` };
      },
    },
    hladaj: {
      popis: 'Vyhľadá v dokumentoch (retriever) a naplní kontext',
      farba: '#9ec79a',
      krok(s) {
        const n = 3;
        return { zmeny: { kontext: `${n} nájdené pasáže`, pocet_chunkov: n },
                 log: `retriever vrátil ${n} chunky` };
      },
    },
    pocitaj: {
      popis: 'Spustí nástroj kalkulačka',
      farba: '#e0a09a',
      krok(s) {
        const m = /(\d+)\s*([+\-*/])\s*(\d+)/.exec(String(s.otazka || ''));
        if (!m) return { zmeny: { vysledok_nastroja: null }, log: 'v otázke nie je príklad' };
        const [, a, op, b] = m;
        const x = +a, y = +b;
        const v = op === '+' ? x + y : op === '-' ? x - y : op === '*' ? x * y : (y ? x / y : null);
        return { zmeny: { vysledok_nastroja: v }, log: `${a} ${op} ${b} = ${v}` };
      },
    },
    odpovedz: {
      popis: 'Zloží finálnu odpoveď zo stavu',
      farba: '#c9a6d6',
      krok(s) {
        const odp = s.vysledok_nastroja !== undefined && s.vysledok_nastroja !== null
          ? `Výsledok je ${s.vysledok_nastroja}.`
          : s.kontext ? `Podľa dokumentov: ${s.kontext}.`
          : 'Na to ti odpoviem všeobecne.';
        return { zmeny: { odpoved: odp }, log: 'odpoveď zostavená' };
      },
    },
    over_kvalitu: {
      popis: 'Skontroluje odpoveď — ak je slabá, pošle beh späť',
      farba: '#f0c878',
      krok(s) {
        const pokusy = (s.pokusy || 0) + 1;
        const ok = pokusy >= 2 || !!s.kontext || s.vysledok_nastroja != null;
        return { zmeny: { pokusy, kvalita: ok ? 'ok' : 'slaba' },
                 log: ok ? `kvalita ok (pokus ${pokusy})` : `kvalita slabá — skúsim znova (pokus ${pokusy})` };
      },
    },
    schval_clovekom: {
      popis: 'ZASTAVÍ beh a čaká na človeka (interrupt)',
      farba: '#e8956f', interrupt: true,
      krok(s) {
        return { zmeny: { schvalene: true }, log: 'človek akciu schválil' };
      },
    },
    posli_email: {
      popis: 'Nezvratná akcia — odošle e-mail',
      farba: '#d67d7d',
      krok(s) {
        return { zmeny: { odoslane: true }, log: 'e-mail odoslaný' };
      },
    },
  };

  /* ── Engine ──────────────────────────────────────────────── */
  function vyrobEngine() {
    const stav = {
      uzly: [],            // [{meno, typ}]
      hrany: [],           // {z, do} alebo {z, podmienka: {pole, mapa:{hodnota:cieľ}}}
      vstup: 'klasifikuj',
      stavGrafu: {},       // aktuálny stav, ktorý grafom putuje
      aktualny: null,      // meno uzla, ktorý je na rade
      beh: [],             // [{uzol, log, stavPo}]
      dokoncene: false,
      cakaNaCloveka: false,
      historia: [],
      // príznaky pre misie
      pocetBehov: 0,
      videlZaseknutie: false,
      preskocInterrupt: false,
      videlInterrupt: false,
      videlCyklus: false,
      videlVetvenie: false,
    };

    const O = (text, cls) => ({ text, cls });
    const chyba = t => [O(t, 'err')];
    const maUzol = m => stav.uzly.some(u => u.meno === m) || m === 'END';

    function spusti(riadok) {
      const cely = riadok.trim();
      if (!cely) return [];
      stav.historia.push(cely);
      const t = cely.split(/\s+/);

      if (/^(help|pomoc)$/i.test(t[0])) {
        return [
          O('Dostupné príkazy v LangGraph Playgrounde:', 'head'),
          O('  add_node <meno>              pridá uzol (zoznam typov: nodes)'),
          O('  add_edge <z> <do>            pevná hrana (cieľ môže byť END)'),
          O('  add_conditional_edges <z> <pole> <hodnota>=<cieľ>,…   vetvenie podľa stavu'),
          O('  set_entry <uzol>             kde beh začína'),
          O('  invoke <otázka>              spustí graf až do konca'),
          O('  step                         vykoná JEDEN uzol (krokovanie)'),
          O('  resume                       pokračuje po zastavení (interrupt)'),
          O('  state                        vypíše aktuálny stav'),
          O('  nodes                        zoznam dostupných typov uzlov'),
          O('  graph                        textový výpis grafu'),
          O('  clear_graph                  zmaže uzly aj hrany · reset = úplne od začiatku'),
        ];
      }
      if (t[0] === 'nodes') {
        return [O('Dostupné uzly (add_node <meno>):', 'head'),
          ...Object.entries(UZLY).map(([m, u]) => O(`  ${m.padEnd(18)} ${u.popis}${u.interrupt ? '  ⏸ zastaví beh' : ''}`))];
      }
      if (t[0] === 'add_node') {
        const m = t[1];
        if (!m) return chyba('add_node potrebuje meno uzla. Zoznam: nodes');
        if (!UZLY[m]) return chyba(`Uzol '${m}' neexistuje. Dostupné: ${Object.keys(UZLY).join(', ')}`);
        if (stav.uzly.some(u => u.meno === m)) return chyba(`Uzol '${m}' už v grafe je.`);
        stav.uzly.push({ meno: m });
        if (stav.uzly.length === 1) stav.vstup = m;
        return [O(`✔ uzol ${m} pridaný`, 'ok')];
      }
      if (t[0] === 'add_edge') {
        const [, z, doU] = t;
        if (!z || !doU) return chyba('add_edge potrebuje dva uzly: add_edge klasifikuj odpovedz');
        if (!maUzol(z)) return chyba(`Uzol '${z}' v grafe nie je — pridaj ho cez add_node.`);
        if (!maUzol(doU)) return chyba(`Uzol '${doU}' v grafe nie je (alebo použi END).`);
        if (stav.hrany.some(h => h.z === z && h.do === doU)) return chyba('Táto hrana už existuje.');
        const stara = stav.hrany.find(h => h.z === z && h.do);
        stav.hrany = stav.hrany.filter(h => !(h.z === z && h.do));
        stav.hrany.push({ z, do: doU });
        const von = [O(`✔ hrana ${z} → ${doU}`, 'ok')];
        if (stara) von.push(O(`(nahradila pôvodnú hranu ${stara.z} → ${stara.do} — z uzla vedie jedna pevná hrana)`, 'dim'));
        return von;
      }
      if (t[0] === 'add_conditional_edges') {
        const z = t[1], pole = t[2], mapaText = t.slice(3).join(' ');
        if (!z || !pole || !mapaText) {
          return chyba('Použitie: add_conditional_edges <uzol> <pole_stavu> hodnota=cieľ,hodnota=cieľ\nnapr.: add_conditional_edges klasifikuj tema matematika=pocitaj,dokumenty=hladaj,ostatne=odpovedz');
        }
        if (!maUzol(z)) return chyba(`Uzol '${z}' v grafe nie je.`);
        const mapa = {};
        for (const par of mapaText.split(',')) {
          const [h, c] = par.split('=').map(x => x && x.trim());
          if (!h || !c) return chyba(`Nerozumiem časti '${par}' — očakávam hodnota=cieľ.`);
          if (!maUzol(c)) return chyba(`Cieľ '${c}' v grafe nie je (alebo použi END).`);
          mapa[h] = c;
        }
        stav.hrany = stav.hrany.filter(h => !(h.z === z && h.podmienka));
        stav.hrany.push({ z, podmienka: { pole, mapa } });
        return [O(`✔ vetvenie z ${z} podľa poľa '${pole}': ${Object.entries(mapa).map(([a, b]) => a + '→' + b).join(', ')}`, 'ok')];
      }
      if (t[0] === 'set_entry') {
        if (!maUzol(t[1])) return chyba(`Uzol '${t[1] || ''}' v grafe nie je.`);
        stav.vstup = t[1];
        return [O(`✔ beh začína v uzle ${t[1]}`, 'ok')];
      }
      if (t[0] === 'graph') {
        if (!stav.uzly.length) return [O('(graf je prázdny — pridaj uzly cez add_node)', 'dim')];
        const von = [O(`START → ${stav.vstup}`, 'head')];
        stav.hrany.forEach(h => {
          if (h.podmienka) {
            von.push(O(`${h.z} ─?─ podľa '${h.podmienka.pole}':`));
            Object.entries(h.podmienka.mapa).forEach(([k, c]) => von.push(O(`      ${k} → ${c}`, 'dim')));
          } else von.push(O(`${h.z} → ${h.do}`));
        });
        return von;
      }
      if (t[0] === 'clear_graph') {
        stav.uzly = []; stav.hrany = []; stav.beh = []; stav.aktualny = null;
        stav.stavGrafu = {}; stav.dokoncene = false; stav.cakaNaCloveka = false;
        return [O('Graf vyčistený.', 'ok')];
      }
      if (t[0] === 'state') {
        const k = Object.keys(stav.stavGrafu);
        if (!k.length) return [O('(stav je prázdny — spusti invoke <otázka>)', 'dim')];
        return [O('Aktuálny stav grafu:', 'head'),
          ...k.map(x => O(`  ${x}: ${JSON.stringify(stav.stavGrafu[x])}`))];
      }
      if (t[0] === 'invoke' || t[0] === 'step' || t[0] === 'resume') {
        return beh(t[0], cely.replace(/^\S+\s*/, ''));
      }
      return chyba(`Neznámy príkaz '${t[0]}'. Napíš help.`);
    }

    /* ── vykonanie grafu ── */
    function dalsiUzol(zUzla) {
      const podm = stav.hrany.find(h => h.z === zUzla && h.podmienka);
      if (podm) {
        const hodn = String(stav.stavGrafu[podm.podmienka.pole]);
        const ciel = podm.podmienka.mapa[hodn];
        stav.videlVetvenie = true;
        if (!ciel) return { chyba: `Vetvenie z '${zUzla}': pole '${podm.podmienka.pole}' má hodnotu '${hodn}', pre ktorú nie je cieľ. Dopĺň ju do add_conditional_edges.` };
        return { uzol: ciel, preco: `${podm.podmienka.pole}='${hodn}'` };
      }
      const pevna = stav.hrany.find(h => h.z === zUzla && h.do);
      if (pevna) return { uzol: pevna.do };
      return { chyba: `Z uzla '${zUzla}' nevedie žiadna hrana — beh sa zasekol. Pridaj add_edge ${zUzla} END.` };
    }

    function vykonajUzol(meno) {
      const def = UZLY[meno];
      const r = def.krok(stav.stavGrafu);
      Object.assign(stav.stavGrafu, r.zmeny);
      stav.beh.push({ uzol: meno, log: r.log, zmeny: r.zmeny });
      return r;
    }

    function beh(rezim, argument) {
      if (!stav.uzly.length) return chyba('Graf je prázdny — najprv pridaj uzly (add_node) a hrany (add_edge).');

      if (rezim === 'invoke' || (rezim === 'step' && !stav.aktualny && !stav.beh.length)) {
        if (rezim === 'invoke' && !argument) return chyba('invoke potrebuje otázku: invoke Koľko je 12 * 7?');
        if (rezim === 'invoke' || argument) {
          stav.stavGrafu = { otazka: argument || 'Ahoj' };
          stav.beh = []; stav.dokoncene = false; stav.cakaNaCloveka = false;
          stav.preskocInterrupt = false;
          stav.aktualny = stav.vstup;
          stav.pocetBehov++;
        }
      }
      if (rezim === 'resume') {
        if (!stav.cakaNaCloveka) return chyba('Beh nie je zastavený — resume nemá čo pokračovať.');
        stav.cakaNaCloveka = false;
        stav.preskocInterrupt = true;   // človek schválil práve tento uzol
      }
      if (!stav.aktualny) {
        if (stav.dokoncene) return [O('Beh je dokončený. Spusti nový cez invoke <otázka>.', 'dim')];
        stav.aktualny = stav.vstup;
      }

      const von = [];
      let kroky = 0;
      const maxKrokov = rezim === 'step' ? 1 : 25;

      while (stav.aktualny && kroky < maxKrokov) {
        const meno = stav.aktualny;
        if (meno === 'END') {
          stav.aktualny = null; stav.dokoncene = true;
          von.push(O('── END ──', 'ok'));
          break;
        }
        const def = UZLY[meno];
        if (!def) { von.push(O(`Uzol '${meno}' neexistuje.`, 'err')); stav.aktualny = null; break; }

        // interrupt: zastav PRED vykonaním
        if (def.interrupt && !stav.preskocInterrupt) {
          stav.cakaNaCloveka = true;
          stav.videlInterrupt = true;
          von.push(O(`⏸ INTERRUPT v uzle '${meno}' — beh zastavený, čaká sa na človeka.`, 'warn'));
          von.push(O('   Stav ostáva uložený (checkpointer). Pokračuj príkazom: resume', 'dim'));
          return von;
        }

        if (def.interrupt) stav.preskocInterrupt = false;   // platí len na jedno zastavenie
        const r = vykonajUzol(meno);
        von.push(O(`▶ ${meno}`, 'head'));
        von.push(O(`   ${r.log}`, 'dim'));
        Object.entries(r.zmeny).forEach(([k, v]) =>
          von.push(O(`   stav.${k} = ${JSON.stringify(v)}`, 'ok')));

        const d = dalsiUzol(meno);
        if (d.chyba) { stav.videlZaseknutie = true; von.push(O(d.chyba, 'err')); stav.aktualny = null; return von; }
        if (d.preco) von.push(O(`   ↳ vetvenie: ${d.preco} → ${d.uzol}`, 'warn'));
        // cyklus?
        if (stav.beh.filter(b => b.uzol === d.uzol).length >= 1 && d.uzol !== 'END') stav.videlCyklus = true;
        stav.aktualny = d.uzol;
        kroky++;
      }

      if (kroky >= maxKrokov && rezim !== 'step') {
        von.push(O('⚠ Beh prekročil 25 krokov — graf sa asi zacyklil. V LangGraphe na to slúži recursion_limit.', 'err'));
        stav.aktualny = null;
      }
      if (rezim === 'step' && stav.aktualny) {
        von.push(O(`(ďalší na rade: ${stav.aktualny} — napíš step)`, 'dim'));
      }
      if (stav.dokoncene && stav.stavGrafu.odpoved) {
        von.push(O(`Odpoveď: ${stav.stavGrafu.odpoved}`, 'ok'));
      }
      return von;
    }

    return {
      stav, spusti, UZLY,
      // dáta pre vizualizáciu
      vizualizacia() {
        return {
          uzly: stav.uzly.map(u => ({
            meno: u.meno, farba: UZLY[u.meno].farba, interrupt: !!UZLY[u.meno].interrupt,
            aktivny: stav.aktualny === u.meno,
            vykonany: stav.beh.some(b => b.uzol === u.meno),
            pocet: stav.beh.filter(b => b.uzol === u.meno).length,
          })),
          hrany: stav.hrany, vstup: stav.vstup,
          caka: stav.cakaNaCloveka, dokoncene: stav.dokoncene,
          stavGrafu: stav.stavGrafu, beh: stav.beh,
        };
      },
      reset() {
        stav.uzly = []; stav.hrany = []; stav.vstup = 'klasifikuj';
        stav.stavGrafu = {}; stav.aktualny = null; stav.beh = [];
        stav.dokoncene = false; stav.cakaNaCloveka = false;
        stav.historia.length = 0;
        stav.pocetBehov = 0; stav.videlInterrupt = false;
        stav.videlZaseknutie = false; stav.preskocInterrupt = false;
        stav.videlCyklus = false; stav.videlVetvenie = false;
      },
    };
  }

  window.GRAPH = { vyrobEngine, UZLY };
})();
