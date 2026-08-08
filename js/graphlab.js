/* ============================================================
   LANGGRAPH PLAYGROUND — misie
   Nadväzujú na lekcie 24–25 (LangGraph, multi-agenty) a 33
   (human-in-the-loop pri nezvratných akciách).
   ============================================================ */
window.GRAPH_MISIE = [
  {
    id: 'lg1', xp: 20, titul: 'Najjednoduchší graf',
    zadanie: 'Každý LangGraph beh je cesta uzlami. Postav najkratšiu možnú: pridaj uzol <code>odpovedz</code>, spoj ho s <code>END</code> a spusti graf otázkou.',
    ciel: 'Graf s uzlom <code>odpovedz</code> prebehol až do END',
    tipy: [
      'Uzol pridáš cez <code>add_node odpovedz</code>. Zoznam dostupných uzlov: <code>nodes</code>.',
      'Koniec behu je špeciálny uzol <code>END</code>: <code>add_edge odpovedz END</code>',
      'Spustenie: <code>invoke Ahoj, ako sa máš?</code>',
    ],
    kontrola(e) {
      if (!e.stav.uzly.some(u => u.meno === 'odpovedz')) return { ok: false, preco: 'Chýba uzol odpovedz (add_node odpovedz).' };
      if (!e.stav.hrany.some(h => h.z === 'odpovedz' && h.do === 'END')) return { ok: false, preco: 'Chýba hrana do END (add_edge odpovedz END).' };
      if (!e.stav.dokoncene) return { ok: false, preco: 'Graf ešte nedobehol — spusti ho cez invoke <otázka>.' };
      return { ok: true };
    },
  },
  {
    id: 'lg2', xp: 25, titul: 'Krokovanie a stav',
    zadanie: 'Pridaj pred <code>odpovedz</code> uzol <code>klasifikuj</code> a spoj ich. Potom graf <b>nekrokuj naraz</b> — spusti <code>invoke</code> a sleduj, ako sa stav mení uzol po uzle. Nakoniec si vypíš celý stav.',
    ciel: 'Graf má dva uzly, prebehol a použil si príkaz <code>state</code>',
    tipy: [
      '<code>add_node klasifikuj</code> → <code>add_edge klasifikuj odpovedz</code> → <code>set_entry klasifikuj</code>',
      'Uzol <code>klasifikuj</code> zapíše do stavu pole <code>tema</code> — uvidíš to vo výpise behu.',
      'Po behu: <code>state</code> vypíše celý stav (otazka, tema, odpoved).',
    ],
    kontrola(e) {
      if (!e.stav.uzly.some(u => u.meno === 'klasifikuj')) return { ok: false, preco: 'Chýba uzol klasifikuj.' };
      if (e.stav.vstup !== 'klasifikuj') return { ok: false, preco: 'Beh musí začínať v klasifikuj — nastav set_entry klasifikuj.' };
      if (!e.stav.stavGrafu.tema) return { ok: false, preco: 'V stave ešte nie je pole tema — spusti graf cez invoke.' };
      if (!e.stav.historia.some(c => /^state\b/.test(c.trim()))) return { ok: false, preco: 'Vypíš si stav príkazom state.' };
      return { ok: true };
    },
  },
  {
    id: 'lg3', xp: 35, titul: 'Vetvenie podľa stavu',
    zadanie: 'Toto je jadro LangGraphu. Nech <code>klasifikuj</code> rozhodne, kam beh pôjde: pri téme <b>matematika</b> na <code>pocitaj</code>, pri <b>dokumenty</b> na <code>hladaj</code>, inak rovno na <code>odpovedz</code>. Potom vyskúšaj <b>obe vetvy</b> — matematickú aj dokumentovú otázku.',
    ciel: 'Graf sa vetví podľa poľa <code>tema</code> a prebehol aspoň dvakrát rôznymi vetvami',
    tipy: [
      'Najprv pridaj uzly <code>pocitaj</code> a <code>hladaj</code> a spoj ich s <code>odpovedz</code>.',
      'Vetvenie: <code>add_conditional_edges klasifikuj tema matematika=pocitaj,dokumenty=hladaj,ostatne=odpovedz</code>',
      'Skús <code>invoke Koľko je 12 * 7?</code> a potom <code>invoke Čo je v zmluve?</code> — v druhom prípade pôjde beh cez hladaj.',
    ],
    kontrola(e) {
      const podm = e.stav.hrany.find(h => h.z === 'klasifikuj' && h.podmienka);
      if (!podm) return { ok: false, preco: 'Chýba vetvenie z klasifikuj (add_conditional_edges).' };
      if (podm.podmienka.pole !== 'tema') return { ok: false, preco: `Vetvenie ide podľa poľa '${podm.podmienka.pole}' — má byť podľa 'tema'.` };
      const m = podm.podmienka.mapa;
      if (m.matematika !== 'pocitaj' || m.dokumenty !== 'hladaj') {
        return { ok: false, preco: 'Mapa vetvenia nesedí: matematika→pocitaj, dokumenty→hladaj.' };
      }
      if (!e.stav.videlVetvenie) return { ok: false, preco: 'Graf ešte cez vetvenie neprešiel — spusti invoke.' };
      if (e.stav.pocetBehov < 2) return { ok: false, preco: 'Vyskúšaj graf aspoň dvakrát, nech uvidíš obe vetvy.' };
      return { ok: true };
    },
  },
  {
    id: 'lg4', xp: 30, titul: 'Nástroj v grafe',
    zadanie: 'Over, že matematická vetva naozaj počíta: spusti graf otázkou s príkladom (napr. <code>invoke Koľko je 12 * 7?</code>) a skontroluj, že v stave je správny <code>vysledok_nastroja</code>.',
    ciel: 'V stave je <code>vysledok_nastroja</code> s výsledkom 84',
    tipy: [
      'Uzol <code>pocitaj</code> vytiahne z otázky príklad a spočíta ho — musí byť v tvare <code>12 * 7</code>.',
      'Skús: <code>invoke Koľko je 12 * 7?</code>',
      'Potom <code>state</code> — v stave uvidíš vysledok_nastroja aj hotovú odpoveď.',
    ],
    kontrola(e) {
      const v = e.stav.stavGrafu.vysledok_nastroja;
      if (v === undefined || v === null) return { ok: false, preco: 'V stave nie je vysledok_nastroja — spusti graf otázkou s príkladom, napr. „Koľko je 12 * 7?".' };
      if (Number(v) !== 84) return { ok: false, preco: `vysledok_nastroja je ${v} — skús presne „Koľko je 12 * 7?" (má vyjsť 84).` };
      return { ok: true };
    },
  },
  {
    id: 'lg5', xp: 40, titul: 'Cyklus: over a skús znova',
    zadanie: 'Grafy môžu mať <b>cykly</b> — práve tým sa líšia od reťazí. Pridaj uzol <code>over_kvalitu</code> za <code>odpovedz</code> a nech pri slabej kvalite pošle beh <b>späť</b> na <code>odpovedz</code>, inak do <code>END</code>.',
    ciel: 'Graf obsahuje spätnú hranu a beh prešiel niektorým uzlom viackrát',
    tipy: [
      '<code>add_node over_kvalitu</code> → <code>add_edge odpovedz over_kvalitu</code>',
      'Vetvenie späť: <code>add_conditional_edges over_kvalitu kvalita slaba=odpovedz,ok=END</code>',
      'Spusti <code>invoke Ahoj</code> — všeobecná otázka nemá kontext ani výsledok nástroja, takže prvý pokus bude „slabý" a graf sa vráti.',
    ],
    kontrola(e) {
      if (!e.stav.uzly.some(u => u.meno === 'over_kvalitu')) return { ok: false, preco: 'Chýba uzol over_kvalitu.' };
      const podm = e.stav.hrany.find(h => h.z === 'over_kvalitu' && h.podmienka);
      if (!podm) return { ok: false, preco: 'Chýba vetvenie z over_kvalitu (add_conditional_edges over_kvalitu kvalita …).' };
      if (!Object.values(podm.podmienka.mapa).includes('odpovedz')) {
        return { ok: false, preco: 'Vetvenie musí pri slabej kvalite viesť SPÄŤ na odpovedz — to je ten cyklus.' };
      }
      if (!e.stav.videlCyklus) return { ok: false, preco: 'Beh sa zatiaľ nikdy nevrátil späť. Skús invoke s otázkou bez kontextu (napr. „Ahoj").' };
      return { ok: true };
    },
  },
  {
    id: 'lg6', xp: 40, titul: 'Human-in-the-loop (interrupt)',
    zadanie: 'Nezvratné akcie nemajú bežať bez človeka (lekcia 33). Postav vetvu <code>odpovedz → schval_clovekom → posli_email → END</code> a spusti graf. Beh sa <b>zastaví</b> — pozri si stav a potom ho pusti ďalej.',
    ciel: 'Beh sa zastavil na <code>schval_clovekom</code> a po <code>resume</code> dobehol s odoslaným e-mailom',
    tipy: [
      '<code>add_node schval_clovekom</code> a <code>add_node posli_email</code>, potom hrany medzi nimi až po END.',
      'Ak už máš hranu <code>odpovedz → over_kvalitu</code>, použi <code>clear_graph</code> a postav graf nanovo (alebo nechaj cestu cez over_kvalitu do schval_clovekom).',
      'Po zastavení: <code>state</code> ukáže uložený stav, <code>resume</code> pustí beh ďalej.',
    ],
    kontrola(e) {
      if (!e.stav.videlInterrupt) return { ok: false, preco: 'Beh sa ešte nikdy nezastavil na schval_clovekom — pridaj ten uzol do cesty a spusti invoke.' };
      if (e.stav.cakaNaCloveka) return { ok: false, preco: 'Beh práve čaká na teba — pusti ho ďalej príkazom resume.' };
      if (!e.stav.stavGrafu.odoslane) return { ok: false, preco: 'E-mail sa ešte neodoslal — po resume musí beh prejsť cez posli_email.' };
      return { ok: true };
    },
  },
  {
    id: 'lg7', xp: 30, titul: 'Slepá ulička',
    zadanie: 'Zisti, čo sa stane, keď z uzla <b>nevedie žiadna hrana</b>. Vyčisti graf (<code>clear_graph</code>), postav dvojicu <code>klasifikuj → hladaj</code>, ale <code>hladaj</code> <b>nespoj ďalej</b> — a spusti beh. Prečítaj si chybu a potom ju oprav tak, aby graf dobehol do END.',
    ciel: 'Videl si chybu o zaseknutom behu a graf potom dobehol do END',
    tipy: [
      '<code>clear_graph</code> → <code>add_node klasifikuj</code> → <code>add_node hladaj</code> → <code>add_edge klasifikuj hladaj</code> → <code>invoke Co je v zmluve?</code>',
      'Graf ti povie: „Z uzla hladaj nevedie žiadna hrana — beh sa zasekol."',
      'Oprav to hranou ďalej: <code>add_edge hladaj END</code> a spusti <code>invoke</code> znova.',
    ],
    kontrola(e) {
      if (!e.stav.videlZaseknutie) {
        return { ok: false, preco: 'Zatiaľ sa ti beh nezasekol — skús uzol bez odchádzajúcej hrany (tip 1).' };
      }
      const slepe = e.stav.uzly.filter(u => !e.stav.hrany.some(h => h.z === u.meno));
      if (slepe.length) {
        return { ok: false, preco: `Uzol '${slepe[0].meno}' stále nemá odchádzajúcu hranu — doplň ju (add_edge ${slepe[0].meno} END).` };
      }
      if (!e.stav.dokoncene) return { ok: false, preco: 'Po oprave nechaj graf dobehnúť do END (invoke).' };
      return { ok: true };
    },
  },
  {
    id: 'lg8', xp: 35, titul: 'Postav agenta od nuly',
    zadanie: 'Záverečná: <b>vyčisti graf</b> a postav kompletného agenta — klasifikácia → vetvenie na výpočet alebo vyhľadávanie → odpoveď → kontrola kvality → END. Potom ho vyskúšaj matematickou aj dokumentovou otázkou.',
    ciel: 'Graf má aspoň 5 uzlov, vetvenie aj kontrolu kvality a prebehol dvakrát',
    tipy: [
      '<code>clear_graph</code>, potom <code>add_node</code> pre: klasifikuj, pocitaj, hladaj, odpovedz, over_kvalitu.',
      'Hrany: <code>pocitaj → odpovedz</code>, <code>hladaj → odpovedz</code>, <code>odpovedz → over_kvalitu</code>, vetvenie <code>over_kvalitu kvalita slaba=odpovedz,ok=END</code>.',
      'Vstup: <code>set_entry klasifikuj</code> + vetvenie <code>klasifikuj tema matematika=pocitaj,dokumenty=hladaj,ostatne=odpovedz</code>.',
    ],
    kontrola(e) {
      const mena = e.stav.uzly.map(u => u.meno);
      const chyba = ['klasifikuj', 'pocitaj', 'hladaj', 'odpovedz', 'over_kvalitu'].filter(m => !mena.includes(m));
      if (chyba.length) return { ok: false, preco: `V grafe chýbajú uzly: ${chyba.join(', ')}` };
      if (!e.stav.hrany.some(h => h.z === 'klasifikuj' && h.podmienka)) return { ok: false, preco: 'Chýba vetvenie z klasifikuj.' };
      if (!e.stav.hrany.some(h => h.z === 'over_kvalitu' && h.podmienka)) return { ok: false, preco: 'Chýba vetvenie z over_kvalitu.' };
      if (!e.stav.dokoncene) return { ok: false, preco: 'Nechaj graf dobehnúť do END.' };
      if (e.stav.pocetBehov < 2) return { ok: false, preco: 'Vyskúšaj agenta aspoň na dvoch rôznych otázkach.' };
      return { ok: true };
    },
  },
];
