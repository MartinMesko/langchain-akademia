/* ============================================================
   TRÉNINGOVÉ PROJEKTY — 30 praktických zadaní (v2)
   Každý projekt: zadanie, UKÁŽKA BEHU (demo terminál/prehliadač),
   interaktívny checklist požiadaviek, pomôcka, bonus.
   demo.type: 'terminal' (konzola v PyCharme) | 'browser' (web appka)
   ============================================================ */

window.PROJECTS = {
  xpByTier: { 1: 30, 2: 50, 3: 80 },
  tiers: [
    { stars: '⭐', name: 'Začiatočník', color: '#9ec79a',
      desc: 'Chainy, prompty, parsery a LCEL — projekty 1–10 zvládneš po sekcii Základy LangChain (lekcie 1–7).' },
    { stars: '⭐⭐', name: 'Pokročilý', color: '#e4c46a',
      desc: 'Nástroje, agenty, embeddingy a prvé chatboty — projekty 11–20 stavajú na lekciách 8–17.' },
    { stars: '⭐⭐⭐', name: 'Expert', color: '#e0a09a',
      desc: 'Kompletné RAG aplikácie, webové UI, lokálne modely a nasadenie — projekty 21–30 sú malé reálne produkty.' }
  ],
  items: [

    /* ── ⭐ ZAČIATOČNÍK (1–10) ─────────────────────────────── */
    { id: 'p1', num: 1, tier: 1, icon: '🎭', time: '~20 min', lessons: ['l2', 'l5'],
      title: 'Vtipkár na počkanie',
      zadanie: 'Tvoj úplne prvý vlastný program s AI: konzolová aplikácia, ktorá sa opýta na tému a vygeneruje k nej vtip. Presne tu zistíš, či máš správne nastavené prostredie a pochopený chain.',
      demo: { type: 'terminal', title: 'vtipkar.py', text:
`Zadaj tému vtipu: programátori

🤖 Generujem vtip...

Prečo programátori nechodia do lesa?
Lebo sa boja, že stretnú bugy. 🐛

Process finished with exit code 0` },
      poziadavky: [
        'Šablóna <code>ChatPromptTemplate</code> s premennou <code>{tema}</code>',
        'Chain v tvare <code>prompt | model | StrOutputParser()</code>',
        'Téma sa načíta cez <code>input()</code> a výsledok sa vypíše cez <code>print()</code>',
        'Model <code>gpt-4o-mini</code> s <code>temperature=0.9</code> (vtipy majú byť pestré)'
      ],
      hint: 'Kostru máš v lekcii 5 — stačí vymeniť obsah šablóny a pridať input(). Celý program má menej než 15 riadkov.',
      bonus: 'Pridaj druhú premennú {styl} (suchý humor / čierny humor / pre deti) a pýtaj si ju tiež od používateľa.' },

    { id: 'p2', num: 2, tier: 1, icon: '🏷️', time: '~20 min', lessons: ['l2'],
      title: 'Generátor názvov firiem — súboj teplôt',
      zadanie: 'Over si na vlastné oči, čo robí temperature. Program vygeneruje názov firmy pre zadaný biznis dvakrát — raz s temperature=0 a raz s temperature=1.5 — a výsledky vypíše vedľa seba na porovnanie.',
      demo: { type: 'terminal', title: 'teploty.py', text:
`Aký biznis rozbiehaš? kaviareň pre programátorov

❄️  T=0.0:  Kód & Káva
🔥 T=1.5:  Espresso Exception — výnimky chytáme s penou

--- spusti ma znova a sleduj, ktorý riadok sa zmení! ---

Process finished with exit code 0` },
      poziadavky: [
        'Dva objekty <code>ChatOpenAI</code> s rôznou <code>temperature</code>',
        'Rovnaký prompt pre oba modely',
        'Prehľadný výpis: <code>T=0:</code> … a <code>T=1.5:</code> …',
        'Spusti program 3× a všimni si: ktorý výstup sa mení a ktorý nie?'
      ],
      hint: 'Nepotrebuješ ani šablónu — stačí model.invoke("...") na oboch modeloch. Porovnaj aj max_tokens, nech odpovede nie sú romány.',
      bonus: 'Pridaj tretí model s temperature=0.7 a napíš si do komentára, ktorá hodnota sa ti pre túto úlohu zdá najlepšia a prečo.' },

    { id: 'p3', num: 3, tier: 1, icon: '🌍', time: '~30 min', lessons: ['l3', 'l5', 'l16'],
      title: 'Prekladateľ v slučke',
      zadanie: 'Konzolový prekladač: pri štarte sa opýta na cieľový jazyk, potom v slučke prekladá každú napísanú vetu, kým nenapíšeš „koniec". Prvý program, ktorý sa správa ako skutočný nástroj.',
      demo: { type: 'terminal', title: 'prekladac.py', text:
`Do akého jazyka mám prekladať? taliančina

Ty: Dobré ráno, kávu prosím.
🇮🇹 Buongiorno, un caffè per favore.

Ty: Koľko to stojí?
🇮🇹 Quanto costa?

Ty: koniec
Arrivederci! 👋` },
      poziadavky: [
        'Šablóna s dvoma premennými: <code>{jazyk}</code> a <code>{text}</code>',
        'Jazyk sa pýta iba RAZ (pred slučkou), text opakovane vo <code>while True</code>',
        'Slučka končí na slovo „koniec" cez <code>break</code>',
        '<code>temperature=0</code> — preklad má byť presný, nie kreatívny'
      ],
      hint: 'Slučku while True + input() + break máš rozobranú v prípravnej lekcii B a v lekcii 16. Jazyk ulož do premennej pred slučkou a posielaj ho v slovníku pri každom invoke.',
      bonus: 'Použi .partial(jazyk=...) — jazyk „predvyplníš" do šablóny a v slučke posielaš už len {text}.' },

    { id: 'p4', num: 4, tier: 1, icon: '📝', time: '~30 min', lessons: ['l3', 'l5'],
      title: 'Sumarizátor dlhých textov',
      zadanie: 'Vlož do programu dlhší text (skopíruj si článok z webu do premennej) a nechaj chain vyrobiť zhrnutie presne v troch odrážkach + jednu vetu záveru. Trénuješ písanie precíznych promptov.',
      demo: { type: 'terminal', title: 'sumarizator.py', text:
`📄 Sumarizujem článok (4 812 znakov)...

- LangChain umožňuje prepájať jazykové modely s vlastnými dátami
- Najčastejšou architektúrou je RAG so vektorovou databázou
- Firmy nasadzujú chatboty nad internou dokumentáciou

Záver: Znalosť LangChainu sa stáva bežnou požiadavkou v inzerátoch.

Process finished with exit code 0` },
      poziadavky: [
        'System správa presne definuje formát: „3 odrážky začínajúce pomlčkou, potom riadok Záver: …"',
        'Text sa odovzdáva cez premennú <code>{text}</code>',
        'Vyskúšaj na 2 rôznych textoch a over, či formát drží',
        'temperature=0'
      ],
      hint: 'Formát vynucuj v system správe („Odpovedáš VŽDY presne v tomto formáte: …"). Ak model formát nedrží, sprísni formuláciu — presne toto je prompt engineering.',
      bonus: 'Pridaj premennú {pocet} — používateľ si zvolí počet odrážok (3–7).' },

    { id: 'p5', num: 5, tier: 1, icon: '🛒', time: '~30 min', lessons: ['l6'],
      title: 'Nákupný zoznam z receptu',
      zadanie: 'Napíšeš názov jedla a program vypíše OČÍSLOVANÝ nákupný zoznam ingrediencií. Kľúčové: výstup musí byť skutočný Python zoznam, nie odsek textu — takže bez parsera sa nepohneš.',
      demo: { type: 'terminal', title: 'nakup.py', text:
`Aké jedlo ideš variť? bryndzové halušky

🛒 Nákupný zoznam:
   1. zemiaky
   2. hrubá múka
   3. bryndza
   4. slanina
   5. soľ

Spolu položiek: 5` },
      poziadavky: [
        '<code>CommaSeparatedListOutputParser</code> na konci chainu',
        '<code>format_instructions</code> vložené do promptu cez <code>.partial()</code>',
        'Výpis cez <code>for</code> cyklus s číslovaním: <code>1. múka</code>, <code>2. vajcia</code>…',
        'Na konci vypíš aj počet položiek cez <code>len()</code>'
      ],
      hint: 'Celý vzor je v lekcii 6 (palacinky). Číslovanie: for i, polozka in enumerate(zoznam, start=1).',
      bonus: 'Spýtaj sa aj na počet porcií a nechaj model prispôsobiť množstvá („500 g múky" namiesto „múka").' },

    { id: 'p6', num: 6, tier: 1, icon: '📇', time: '~40 min', lessons: ['l6'],
      title: 'Extraktor kontaktov z e-mailu',
      zadanie: 'Reálna kancelárska úloha: z neuprataného textu e-mailu vytiahni meno, e-mailovú adresu a telefón do slovníka. Ak údaj v texte nie je, v slovníku má byť null.',
      demo: { type: 'terminal', title: 'extraktor.py', text:
`📧 Spracúvam e-mail...

   "Zdravím, tu Jana Kováčová z učtárne. Faktúru pošlite
    na jana.kovacova@firma.sk. Ozvem sa aj telefonicky."

✅ Extrahované údaje:
   meno:    Jana Kováčová
   email:   jana.kovacova@firma.sk
   telefon: — (v texte sa nenachádza)` },
      poziadavky: [
        '<code>JsonOutputParser</code> — výstup je Python slovník',
        'Prompt jasne určuje polia: <code>meno</code>, <code>email</code>, <code>telefon</code>',
        'Vyskúšaj na 3 rôznych e-mailoch — aj na takom, kde telefón chýba',
        'Hodnoty vypíš každú na samostatnom riadku cez kľúče slovníka'
      ],
      hint: 'Do promptu pridaj: „Ak údaj chýba, použi hodnotu null." — JSON null sa v Pythone zmení na None a vieš ho otestovať cez if data["telefon"] is None.',
      bonus: 'Prerob na PydanticOutputParser s triedou Kontakt(BaseModel) — dostaneš validáciu typov zadarmo (lekcia 6).' },

    { id: 'p7', num: 7, tier: 1, icon: '⚖️', time: '~40 min', lessons: ['l4'],
      title: 'Strážca recenzií (few-shot klasifikátor)',
      zadanie: 'Postav klasifikátor sentimentu bez jediného pravidla v prompte — model naučíš čisto UKÁŽKAMI. Program dostane recenziu a vráti presne jedno slovo: POZITÍVNA / NEGATÍVNA / NEUTRÁLNA.',
      demo: { type: 'terminal', title: 'straznik.py', text:
`Recenzia: Jedlo vynikajúce, obsluha milá!
→ POZITÍVNA

Recenzia: Čakali sme hodinu a polievka studená.
→ NEGATÍVNA

Recenzia: Interiér pekný, ale porcie maličké.
→ NEUTRÁLNA

Recenzia: No... "skvelé", ako vždy. 🙄
→ NEGATÍVNA   (irónia zachytená!)` },
      poziadavky: [
        'Zoznam správ so SystemMessage + aspoň 3 few-shot dvojice HumanMessage/AIMessage',
        'Ukážky pokrývajú všetky tri kategórie',
        'temperature=0 a výstup je VŽDY len jedno slovo',
        'Otestuj na 5 vlastných recenziách vrátane jednej ťažkej (irónia, zmiešané pocity)'
      ],
      hint: 'Presný vzor je v lekcii 4 (few-shot). Ak model pridáva vetu navyše, pridaj ukážku, kde je odpoveď naozaj LEN jedno slovo.',
      bonus: 'Spracuj zoznam 10 recenzií naraz cez chain.batch() a vypíš štatistiku: koľko bolo pozitívnych.' },

    { id: 'p8', num: 8, tier: 1, icon: '🧚', time: '~30 min', lessons: ['l2', 'l7'],
      title: 'Rozprávkar so živým písaním',
      zadanie: 'Generátor rozprávok na dobrú noc, ktorý text „píše" postupne ako ChatGPT — po kúskoch, nie naraz. Zadáš hrdinu a ponaučenie, rozprávka sa streamuje do konzoly.',
      demo: { type: 'terminal', title: 'rozpravkar.py', text:
`Hrdina rozprávky: dráčik Emil
Ponaučenie: netreba sa báť tmy

✨ (text nabieha po písmenkách, presne ako v ChatGPT...)

Kde bolo, tam bolo, v jaskyni pod kopcom býval dráčik
Emil, ktorý sa bál tmy. Každý večer si svietil vlastným
ohníkom... až raz zistil, že tma je vlastne mäkká
perinka pre hviezdy. A odvtedy spal ako drak. 🐉💤` },
      poziadavky: [
        'Premenné <code>{hrdina}</code> a <code>{ponaucenie}</code> v šablóne',
        'Výstup cez <code>chain.stream()</code>, nie invoke',
        'Chunky sa vypisujú plynulo: <code>print(chunk, end="", flush=True)</code>',
        'Rozprávka má mať max ~10 viet (povedz to modelu v system správe)'
      ],
      hint: 'Pri streame cez celý chain (so StrOutputParserom) sú chunky rovno stringy — žiadne .content netreba. Porovnaj s lekciou 2, kde sa streamoval samotný model.',
      bonus: 'Zmeraj čas do prvého chunku a celkový čas (import time) — uvidíš, prečo streaming pôsobí tak rýchlo.' },

    { id: 'p9', num: 9, tier: 1, icon: '📣', time: '~45 min', lessons: ['l7'],
      title: 'Marketingový balík jedným klikom',
      zadanie: 'Zadáš názov a popis produktu a program vyrobí NARAZ tri veci: slogan, popis pre e-shop a tri hashtagy. Tri chainy pobežia paralelne — jedno volanie, tri výstupy.',
      demo: { type: 'terminal', title: 'marketing.py', text:
`Produkt: BikeMania — horské bicykle

⚡ Generujem 3 výstupy paralelne...   (1.8 s)

🎯 SLOGAN:   BikeMania — pretože hory sa samé nezídu.

📃 POPIS:    Horské bicykle stavané na slovenské kopce.
             Odpružené, odolné a pripravené na blato.

#️⃣ HASHTAGY: #bikemania #horskybicykel #vylethorou` },
      poziadavky: [
        'Tri samostatné chainy (slogan / popis / hashtagy)',
        'Spojené cez <code>RunnableParallel(slogan=…, popis=…, hashtagy=…)</code>',
        'Jediné <code>invoke()</code> na paralelnom objekte',
        'Prehľadný výpis všetkých troch častí zo slovníka výsledku'
      ],
      hint: 'Všetky tri vetvy dostanú ten istý vstupný slovník — každá šablóna si z neho vezme svoje premenné. Vzor je v lekcii 7.',
      bonus: 'Pridaj štvrtú vetvu „email" (predajný e-mail na 5 viet) a zmeraj, že 4 vetvy netrvajú 4× dlhšie než jedna.' },

    { id: 'p10', num: 10, tier: 1, icon: '👨‍🍳', time: '~45 min', lessons: ['l6'],
      title: 'Receptová knižka s validáciou',
      zadanie: 'Vyvrcholenie prvej desiatky: generátor receptov, ktorého výstup je validovaný Pydantic objekt — s názvom, počtom porcií, zoznamom ingrediencií a očíslovanými krokmi. Žiadny voľný text, len čisté dáta.',
      demo: { type: 'terminal', title: 'recepty.py', text:
`Na čo máš chuť? palacinky

════════ 🥞 PALACINKY (4 porcie) ════════

Ingrediencie:
  • 250 g hladkej múky   • 500 ml mlieka
  • 2 vajcia             • štipka soli

Postup:
  1. Zmiešaj múku, mlieko, vajcia a soľ na hladké cesto.
  2. Nechaj cesto 15 minút odpočívať.
  3. Smaž tenké palacinky z oboch strán dozlatista.

typ objektu: <class 'Recept'>  ✓ validované` },
      poziadavky: [
        'Trieda <code>Recept(BaseModel)</code> s poľami: <code>nazov: str</code>, <code>porcie: int</code>, <code>ingrediencie: list[str]</code>, <code>kroky: list[str]</code>',
        '<code>PydanticOutputParser</code> + format_instructions cez partial',
        'Pekný výpis: nadpis, porcie, odrážky ingrediencií, očíslované kroky',
        'Over, že <code>type(recept)</code> je Recept a <code>recept.porcie</code> je číslo'
      ],
      hint: 'Každé pole triedy opíš cez Field(description="…") — model potom presnejšie vie, čo kam patrí. Vzor v lekcii 6.',
      bonus: 'Ulož recept do súboru JSON: open("recept.json", "w") + recept.model_dump_json(indent=2).' },

    /* ── ⭐⭐ POKROČILÝ (11–20) ────────────────────────────── */
    { id: 'p11', num: 11, tier: 2, icon: '🧮', time: '~45 min', lessons: ['l8'],
      title: 'Kalkulačka z nástrojov',
      zadanie: 'Vyrob modelu štyri matematické nástroje (+ − × ÷) a nechaj ho počítať slovné úlohy. Model si vyžiada správny nástroj, ty ho spustíš a výsledok mu vrátiš — celý tool-calling cyklus ručne.',
      demo: { type: 'terminal', title: 'kalkulacka.py', text:
`Úloha: Koľko je 1547 delené 13?

🧠 Model žiada nástroj:
   tool_calls: [{'name': 'vydel', 'args': {'a': 1547, 'b': 13}}]

🔧 Spúšťam vydel(a=1547, b=13)...
   → 119.0

Úloha: Koľko je 5 delené 0?
🔧 vydel(a=5, b=0) → „Delenie nulou nie je možné." ✓ ošetrené` },
      poziadavky: [
        'Štyri funkcie s dekorátorom <code>@tool</code>, každá s poctivým docstringom',
        'Delenie ošetruje delenie nulou (vráti zrozumiteľnú správu)',
        '<code>model.bind_tools([...])</code> a výpis <code>odpoved.tool_calls</code>',
        'Nástroj z tool_calls skutočne spusti s <code>args</code> od modelu a vypíš výsledok'
      ],
      hint: 'Postupuj podľa lekcie 8 (vynasob). Otestuj otázku „Koľko je 1547 delené 13?" — a schválne aj „Koľko je 5 delené 0?".',
      bonus: 'Vráť výsledok modelu ako ToolMessage a nechaj ho sformulovať ľudskú odpoveď — postavíš tak polovicu agenta ručne.' },

    { id: 'p12', num: 12, tier: 2, icon: '📅', time: '~60 min', lessons: ['l9'],
      title: 'Časový agent',
      zadanie: 'Prvý ozajstný agent: dostane nástroje na prácu s časom a sám sa rozhodne, ktoré potrebuje. Zvládne otázky typu „Aký deň v týždni bude o 100 dní?" alebo „Koľko dní zostáva do Vianoc?".',
      demo: { type: 'terminal', title: 'casovy_agent.py', text:
`Otázka: Aký deň v týždni bude o 100 dní?

> Entering new AgentExecutor chain...

Invoking: \`aktualny_datum\` with \`{}\`
→ piatok 13.06.2026

Invoking: \`datum_o_n_dni\` with \`{'n': 100}\`
→ pondelok 21.09.2026

O 100 dní bude pondelok, 21. septembra 2026.

> Finished chain.` },
      poziadavky: [
        'Nástroje: <code>aktualny_datum()</code> a <code>datum_o_n_dni(n: int)</code> (použi <code>datetime</code> + <code>timedelta</code>)',
        'Prompt s <code>{input}</code> a <code>MessagesPlaceholder("agent_scratchpad")</code>',
        '<code>create_tool_calling_agent</code> + <code>AgentExecutor</code> s <code>verbose=True</code>',
        'Otestuj 3 otázky a v konzole si prečítaj, ako agent uvažoval'
      ],
      hint: 'timedelta: from datetime import datetime, timedelta → (datetime.now() + timedelta(days=n)).strftime("%A %d.%m.%Y"). Slovenské dni v týždni si môže domyslieť model z anglických.',
      bonus: 'Pridaj nástroj dni_medzi(datum1, datum2) a polož otázku, ktorá vyžaduje DVA nástroje za sebou.' },

    { id: 'p13', num: 13, tier: 2, icon: '📖', time: '~60 min', lessons: ['l8', 'l9'],
      title: 'Agent-knihovník s vlastnou databázou',
      zadanie: 'Agent s prístupom k tvojmu mini-katalógu kníh (obyčajný Python slovník). Nástroje mu dovolia hľadať knihu podľa názvu a vypísať knihy podľa žánru — a agent sa rozhoduje, kedy ktorý použiť.',
      demo: { type: 'terminal', title: 'knihovnik.py', text:
`Ty: Kto napísal Dunu a kedy?

Invoking: \`najdi_knihu\` with \`{'nazov': 'Duna'}\`
📚 Duna — Frank Herbert (1965), žáner: sci-fi

Dunu napísal Frank Herbert v roku 1965.

Ty: Odporuč mi nejaké sci-fi.

Invoking: \`knihy_podla_zanru\` with \`{'zaner': 'sci-fi'}\`
V katalógu máme: Duna, Nadácia, Hyperion. Odporúčam
začať Dunou — klasika, ktorou žáner dýcha dodnes.` },
      poziadavky: [
        'Slovník ~8 kníh: <code>{"Duna": {"autor": …, "zaner": "sci-fi", "rok": …}, …}</code>',
        'Nástroj <code>najdi_knihu(nazov: str)</code> — vráti detaily alebo „nenašla sa"',
        'Nástroj <code>knihy_podla_zanru(zaner: str)</code> — vráti zoznam názvov',
        'Agent zvládne: „Kto napísal Dunu?", „Odporuč mi nejaké sci-fi", „Máte Harryho Pottera?"'
      ],
      hint: 'Nástroj vracia string — slovník sprav na text cez f-string. Na vyhľadávanie bez ohľadu na veľké písmená použi .lower() na oboch stranách porovnania.',
      bonus: 'Pridaj nástroj pridaj_knihu(...), ktorý do slovníka zapíše novú knihu — agent potom zvládne aj „Pridaj do katalógu knihu XYZ".' },

    { id: 'p14', num: 14, tier: 2, icon: '📏', time: '~45 min', lessons: ['l9'],
      title: 'Prevodník jednotiek (multi-tool agent)',
      zadanie: 'Agent so sadou prevodných nástrojov: km↔míle, °C↔°F, EUR↔USD (kurz natvrdo). Pointa cvičenia: dobré docstringy — model musí z popisu SÁM trafiť správny nástroj.',
      demo: { type: 'terminal', title: 'prevodnik.py', text:
`Ty: Koľko stupňov Fahrenheita je 21 °C?
Invoking: \`celzius_na_fahrenheit\` with \`{'c': 21}\`
21 °C je presne 69.8 °F.

Ty: A koľko je 30 míľ v kilometroch?
Invoking: \`mile_na_km\` with \`{'mile': 30}\`
30 míľ je 48.28 km.

Ty: Aké je hlavné mesto Peru?
Hlavné mesto Peru je Lima.  (bez nástroja — správne!)` },
      poziadavky: [
        'Aspoň 4 nástroje s presnými docstringami (kedy ktorý použiť)',
        'AgentExecutor s verbose=True',
        'Test: „Koľko °F je 21 °C?" aj chyták „Koľko je 30 míľ v km?" (opačný smer!)',
        'Otázka mimo tém („Aké je hlavné mesto Peru?") — agent má odpovedať bez nástroja'
      ],
      hint: 'Ak agent volí zlý nástroj, oprav DOCSTRING, nie kód — presne takto sa ladí tool-calling v praxi. Vzorce: F = C × 9/5 + 32, 1 míľa = 1.609 km.',
      bonus: 'Zámerne napíš jednému nástroju vágny docstring („prevádza čísla") a sleduj, ako sa agent začne mýliť. Potom ho oprav.' },

    { id: 'p15', num: 15, tier: 2, icon: '🗂️', time: '~45 min', lessons: ['l11'],
      title: 'Inventúra poznámok',
      zadanie: 'Priprav si priečinok so 4–5 textovými súbormi (poznámky, články…) a napíš skript, ktorý ich hromadne načíta a vypíše štatistiku knižnice: počet dokumentov, celkový počet znakov a najdlhší dokument.',
      demo: { type: 'terminal', title: 'inventura.py', text:
`📂 Načítavam poznamky/ ...

   poznamky/langchain.txt      4 812 znakov
   poznamky/python_tipy.txt    2 108 znakov
   poznamky/napady.txt           934 znakov
   poznamky/recepty.txt        1 466 znakov

Dokumentov: 4  |  Spolu: 9 320 znakov
🏆 Najdlhší: langchain.txt` },
      poziadavky: [
        '<code>DirectoryLoader("poznamky/", glob="**/*.txt", loader_cls=TextLoader)</code>',
        'Pre každý dokument riadok: názov súboru (z metadát) + počet znakov',
        'Súčet znakov cez <code>sum()</code> a najdlhší dokument cez <code>max()</code>',
        'Nezabudni <code>loader_kwargs={"encoding": "utf-8"}</code> kvôli diakritike'
      ],
      hint: 'max s kľúčom: max(dokumenty, key=lambda d: len(d.page_content)) — lambda máš vysvetlenú v Python okienku lekcie 7.',
      bonus: 'Pridaj mini-analýzu cez model: pošli mu prvých 500 znakov každého dokumentu a nechaj ho uhádnuť tému jednou vetou.' },

    { id: 'p16', num: 16, tier: 2, icon: '🔬', time: '~60 min', lessons: ['l12'],
      title: 'Laboratórium chunkov',
      zadanie: 'Experiment, ktorý ti dá cit pre najdôležitejší RAG parameter: rozsekaj ten istý dlhý dokument tromi rôznymi nastaveniami (chunk_size 200 / 500 / 1000) a porovnaj výsledky vedľa seba.',
      demo: { type: 'terminal', title: 'laboratorium.py', text:
`🔬 Dokument: clanok.txt (9 320 znakov)

chunk_size   počet chunkov   priem. dĺžka
   200            52             179
   500            21             444
  1000            11             847

Chunk #2 pri 200:  "...šie modely. Preto sa v pra"  ✂️ useknuté!
Chunk #2 pri 500:  celý odsek, končí bodkou.  ✓` },
      poziadavky: [
        'Jeden dlhší text (aspoň 2 strany) načítaný cez TextLoader',
        'Tri splittery s rôznym <code>chunk_size</code> (overlap vždy ~15 %)',
        'Tabuľkový výpis: nastavenie → počet chunkov → priemerná dĺžka chunku',
        'Vypíš chunk č. 2 z každého behu a porovnaj, či končí uprostred vety'
      ],
      hint: 'Priemer: sum(len(ch.page_content) for ch in chunky) / len(chunky). Skús aj CharacterTextSplitter namiesto Recursive a všimni si rozdiel v hraniciach.',
      bonus: 'Napíš si do komentára záver: ktoré nastavenie by si zvolil pre FAQ a ktoré pre zmluvu — a prečo (opri sa o tabuľku z lekcie 12).' },

    { id: 'p17', num: 17, tier: 2, icon: '🧭', time: '~60 min', lessons: ['l13'],
      title: 'Hľadač citátov podľa významu',
      zadanie: 'Sémantické vyhľadávanie bez databázy: priprav zoznam 10 citátov, embedni ich a k ľubovoľnej otázke („niečo o odvahe") nájdi 3 významovo najbližšie — vlastným výpočtom kosínusovej podobnosti.',
      demo: { type: 'terminal', title: 'citaty.py', text:
`Hľadám citát o... strachu z neúspechu

🥇 0.71  "Nezakopne ten, kto leží — ale ani nikam nedôjde."
🥈 0.64  "Odvaha nie je absencia strachu, ale víťazstvo nad ním."
🥉 0.58  "Jediná skutočná prehra je nikdy to neskúsiť."

(všimni si: ani jeden citát neobsahuje slovo „neúspech" —
 našli sa podľa VÝZNAMU, nie podľa slov!)` },
      poziadavky: [
        'Zoznam 10 citátov, embednutý NARAZ cez <code>embed_documents()</code>',
        'Otázka cez <code>embed_query()</code> — v slučke, aby si mohol skúšať viac otázok',
        'Vlastná funkcia <code>kosinus(a, b)</code> (vzor v lekcii 13)',
        'Výpis TOP 3 citátov zoradených podľa podobnosti aj so skóre'
      ],
      hint: 'Zoradenie: dvojice (skóre, citát) do zoznamu a sorted(zoznam, reverse=True). Vyskúšaj otázku, ktorá nezdieľa s citátom ani jedno slovo — a sleduj, že ho aj tak nájde.',
      bonus: 'Vypíš aj NAJVZDIALENEJŠÍ citát — pochopíš, čo vektory považujú za „úplne inú tému".' },

    { id: 'p18', num: 18, tier: 2, icon: '📚', time: '~75 min', lessons: ['l14', 'l15'],
      title: 'Mini knižnica s Chromou',
      zadanie: 'Prvá skutočná vektorová databáza: zaindexuj 3 textové súbory na rôzne témy do Chromy a postav vyhľadávaciu slučku, ktorá k otázke vráti najrelevantnejšie pasáže aj so zdrojom.',
      demo: { type: 'terminal', title: 'indexuj.py → hladaj.py', text:
`$ python indexuj.py
✅ Zaindexovaných 27 chunkov z 3 súborov do ./kniznica_db

$ python hladaj.py
Otázka: ako sa starať o kaktusy v zime?

📄 rastliny.txt: "V zime kaktusy zalievame maximálne
    raz mesačne a držíme ich pri 10–15 °C..."
📄 rastliny.txt: "Prezimovanie je kľúčové pre kvitnutie..."

Otázka: koniec` },
      poziadavky: [
        'Samostatný skript <code>indexuj.py</code> (loader → splitter → <code>Chroma.from_documents</code> s <code>persist_directory</code>)',
        'Samostatný skript <code>hladaj.py</code>, ktorý databázu len OTVÁRA (žiadne nové indexovanie!)',
        'Slučka: otázka → <code>similarity_search(otazka, k=3)</code> → výpis textov + zdrojov',
        'Over, že otázka o téme súboru A vracia chunky zo súboru A'
      ],
      hint: 'Rozdelenie na dva skripty je pointa projektu — vzor „indexuj raz, pýtaj sa veľakrát" z lekcie 18. Zdroj: doc.metadata["source"].',
      bonus: 'Použi similarity_search_with_score a vypíš aj skóre — pri otázke úplne mimo tém uvidíš, ako skóre stúpne (= horšia zhoda).' },

    { id: 'p19', num: 19, tier: 2, icon: '☕', time: '~60 min', lessons: ['l16', 'l17'],
      title: 'Barista-bot s pamäťou',
      zadanie: 'Chatbot fiktívnej kaviarne s vlastnou osobnosťou a pamäťou: pozná menu (v system správe), tyká, odporúča — a hlavne si pamätá, čo si mu povedal pred tromi správami.',
      demo: { type: 'terminal', title: 'barista.py', text:
`☕ Vitaj v Kávičkárni! Som Berto, tvoj barista.

Ty: Volám sa Martin a nepijem kofeín.
Berto: Jasné, Martin! Bezkofeínové možnosti mám v malíčku.

Ty: Aké máte koláče?
Berto: Dnes mrkvový a jablkový závin, oba po 2,50 €.

Ty: Čo mi odporučíš na pitie?
Berto: Pre teba bezkofeínové cappuccino alebo matcha
       bez kofeínu, Martin — na espresso ani nemysli! 😉` },
      poziadavky: [
        'System správa: osobnosť + menu kaviarne (aspoň 5 položiek s cenami)',
        '<code>MessagesPlaceholder("chat_history")</code> + ručná história so správnymi append-mi',
        'Pamäťový test: „Volám sa Martin a nepijem kofeín" → o pár správ neskôr „Čo mi odporučíš?" — bot NESMIE ponúknuť espresso',
        'Ukončenie na „koniec" + rozlúčka menom, ak ho bot pozná'
      ],
      hint: 'Celá kostra je v lekcii 17. Menu vlož priamo do system stringu — pre malé dáta je to legitímna technika (RAG je na veľké).',
      bonus: 'Obmedz pamäť na posledných 10 správ (historia[-10:]) a over, že bot meno „zabudne" — pochopíš kontextové okno.' },

    { id: 'p20', num: 20, tier: 2, icon: '📔', time: '~75 min', lessons: ['l17', 'l5'],
      title: 'Denník s AI zhrnutím',
      zadanie: 'Chatbot-spovedník: porozprávaš mu, ako bolo v práci, a keď napíšeš „koniec", nechá si celú konverzáciu zhrnúť druhým chainom a zápis uloží do textového súboru s dátumom.',
      demo: { type: 'terminal', title: 'dennik.py', text:
`📔 Ahoj! Ako bolo dnes?

Ty: Konečne mi prešiel ten RAG projekt v práci.
Bot: Gratulujem! To znie ako veľký míľnik. Čo bolo najťažšie?

Ty: Ladenie chunkov. A kolega ma pochválil pred šéfom.
Bot: Pochvala pred šéfom — to sa počíta dvojmo! 🎉

Ty: koniec

✍️  Zhŕňam dnešok...
💾 Uložené do dennik_2026-06-13.txt
   „Úspešný deň: dokončený RAG projekt, pochvala pred
    vedením. Nálada: hrdosť a úľava. ⭐⭐⭐⭐⭐"` },
      poziadavky: [
        'Konverzačná slučka s pamäťou (ako v lekcii 17)',
        'Po „koniec": história sa premení na text a pošle do SUMARIZAČNÉHO chainu',
        'Zhrnutie (3–5 viet + nálada dňa) sa uloží do súboru <code>dennik_RRRR-MM-DD.txt</code>',
        'Použi <code>open(nazov, "w", encoding="utf-8")</code> a <code>datetime</code> na názov súboru'
      ],
      hint: 'Históriu na text: "\\n".join(f"{typ}: {s.content}" for s in historia). Zápis do súboru: with open(...) as f: f.write(zhrnutie).',
      bonus: 'Pri štarte skontroluj, či dnešný súbor už existuje (os.path.exists) — ak áno, načítaj ho a nechaj bota nadviazať: „Ráno si písal, že…".' },

    /* ── ⭐⭐⭐ EXPERT (21–30) ─────────────────────────────── */
    { id: 'p21', num: 21, tier: 3, icon: '🛍️', time: '~90 min', lessons: ['l15', 'l18'],
      title: 'FAQ bot pre e-shop',
      zadanie: 'Kompletný RAG chatbot zákazníckej podpory: napíš si faq.txt fiktívneho e-shopu (doprava, reklamácie, vrátenie tovaru…), zaindexuj ho a postav bota, ktorý odpovedá VÝHRADNE z neho a cituje zdroj.',
      demo: { type: 'terminal', title: 'faq_bot.py', text:
`🛍️ Podpora e-shopu MegaShop — pýtaj sa!

Ty: Do koľkých dní môžem vrátiť tovar?
Bot: Tovar môžeš vrátiť do 30 dní od doručenia, nepoužitý
     a v pôvodnom obale.
     📎 zdroj: faq.txt

Ty: Predávate aj náhradné diely na práčky?
Bot: Na túto otázku v našich podkladoch nemám odpoveď —
     obráť sa prosím na podporu. ✓ nevymýšľa si!` },
      poziadavky: [
        'Vlastný <code>faq.txt</code> s aspoň 10 otázkami a odpoveďami',
        'RAG chain: retriever (k=3) + <code>create_stuff_documents_chain</code> + <code>create_retrieval_chain</code>',
        'System prompt s poistkou: „Ak odpoveď nie je v kontexte, povedz to."',
        'Test: otázka z FAQ → správna odpoveď; otázka mimo FAQ → čestné „neviem"'
      ],
      hint: 'Celá architektúra je v lekcii 18. FAQ píš tak, aby každá otázka+odpoveď tvorili súvislý odsek — splitter ich potom pekne udrží pokope (chunk_size ~400).',
      bonus: 'Loguj otázky, na ktoré bot nevedel odpovedať, do missing.txt — v praxi presne takto rastie FAQ.' },

    { id: 'p22', num: 22, tier: 3, icon: '📄', time: '~90 min', lessons: ['l11', 'l18'],
      title: 'Vypytávaj sa svojho PDF',
      zadanie: 'Univerzálny PDF asistent: program dostane cestu k ľubovoľnému PDF (návod, zmluva, skriptá…), zaindexuje ho a spustí chat, v ktorom každá odpoveď uvádza aj ČÍSLO STRANY, z ktorej pochádza.',
      demo: { type: 'terminal', title: 'pdf_asistent.py', text:
`Cesta k PDF: manual_kavovar.pdf
📖 Indexujem 24 strán... hotovo (18 s)

Ty: Ako sa čistí parná tryska?
Bot: Trysku odmontuj otočením doľava, prepláchni pod
     teplou vodou a raz týždenne namoč do odvápňovača.
     📄 strany: 12, 13

Ty: Aká je záruka?
Bot: Na kávovar sa vzťahuje záruka 24 mesiacov.
     📄 strana: 23` },
      poziadavky: [
        '<code>PyPDFLoader</code> (pip install pypdf) + splitter + Chroma',
        'Cesta k PDF cez <code>input()</code> pri štarte',
        'Odpoveď + zoznam strán zo <code>d.metadata["page"]</code> použitých chunkov',
        'Chunk_size zvoľ podľa typu dokumentu (a napíš do komentára prečo)'
      ],
      hint: 'PyPDFLoader čísluje strany od 0 — pri výpise pridaj +1, nech sedí s PDF prehliadačom. Strany bez duplikátov: sorted({d.metadata["page"] + 1 for d in vysledok["context"]}).',
      bonus: 'Indexuj do pamäte bez persist_directory — pre jednorazové dokumenty je zbytočné špiniť disk. Porovnaj rýchlosť štartu.' },

    { id: 'p23', num: 23, tier: 3, icon: '🧠', time: '~2 h', lessons: ['l19'],
      title: 'RAG bot, ktorý chápe nadväzujúce otázky',
      zadanie: 'Vylepši projekt 21 alebo 22 o pamäť konverzácie s history-aware retrieverom. Cieľ: séria otázok „Aká je záručná doba?" → „A dá sa predĺžiť?" → „Koľko to stojí?" musí fungovať bez zopakovania témy.',
      demo: { type: 'terminal', title: 'rag_pamat.py', text:
`Ty: Aká je záručná doba?
Bot: Štandardná záručná doba je 24 mesiacov.

Ty: A dá sa predĺžiť?
   (interné preformulovanie: „Dá sa predĺžiť záručná doba?")
Bot: Áno, o ďalších 12 mesiacov cez program Záruka+.

Ty: Koľko to stojí?
   (interné: „Koľko stojí predĺženie záruky Záruka+?")
Bot: Predĺženie záruky stojí 49 € jednorazovo.  🧠✓` },
      poziadavky: [
        '<code>create_history_aware_retriever</code> s preformulovacím promptom',
        'História v OBOCH promptoch (preformulovacom aj QA) cez MessagesPlaceholder',
        'Ručná história s append-mi po každej výmene',
        'Test presne tej trojice nadväzujúcich otázok vyššie'
      ],
      hint: 'Kompletná architektúra je v lekcii 19 — najdlhšej v kurze. Najčastejšia chyba: zabudnúť poslať chat_history v invoke slovníku.',
      bonus: 'Vypíš si (dočasne) preformulovanú otázku — pridaj print do preformulovacieho chainu cez RunnableLambda a sleduj, ako model zámená rozväzuje.' },

    { id: 'p24', num: 24, tier: 3, icon: '🌐', time: '~2 h', lessons: ['l11', 'l18'],
      title: 'Webový výskumník',
      zadanie: 'Bot, ktorý odpovedá z čerstvého webu: cez WebBaseLoader stiahni 2–3 články na jednu tému (napr. recenzie produktu), zaindexuj ich a odpovedaj na otázky s uvedením URL zdroja. Bonusová výzva: články si môžu protirečiť.',
      demo: { type: 'terminal', title: 'vyskumnik.py', text:
`🌐 Sťahujem 3 články o slúchadlách SonicX...

Ty: Aká je výdrž batérie?
Bot: Zdroje sa líšia: recenzia na TechBlogu uvádza
     32 hodín, oficiálny web výrobcu 40 hodín.
     Reálne testy sa teda blížia k 32 h.
     📎 techblog.sk/sonicx  📎 sonicx.com/specs

Ty: Oplatia sa?
Bot: Podľa oboch zdrojov áno — za cenu do 100 € patria
     k najlepším. Kritika smeruje len na tvrdšie náušníky.` },
      poziadavky: [
        '<code>WebBaseLoader([url1, url2, url3])</code> (pip install beautifulsoup4)',
        'RAG pipeline s metadátami — zdroj odpovede je URL',
        'System prompt: „Ak sa zdroje líšia, uveď obe verzie."',
        'Otázka, na ktorú majú články rôzne odpovede — over správanie'
      ],
      hint: 'Weby obsahujú menu a pätičky — zvýš k na 4–5, nech sa k modelu dostane dosť užitočného obsahu. WebBaseLoader zoberie zoznam URL naraz.',
      bonus: 'Pridaj druhý chain, ktorý po odpovedi vygeneruje „mieru istoty" (vysoká/stredná/nízka) podľa zhody zdrojov.' },

    { id: 'p25', num: 25, tier: 3, icon: '🖥️', time: '~2 h', lessons: ['l20'],
      title: 'ChatSK — webový chat v Streamlite',
      zadanie: 'Presuň svojho chatbota z čiernej konzoly do prehliadača: plnohodnotné chat UI so session_state pamäťou, streamovaním odpovedí a bočným panelom na nastavenie osobnosti bota.',
      demo: { type: 'browser', title: 'localhost:8501 — ChatSK', text:
`┌─ bočný panel ─────────┐
│ Osobnosť: [Pirát ▾]   │   💬 ChatSK
│ Správ: 4              │
└───────────────────────┘
🧑 Ty:  Ahoj, kto si?

🤖 Bot: Arrr! Som Kapitán Chat, tvoj AI moreplavec!
        Otázky sem, suchozemec! 🏴‍☠️

🧑 Ty:  Poradíš mi s Pythonom?

🤖 Bot: Python? Môj obľúbený had na palube! Pýtaj sa...
        ▌ (odpoveď sa streamuje naživo)

[ Napíš správu…                              ⏎ ]` },
      poziadavky: [
        'Streamlit appka spúšťaná cez <code>streamlit run app.py</code>',
        'História v <code>st.session_state</code>, vykresľovaná celá pri každom rerune',
        'Streaming cez <code>st.write_stream(chain.stream({...}))</code>',
        '<code>st.sidebar</code> so selectboxom osobnosti (formálny / kamarát / pirát) — mení system správu'
      ],
      hint: 'Kostra je v lekcii 20. Pri zmene osobnosti vyčisti históriu (st.session_state.historia = []) — inak bude bot schizofrenický.',
      bonus: 'Pridaj tlačidlo „🗑️ Nová konverzácia" a počítadlo správ v sidebar-i.' },

    { id: 'p26', num: 26, tier: 3, icon: '📤', time: '~3 h', lessons: ['l20', 'l19'],
      title: 'Nahraj a pýtaj sa (Streamlit RAG)',
      zadanie: 'Najužitočnejšia appka kurzu: webové rozhranie, kam používateľ NAHRÁ vlastné PDF, appka ho zaindexuje a otvorí chat nad dokumentom — s pamäťou aj zdrojmi. V podstate malý „ChatPDF".',
      demo: { type: 'browser', title: 'localhost:8501 — Nahraj a pýtaj sa', text:
`📤 Nahraj PDF:  [ zmluva_najom.pdf ✓ ]

⏳ Čítam dokument... zaindexované 18 strán ✓

🧑 Ty:  Kedy môžem dostať výpoveď?

🤖 Bot: Prenajímateľ môže zmluvu vypovedať písomne
        s 3-mesačnou výpovednou lehotou, a to len
        z dôvodov uvedených v článku VII.
        📎 zmluva_najom.pdf, str. 6

🧑 Ty:  A čo kaucia?

🤖 Bot: Kaucia je 800 € a vráti sa do 30 dní od
        odovzdania bytu. 📎 str. 3` },
      poziadavky: [
        '<code>st.file_uploader("Nahraj PDF", type="pdf")</code> + uloženie do dočasného súboru',
        'Indexácia so <code>st.spinner("Čítam dokument…")</code> LEN RAZ — databázu drž v session_state',
        'RAG chat s history-aware retrieverom (projekt 23) pod uploadom',
        'Zdroje (strany) pod každou odpoveďou cez <code>st.caption</code>'
      ],
      hint: 'file_uploader vracia objekt v pamäti — ulož ho: with open("docasny.pdf", "wb") as f: f.write(subor.getbuffer()). Kontrola „už zaindexované?" cez if "db" not in st.session_state.',
      bonus: 'Podpor viac súborov naraz (accept_multiple_files=True) a do metadát pridaj názov súboru — odpovede potom citujú „subor.pdf, str. 3".' },

    { id: 'p27', num: 27, tier: 3, icon: '🔒', time: '~2 h', lessons: ['l21', 'l18'],
      title: 'Súkromný asistent (100 % offline)',
      zadanie: 'Paranoidný projekt: kompletný RAG chatbot, z ktorého NEODÍDE ani bajt na internet. Lokálny model cez Ollama, lokálne embeddingy, lokálna Chroma. Otestuj ho na „citlivých" poznámkach.',
      demo: { type: 'terminal', title: 'sukromny.py', text:
`✈️  Wi-Fi: VYPNUTÁ   |   API kľúč: ŽIADNY

🔒 Súkromný asistent (llama3.2 + nomic-embed-text)

Ty: Aké heslo som si poznačil k routeru?
Bot: V poznámkach máš: router admin / heslo Kv3tin4c!
     (toto NIKDY neposielaj do cloudu — a my ani nemusíme 😎)

Ty: Zhrň mi poznámky zo stretnutia s právnikom.
Bot: Stretnutie 3.6.: riešili ste závet a prevod bytu...

⏱ odpoveď za 9 s (lokálny model je pomalší — ale tvoj)` },
      poziadavky: [
        '<code>ChatOllama</code> (napr. llama3.2) namiesto ChatOpenAI',
        '<code>OllamaEmbeddings</code> namiesto OpenAIEmbeddings — indexovanie aj otázky lokálne',
        'Žiadny load_dotenv, žiadny API kľúč v celom projekte',
        'Funkčný test: vypni Wi-Fi a over, že bot stále odpovedá'
      ],
      hint: 'ollama pull llama3.2 + ollama pull nomic-embed-text (embedovací model). from langchain_ollama import ChatOllama, OllamaEmbeddings. Buď trpezlivý — lokálne je to pomalšie.',
      bonus: 'Porovnaj kvalitu odpovedí s GPT-4o-mini verziou toho istého bota a napíš si záver: kedy lokál stačí a kedy nie.' },

    { id: 'p28', num: 28, tier: 3, icon: '🕵️', time: '~3 h', lessons: ['l9', 'l15'],
      title: 'Agent s RAG nástrojom',
      zadanie: 'Spoj dva najväčšie koncepty kurzu: agent, ktorého JEDNÝM z nástrojov je vyhľadávanie v tvojej vektorovej databáze. Sám sa rozhodne, či otázka potrebuje dokumenty, kalkulačku, alebo vie odpovedať rovno.',
      demo: { type: 'terminal', title: 'super_agent.py', text:
`Ty: Koľko dní dovolenky mi zostáva, ak som vyčerpal 9?

> Entering new AgentExecutor chain...

Invoking: \`hladaj_v_dokumentoch\`
   with \`{'otazka': 'nárok na dovolenku'}\`
→ "Každý zamestnanec má nárok na 25 dní dovolenky..."

Invoking: \`odpocitaj\` with \`{'a': 25, 'b': 9}\`
→ 16

Zostáva ti 16 dní dovolenky (nárok 25, vyčerpaných 9).

> Finished chain.   🤯 dva nástroje, jedna otázka!` },
      poziadavky: [
        'Nástroj <code>@tool hladaj_v_dokumentoch(otazka: str)</code>, ktorý vnútri volá <code>retriever.invoke()</code> a vráti spojené texty chunkov',
        'Druhý nástroj (napr. kalkulačka) + AgentExecutor s verbose=True',
        'Tri testy: otázka na dokumenty / na výpočet / všeobecná — agent volí správne',
        'Docstring RAG nástroja jasne hovorí, ČO je v dokumentoch'
      ],
      hint: 'V nástroji: docs = retriever.invoke(otazka) → return "\\n\\n".join(d.page_content for d in docs). Agent dostane texty ako Observation a sám z nich odpovie.',
      bonus: 'Pridaj tretí nástroj uloz_poznamku(text), ktorý appenduje do súboru — agent potom zvládne „Nájdi v dokumentoch X a poznamenaj si to".' },

    { id: 'p29', num: 29, tier: 3, icon: '🔍', time: '~2 h', lessons: ['l22', 'l12'],
      title: 'Ladenie RAG systému s LangSmith',
      zadanie: 'Inžiniersky projekt bez písania novej appky: zapni tracing nad projektom 21/23, polož botovi 10 otázok, analyzuj traces a na základe DÁT (nie pocitu) vylaď chunk_size a k. Výstupom je mini-report.',
      demo: { type: 'terminal', title: 'report.md — výsledok experimentu', text:
`# RAG experiment: rag-v1 → rag-v2

                      v1 (chunk 300)   v2 (chunk 600)
správne odpovede         6 / 10           9 / 10
priem. latencia          3.1 s            2.4 s
priem. tokeny/dopyt      1 840            1 420

Zistenie (z traces): pri v1 retriever pri 3 otázkach
nenašiel správny chunk — odpoveď bola rozseknutá.

✅ Odporúčanie: chunk_size 600, k=3 ponechať.` },
      poziadavky: [
        'LangSmith premenné v .env + projekt pomenovaný podľa experimentu',
        '10 testovacích otázok (aj 2 také, kde bot odpovedá zle)',
        'Z traces zisti: najpomalší krok, priemerné tokeny na dopyt, či retriever našiel správne chunky pri zlých odpovediach',
        'Zmeň JEDEN parameter (chunk_size alebo k), preindexuj, zopakuj 10 otázok a porovnaj v novom projekte'
      ],
      hint: 'Presný postup analýzy je v lekcii 22 (debugging workflow). Dva LANGCHAIN_PROJECT názvy (rag-v1, rag-v2) = čisté porovnanie behov vedľa seba.',
      bonus: 'Doplň do reportu tabuľku pred/po (latencia, tokeny, počet správnych odpovedí z 10) + jedno odporúčanie.' },

    { id: 'p30', num: 30, tier: 3, icon: '🚢', time: '~pol dňa', lessons: ['l19', 'l23', 'l20'],
      title: 'VLAJKOVÁ LOĎ: Nasadený firemný asistent',
      zadanie: 'Finálny boss. Kompletný produkt: RAG asistent s pamäťou nad firemnými dokumentmi, vystavený ako REST API cez LangServe, s klientom aj webovým rozhraním. Toto je projekt do portfólia a na pracovný pohovor.',
      demo: { type: 'terminal', title: '3 terminály: server + klient + frontend', text:
`$ python server.py
LANGSERVE: Playground at /asistent/playground/
INFO: Uvicorn running on http://localhost:8000

$ python klient.py
→ RemoteRunnable volá API...
"Nárok na dovolenku je 25 dní ročne."

$ streamlit run frontend.py
Local URL: http://localhost:8501
   (frontend volá API — backend beží oddelene!)

✅ indexácia ✅ API ✅ playground ✅ klient ✅ web UI` },
      poziadavky: [
        'Zdieľaný modul <code>chain.py</code> s funkciou <code>vytvor_chain()</code> (architektúra lekcie 19)',
        '<code>server.py</code>: FastAPI + <code>add_routes(app, chain, path="/asistent")</code> + uvicorn',
        'Funkčný playground na <code>/asistent/playground/</code> + <code>klient.py</code> s RemoteRunnable',
        'Streamlit frontend, ktorý volá API (nie chain priamo!) — oddelený frontend od backendu',
        'README.md: ako projekt spustiť (indexácia → server → frontend)'
      ],
      hint: 'Stavaj po vrstvách a každú otestuj samostatne: najprv chain v konzole, potom server + playground, potom klient, nakoniec frontend. Záverečný projekt v akadémii (🏗️) je tvoja mapa.',
      bonus: 'Pridaj LangSmith monitoring s projektom „asistent-prod" a curl príklad volania API do README — presne to od teba bude chcieť DevOps kolega.' }
  ]
};
