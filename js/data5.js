/* ============================================================
   SEKCIA s5 — Kariéra v AI: pokročilé agenty a produkcia
   Lekcie 24–27: LangGraph, multi-agenty, pokročilý RAG, evaluácia
   ============================================================ */

window.COURSE.sections.push({
  id: 's5', icon: '🤖', color: '#e8a87c',
  title: 'Kariéra v AI — pokročilé agenty a produkcia',
  subtitle: 'Bonusová nadstavba nad kurz: LangGraph, multi-agentové systémy, pokročilý RAG, evaluácia, bezpečnosť, optimalizácia nákladov, produkčné nasadenie — a ako sa s tým všetkým zamestnať.',
  lessons: ['l24', 'l25', 'l26', 'l27', 'l28', 'l29', 'l30', 'l31']
});

/* ============================================================
   LEKCIA 24 — LangGraph
   ============================================================ */
window.COURSE.lessons.l24 = {
  id: 'l24', num: 24, section: 's5', icon: '🕸️', duration: '14 min',
  title: 'LangGraph — agenty ako grafy',
  intro: 'AgentExecutor z lekcie 9 je fajn na začiatok — ale moderné produkčné agenty sa dnes stavajú v LangGraphe: knižnici od tvorcov LangChainu, kde agenta opíšeš ako GRAF stavov a prechodov. Presne túto skill dnes firmy hľadajú v inzerátoch najčastejšie.',
  goals: [
    'Pochopiť, prečo slučka AgentExecutora prestáva stačiť (kontrola, vetvenie, pamäť)',
    'Postaviť ReAct agenta jedným riadkom cez create_react_agent',
    'Pridať agentovi trvalú pamäť vlákien cez checkpointer a thread_id',
    'Zostaviť vlastný graf: StateGraph, uzly, hrany a podmienené vetvenie'
  ],
  blocks: [
    { t: 'h', x: 'Prečo graf namiesto slučky' },
    { t: 'p', x: '<code>AgentExecutor</code> točí jednu pevnú slučku: model → nástroj → model… Lenže reálne aplikácie potrebujú viac: <strong>vetvenie</strong> („ak je otázka o faktúrach, choď inou cestou"), <strong>kontrolné body</strong> („pred odoslaním e-mailu počkaj na schválenie človekom"), <strong>návraty</strong> („ak odpoveď neprešla kontrolou, skús znova") a <strong>pamäť medzi behmi</strong>. <strong>LangGraph</strong> toto všetko rieši tým, že tok aplikácie opíšeš ako graf: uzly = kroky, hrany = prechody.' },
    { t: 'compare', a: { title: '🔁 AgentExecutor (lekcia 9)', items: [
        'Jedna zabudovaná slučka ReAct',
        'Minimálna kontrola nad priebehom',
        'Pamäť si riešiš sám (append histórie)',
        'Skvelý na pochopenie princípu'
      ]}, b: { title: '🕸️ LangGraph', items: [
        'Ľubovoľný tok: vetvenie, cykly, paralelné kroky',
        'Checkpointy — stav sa ukladá po každom uzle',
        'Vstavaná pamäť vlákien (thread_id)',
        'Štandard pre produkčné agenty (a inzeráty!)'
      ]} },
    { t: 'h', x: 'ReAct agent jedným riadkom' },
    { t: 'p', x: 'Inštalácia: <code>pip install langgraph</code>. Najrýchlejší štart je hotová továreň <code>create_react_agent</code> — dostane model a nástroje a vráti skompilovaný graf. Všimni si nový tvar vstupu aj výstupu: všetko sa točí okolo kľúča <code>messages</code>:' },
    { t: 'pycharm', title: 'graf_agent.py — agent v LangGraphe', files: [
      { name: 'graf_agent.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

load_dotenv()

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# celý agent = jeden riadok (žiadny prompt s agent_scratchpad!)
agent = create_react_agent(model, [vynasob])

vysledok = agent.invoke(
    {"messages": [("human", "Koľko je 25 × 17 a prečo?")]}
)

print(vysledok["messages"][-1].content)` }
    ], output: `25 × 17 = 425. Výsledok som vypočítal nástrojom na násobenie: 25 krát 17 dáva presne 425.`,
      note: 'Výstup je slovník so VŠETKÝMI správami behu (human → AI s tool_calls → tool výsledok → finálna AI). Finálna odpoveď = posledná správa, preto index [-1].' },
    { t: 'explain', title: 'Rozbor kódu — čo je tu nové', rows: [
      ['from langgraph.prebuilt import create_react_agent', 'LangGraph je samostatná knižnica (pip install langgraph). „Prebuilt" = hotové, predpripravené grafy — nemusíš ich skladať ručne.'],
      ['agent = create_react_agent(model, [vynasob])', 'Továreň zloží celý ReAct graf: uzol „model" ↔ uzol „nástroje" s podmienenou hranou. Porovnaj s lekciou 9 — žiadny prompt, žiadny scratchpad, žiadny executor.'],
      ['{"messages": [("human", "...")]}', 'Vstup grafu je STAV — slovník s kľúčom messages (zoznam správ). Dvojica ("human", text) je skratka za HumanMessage.'],
      ['vysledok["messages"][-1]', 'Graf vráti celý stav po dobehnutí. Index [-1] = posledná položka zoznamu (Python počíta zozadu záporne) — finálna odpoveď agenta.']
    ]},
    { t: 'h', x: 'Pamäť vlákien: checkpointer + thread_id' },
    { t: 'p', x: 'Toto je killer-feature. Pridáš <code>checkpointer</code> a agent si <strong>sám ukladá stav po každom kroku</strong> — oddelene pre každé „vlákno" konverzácie (thread_id). Žiadne ručné appendovanie histórie ako v lekcii 17:' },
    { t: 'pycharm', title: 'pamat.py — agent s pamäťou vlákien', files: [
      { name: 'pamat.py', active: true, code: `from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

agent = create_react_agent(model, nastroje, checkpointer=MemorySaver())

# thread_id = identifikátor konverzácie (napr. ID používateľa)
konfig = {"configurable": {"thread_id": "martin-1"}}

agent.invoke({"messages": [("human", "Volám sa Martin.")]}, konfig)
odpoved = agent.invoke({"messages": [("human", "Ako sa volám?")]}, konfig)
print("Vlákno martin-1:", odpoved["messages"][-1].content)

# iné vlákno = čistá pamäť
ina_konfig = {"configurable": {"thread_id": "jana-7"}}
odpoved2 = agent.invoke({"messages": [("human", "Ako sa volám?")]}, ina_konfig)
print("Vlákno jana-7:", odpoved2["messages"][-1].content)` }
    ], output: `Vlákno martin-1: Voláš sa Martin.
Vlákno jana-7: To mi zatiaľ nepovedala — ako sa voláš?`,
      note: 'MemorySaver drží stav v RAM (zmizne s programom). V produkcii vymeníš za SqliteSaver/PostgresSaver — a pamäť prežije aj reštart servera. Presne takto sa robia multi-používateľské chatboty.' },
    { t: 'h', x: 'Vlastný graf: StateGraph' },
    { t: 'p', x: 'Skutočná sila príde, keď graf poskladáš sám. Tri ingrediencie: <strong>stav</strong> (TypedDict — spoločný „formulár", ktorý si uzly podávajú), <strong>uzly</strong> (obyčajné Python funkcie: stav dnu → zmeny stavu von) a <strong>hrany</strong> (kto nasleduje po kom — vrátane podmienených):' },
    { t: 'pycharm', title: 'vlastny_graf.py — triedič e-mailov', files: [
      { name: 'vlastny_graf.py', active: true, code: `from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class Stav(TypedDict):
    email: str
    kategoria: str
    odpoved: str

def zatried(stav: Stav) -> dict:
    kat = klasifikacny_chain.invoke({"email": stav["email"]})
    return {"kategoria": kat}          # uzol vracia len ZMENY stavu

def napis_odpoved(stav: Stav) -> dict:
    text = odpovedny_chain.invoke({"email": stav["email"]})
    return {"odpoved": text}

def eskaluj(stav: Stav) -> dict:
    return {"odpoved": "Preposielam kolegovi z podpory."}

def rozhodni(stav: Stav) -> str:       # router: vráti MENO ďalšieho uzla
    return "eskaluj" if stav["kategoria"] == "REKLAMACIA" else "napis_odpoved"

graf = StateGraph(Stav)
graf.add_node("zatried", zatried)
graf.add_node("napis_odpoved", napis_odpoved)
graf.add_node("eskaluj", eskaluj)

graf.add_edge(START, "zatried")
graf.add_conditional_edges("zatried", rozhodni)
graf.add_edge("napis_odpoved", END)
graf.add_edge("eskaluj", END)

app = graf.compile()
vysledok = app.invoke({"email": "Tovar prišiel rozbitý, žiadam vrátenie peňazí!"})
print(vysledok["kategoria"], "→", vysledok["odpoved"])` }
    ], output: `REKLAMACIA → Preposielam kolegovi z podpory.`,
      note: 'Toto by si v AgentExecutore nepostavil: pevne daný tok s vetvením, ktorý má LLM len tam, kde ho treba. Kombinuješ spoľahlivosť chainu s inteligenciou modelu.' },
    { t: 'flow', steps: ['🏁 START', '🗂️ zatried<br><small>LLM klasifikácia</small>', '🔀 rozhodni<br><small>podmienená hrana</small>', '✍️ napis_odpoveď / 🚨 eskaluj', '🏆 END'] },
    { t: 'box', kind: 'key', title: 'Mentálny model', x: 'Chain (lekcia 5) = rovná rúra. Agent (lekcia 9) = slučka. <strong>LangGraph = mapa mesta</strong>: križovatky (podmienené hrany), okruhy (návraty), parkoviská (checkpointy). Do životopisu píš všetky tri — a pri LangGraphe budeš vedieť povedať KEDY ho použiť: keď tok potrebuje vetvenie, ľudské schválenie alebo trvalý stav.' },
    { t: 'box', kind: 'tip', title: 'Kam ďalej', x: 'Oficiálne tutoriály <code>langchain-ai.github.io/langgraph</code> — prejdi si „Quickstart" a „Human-in-the-loop". V pohovoroch sa LangGraph objavuje pod heslami: state machine, checkpointing, interrupt, supervisor pattern (ďalšia lekcia!).' }
  ],
  quiz: [
    { q: 'Kedy siahneš po LangGraphe namiesto AgentExecutora?',
      opts: ['Vždy — AgentExecutor je zakázaný', 'Keď tok potrebuje vetvenie, kontrolné body, návraty alebo trvalú pamäť', 'Len pri obrázkových modeloch', 'Keď nemám API kľúč'],
      correct: 1, explain: 'AgentExecutor = jedna pevná slučka. LangGraph = ľubovoľná mapa toku so stavom, checkpointmi a podmienkami — presne to, čo produkčné aplikácie vyžadujú.' },
    { q: 'Čo robí checkpointer s thread_id?',
      opts: ['Zrýchľuje odpovede', 'Ukladá stav grafu po každom kroku, oddelene pre každé vlákno konverzácie', 'Kontroluje gramatiku', 'Obmedzuje počet tokenov'],
      correct: 1, explain: 'Checkpointer (MemorySaver, SqliteSaver…) automaticky perzistuje stav. thread_id oddeľuje konverzácie — každý používateľ má vlastnú pamäť bez ručného appendovania.' },
    { q: 'Čo vracia uzol (funkcia) v StateGraphe?',
      opts: ['Celý nový stav', 'Slovník so ZMENAMI stavu — LangGraph ich zlúči do celku', 'Meno ďalšieho uzla', 'Nič'],
      correct: 1, explain: 'Uzol dostane celý stav, ale vráti len to, čo zmenil (napr. {"kategoria": kat}). Meno ďalšieho uzla vracia až funkcia v conditional_edges.' },
    { q: 'Aký tvar vstupu očakáva agent z create_react_agent?',
      opts: ['Obyčajný string', '{"messages": [zoznam správ]}', '{"input": "...", "agent_scratchpad": []}', 'PromptValue'],
      correct: 1, explain: 'LangGraph agenty pracujú so stavom messages. Odpoveď potom čítaš z vysledok["messages"][-1].content.' },
    { q: 'Na čo slúži add_conditional_edges?',
      opts: ['Na pridanie nástrojov', 'Na vetvenie: funkcia-router rozhodne podľa stavu, ktorý uzol beží ďalej', 'Na paralelné spustenie všetkých uzlov', 'Na ukončenie grafu'],
      correct: 1, explain: 'Podmienená hrana = križovatka. Router funkcia vráti meno nasledujúceho uzla — takto vzniká „ak reklamácia, eskaluj".' }
  ],
  exercises: [
    { t: 'blanks', title: 'Agent s pamäťou v LangGraphe', xp: 25,
      intro: 'Doplň stavbu ReAct agenta s pamäťou vlákien.',
      code: `from langgraph.prebuilt import ⟦0⟧
from langgraph.checkpoint.memory import MemorySaver

agent = create_react_agent(model, nastroje, ⟦1⟧=MemorySaver())

konfig = {"configurable": {"⟦2⟧": "pouzivatel-42"}}

vysledok = agent.invoke({"⟦3⟧": [("human", "Ahoj!")]}, konfig)
print(vysledok["messages"][⟦4⟧].content)`,
      blanks: [['create_react_agent'], ['checkpointer'], ['thread_id'], ['messages'], ['-1']],
      hint: 'Továreň = create_react_agent, pamäť zapína parameter checkpointer, vlákno určuje thread_id, stav sa volá messages a posledná správa má index -1.' },
    { t: 'order', title: 'Stavba vlastného grafu', xp: 25,
      intro: 'Zoraď kroky tvorby StateGraph aplikácie.',
      items: [
        'Definuj stav ako TypedDict (aké polia si uzly podávajú)',
        'Napíš uzly — funkcie, ktoré vracajú zmeny stavu',
        'Vytvor StateGraph(Stav) a uzly doň pridaj cez add_node',
        'Prepoj ich hranami: add_edge a add_conditional_edges',
        'Skompiluj graf cez graf.compile()',
        'Spusti app.invoke({...}) so vstupným stavom' ] },
    { t: 'write', title: 'Router uzol', xp: 30,
      intro: 'Napíš srdce podmieneného vetvenia.',
      task: 'Napíš funkciu <code>rozhodni(stav)</code>, ktorá vráti <code>"urgent"</code>, ak <code>stav["priorita"]</code> je viac ako 7, inak vráti <code>"bezne"</code>. Potom ju zaregistruj cez <code>add_conditional_edges("zatried", rozhodni)</code>.',
      starter: `def rozhodni(stav):
    # tvoj kód...

# registrácia:`,
      must: [['def rozhodni'], ['return "urgent"', "return 'urgent'"], ['return "bezne"', "return 'bezne'"], ['add_conditional_edges']],
      hint: 'if stav["priorita"] > 7: return "urgent" — router vracia MENO uzla ako text.',
      solution: `def rozhodni(stav):
    if stav["priorita"] > 7:
        return "urgent"
    return "bezne"

graf.add_conditional_edges("zatried", rozhodni)` }
  ]
};

/* ============================================================
   LEKCIA 25 — Multi-agentové systémy
   ============================================================ */
window.COURSE.lessons.l25 = {
  id: 'l25', num: 25, section: 's5', icon: '👥', duration: '12 min',
  title: 'Multi-agentové systémy — tím špecialistov',
  intro: 'Jeden agent s dvadsiatimi nástrojmi sa stráca. Riešenie z praxe: viac malých agentov-špecialistov a jeden „šéf" (supervisor), ktorý prácu rozdeľuje. Naučíš sa najpoužívanejší vzor multi-agentových architektúr — a kedy ho (ne)nasadiť.',
  goals: [
    'Pochopiť, prečo veľa nástrojov v jednom agentovi škodí presnosti',
    'Poznať supervisor pattern: router + špecialisti',
    'Postaviť dvojicu špecializovaných agentov s LLM routerom',
    'Vedieť posúdiť, kedy multi-agent NEpoužiť (cena, latencia, zložitosť)'
  ],
  blocks: [
    { t: 'h', x: 'Problém: agent-všeumelec' },
    { t: 'p', x: 'Predstav si agenta s nástrojmi na faktúry, HR smernice, kalendár, počasie a SQL databázu. Pri každej otázke musí model vyberať z 20+ popisov nástrojov — a začne sa mýliť: volá zlé nástroje, mieša kontexty, spotrebúva tokeny. Empirické pravidlo z praxe: <strong>nad ~10 nástrojov presnosť výberu citeľne klesá</strong>.' },
    { t: 'p', x: 'Riešenie kopíruje firmu: <strong>špecialisti + manažér</strong>. Každý agent má malú sadu nástrojov a jasnú rolu; nad nimi stojí <strong>supervisor</strong>, ktorý požiadavku prečíta a pridelí ju správnemu špecialistovi.' },
    { t: 'flow', steps: ['❓ Požiadavka', '🧑‍💼 Supervisor<br><small>komu to patrí?</small>', '📊 Analytik<br><small>SQL, výpočty</small>', '📚 Výskumník<br><small>RAG, dokumenty</small>', '✉️ Asistent<br><small>e-maily, kalendár</small>', '✅ Odpoveď'] },
    { t: 'h', x: 'Najjednoduchší funkčný supervisor' },
    { t: 'p', x: 'Supervisor nemusí byť zložitý — na začiatok stačí <strong>klasifikačný chain</strong> (router), ktorý vyberie špecialistu. Tu je celý vzor: dvaja agenti z lekcie 24 + router + odovzdanie práce:' },
    { t: 'pycharm', title: 'tim.py — supervisor s dvoma špecialistami', files: [
      { name: 'tim.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.prebuilt import create_react_agent

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── Špecialisti: každý má LEN svoje nástroje ──
matematik = create_react_agent(model, [scitaj, vynasob, vydel])
vyskumnik = create_react_agent(model, [hladaj_v_dokumentoch])

# ── Supervisor: obyčajný klasifikačný chain ──
router = (
    ChatPromptTemplate.from_messages([
        ("system", "Zaraď požiadavku. Odpovedz IBA slovom "
                   "MATIKA (výpočty) alebo DOKUMENTY (firemné info)."),
        ("human", "{vstup}"),
    ])
    | model | StrOutputParser()
)

def tim_odpovedz(otazka: str) -> str:
    rola = router.invoke({"vstup": otazka}).strip()
    print(f"   [supervisor] → prideľujem: {rola}")
    agent = matematik if rola == "MATIKA" else vyskumnik
    vysledok = agent.invoke({"messages": [("human", otazka)]})
    return vysledok["messages"][-1].content

print(tim_odpovedz("Koľko je 1 250 × 12?"))
print(tim_odpovedz("Koľko dní dovolenky mám podľa smernice?"))` }
    ], output: `   [supervisor] → prideľujem: MATIKA
1 250 × 12 = 15 000.
   [supervisor] → prideľujem: DOKUMENTY
Podľa smernice máš nárok na 25 dní dovolenky ročne.`,
      note: 'Všimni si deľbu práce: router je lacný chain (jedno volanie), špecialisti majú malé, presné sady nástrojov. V plnom LangGraphe by supervisor bol uzol a špecialisti pod-grafy — princíp je identický.' },
    { t: 'explain', title: 'Rozbor kódu — architektúra tímu', rows: [
      ['matematik = create_react_agent(model, [scitaj, vynasob, vydel])', 'Špecialista č. 1: TEN ISTÝ model, ale iba matematické nástroje. Menej možností = presnejší výber.'],
      ['vyskumnik = create_react_agent(model, [hladaj_v_dokumentoch])', 'Špecialista č. 2 s RAG nástrojom (vzor z projektu 28). Kľúčové: nástroje sa NEPREKRÝVAJÚ.'],
      ['router = ChatPromptTemplate... | model | StrOutputParser()', 'Supervisor je obyčajný chain z lekcie 5! Inštrukcia „odpovedz IBA slovom" + temperature=0 = spoľahlivý klasifikátor.'],
      ['rola = router.invoke(...).strip()', '<code>.strip()</code> odstráni medzery a nové riadky okolo odpovede — modely ich občas pridajú a porovnanie by zlyhalo.'],
      ['agent = matematik if rola == "MATIKA" else vyskumnik', 'Jednoriadkový if (ternár): vyber objekt agenta podľa roly. Agenti sú obyčajné hodnoty v premenných — dajú sa vyberať, posielať, ukladať do slovníka.'],
      ['agent.invoke({"messages": [...]})', 'Odovzdanie práce: vybraný špecialista dostane pôvodnú otázku a rieši ju vlastnými nástrojmi.']
    ]},
    { t: 'h', x: 'Kedy multi-agent ÁNO a kedy NIE' },
    { t: 'table', head: ['Situácia', 'Voľba', 'Prečo'], rows: [
      ['5 nástrojov, jedna doména', '❌ Jeden agent', 'Supervisor by len pridal latenciu a cenu navyše'],
      ['15+ nástrojov, viac domén (HR + financie + IT)', '✅ Multi-agent', 'Malé sady nástrojov = presnejší výber, čistejšie prompty'],
      ['Kroky na sebe závisia (výskum → výpočet → report)', '✅ Multi-agent v LangGraphe', 'Supervisor riadi postupnosť, stav sa odovzdáva grafom'],
      ['Chat s dokumentmi (RAG)', '❌ Obyčajný chain', 'Lekcia 19 stačí — nepridávaj agentov tam, kde netreba'],
      ['Potrebuješ schválenie človekom medzi krokmi', '✅ LangGraph + interrupt', 'Human-in-the-loop je vstavaná funkcia grafu']
    ] },
    { t: 'box', kind: 'warn', title: 'Multi-agent nie je cieľ, ale nástroj', x: 'Častá chyba (aj na pohovoroch!): „všetko vyriešime multi-agentmi". Každý agent navyše = ďalšie volania, vyššia cena, dlhšie čakanie a ťažšie ladenie. Zlaté pravidlo: <strong>začni chainom, povýš na agenta, až potom na tím agentov</strong> — a každé povýšenie si obháj.' },
    { t: 'box', kind: 'tip', title: 'Slovník na pohovor', x: '<strong>Supervisor/orchestrator</strong> = riadiaci uzol · <strong>hand-off</strong> = odovzdanie úlohy medzi agentmi · <strong>specialist agents</strong> = agenti s úzkou sadou nástrojov · <strong>human-in-the-loop</strong> = človek schvaľuje kritické kroky. Tieto pojmy padajú na pohovoroch — teraz ich vieš aj postaviť.' }
  ],
  quiz: [
    { q: 'Prečo agent s 20 nástrojmi funguje horšie než tím špecialistov?',
      opts: ['API to zakazuje', 'Model vyberá z priveľa popisov — klesá presnosť výberu nástroja a rastie spotreba tokenov', 'Nástroje sa navzájom mažú', 'Nefunguje horšie, je to jedno'],
      correct: 1, explain: 'Výber nástroja je pre model rozhodovanie podľa popisov. Priveľa možností = viac chýb. Malé sady u špecialistov problém riešia.' },
    { q: 'Čo je supervisor v multi-agentovej architektúre?',
      opts: ['Človek, ktorý kontroluje AI', 'Riadiaci prvok (často LLM router), ktorý požiadavku pridelí správnemu špecialistovi', 'Najsilnejší model v systéme', 'Bezpečnostný filter'],
      correct: 1, explain: 'Supervisor číta požiadavku a rozhoduje, kto ju rieši — v najjednoduchšej verzii je to klasifikačný chain, v LangGraphe riadiaci uzol.' },
    { q: 'Firma chce chatbota nad 30 PDF smernicami. Multi-agent?',
      opts: ['Áno, jeden agent na každé PDF', 'Nie — je to jedna doména, stačí RAG chain s pamäťou (lekcia 19)', 'Áno, minimálne päť agentov', 'PDF sa nedajú spracovať'],
      correct: 1, explain: 'Počet dokumentov nie je dôvod na agentov — vektorová databáza ich zvládne tisíce. Multi-agent dáva zmysel pri viacerých DOMÉNACH či závislých krokoch.' },
    { q: 'Prečo je dobré, aby sa sady nástrojov špecialistov neprekrývali?',
      opts: ['Kvôli licenciám', 'Jasné hranice zodpovednosti — router aj špecialisti sa rozhodujú jednoznačnejšie', 'Prekrývanie je technicky nemožné', 'Aby bol kód kratší'],
      correct: 1, explain: 'Prekrývajúce sa nástroje = nejednoznačné pridelenie a ťažšie ladenie. Ostré hranice robia systém predvídateľným.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Zlož supervisora', xp: 25,
      intro: 'Doplň router a odovzdanie práce špecialistovi.',
      code: `router = (
    ChatPromptTemplate.from_messages([
        ("system", "Odpovedz IBA slovom MATIKA alebo DOKUMENTY."),
        ("human", "{vstup}"),
    ])
    | model | ⟦0⟧()
)

rola = router.invoke({"vstup": otazka}).⟦1⟧()

agent = matematik ⟦2⟧ rola == "MATIKA" ⟦3⟧ vyskumnik
vysledok = agent.invoke({"messages": [("human", otazka)]})`,
      blanks: [['StrOutputParser'], ['strip'], ['if'], ['else']],
      hint: 'Router končí StrOutputParserom, odpoveď očisti cez .strip() a agenta vyber ternárom: A if podmienka else B.' },
    { t: 'order', title: 'Cesta požiadavky tímom', xp: 25,
      intro: 'Zoraď, čo sa deje od otázky po odpoveď v supervisor architektúre.',
      items: [
        'Používateľ pošle požiadavku',
        'Supervisor (router) ju klasifikuje do domény',
        'Požiadavka sa odovzdá zodpovedajúcemu špecialistovi',
        'Špecialista rieši úlohu svojimi nástrojmi (ReAct slučka)',
        'Finálna odpoveď špecialistu sa vráti používateľovi' ] },
    { t: 'write', title: 'Tretí špecialista', xp: 30,
      intro: 'Rozšír tím o prekladateľa.',
      task: 'Vytvor agenta <code>prekladatel = create_react_agent(model, [preloz])</code>, rozšír system správu routera o kategóriu PREKLAD a uprav výber agenta tak, aby zvládol tri roly (použi slovník <code>{"MATIKA": matematik, "DOKUMENTY": vyskumnik, "PREKLAD": prekladatel}</code> a <code>.get()</code>).',
      starter: `# matematik a vyskumnik už existujú
# tvoj kód...`,
      must: [['prekladatel = create_react_agent'], ['PREKLAD'], ['"MATIKA": matematik'], ['.get(']],
      hint: 'agenti = {...}; agent = agenti.get(rola, vyskumnik) — .get s náhradníkom ošetrí aj nečakanú odpoveď routera.',
      solution: `prekladatel = create_react_agent(model, [preloz])

agenti = {
    "MATIKA": matematik,
    "DOKUMENTY": vyskumnik,
    "PREKLAD": prekladatel,
}

rola = router.invoke({"vstup": otazka}).strip()
agent = agenti.get(rola, vyskumnik)
vysledok = agent.invoke({"messages": [("human", otazka)]})` }
  ]
};

/* ============================================================
   LEKCIA 26 — Pokročilý RAG
   ============================================================ */
window.COURSE.lessons.l26 = {
  id: 'l26', num: 26, section: 's5', icon: '🎯', duration: '14 min',
  title: 'Pokročilý RAG — keď similarity search nestačí',
  intro: 'Základný RAG z lekcií 10–15 je štart, nie cieľ. V praxi narazíš na otázky, ktoré vektorové vyhľadávanie netrafí — a práve techniky z tejto lekcie (multi-query, hybrid search, reranking) odlišujú juniora od človeka, ktorého firmy chcú.',
  goals: [
    'Rozpoznať tri typické zlyhania základného RAG',
    'Nasadiť MultiQueryRetriever — viac formulácií otázky naraz',
    'Skombinovať kľúčové slová a vektory cez EnsembleRetriever (hybrid search)',
    'Pochopiť reranking a mať prehľad o ďalších technikách (parent-document, metadata filtre)'
  ],
  blocks: [
    { t: 'h', x: 'Kde základný RAG zlyháva' },
    { t: 'ul', items: [
      '<strong>Nešťastná formulácia</strong> — používateľ napíše „koľko voľna" a chunk hovorí o „výmere dovolenky"; podobnosť je nízka, chunk sa nenájde.',
      '<strong>Presné kódy a názvy</strong> — otázka na „chybu E-405" či „model XR-500": vektory čísla a kódy reprezentujú mizerne, tu vyhráva klasické hľadanie kľúčových slov.',
      '<strong>Správny chunk až na 7. mieste</strong> — pri k=3 sa do promptu nedostane; pri k=10 zas prompt zaplavia menej relevantné texty.'
    ]},
    { t: 'p', x: 'Na každé zlyhanie existuje technika: <strong>multi-query</strong> (preformuluj otázku viackrát), <strong>hybrid search</strong> (spoj vektory s kľúčovými slovami) a <strong>reranking</strong> (nechaj širší výber prehodnotiť presnejším modelom).' },
    { t: 'h', x: 'MultiQueryRetriever — viac uhlov pohľadu' },
    { t: 'p', x: 'Princíp: LLM z jednej otázky vygeneruje 3–5 alternatívnych formulácií, každou sa vyhľadá a výsledky sa zlúčia (bez duplikátov). Jediná zmena v kóde — obalíš existujúci retriever:' },
    { t: 'pycharm', title: 'multi_query.py — otázka v piatich šatách', files: [
      { name: 'multi_query.py', active: true, code: `from langchain.retrievers.multi_query import MultiQueryRetriever

zakladny = db.as_retriever(search_kwargs={"k": 3})

mq_retriever = MultiQueryRetriever.from_llm(
    retriever=zakladny,
    llm=model,
)

# interné logovanie vygenerovaných otázok (nech vidíš, čo robí)
import logging
logging.basicConfig()
logging.getLogger("langchain.retrievers.multi_query").setLevel(logging.INFO)

dokumenty = mq_retriever.invoke("koľko voľna si môžem vziať?")
print(f"Nájdených {len(dokumenty)} unikátnych chunkov")` }
    ], output: `INFO:langchain.retrievers.multi_query:Generated queries:
['Aký je nárok zamestnanca na dovolenku?',
 'Koľko dní plateného voľna mám k dispozícii?',
 'Aká je výmera dovolenky podľa smernice?']
Nájdených 5 unikátnych chunkov`,
      note: 'Hovorové „koľko voľna" sa premenilo aj na formálnu „výmeru dovolenky" — a chunk, ktorý by pôvodná otázka minula, sa našiel. Cena: jedno LLM volanie navyše na dopyt.' },
    { t: 'h', x: 'Hybrid search — vektory + kľúčové slová' },
    { t: 'p', x: 'Klasický textový algoritmus <strong>BM25</strong> (hľadá presné slová, ako Google v roku 2005) je slabý na význam, ale neomylný na kódy a názvy. <code>EnsembleRetriever</code> spojí oba svety s váhami:' },
    { t: 'pycharm', title: 'hybrid.py — BM25 + vektory', files: [
      { name: 'hybrid.py', active: true, code: `# pip install rank_bm25
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever

# 1) kľúčové slová — stavia sa priamo z chunkov, žiadne embeddingy
bm25 = BM25Retriever.from_documents(chunky)
bm25.k = 3

# 2) význam — náš známy vektorový retriever
vektorovy = db.as_retriever(search_kwargs={"k": 3})

# 3) kombinácia s váhami (spolu 1.0)
hybrid = EnsembleRetriever(
    retrievers=[bm25, vektorovy],
    weights=[0.4, 0.6],
)

for d in hybrid.invoke("chyba E-405 na modeli XR-500"):
    print("•", d.page_content[:60])` }
    ], output: `• Chybový kód E-405 signalizuje zanesený filter. Postup...
• Model XR-500: údržba filtra sa vykonáva každé 3 mesiace...
• Pri chybách radu E-4xx najprv reštartujte zariadenie...`,
      note: 'Kód „E-405" našiel BM25 (presná zhoda slova), súvislosti dodali vektory. Presne tento setup — hybrid search — je dnes štandard v produkčných RAG systémoch.' },
    { t: 'explain', title: 'Rozbor kódu — hybrid do detailu', rows: [
      ['BM25Retriever.from_documents(chunky)', 'Postaví index kľúčových slov priamo z chunkov v pamäti — žiadne embeddingy, žiadne API volania, zadarmo.'],
      ['bm25.k = 3', 'Počet výsledkov sa tu nastavuje atribútom (nie search_kwargs) — drobná API odlišnosť, na ktorú sa ľahko naletí.'],
      ['EnsembleRetriever(retrievers=[...], weights=[0.4, 0.6])', 'Spojí výsledky oboch retrieverov algoritmom RRF (reciprocal rank fusion) — dokument bodujú OBA zoznamy podľa pozície a váhy.'],
      ['weights=[0.4, 0.6]', 'Pomer dôvery: 40 % kľúčové slová, 60 % význam. Technická dokumentácia s kódmi → zvýš BM25; voľný text → zvýš vektory. Ladí sa experimentom.'],
      ['hybrid.invoke(otazka)', 'Ensemble je stále obyčajný retriever (Runnable) — zapojíš ho do create_retrieval_chain z lekcie 15 bez akejkoľvek ďalšej zmeny.']
    ]},
    { t: 'h', x: 'Reranking a ďalšie techniky do zásoby' },
    { t: 'table', head: ['Technika', 'Princíp', 'Kedy nasadiť'], rows: [
      ['<strong>Reranking</strong>', 'Vytiahni širších k=20, potom presnejší cross-encoder model zoradí a nechá TOP 3', 'Správne chunky sa nachádzajú, ale „utopené" hlbšie v poradí'],
      ['<strong>Parent-document</strong>', 'Hľadaj v malých chunkoch (presné), do promptu pošli celý rodičovský odsek (kontext)', 'Odpovede pôsobia útržkovito, chýba im okolie'],
      ['<strong>Metadata filtre</strong>', 'similarity_search s filter={"rok": 2026} — hľadaj len v podmnožine', 'Dokumenty majú verzie, oddelenia, dátumy'],
      ['<strong>Semantic chunking</strong>', 'Hranice chunkov podľa zmeny témy (embeddingy susedných viet), nie podľa dĺžky', 'Dokumenty s dlhými súvislými pasážami']
    ] },
    { t: 'box', kind: 'key', title: 'Postup ladenia RAG (odpoveď na pohovor)', x: 'Keď sa ťa spýtajú „RAG vracia zlé odpovede, čo s tým?", odpovedaj v poradí: <strong>1)</strong> zmeraj (LangSmith, lekcia 22 — je problém v retrieveri či v prompte?), <strong>2)</strong> ladenie chunkov (veľkosť/overlap, lekcia 12), <strong>3)</strong> multi-query pri zlých formuláciách, <strong>4)</strong> hybrid pri kódoch a názvoch, <strong>5)</strong> reranking pri utopených výsledkoch. Systematicky, od najlacnejšieho.' },
    { t: 'box', kind: 'tip', title: 'Nezabudni merať', x: 'Každú techniku nasaď s testovacou sadou otázok (projekt 29). Multi-query zdvihne latenciu, hybrid pridá závislosť, reranking stojí ďalší model — bez merania nevieš, či sa oplatili. O meraní je celá nasledujúca lekcia.' }
  ],
  quiz: [
    { q: 'Otázka „chyba E-405" nenachádza správny chunk. Ktorá technika pomôže najviac?',
      opts: ['Zvýšiť temperature', 'Hybrid search s BM25 — presné kódy sú doména kľúčových slov, nie vektorov', 'Väčší chunk_size', 'Iný LLM'],
      correct: 1, explain: 'Vektory reprezentujú kódy a čísla slabo. BM25 hľadá presnú zhodu slova — v kombinácii cez EnsembleRetriever dostaneš oboje.' },
    { q: 'Čo robí MultiQueryRetriever?',
      opts: ['Hľadá vo viacerých databázach', 'LLM vygeneruje viac formulácií otázky, každou sa vyhľadá a výsledky sa zlúčia', 'Kladie otázku viacerým modelom', 'Zrýchľuje vyhľadávanie'],
      correct: 1, explain: 'Rieši problém nešťastnej formulácie: hovorová otázka sa preformuluje aj do jazyka dokumentov. Cena = jedno LLM volanie navyše.' },
    { q: 'Ako funguje reranking?',
      opts: ['Zoradí dokumenty podľa dátumu', 'Vytiahne sa širší výber (k≈20) a presnejší model ho prehodnotí — do promptu ide nové TOP 3', 'Zoradí odpovede podľa dĺžky', 'Preusporiada chunky v databáze'],
      correct: 1, explain: 'Prvé kolo (vektory) je rýchle ale hrubé; druhé kolo (cross-encoder) pomalšie ale presné. Kombinácia = presnosť bez prehľadávania všetkého.' },
    { q: 'Váhy EnsembleRetrievera [0.4, 0.6] znamenajú:',
      opts: ['40 % dokumentov sa zahodí', 'Skóre z BM25 sa počíta s váhou 0.4 a z vektorov s 0.6 pri zlučovaní výsledkov', 'Vyhľadá sa 40 % databázy', 'Prvý retriever beží len v 40 % prípadov'],
      correct: 1, explain: 'Oba retrievery bežia vždy; váhy určujú, ako veľmi ich poradia ovplyvnia finálny rebríček (RRF fúzia).' },
    { q: 'Aký je správny PRVÝ krok, keď RAG odpovedá zle?',
      opts: ['Nasadiť všetky pokročilé techniky naraz', 'Zmerať a lokalizovať problém (retriever vs. prompt) — napr. cez LangSmith traces', 'Vymeniť model za väčší', 'Zdvojnásobiť k'],
      correct: 1, explain: 'Bez diagnózy nevieš, čo liečiš. Trace ukáže, či retriever našiel správne chunky — až potom volíš techniku.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Postav hybrid retriever', xp: 25,
      intro: 'Doplň kombináciu BM25 + vektorov.',
      code: `from langchain_community.retrievers import ⟦0⟧
from langchain.retrievers import EnsembleRetriever

bm25 = BM25Retriever.from_documents(chunky)
bm25.⟦1⟧ = 3

vektorovy = db.as_retriever(search_kwargs={"k": 3})

hybrid = EnsembleRetriever(
    retrievers=[bm25, vektorovy],
    ⟦2⟧=[0.4, 0.6],
)

dokumenty = hybrid.⟦3⟧("chyba E-405")`,
      blanks: [['BM25Retriever'], ['k'], ['weights'], ['invoke']],
      hint: 'BM25Retriever nastavuje počet cez atribút k, ensemble berie weights a každý retriever sa spúšťa cez invoke.' },
    { t: 'order', title: 'Diagnostika chorého RAGu', xp: 25,
      intro: 'Zoraď kroky ladenia od prvého po posledný (od najlacnejšieho po najdrahší).',
      items: [
        'Zmeraj: traces v LangSmith — retriever alebo prompt?',
        'Vylaď chunk_size a chunk_overlap',
        'Pridaj MultiQueryRetriever pre zle formulované otázky',
        'Nasaď hybrid search kvôli kódom a presným názvom',
        'Doplň reranking pre utopené výsledky' ] },
    { t: 'write', title: 'Multi-query nad tvojou databázou', xp: 30,
      intro: 'Obal existujúci retriever bez zmeny zvyšku aplikácie.',
      task: 'Vytvor <code>MultiQueryRetriever.from_llm</code> nad <code>db.as_retriever(search_kwargs={"k": 3})</code>, zavolaj ho s hovorovou otázkou a vypíš počet nájdených dokumentov cez <code>len()</code>.',
      starter: `from langchain.retrievers.multi_query import MultiQueryRetriever

# db a model už existujú
# tvoj kód...`,
      must: [['MultiQueryRetriever.from_llm'], ['retriever='], ['llm='], ['.invoke('], ['len(']],
      hint: 'from_llm(retriever=..., llm=model) → mq.invoke("hovorová otázka") → print(len(dokumenty)).',
      solution: `from langchain.retrievers.multi_query import MultiQueryRetriever

mq = MultiQueryRetriever.from_llm(
    retriever=db.as_retriever(search_kwargs={"k": 3}),
    llm=model,
)

dokumenty = mq.invoke("koľko voľna si vlastne môžem zobrať?")
print("Unikátnych chunkov:", len(dokumenty))` }
  ]
};

/* ============================================================
   LEKCIA 27 — Evaluácia LLM aplikácií
   ============================================================ */
window.COURSE.lessons.l27 = {
  id: 'l27', num: 27, section: 's5', icon: '🧪', duration: '13 min',
  title: 'Evaluácia — ako dokázať, že tvoja AI funguje',
  intro: '„Vyzerá, že to funguje" v práci nestačí. Keď zmeníš prompt, model či chunk_size — zlepšil si systém, alebo pokazil? Evaluácia je disciplína, ktorá z AI vývoja robí inžinierstvo. A na pohovoroch je to otázka, ktorá oddeľuje zrno od pliev.',
  goals: [
    'Pochopiť, prečo sa LLM aplikácie nedajú testovať klasickými assert-mi',
    'Zostaviť testovaciu sadu (golden dataset) otázok a očakávaní',
    'Postaviť LLM-as-judge — model, ktorý známkuje odpovede iného modelu',
    'Spustiť evaluačnú slučku a čítať jej výsledky ako regresný test'
  ],
  blocks: [
    { t: 'h', x: 'Prečo assert nestačí' },
    { t: 'p', x: 'Klasický test: <code>assert scitaj(2, 3) == 5</code> — výstup je vždy rovnaký. LLM ale na tú istú otázku odpovie zakaždým inými slovami: „Máš nárok na 25 dní" aj „Zamestnancom patrí 25 dní dovolenky" sú OBE správne. Porovnávanie na presnú zhodu je zbytočné — potrebuješ posúdiť <strong>význam</strong>. A kto vie posudzovať význam? Ďalší LLM.' },
    { t: 'h', x: 'Krok 1: Golden dataset' },
    { t: 'p', x: 'Základ všetkého: zoznam dvojíc <strong>otázka → očakávaná odpoveď</strong> (tzv. ground truth). Nemusí byť veľký — aj 15–30 kvalitných otázok odhalí väčšinu regresií. Zbieraj do neho reálne otázky používateľov, hraničné prípady a otázky, na ktoré systém kedysi odpovedal zle:' },
    { t: 'pycharm', title: 'dataset.py — testovacia sada', files: [
      { name: 'dataset.py', active: true, code: `# Golden dataset: otázka + čo MUSÍ odpoveď obsahovať (fakticky)
TESTY = [
    {"otazka": "Koľko dní dovolenky mám ročne?",
     "ocakavane": "25 dní"},
    {"otazka": "Dokedy sa dá preniesť nevyčerpaná dovolenka?",
     "ocakavane": "do 31. marca nasledujúceho roka"},
    {"otazka": "Koľko sick days mám?",
     "ocakavane": "5 dní bez potvrdenia"},
    # ...otázka MIMO dokumentov — správna odpoveď je "neviem":
    {"otazka": "Aká je politika služobných psov v kancelárii?",
     "ocakavane": "v dokumentoch sa nenachádza / neviem"},
]` }
    ], output: `(dataset je len dátový súbor — spúšťať budeme eval.py)`,
      note: 'Posledný test je zákerný naschvál: overuje, že bot NEHALUCINUJE. Dobrý dataset testuje aj to, čo systém vedieť NEMÁ.' },
    { t: 'h', x: 'Krok 2: LLM-as-judge' },
    { t: 'p', x: '<strong>Sudca</strong> je chain, ktorý dostane otázku, očakávanie a skutočnú odpoveď — a vráti štruktúrovaný verdikt. Kľúčové detaily: <code>temperature=0</code>, jasné kritériá v prompte a JSON výstup, aby sa dal spracovať:' },
    { t: 'pycharm', title: 'eval.py — sudca + evaluačná slučka', files: [
      { name: 'eval.py', active: true, code: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

sudca = (
    ChatPromptTemplate.from_template(
        "Si prísny hodnotiteľ QA systému.\\n"
        "Otázka: {otazka}\\n"
        "Očakávaný fakt: {ocakavane}\\n"
        "Skutočná odpoveď: {odpoved}\\n\\n"
        "Obsahuje odpoveď očakávaný fakt (významovo, nie doslovne)?\\n"
        "Odpovedz IBA JSON: {{\\"verdikt\\": \\"PASS\\" alebo \\"FAIL\\", "
        "\\"dovod\\": \\"jedna veta\\"}}"
    )
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | JsonOutputParser()
)

vysledky = []
for t in TESTY:
    odpoved = rag_chain.invoke({"input": t["otazka"]})["answer"]
    verdikt = sudca.invoke({**t, "odpoved": odpoved})
    vysledky.append(verdikt["verdikt"] == "PASS")
    znacka = "✅" if verdikt["verdikt"] == "PASS" else "❌"
    print(f"{znacka} {t['otazka'][:45]:47} {verdikt['dovod'][:40]}")

uspesnost = sum(vysledky) / len(vysledky) * 100
print(f"\\nÚspešnosť: {uspesnost:.0f} %  ({sum(vysledky)}/{len(vysledky)})")` }
    ], output: `✅ Koľko dní dovolenky mám ročne?                Odpoveď uvádza 25 dní — zhoda.
✅ Dokedy sa dá preniesť nevyčerpaná dovolenk    Termín 31. marca sedí s očakávaním.
✅ Koľko sick days mám?                          5 dní bez potvrdenia — správne.
❌ Aká je politika služobných psov v kancelá     Bot si vymyslel pravidlá namiesto „neviem".

Úspešnosť: 75 %  (3/4)`,
      note: 'A máš regresný test! Zajtra zmeníš chunk_size → spustíš eval.py → číslo hore alebo dole ti POVIE, či to bola dobrá zmena. Žiadne dojmy, len dáta. (Ten ❌ mimochodom opravíš poistkou zo lekcie 15.)' },
    { t: 'explain', title: 'Rozbor kódu — sudcovské detaily', rows: [
      ['"Obsahuje odpoveď očakávaný fakt (významovo, nie doslovne)?"', 'Jadro promptu: sudca porovnáva VÝZNAM, nie znaky. „25 dní" a „dvadsaťpäť dní ročne" prejdú obe.'],
      ['{{\\"verdikt\\": ...}}', 'Dvojité zátvorky {{ }} = literálne { } v šablóne (lekcia 3) — inak by ich LangChain považoval za premenné. A \\" sú úvodzovky vnútri Python stringu.'],
      ['sudca.invoke({**t, "odpoved": odpoved})', '<code>**t</code> „rozbalí" slovník testu (otazka, ocakavane) a pridáme k nemu odpoveď — tri premenné pre šablónu jedným výrazom.'],
      ['vysledky.append(verdikt["verdikt"] == "PASS")', 'Porovnanie vráti True/False — zoznam boolov sa potom dá jednoducho sčítať (True sa počíta ako 1).'],
      ['f"{znacka} {t[\'otazka\'][:45]:47} ..."', 'Formátovacie kúzlo f-stringov: [:45] oreže text, :47 doplní medzery do pevnej šírky — vznikne úhľadná tabuľka v konzole.'],
      ['sum(vysledky) / len(vysledky) * 100', 'sum() spočíta True hodnoty, len() celkový počet — percento úspešnosti jedným riadkom.']
    ]},
    { t: 'h', x: 'Ako sa to robí „vo veľkom"' },
    { t: 'table', head: ['Úroveň', 'Nástroj', 'Kedy'], rows: [
      ['Ručný eval skript', 'presne to, čo sme napísali', 'Malé projekty, rýchla spätná väzba — začni tu'],
      ['LangSmith datasets + evaluate()', 'dataset v cloude, spúšťanie evalov nad ním, porovnávanie behov v UI', 'Tímová práca, história experimentov (lekcia 22)'],
      ['CI pipeline', 'eval beží automaticky pri každom git pushi; pokles úspešnosti zablokuje merge', 'Produkčné systémy — AI verzia unit testov'],
      ['Online monitoring', 'vzorka reálnej prevádzky sa priebežne hodnotí + user feedback (👍/👎)', 'Po nasadení — regresie chytíš skôr než používatelia']
    ] },
    { t: 'box', kind: 'warn', title: 'Sudca nie je neomylný', x: 'LLM-as-judge má ~90–95 % zhodu s ľudským hodnotením — výborné na trend, slabé na jednotlivosti. Preto: verdikty FAIL si prejdi očami (môže sa mýliť sudca, nie systém), sudcu drž na temperature=0 a občas ho kalibruj proti vlastnému úsudku na 10 vzorkách.' },
    { t: 'box', kind: 'key', title: 'Veta na pohovor', x: '„Každú zmenu promptu či parametrov prežeňem golden datasetom s LLM-as-judge sudcom a sledujem úspešnosť — evaly beriem ako unit testy LLM aplikácie." — táto jedna veta ťa na pohovore posunie pred 80 % kandidátov.' }
  ],
  quiz: [
    { q: 'Prečo sa LLM aplikácie nedajú testovať cez assert odpoved == "...":',
      opts: ['LLM odpovede sú vždy nesprávne', 'Model formuluje tú istú správnu odpoveď zakaždým inak — porovnávať treba význam, nie znaky', 'assert v Pythone nefunguje so stringami', 'Dajú sa, len je to pomalé'],
      correct: 1, explain: 'Nedeterministické formulácie = presná zhoda zlyhá aj pri správnej odpovedi. Preto významové hodnotenie sudcom.' },
    { q: 'Čo je golden dataset?',
      opts: ['Najdrahšie tréningové dáta', 'Zoznam testovacích otázok s očakávanými (správnymi) odpoveďami — základ evaluácie', 'Záloha vektorovej databázy', 'Dataset od OpenAI'],
      correct: 1, explain: 'Ground truth sada: reálne otázky, hraničné prípady aj minulé chyby. Proti nej meriaš každú zmenu systému.' },
    { q: 'Prečo má byť v datasete aj otázka, na ktorú systém NEMÁ poznať odpoveď?',
      opts: ['Aby bol dataset dlhší', 'Testuje, že systém nehalucinuje a čestne prizná „neviem"', 'Kvôli GDPR', 'Nemá tam byť'],
      correct: 1, explain: 'Halucinácie sú najnebezpečnejšia chyba RAG systémov — a bez negatívneho testu ich neodhalíš.' },
    { q: 'Aké nastavenie musí mať sudcovský model?',
      opts: ['temperature=2 pre kreativitu', 'temperature=0 + jasné kritériá + štruktúrovaný (JSON) výstup', 'Musí byť väčší než testovaný model', 'Bez system správy'],
      correct: 1, explain: 'Sudca má byť nudný a konzistentný: deterministický, s presným zadaním kritérií a parsovateľným výstupom.' },
    { q: 'Zmenil si chunk_size z 500 na 800. Ako zistíš, či to pomohlo?',
      opts: ['Položíš dve otázky a uvidíš', 'Spustíš eval nad golden datasetom pred aj po zmene a porovnáš úspešnosť', 'Ak to beží bez chyby, pomohlo to', 'Spýtaš sa modelu, či sa zlepšil'],
      correct: 1, explain: 'Meranie pred/po na rovnakej sade = jediný objektívny dôkaz. Presne takto pracuje projekt 29.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Poskladaj sudcu', xp: 25,
      intro: 'Doplň evaluačný chain a slučku.',
      code: `sudca = prompt_sudcu | ChatOpenAI(model="gpt-4o-mini", ⟦0⟧=0) | ⟦1⟧()

vysledky = []
for t in TESTY:
    odpoved = rag_chain.invoke({"input": t["otazka"]})["answer"]
    verdikt = sudca.invoke({**t, "odpoved": odpoved})
    vysledky.append(verdikt["verdikt"] == "⟦2⟧")

uspesnost = ⟦3⟧(vysledky) / len(vysledky) * 100`,
      blanks: [['temperature'], ['JsonOutputParser'], ['PASS'], ['sum']],
      hint: 'Sudca je deterministický (temperature=0), vracia JSON, verdikt porovnávaš s "PASS" a True hodnoty sčíta sum().' },
    { t: 'order', title: 'Evaluačný workflow', xp: 25,
      intro: 'Zoraď profesionálny postup vyhodnotenia zmeny v RAG systéme.',
      items: [
        'Zostav golden dataset (otázky + očakávania + negatívne testy)',
        'Spusti eval na AKTUÁLNEJ verzii — základná úspešnosť (baseline)',
        'Vykonaj zmenu (prompt, chunk_size, retriever…)',
        'Spusti ten istý eval na novej verzii',
        'Porovnaj úspešnosti a FAIL prípady si prejdi očami',
        'Zmenu prijmi/vráť podľa dát — a commitni aj dataset' ] },
    { t: 'write', title: 'Negatívny test halucinácií', xp: 30,
      intro: 'Najcennejší test v celom datasete.',
      task: 'Pridaj do zoznamu <code>TESTY</code> slovník s otázkou úplne mimo tvojich dokumentov a očakávaním „neviem / nenachádza sa". Potom napíš <code>for</code> slučku, ktorá spočíta a vypíše počet FAIL verdiktov zo zoznamu <code>vysledky</code> (pole boolov).',
      starter: `TESTY = [
    # existujúce testy...
]
# tvoj kód...`,
      must: [['TESTY.append', '"ocakavane"'], ['neviem'], ['for '], ['FAIL', 'False', 'not ']],
      hint: 'TESTY.append({"otazka": "...", "ocakavane": "neviem"}). FAIL count: sum(1 for v in vysledky if not v) alebo len(vysledky) - sum(vysledky).',
      solution: `TESTY.append({
    "otazka": "Aké sú pravidlá pre parkovanie vesmírnych lodí?",
    "ocakavane": "neviem / v dokumentoch sa nenachádza",
})

pocet_fail = 0
for v in vysledky:
    if not v:
        pocet_fail += 1
print(f"FAIL testov: {pocet_fail} z {len(vysledky)}")` }
  ]
};
