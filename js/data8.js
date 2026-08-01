/* ============================================================
   SEKCIA s7 — Produkčný backend a cloud
   Lekcie 38–44. Dopĺňa medzery voči požiadavkám na senior
   AI-engineering pozície: Azure OpenAI a cloud, async spracovanie,
   databázy (PostgreSQL/Redis/Elasticsearch/MongoDB), CI/CD,
   architektúra a resilience, LlamaIndex, líderské zručnosti.
   ============================================================ */

window.COURSE.sections.push({
  id: 's7', icon: '🏗️', color: '#8fb8d6',
  title: 'Produkčný backend a cloud',
  subtitle: 'Zvyšok senior stacku: Azure OpenAI, asynchrónne spracovanie, PostgreSQL/Redis/Elasticsearch/MongoDB, CI/CD s GitHub Actions, architektúra odolného systému, LlamaIndex a líderské zručnosti.',
  lessons: ['l38', 'l39', 'l40', 'l41', 'l42', 'l43', 'l44']
});

/* ============================================================
   LEKCIA 38 — Azure OpenAI a cloud
   ============================================================ */
window.COURSE.lessons.l38 = {
  id: 'l38', num: 38, section: 's7', icon: '☁️', duration: '13 min',
  title: 'Azure OpenAI a nasadenie do cloudu',
  intro: 'Väčšina firiem nevolá api.openai.com priamo — používa Azure OpenAI, lebo potrebuje dáta v EÚ, zmluvné SLA a súkromnú sieť. V kóde je to zmena pár riadkov, ale s jednou zradnou odlišnosťou (deployment ≠ model), na ktorej sa zasekol každý, kto to skúšal prvýkrát. Pridáme aj prehľad, kam sa kontajner s tvojou appkou reálne nasadzuje.',
  goals: [
    'Vysvetliť, prečo firmy volia Azure OpenAI namiesto priameho OpenAI API',
    'Prepnúť LangChain kód na AzureChatOpenAI (endpoint, deployment, api_version)',
    'Rozumieť rozdielu medzi názvom modelu a názvom nasadenia',
    'Zorientovať sa v možnostiach nasadenia kontajnera na Azure, AWS a GCP'
  ],
  blocks: [
    { t: 'h', x: 'Prečo firmy chcú Azure OpenAI' },
    { t: 'p', x: 'Technicky je to ten istý GPT-4o. Rozdiel je v <strong>prevádzkových zárukách</strong>: dáta ostávajú vo zvolenom regióne (napr. Sweden Central pre EÚ), Microsoft zmluvne garantuje SLA a nespracúva tvoje dáta na tréning, prístup vieš uzavrieť do súkromnej siete (VNet + private endpoint) a fakturácia ide cez existujúcu Azure zmluvu firmy. Pre banku či poisťovňu je to často <strong>jediná povolená cesta</strong> k OpenAI modelom.' },
    { t: 'table', head: ['', 'OpenAI API', 'Azure OpenAI'], rows: [
      ['Adresa', '<code>api.openai.com</code> (globálna)', 'tvoj endpoint: <code>https://firma.openai.azure.com</code>'],
      ['Kľúč', '<code>OPENAI_API_KEY</code> (sk-…)', '<code>AZURE_OPENAI_API_KEY</code> + <code>AZURE_OPENAI_ENDPOINT</code>'],
      ['Model', 'názov modelu: <code>gpt-4o-mini</code>', '<strong>názov NASADENIA</strong>, ktorý si sám vytvoril v portáli'],
      ['Verzia API', 'netreba', 'povinný parameter <code>api_version</code>'],
      ['Dáta a compliance', 'podľa podmienok OpenAI', 'región, SLA, žiadny tréning na tvojich dátach, VNet'],
    ] },
    { t: 'h', x: 'AzureChatOpenAI v LangChaine' },
    { t: 'p', x: 'Krása LangChainu: zvyšok appky (prompty, chainy, RAG, agenti) sa <strong>nemení vôbec</strong>. Vymeníš len konštruktor modelu:' },
    { t: 'pycharm', title: 'azure_model.py — prepnutie na Azure', files: [
      { name: 'azure_model.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI

load_dotenv()
# .env obsahuje:
#   AZURE_OPENAI_ENDPOINT=https://firma.openai.azure.com
#   AZURE_OPENAI_API_KEY=...

model = AzureChatOpenAI(
    azure_deployment="firemny-gpt4o",   # názov TVOJHO nasadenia z portálu!
    api_version="2024-10-21",           # verzia Azure OpenAI API
    temperature=0,
)

print(model.invoke("Povedz ahoj jednou vetou.").content)` }
    ], output: `Ahoj, teším sa, že si tu!`,
      note: 'Endpoint a kľúč si <b>AzureChatOpenAI</b> prečíta z prostredia sám (AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY). V kóde zadávaš len nasadenie a verziu API.' },
    { t: 'explain', title: 'Rozbor kódu — čo je iné oproti ChatOpenAI', rows: [
      ['AzureChatOpenAI', 'Trieda z toho istého balíka <code>langchain_openai</code> — rovnaké rozhranie (invoke, stream, bind_tools), iná autentifikácia.'],
      ['azure_deployment="firemny-gpt4o"', 'V Azure si model najprv NASADÍŠ pod vlastným menom. Tu patrí to meno — nie „gpt-4o"!'],
      ['api_version="2024-10-21"', 'Azure verzuje svoje API dátumami. Bez tohto parametra volanie zlyhá.'],
      ['load_dotenv()', 'Kľúč a endpoint ostávajú v prostredí — presne ako v lekcii 37 o tajomstvách.'],
    ]},
    { t: 'box', kind: 'warn', title: 'Chyba č. 1: deployment ≠ model', x: 'Ak do <code>azure_deployment</code> napíšeš „gpt-4o-mini" a nasadenie sa tak nevolá, dostaneš <code>DeploymentNotFound</code>. Názov nasadenia si volíš SÁM pri vytváraní v Azure portáli (Azure AI Foundry) — pokojne sa môže volať „muj-chatbot-produkcia". Model je to, ČO beží; deployment je, AKO si to u seba pomenoval.' },
    { t: 'box', kind: 'tip', title: 'Prepínateľná appka', x: 'Dobrý zvyk: továrenská funkcia <code>vyrob_model()</code>, ktorá podľa premennej prostredia (napr. <code>LLM_PROVIDER=azure|openai</code>) vráti ChatOpenAI alebo AzureChatOpenAI. Zvyšok kódu o rozdiele nevie — a lokálne vyvíjaš proti OpenAI, v produkcii beží Azure.' },
    { t: 'h', x: 'Kam s kontajnerom: Azure vs AWS vs GCP' },
    { t: 'p', x: 'Docker image z lekcie 30 je univerzálny — všetky tri cloudy ho vedia spustiť. Líšia sa názvami služieb a mierou starostí, ktoré z teba snímu:' },
    { t: 'table', head: ['Úroveň', 'Azure', 'AWS', 'GCP', 'Kedy'], rows: [
      ['Serverless kontajner', 'Container Apps', 'App Runner / Fargate', '<strong>Cloud Run</strong>', 'Štart projektu — platíš za beh, škáluje sa samo (aj na nulu)'],
      ['Orchestrátor (Kubernetes)', 'AKS', 'EKS', 'GKE', 'Veľké systémy, vlastný DevOps tím'],
      ['Registry pre image', 'ACR', 'ECR', 'Artifact Registry', 'Kam CI/CD pushne image (lekcia 41)'],
      ['Tajomstvá', 'Key Vault', 'Secrets Manager', 'Secret Manager', 'API kľúče v produkcii — nie v .env súbore na serveri'],
    ] },
    { t: 'box', kind: 'key', title: '12-factor pravidlo', x: 'Jeden a ten istý image beží lokálne, na stagingu aj v produkcii — <strong>mení sa len konfigurácia z prostredia</strong> (endpoint, kľúče, názov nasadenia). Ak musíš pre iné prostredie prebuildiť image, máš architektonickú chybu.' },
  ],
  quiz: [
    { q: 'Prečo firma s dátami v EÚ zvolí Azure OpenAI namiesto priameho OpenAI API?',
      opts: ['Je lacnejšie za token', 'Dáta ostávajú vo zvolenom regióne, je zmluvné SLA a prístup vieš uzavrieť do súkromnej siete', 'Má novšie modely', 'Nevyžaduje API kľúč'],
      correct: 1, explain: 'Modely sú rovnaké — rozdiel je v compliance: región dát, SLA, žiadny tréning na tvojich dátach, VNet.' },
    { q: 'Čo patrí do parametra azure_deployment?',
      opts: ['Názov modelu, napr. gpt-4o-mini', 'Názov nasadenia, ktorý si si SÁM vytvoril v Azure portáli', 'URL endpointu', 'Verzia API'],
      correct: 1, explain: 'Deployment je tvoje pomenovanie nasadeného modelu. Zámena s názvom modelu je najčastejšia začiatočnícka chyba (DeploymentNotFound).' },
    { q: 'Čo sa zmení vo zvyšku LangChain appky (chainy, RAG, agenti) pri prechode na Azure?',
      opts: ['Všetko treba prepísať', 'Nič — vymení sa len konštruktor modelu, rozhranie je rovnaké', 'Treba iný vektorový store', 'Prompty treba preložiť'],
      correct: 1, explain: 'AzureChatOpenAI má rovnaké rozhranie ako ChatOpenAI (invoke, stream, bind_tools) — mení sa len autentifikácia a názov nasadenia.' },
    { q: 'Ktorá služba je serverless beh kontajnera na GCP?',
      opts: ['GKE', 'Cloud Run', 'Artifact Registry', 'Secret Manager'],
      correct: 1, explain: 'Cloud Run (obdoba Azure Container Apps a AWS App Runner) — spustí image, škáluje podľa záťaže, aj na nulu.' },
    { q: 'Čo hovorí 12-factor prístup o konfigurácii?',
      opts: ['Konfigurácia patrí do kódu', 'Jeden image všade, konfigurácia sa mení len cez prostredie', 'Pre každé prostredie iný image', 'Konfigurácia patrí do databázy'],
      correct: 1, explain: 'Rovnaký artefakt (image) beží vo všetkých prostrediach; líšia sa len env premenné. Rebuild pre iné prostredie = architektonická chyba.' },
  ],
  exercises: [
    { t: 'order', title: 'Cesta k behu na Azure', xp: 25,
      intro: 'Zoraď kroky od nuly po volanie Azure OpenAI z appky.',
      items: [
        'Vytvor Azure OpenAI resource vo zvolenom regióne',
        'Nasaď model a pomenuj nasadenie (deployment)',
        'Ulož endpoint a kľúč do prostredia (.env / Key Vault)',
        'V kóde vytvor AzureChatOpenAI s azure_deployment a api_version',
        'Zvyšok appky (chainy, RAG) funguje bez zmeny' ] },
    { t: 'blanks', title: 'Prepni model na Azure', xp: 25,
      intro: 'Doplň parametre AzureChatOpenAI.',
      code: `from langchain_openai import ⟦0⟧

model = AzureChatOpenAI(
    ⟦1⟧="firemny-gpt4o",     # meno nasadenia z portálu
    ⟦2⟧="2024-10-21",        # Azure verzuje API dátumami
    temperature=0,
)`,
      blanks: [['AzureChatOpenAI'], ['azure_deployment'], ['api_version']],
      hint: 'Trieda sa volá AzureChatOpenAI; nasadenie určuje azure_deployment a verziu API api_version.' },
    { t: 'write', title: 'Továreň na model', xp: 30,
      task: 'Napíš funkciu <code>vyrob_model()</code>, ktorá podľa premennej prostredia <code>LLM_PROVIDER</code> (cez <code>os.getenv</code> s defaultom <code>"openai"</code>) vráti buď <code>AzureChatOpenAI(azure_deployment=..., api_version=...)</code>, alebo <code>ChatOpenAI(model="gpt-4o-mini")</code>. Zavolaj ju a vypíš typ výsledku cez <code>type(...).__name__</code>.',
      starter: `import os
from langchain_openai import ChatOpenAI, AzureChatOpenAI

# tvoj kód...`,
      must: [['def vyrob_model'], ['os.getenv('], ['AzureChatOpenAI('], ['ChatOpenAI('], ['__name__']],
      hint: 'if os.getenv("LLM_PROVIDER", "openai") == "azure": return AzureChatOpenAI(...) — inak ChatOpenAI. Zvyšok appky volá len vyrob_model() a o rozdiele nevie.',
      solution: `import os
from langchain_openai import ChatOpenAI, AzureChatOpenAI

def vyrob_model():
    """Jedno miesto, kde sa rozhoduje o poskytovateľovi LLM."""
    if os.getenv("LLM_PROVIDER", "openai") == "azure":
        return AzureChatOpenAI(azure_deployment="firemny-gpt4o",
                               api_version="2024-10-21", temperature=0)
    return ChatOpenAI(model="gpt-4o-mini", temperature=0)

model = vyrob_model()
print(type(model).__name__)` }
  ]
};

/* ============================================================
   LEKCIA 39 — Asynchrónne spracovanie
   ============================================================ */
window.COURSE.lessons.l39 = {
  id: 'l39', num: 39, section: 's7', icon: '⚡', duration: '14 min',
  title: 'Asynchrónny LangChain — ainvoke, gather a fronty',
  intro: 'Volanie LLM je 95 % čakania na sieť. Synchrónny kód pri ňom stojí a nič nerobí; asynchrónny medzitým obslúži ďalších používateľov alebo pošle ďalšie dopyty. Toto je rozdiel medzi appkou pre jedného a službou pre tisíc ľudí — a na pohovore sa na async pýtajú vždy.',
  goals: [
    'Pochopiť, kedy async pomáha (I/O čakanie) a kedy nie (výpočty)',
    'Používať ainvoke, abatch a astream namiesto sync verzií',
    'Spustiť viac LLM volaní naraz cez asyncio.gather',
    'Vedieť, kedy požiadavku odovzdať fronte namiesto čakania'
  ],
  blocks: [
    { t: 'h', x: 'Kde sa stráca čas' },
    { t: 'p', x: 'Keď zavoláš <code>model.invoke()</code>, tvoj program odošle HTTP požiadavku a potom <strong>len čaká</strong> — sekundu, dve, pri dlhých odpovediach aj desať. CPU medzitým nerobí nič. Async programovanie hovorí: „kým čakáš na jednu odpoveď, rob niečo iné" — napríklad obsluhuj ďalšího používateľa alebo pošli ďalšie tri dopyty naraz.' },
    { t: 'compare', a: { title: '🐌 Synchrónne', items: [
        '3 otázky × 2 s = <strong>6 sekúnd</strong>',
        'Program počas čakania stojí',
        'FastAPI vlákno je zablokované',
        'Jednoduchšie na čítanie a ladenie'
      ]}, b: { title: '⚡ Asynchrónne', items: [
        '3 otázky naraz = <strong>~2 sekundy</strong>',
        'Čakanie sa prekrýva',
        'Server medzitým obsluhuje ďalších',
        'Vyžaduje async/await disciplínu'
      ]} },
    { t: 'box', kind: 'info', title: 'Kedy async NEPOMÔŽE', x: 'Async zrýchľuje <strong>čakanie</strong> (sieť, disk, databáza), nie <strong>výpočty</strong>. Ak ti program trávi čas počítaním embeddings na CPU alebo parsovaním obrieho PDF, async nič nevyrieši — tam pomôže viac procesov alebo silnejší stroj.' },
    { t: 'h', x: 'ainvoke + asyncio.gather: tri dopyty naraz' },
    { t: 'p', x: 'Každá LangChain komponenta má async dvojičky sync metód: <code>ainvoke</code>, <code>abatch</code>, <code>astream</code>. Volajú sa s <code>await</code> vnútri <code>async def</code> funkcie:' },
    { t: 'pycharm', title: 'paralelne.py — gather v praxi', files: [
      { name: 'paralelne.py', active: true, code: `import asyncio
import time
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

OTAZKY = ["Čo je RAG?", "Čo je embedding?", "Čo je agent?"]

async def spracuj_vsetky():
    ulohy = [model.ainvoke(o) for o in OTAZKY]     # 3 dopyty vyrazia NARAZ
    odpovede = await asyncio.gather(*ulohy)        # počkaj na všetky
    return [o.content[:45] for o in odpovede]

start = time.time()
vysledky = asyncio.run(spracuj_vsetky())
for v in vysledky:
    print("•", v)
print(f"Hotovo za {time.time() - start:.1f} s (sync by trvalo ~3× dlhšie)")` }
    ], output: `• RAG je technika, ktorá kombinuje vyhľadávanie
• Embedding je číselná reprezentácia textu vo v
• Agent je systém, ktorý používa LLM na rozhodo
Hotovo za 2.1 s (sync by trvalo ~3× dlhšie)`,
      note: '<b>gather</b> spustí všetky úlohy súčasne a vráti výsledky v pôvodnom poradí. Hviezdička v <b>gather(*ulohy)</b> rozbalí zoznam na jednotlivé argumenty.' },
    { t: 'explain', title: 'Rozbor kódu — async stavebnica', rows: [
      ['async def spracuj_vsetky()', 'Asynchrónna funkcia (korutina). Nespustí sa zavolaním — treba ju awaitnúť alebo dať do asyncio.run().'],
      ['model.ainvoke(o)', 'Async verzia invoke. Vytvorí úlohu, ktorá sa začne vykonávať, keď na ňu event loop príde — tu ešte NEčakáme.'],
      ['await asyncio.gather(*ulohy)', 'Toto je bod čakania: všetky dopyty bežia súčasne a gather počká na posledný. Celkový čas ≈ najpomalší dopyt, nie súčet.'],
      ['asyncio.run(...)', 'Vstupná brána zo sync sveta: vytvorí event loop, spustí korutinu a po skončení loop zavrie. Voláš ju raz, na vrchu programu.'],
    ]},
    { t: 'h', x: 'astream — tokeny priebežne' },
    { t: 'pycharm', title: 'streamovanie.py — odpoveď po kúskoch', files: [
      { name: 'streamovanie.py', active: true, code: `import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

chain = (
    ChatPromptTemplate.from_template("Vysvetli jednou vetou: {tema}")
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | StrOutputParser()
)

async def hlavna():
    async for kusok in chain.astream({"tema": "vektorová databáza"}):
        print(kusok, end="", flush=True)   # kúsok textu hneď na obrazovku
    print()

asyncio.run(hlavna())` }
    ], output: `Vektorová databáza ukladá texty ako číselné vektory, takže vie
bleskovo nájsť významovo podobné dokumenty.`,
      note: '<b>async for</b> vyberá kúsky (chunky) hneď, ako prichádzajú zo siete. Používateľ vidí text rásť — vnímaná rýchlosť appky sa dramaticky zlepší, hoci celkový čas je rovnaký.' },
    { t: 'box', kind: 'tip', title: 'abatch — dávka s limitom súbežnosti', x: '<code>await model.abatch(zoznam, config={"max_concurrency": 5})</code> spracuje hoci 100 vstupov, ale naraz ich poletí najviac 5 — ochrana pred rate limitom API aj pred vlastným účtom. Pre hromadné spracovanie (sumarizácia 500 dokumentov) je to správny nástroj.' },
    { t: 'h', x: 'FastAPI a fronty: keď 2 sekundy je priveľa' },
    { t: 'p', x: 'Vo FastAPI stačí endpoint označiť <code>async def</code> a vnútri používať <code>await chain.ainvoke(...)</code> — server počas čakania obsluhuje ďalšie požiadavky. Ale pozor: ak úloha trvá <strong>minúty</strong> (analýza 300-stranového PDF), používateľ nebude čakať na HTTP odpoveď. Vtedy požiadavku <strong>odovzdáš fronte</strong> (Celery + Redis, RQ, cloud fronta), vrátiš <code>job_id</code> a klient sa na výsledok pýta priebežne — alebo mu ho pošleš notifikáciou.' },
    { t: 'flow', steps: ['📥 POST /analyza<br><small>vráti job_id hneď</small>', '📮 Fronta<br><small>Redis / SQS</small>', '⚙️ Worker<br><small>spracuje na pozadí</small>', '💾 Výsledok do DB', '📤 GET /analyza/{id}<br><small>hotovo → výsledok</small>'] },
    { t: 'box', kind: 'key', title: 'Rozhodovacie pravidlo', x: 'Do ~10 sekúnd: <strong>async endpoint + streaming</strong> (používateľ vidí progres). Nad to: <strong>fronta + worker + job_id</strong>. Nikdy nedrž HTTP spojenie otvorené minúty — load balancery a prehliadače ho zabijú.' },
  ],
  quiz: [
    { q: 'Prečo async výrazne zrýchli tri LLM volania?',
      opts: ['Model odpovedá rýchlejšie', 'Čakania na sieť sa prekryjú — dopyty letia naraz a celkový čas ≈ najpomalší z nich', 'Použije sa menší model', 'Tokeny sú lacnejšie'],
      correct: 1, explain: 'LLM volanie je hlavne čakanie na sieť. gather ich spustí súčasne, takže nečakáš súčet časov, ale maximum.' },
    { q: 'Kedy async NEPOMÔŽE?',
      opts: ['Pri volaní API', 'Pri ťažkých CPU výpočtoch (parsovanie, lokálne embeddings) — tam treba procesy, nie async', 'Pri čítaní z databázy', 'Pri streamovaní'],
      correct: 1, explain: 'Async prekrýva čakanie na I/O. Výpočty na CPU sa neprekryjú — event loop je jedno vlákno.' },
    { q: 'Čo robí await asyncio.gather(*ulohy)?',
      opts: ['Spustí úlohy postupne', 'Spustí všetky úlohy súčasne a počká na dokončenie všetkých, výsledky vráti v pôvodnom poradí', 'Zruší pomalé úlohy', 'Vyberie najrýchlejšiu odpoveď'],
      correct: 1, explain: 'gather = súbežné spustenie + čakanie na všetko + stabilné poradie výsledkov.' },
    { q: 'Načo je max_concurrency pri abatch?',
      opts: ['Zrýchľuje odpovede', 'Obmedzí počet súčasne letiacich dopytov — ochrana pred rate limitom API a nákladmi', 'Zvyšuje kvalitu', 'Je povinný parameter'],
      correct: 1, explain: '100 vstupov naraz by narazilo na rate limit poskytovateľa. Limit súbežnosti drží dávku pod kontrolou.' },
    { q: 'Úloha trvá 3 minúty (analýza veľkého PDF). Ako ju obslúžiš cez API?',
      opts: ['async endpoint, ktorý 3 minúty drží spojenie', 'Fronta + worker: endpoint hneď vráti job_id a klient sa na výsledok pýta neskôr', 'Zvýšim timeout na 5 minút', 'Streamovaním'],
      correct: 1, explain: 'HTTP spojenia na minúty zabíjajú load balancery aj prehliadače. Dlhé úlohy patria fronte a workerom na pozadí.' },
  ],
  exercises: [
    { t: 'order', title: 'Život async požiadavky', xp: 25,
      intro: 'Zoraď, čo sa deje pri paralelnom spracovaní troch otázok.',
      items: [
        'async def funkcia vytvorí zoznam úloh cez model.ainvoke',
        'asyncio.gather spustí všetky úlohy súčasne',
        'Event loop prepína medzi úlohami počas čakania na sieť',
        'Odpovede sa vrátia v pôvodnom poradí',
        'asyncio.run ukončí event loop a vráti výsledok' ] },
    { t: 'blanks', title: 'Async chain', xp: 25,
      intro: 'Doplň asynchrónne volanie reťaze.',
      code: `import asyncio

⟦0⟧ def hlavna():
    odpoved = ⟦1⟧ chain.⟦2⟧({"tema": "RAG"})
    print(odpoved)

asyncio.⟦3⟧(hlavna())`,
      blanks: [['async'], ['await'], ['ainvoke'], ['run']],
      hint: 'Korutina sa definuje async def, na výsledok sa čaká await, async verzia invoke je ainvoke a zo sync sveta ju spúšťa asyncio.run.' },
    { t: 'write', title: 'Tri otázky naraz', xp: 30,
      task: 'Napíš <code>async def spracuj_vsetky()</code>, ktorá pre zoznam <code>OTAZKY</code> (aspoň 2 otázky) vytvorí úlohy cez <code>model.ainvoke</code>, počká na ne cez <code>await asyncio.gather(*ulohy)</code> a vráti zoznam odpovedí. Spusti ju cez <code>asyncio.run</code> a výsledky vypíš.',
      starter: `import asyncio
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
OTAZKY = ["Čo je RAG?", "Čo je agent?"]

# tvoj kód...`,
      must: [['async def spracuj_vsetky'], ['model.ainvoke('], ['await asyncio.gather('], ['asyncio.run('], ['print(']],
      hint: 'ulohy = [model.ainvoke(o) for o in OTAZKY], potom odpovede = await asyncio.gather(*ulohy). Hviezdička rozbalí zoznam na argumenty.',
      solution: `import asyncio
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
OTAZKY = ["Čo je RAG?", "Čo je agent?"]

async def spracuj_vsetky():
    ulohy = [model.ainvoke(o) for o in OTAZKY]
    odpovede = await asyncio.gather(*ulohy)
    return [o.content for o in odpovede]

vysledky = asyncio.run(spracuj_vsetky())
for v in vysledky:
    print(v[:60])` }
  ]
};

/* ============================================================
   LEKCIA 40 — Databázy v praxi
   ============================================================ */
window.COURSE.lessons.l40 = {
  id: 'l40', num: 40, section: 's7', icon: '🗄️', duration: '15 min',
  title: 'Databázy pre AI appky: PostgreSQL, Redis, Elasticsearch, MongoDB',
  intro: 'Chroma na notebooku je super na učenie — ale produkčná AI appka stojí na „dospelých" databázach: PostgreSQL na dáta aj vektory, Redis na cache a limity, Elasticsearch na fulltext, MongoDB na dokumenty. Nemusíš byť DBA; musíš vedieť, KTORÚ na ČO — presne to sa pýtajú na pohovore.',
  goals: [
    'Vybrať správnu databázu podľa úlohy (a vedieť výber obhájiť)',
    'Použiť PostgreSQL + pgvector ako produkčný vector store',
    'Nasadiť Redis ako LLM cache a rate limiter',
    'Vedieť, kde sa hodí Elasticsearch (hybrid search) a MongoDB'
  ],
  blocks: [
    { t: 'h', x: 'Štyri databázy, štyri role' },
    { t: 'table', head: ['Databáza', 'Typ', 'V AI appke slúži na', 'Kedy siahnuť po nej'], rows: [
      ['<strong>PostgreSQL</strong>', 'relačná (SQL)', 'používatelia, história chatov, audit, a s <code>pgvector</code> aj embeddingy', 'Default. Máš ju aj tak — a s pgvector netreba ďalší systém'],
      ['<strong>Redis</strong>', 'in-memory (kľúč→hodnota)', 'LLM cache, rate limiting, sessions, fronta úloh', 'Všetko, čo musí byť POD milisekundu a smie sa stratiť'],
      ['<strong>Elasticsearch</strong>', 'fulltext + vektory', 'hybridné vyhľadávanie (BM25 + embeddingy), logy', 'Používatelia hľadajú aj presné výrazy, kódy produktov, mená'],
      ['<strong>MongoDB</strong>', 'dokumentová (JSON)', 'rôznorodé dokumenty bez pevnej schémy, prototypy', 'Dáta majú premenlivú štruktúru a SQL schéma by prekážala'],
    ] },
    { t: 'box', kind: 'key', title: 'Odpoveď na pohovorovú otázku „prečo?"', x: '<strong>PostgreSQL</strong>: transakcie a konzistencia — história chatu a faktúra sa nesmú stratiť. <strong>Redis</strong>: rýchlosť — dáta žijú v RAM, ideálne na cache, ktorú smieš kedykoľvek zahodiť. <strong>Elasticsearch</strong>: invertovaný index — presné slová nájde lepšie než embeddingy. <strong>MongoDB</strong>: flexibilná schéma. Senior odpoveď nie je názov technológie, ale TENTO dôvod.' },
    { t: 'h', x: 'PostgreSQL + pgvector: vektory tam, kde už máš dáta' },
    { t: 'p', x: '<code>pgvector</code> je rozšírenie PostgreSQL, ktoré pridá stĺpec typu <code>vector</code> a podobnostné vyhľadávanie. Výhoda oproti samostatnej vektorovej DB: <strong>jeden systém, jedna záloha, jedny transakcie</strong> — a JOIN medzi vektormi a biznis dátami (napr. „hľadaj len v dokumentoch zákazníka X so statusom aktívny"):' },
    { t: 'pycharm', title: 'pgvector_store.py — produkčný vector store', files: [
      { name: 'pgvector_store.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

load_dotenv()

emb = OpenAIEmbeddings(model="text-embedding-3-small")

db = PGVector(
    embeddings=emb,
    collection_name="firemne_dokumenty",
    connection="postgresql+psycopg://app:heslo@localhost:5432/akademia",
)

db.add_documents(dokumenty)          # embeddingy + metadáta do Postgresu

retriever = db.as_retriever(search_kwargs={
    "k": 4,
    "filter": {"tenant": "firma-a"},  # izolácia z lekcie 36 funguje aj tu
})
print(retriever.invoke("aká je záručná doba?")[0].page_content[:60])` }
    ], output: `Záručná doba na všetky produkty je 24 mesiacov od dátumu ná`,
      note: 'Rozhranie je rovnaké ako pri Chrome (add_documents, as_retriever, filter) — vymenil si len úložisko. Connection string patrí do prostredia, nie do kódu!' },
    { t: 'explain', title: 'Rozbor kódu — PGVector', rows: [
      ['from langchain_postgres import PGVector', 'Oficiálna integrácia LangChainu pre Postgres s pgvector rozšírením.'],
      ['collection_name="firemne_dokumenty"', 'Logická kolekcia — PGVector si v DB spraví tabuľky a kolekcie oddelí.'],
      ['connection="postgresql+psycopg://…"', 'Štandardný connection string: driver, používateľ, heslo, host, port, databáza. V produkcii z env premennej.'],
      ['"filter": {"tenant": "firma-a"}', 'Metadata filtre fungujú rovnako ako v Chrome — bezpečnostné návyky z lekcie 36 sa prenášajú 1:1.'],
    ]},
    { t: 'box', kind: 'tip', title: 'História chatu v Postgrese', x: 'Rovnaká databáza unesie aj históriu konverzácií — tabuľka <code>spravy(session_id, rola, obsah, cas)</code> a máš trvalú pamäť chatbota, ktorú vieš auditovať, mazať (GDPR!) a JOIN-ovať s používateľmi. LangGraph checkpointer má na to hotový <code>PostgresSaver</code>.' },
    { t: 'h', x: 'Redis: cache, ktorá šetrí peniaze, a limity, ktoré chránia' },
    { t: 'pycharm', title: 'redis_vrstvy.py — cache + rate limit', files: [
      { name: 'redis_vrstvy.py', active: true, code: `import redis
from langchain_community.cache import RedisCache
from langchain_core.globals import set_llm_cache

r = redis.Redis(host="localhost", port=6379)

# 1) LLM cache: rovnaký prompt druhýkrát = odpoveď z Redis, 0 tokenov
set_llm_cache(RedisCache(r))

# 2) Rate limit: atomický čítač s expiráciou (funguje aj pri 10 serveroch)
def povoleny_dopyt(pouzivatel: str, limit: int = 10) -> bool:
    kluc = f"rl:{pouzivatel}"
    pocet = r.incr(kluc)          # +1, atomicky naprieč všetkými servermi
    if pocet == 1:
        r.expire(kluc, 60)        # prvé volanie: okno platí 60 sekúnd
    return pocet <= limit

print(povoleny_dopyt("user-1"))
odpoved1 = model.invoke("Čo je LangChain?")   # reálne volanie API
odpoved2 = model.invoke("Čo je LangChain?")   # z cache — zadarmo a hneď` }
    ], output: `True`,
      note: 'Oproti lekcii 37 sa zmenilo úložisko (Redis namiesto pamäte procesu) <b>aj algoritmus</b>: tu ide o <b>pevné (fixed) okno</b> — lacné a jednoduché, ale na hranici okna prepustí až 2× limit (10 dopytov v 59. sekunde + 10 v 61.). Skutočné <b>posuvné okno</b> sa v Redise robí cez sorted set (<code>ZADD</code> + <code>ZREMRANGEBYSCORE</code> + <code>ZCARD</code>), prípadne token bucket.' },
    { t: 'explain', title: 'Rozbor kódu — Redis vrstvy', rows: [
      ['set_llm_cache(RedisCache(r))', 'Globálny prepínač LangChainu: každé invoke sa najprv pozrie do cache. Identický prompt = žiadne API volanie.'],
      ['r.incr(kluc)', 'Atomické +1 — dve súčasné požiadavky sa nikdy nepomýlia v počítaní, ani z rôznych serverov.'],
      ['r.expire(kluc, 60)', 'Kľúč sa po minúte sám zmaže — <strong>pevné (fixed) okno</strong> bez upratovacieho kódu. Pozor: nie je to posuvné okno z lekcie 37, čítač sa vynuluje naraz.'],
      ['pocet <= limit', 'Jednoduchá podmienka; pri prekročení vraciaš 429 Too Many Requests (lekcia 42).'],
    ]},
    { t: 'box', kind: 'warn', title: 'Cache smie zmiznúť, zdroj pravdy nie', x: 'Redis drž ako <strong>vrstvu, o ktorú môžeš prísť</strong> — cache, sessions, čítače. Históriu chatov, audit a čokoľvek nenahraditeľné ukladaj do PostgreSQL. Ak ti pád Redisu zmaže dáta, ktoré chýbajú, mal si ich v Postgrese.' },
    { t: 'h', x: 'Elasticsearch a MongoDB: kedy sa oplatia' },
    { t: 'p', x: '<strong>Elasticsearch</strong> vyniká tam, kde embeddingy zlyhávajú: presné kódy produktov („objednávka #A-4711"), mená, právne formulácie. Produkčný RAG preto často beží <strong>hybridne</strong> — BM25 fulltext + vektorové skóre dokopy (pamätáš na EnsembleRetriever z lekcie 26? Elasticsearch to robí natívne, vo veľkom). <strong>MongoDB</strong> sa hodí, keď dokumenty nemajú jednotnú štruktúru (rôzne formuláre, scrapované dáta) — uložíš JSON tak, ako prišiel, bez migrácií schémy.' },
    { t: 'box', kind: 'key', title: 'Zhrnutie do jednej vety', x: 'Postgres je <strong>zdroj pravdy</strong> (a s pgvector aj vektory), Redis je <strong>rýchla pominuteľná vrstva</strong>, Elasticsearch je <strong>vyhľadávač</strong>, MongoDB je <strong>šuflík na rôznorodé JSON-y</strong>. Keď váhaš — začni Postgresom a pridávaj ostatné, až keď na ich problém narazíš.' },
  ],
  quiz: [
    { q: 'Prečo je pgvector atraktívny oproti samostatnej vektorovej databáze?',
      opts: ['Je rýchlejší vo všetkom', 'Vektory žijú v systéme, ktorý už máš: jedna záloha, transakcie a JOIN s biznis dátami', 'Nepotrebuje embeddingy', 'Je jediný zadarmo'],
      correct: 1, explain: 'Menej systémov = menej prevádzkových starostí. A JOIN medzi vektormi a biznis dátami samostatná vektorová DB nedokáže.' },
    { q: 'Ktoré dáta patria do Redis a ktoré do PostgreSQL?',
      opts: ['Všetko do Redis, je rýchlejší', 'Do Redis pominuteľné (cache, čítače, sessions), do Postgresu zdroj pravdy (história, audit)', 'Všetko do Postgresu', 'Je to jedno'],
      correct: 1, explain: 'Redis žije v RAM a smie sa stratiť. Čo stratiť nesmieš, patrí do relačnej DB s transakciami a zálohou.' },
    { q: 'Prečo r.incr() funguje ako rate limit aj pri 10 kópiách appky za load balancerom?',
      opts: ['Lebo je rýchly', 'Je atomický a zdieľaný — všetky servery inkrementujú ten istý kľúč v Redise', 'Každý server má vlastný čítač', 'Load balancer počíta požiadavky'],
      correct: 1, explain: 'Čítač v pamäti procesu (lekcia 37) vidí len svoj proces. Zdieľaný atomický čítač v Redise vidí všetko — preto je to produkčné riešenie.' },
    { q: 'Kedy siahnuť po Elasticsearch popri vektorovej DB?',
      opts: ['Vždy, je lepší', 'Keď používatelia hľadajú aj presné výrazy (kódy, mená) — hybrid BM25 + vektory', 'Keď je málo dát', 'Na ukladanie obrázkov'],
      correct: 1, explain: 'Embeddingy sú skvelé na význam, slabé na presné reťazce. Hybridné vyhľadávanie kombinuje oboje.' },
    { q: 'Čo je hlavný argument pre MongoDB?',
      opts: ['Najrýchlejšie SQL', 'Flexibilná schéma — dokumenty s premenlivou štruktúrou bez migrácií', 'Vstavaný LLM', 'Nahrádza Redis'],
      correct: 1, explain: 'Dokumentová DB uloží JSON aký príde. Pri pevnej štruktúre a vzťahoch je však Postgres lepšia voľba.' },
  ],
  exercises: [
    { t: 'order', title: 'Vyber databázu podľa úlohy', xp: 25,
      intro: 'Zoraď úlohy v poradí: PostgreSQL → Redis → Elasticsearch → MongoDB.',
      items: [
        'História chatov s auditom a GDPR mazaním',
        'Cache LLM odpovedí a rate limiting naprieč servermi',
        'Hybridné vyhľadávanie: presné kódy produktov + význam',
        'Scrapované JSON dokumenty s premenlivou štruktúrou' ] },
    { t: 'blanks', title: 'Rate limit v Redise', xp: 25,
      intro: 'Doplň atomický čítač s expiráciou.',
      code: `def povoleny_dopyt(pouzivatel, limit=10):
    kluc = f"rl:{pouzivatel}"
    pocet = r.⟦0⟧(kluc)          # atomické +1
    if pocet == 1:
        r.⟦1⟧(kluc, 60)          # okno 60 sekúnd
    return pocet ⟦2⟧ limit`,
      blanks: [['incr'], ['expire'], ['<=']],
      hint: 'Čítač zvyšuje incr, životnosť kľúča nastavuje expire a limit nesmie byť prekročený — teda <=.' },
    { t: 'write', title: 'PGVector s izoláciou', xp: 30,
      task: 'Vytvor <code>PGVector</code> store (parametre <code>embeddings</code>, <code>collection_name</code>, <code>connection</code> — connection string načítaj cez <code>os.getenv("DATABASE_URL")</code>) a z neho retriever s <code>filter</code> podľa tenanta. Vypíš typ retrievera.',
      starter: `import os
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

emb = OpenAIEmbeddings(model="text-embedding-3-small")
# tvoj kód...`,
      must: [['PGVector('], ['collection_name='], ['os.getenv("DATABASE_URL"', "os.getenv('DATABASE_URL'"], ['as_retriever('], ['filter']],
      hint: 'db = PGVector(embeddings=emb, collection_name="dokumenty", connection=os.getenv("DATABASE_URL")) a potom db.as_retriever(search_kwargs={"k": 4, "filter": {"tenant": "firma-a"}}).',
      solution: `import os
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

emb = OpenAIEmbeddings(model="text-embedding-3-small")

db = PGVector(
    embeddings=emb,
    collection_name="firemne_dokumenty",
    connection=os.getenv("DATABASE_URL"),
)

retriever = db.as_retriever(search_kwargs={
    "k": 4,
    "filter": {"tenant": "firma-a"},
})
print(type(retriever).__name__)` }
  ]
};

/* ============================================================
   LEKCIA 41 — CI/CD s GitHub Actions
   ============================================================ */
window.COURSE.lessons.l41 = {
  id: 'l41', num: 41, section: 's7', icon: '🔁', duration: '13 min',
  title: 'CI/CD prakticky: GitHub Actions pre AI appku',
  intro: 'V lekcii 30 si sa naučil princíp CI/CD — teraz si napíšeme skutočnú pipeline. GitHub Actions je YAML súbor v repozitári: push kódu spustí testy, bezpečnostný eval z lekcie 37, build Docker image a nasadenie. Ľudská ruka sa nedotkne ničoho — a presne preto je to spoľahlivé.',
  goals: [
    'Napísať GitHub Actions workflow (on, jobs, steps, needs)',
    'Zaradiť do pipeline testy A bezpečnostný/kvalitatívny eval ako bránu',
    'Bezpečne pracovať s tajomstvami v CI (GitHub Secrets)',
    'Rozumieť pojmom aj v GitLab CI (prenositeľnosť znalostí)'
  ],
  blocks: [
    { t: 'h', x: 'Anatómia workflow' },
    { t: 'p', x: 'Workflow je súbor v <code>.github/workflows/</code>. Skladá sa z <strong>udalosti</strong> (kedy bežať — napr. push do main), <strong>jobov</strong> (bloky práce na čistom stroji) a <strong>krokov</strong> (jednotlivé príkazy). Joby bežia paralelne, pokiaľ ich nezreťazíš cez <code>needs</code>:' },
    { t: 'pycharm', title: '.github/workflows/deploy.yml — celá pipeline', files: [
      { name: 'deploy.yml', active: true, code: `name: Test, eval a nasadenie

on:
  push:
    branches: [main]        # spustí sa pri každom pushi do main

jobs:
  testy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4          # stiahne kód repozitára
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest tests/ -q              # jednotkové testy

  eval:
    needs: testy                           # beží AŽ PO testoch
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: python security_eval.py       # brána z lekcie 37
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}

  nasadenie:
    needs: eval                            # nasadzuje sa len po zelenom evale
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t moja-appka:\${{ github.sha }} .
      - run: ./deploy.sh                   # push do registry + deploy
        env:
          REGISTRY_TOKEN: \${{ secrets.REGISTRY_TOKEN }}` }
    ], output: `✓ testy      (43 s)  pytest: 58 passed
✓ eval       (61 s)  Bezpečnostné skóre: 100 %
✓ nasadenie  (85 s)  image moja-appka:e4f2a91 nasadený`,
      note: 'Tri joby zreťazené cez <b>needs</b>: keď testy alebo eval spadnú, nasadenie sa ani nespustí. Presne takto vyzerá „eval ako brána" v praxi.' },
    { t: 'explain', title: 'Rozbor workflow — riadok po riadku', rows: [
      ['on: push: branches: [main]', 'Udalosť. Ďalšie užitočné: <code>pull_request</code> (kontrola pred merge) a <code>schedule</code> (nočné behy evalov).'],
      ['runs-on: ubuntu-latest', 'Každý job dostane čistý virtuálny stroj — preto si musí sám nainštalovať Python aj závislosti.'],
      ['uses: actions/checkout@v4', 'Hotová akcia z marketplace — stiahne tvoj kód. Bez nej je stroj prázdny.'],
      ['needs: testy', 'Závislosť medzi jobmi: eval čaká na testy, nasadenie na eval. Zlyhanie zastaví reťaz.'],
      ['\${{ secrets.OPENAI_API_KEY }}', 'Tajomstvo z nastavení repozitára (Settings → Secrets). V logoch sa automaticky maskuje. NIKDY kľúč priamo do YAML!'],
      ['github.sha', 'Hash commitu ako tag image — vždy presne vieš, ktorá verzia kódu beží v produkcii (a kam sa vrátiť).'],
    ]},
    { t: 'box', kind: 'warn', title: 'Prečo eval v CI, nie „občas ručne"', x: 'Zmena promptu je zmena správania appky — rovnako riskantná ako zmena kódu. Bez evalu v pipeline sa regresia (horšie odpovede, prelomená obrana) dostane do produkcie potichu. S evalom ako bránou build jednoducho <strong>nezbehne</strong> — a to je celý zmysel CI: stroj stráži to, na čo človek zabudne.' },
    { t: 'h', x: 'Tí istí hráči, iné mená: GitLab CI' },
    { t: 'table', head: ['Pojem', 'GitHub Actions', 'GitLab CI'], rows: [
      ['Definícia', '<code>.github/workflows/*.yml</code>', '<code>.gitlab-ci.yml</code> v koreni repa'],
      ['Blok práce', 'job', 'job (zoskupené do <code>stages</code>)'],
      ['Poradie', '<code>needs:</code>', '<code>stages:</code> poradie + <code>needs:</code>'],
      ['Tajomstvá', 'Settings → Secrets', 'Settings → CI/CD Variables (masked)'],
      ['Hotové kroky', 'marketplace <code>uses:</code>', '<code>include:</code> šablóny'],
    ] },
    { t: 'box', kind: 'tip', title: 'Rollback plán', x: 'Nasadenie nie je hotové, kým nevieš, ako sa VRÁTIŤ. Tagovanie cez <code>github.sha</code> znamená, že rollback = nasadenie predchádzajúceho tagu — jeden príkaz. Nikdy neprepisuj tag <code>latest</code> bez možnosti návratu.' },
    { t: 'box', kind: 'key', title: 'Minimálna zdravá pipeline pre AI appku', x: '<strong>1)</strong> lint + testy (sekundy), <strong>2)</strong> bezpečnostný + kvalitatívny eval (minúty, s malým modelom), <strong>3)</strong> build image s tagom podľa commitu, <strong>4)</strong> deploy na staging, <strong>5)</strong> deploy do produkcie (pokojne s manuálnym schválením — <code>environment: production</code> s required reviewers).' },
  ],
  quiz: [
    { q: 'Čo zabezpečí needs: testy v jobe eval?',
      opts: ['Zrýchli testy', 'Eval sa spustí až po úspešných testoch — pri zlyhaní sa reťaz zastaví', 'Zdieľa premenné medzi jobmi', 'Nič, je to komentár'],
      correct: 1, explain: 'needs vytvára závislosť: joby inak bežia paralelne, s needs sa zreťazia a zlyhanie zastaví pipeline.' },
    { q: 'Kam patrí OPENAI_API_KEY pre CI pipeline?',
      opts: ['Do YAML súboru', 'Do GitHub Secrets (Settings → Secrets) a do workflow cez ${{ secrets.… }}', 'Do README', 'Do názvu jobu'],
      correct: 1, explain: 'Workflow súbor je v repozitári — kľúč v ňom by videl každý. Secrets sa navyše v logoch automaticky maskujú.' },
    { q: 'Prečo tagovať Docker image hashom commitu (github.sha)?',
      opts: ['Je to kratšie', 'Presná stopa: vieš, ktorý kód beží v produkcii, a rollback je nasadenie starého tagu', 'Vyžaduje to Docker', 'Šetrí miesto'],
      correct: 1, explain: 'Tag latest nehovorí nič. Tag podľa commitu dáva dohľadateľnosť a jednoduchý návrat späť.' },
    { q: 'Prečo má byť eval promptov súčasťou pipeline?',
      opts: ['Aby pipeline trvala dlhšie', 'Zmena promptu mení správanie appky — bez brány sa regresia dostane do produkcie potichu', 'Kvôli licencii', 'Evaly sa nedajú spúšťať lokálne'],
      correct: 1, explain: 'Prompt = kód. Eval v CI je regresný test správania: pri poklese skóre build nezbehne.' },
    { q: 'Ako sa volá súbor pipeline v GitLab CI?',
      opts: ['.github/workflows/main.yml', '.gitlab-ci.yml v koreni repozitára', 'Jenkinsfile', 'pipeline.json'],
      correct: 1, explain: 'Rovnaké princípy (joby, stages, variables), iné názvoslovie — znalosti sa prenášajú.' },
  ],
  exercises: [
    { t: 'order', title: 'Pipeline od pushu po produkciu', xp: 25,
      intro: 'Zoraď kroky zdravej CI/CD pipeline pre AI aplikáciu.',
      items: [
        'Push do main spustí workflow',
        'Job testy: lint a pytest na čistom stroji',
        'Job eval: bezpečnostné a kvalitatívne skóre ako brána',
        'Build Docker image s tagom podľa commitu',
        'Nasadenie na staging a po schválení do produkcie' ] },
    { t: 'blanks', title: 'Kostra workflow', xp: 25,
      intro: 'Doplň kľúčové slová GitHub Actions.',
      code: `name: CI

⟦0⟧:
  push:
    branches: [main]

jobs:
  testy:
    runs-on: ubuntu-latest
    steps:
      - ⟦1⟧: actions/checkout@v4
      - run: pytest tests/ -q

  nasadenie:
    ⟦2⟧: testy          # spusti až po testoch
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh`,
      blanks: [['on'], ['uses'], ['needs']],
      hint: 'Udalosť definuje on:, hotovú akciu vkladá uses: a závislosť medzi jobmi needs:.' },
    { t: 'write', title: 'Eval brána pre CI', xp: 30,
      task: 'Napíš skript pre CI: funkcia <code>bezpecnostne_skore(vysledky)</code> vráti percento úspešnosti a na konci skript pri skóre pod 100 vypíše „Nenasadzovať" a skončí cez <code>sys.exit(1)</code> (nenulový kód zhodí pipeline). Otestuj so zoznamom, kde jeden test zlyhal.',
      starter: `import sys

# tvoj kód...`,
      must: [['import sys'], ['def bezpecnostne_skore'], ['sum('], ['sys.exit(1)'], ['print(']],
      hint: 'CI pozná výsledok skriptu podľa exit kódu: 0 = OK, čokoľvek iné = fail. Preto if skore < 100: print(...); sys.exit(1).',
      solution: `import sys

def bezpecnostne_skore(vysledky):
    """Percento útokov, ktoré appka ustála."""
    return sum(vysledky) / len(vysledky) * 100

skore = bezpecnostne_skore([True, True, False])
print(f"Bezpečnostné skóre: {skore:.0f} %")
if skore < 100:
    print("⛔ Nenasadzovať — najprv oprav zlyhania.")
    sys.exit(1)` }
  ]
};

/* ============================================================
   LEKCIA 42 — Architektúra a resilience
   ============================================================ */
window.COURSE.lessons.l42 = {
  id: 'l42', num: 42, section: 's7', icon: '🏛️', duration: '16 min',
  title: 'Architektúra produkčného AI systému: škálovanie, resilience, API design',
  intro: 'OpenAI API má výpadky. Sieť má výpadky. Tvoja appka bude mať výpadky. Rozdiel medzi hračkou a produkčným systémom nie je v tom, či sa niečo pokazí — ale čo sa stane POTOM. Táto lekcia je slovník seniora: stateless, retry s backoffom, circuit breaker, fallback, verzované API, SSE streaming.',
  goals: [
    'Navrhnúť škálovateľnú architektúru (stateless appka, zdieľaný stav v DB)',
    'Implementovať retry s exponenciálnym backoffom a fallback model',
    'Vysvetliť timeout, circuit breaker a graceful degradation',
    'Navrhnúť API: verzovanie, autentifikácia, streaming cez SSE'
  ],
  blocks: [
    { t: 'h', x: 'Škálovanie: prečo appka nesmie mať pamäť' },
    { t: 'p', x: 'Jedna kópia appky unesie desiatky používateľov. Potom pridáš ďalšie kópie za <strong>load balancer</strong> — a tu sa ukáže návrhová chyba: ak si appka drží stav v pamäti (históriu chatu, počítadlá, session), používateľ pri každej požiadavke trafí inú kópiu a stav sa „stratí". Riešenie poznáš z celej tejto sekcie: <strong>appka je stateless</strong> — všetok stav žije v PostgreSQL a Redise, ktoré sú spoločné pre všetky kópie.' },
    { t: 'flow', steps: ['👥 Klienti', '⚖️ Load balancer', '📦 App ×N<br><small>stateless, ľubovoľná kópia</small>', '🧠 LLM API<br><small>OpenAI / Azure</small>', '🗄️ Postgres + Redis<br><small>spoločný stav</small>'] },
    { t: 'box', kind: 'key', title: 'Test statelessness', x: 'Polož si otázku: <strong>„môžem túto kópiu appky kedykoľvek zabiť a spustiť novú bez straty dát?"</strong> Ak áno, škáluješ vodorovne jedným príkazom. Ak nie, nájdi, čo si appka drží v pamäti, a presuň to do Redis/Postgres. (Rate limit z lekcie 37 v pamäti procesu je presne takýto nález — preto sme ho v lekcii 40 presunuli do Redisu.)' },
    { t: 'h', x: 'Resilience: keď LLM API zlyhá' },
    { t: 'p', x: 'Volanie cez sieť môže zlyhať kedykoľvek — a pri LLM API to nie je výnimka, ale režim prevádzky (429 rate limit, 500, timeouty pri špičkách). Odolná appka má pripravenú <strong>kaskádu reakcií</strong>:' },
    { t: 'pycharm', title: 'resilience.py — retry, backoff, fallback', files: [
      { name: 'resilience.py', active: true, code: `import time
import random
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

hlavny = ChatOpenAI(model="gpt-4o", temperature=0, timeout=15)
zalozny = ChatOpenAI(model="gpt-4o-mini", temperature=0, timeout=15)

def s_opakovanim(funkcia, max_pokusov: int = 3):
    """Retry s exponenciálnym backoffom a jitterom."""
    for pokus in range(1, max_pokusov + 1):
        try:
            return funkcia()
        except Exception as e:
            if pokus == max_pokusov:
                raise                              # vyčerpané — pošli vyššie
            cakanie = 2 ** pokus + random.random() # 2s, 4s, 8s… + náhoda
            print(f"Pokus {pokus} zlyhal ({type(e).__name__}), "
                  f"čakám {cakanie:.1f} s")
            time.sleep(cakanie)

def odpovedz(otazka: str) -> str:
    try:
        return s_opakovanim(lambda: hlavny.invoke(otazka).content)
    except Exception:
        # graceful degradation: menší model je lepší než chybová hláška
        return zalozny.invoke(otazka).content + "\\n(záložný model)"

print(odpovedz("Zhrň, čo je RAG, do jednej vety.")[:80])` }
    ], output: `Pokus 1 zlyhal (RateLimitError), čakám 2.7 s
RAG kombinuje vyhľadávanie relevantných dokumentov s generovaním odpovede.`,
      note: 'Tri vrstvy odolnosti v 25 riadkoch: <b>timeout</b> (nečakaj večne), <b>retry s backoffom</b> (skús znova, ale čoraz zdvorilejšie) a <b>fallback</b> (menší model namiesto výpadku).' },
    { t: 'explain', title: 'Rozbor kódu — prečo presne takto', rows: [
      ['timeout=15', 'Bez timeoutu visí požiadavka minúty a vyčerpá ti vlákna. Radšej rýchle zlyhanie a retry.'],
      ['2 ** pokus', 'Exponenciálny backoff: 2, 4, 8 sekúnd. Pri preťažení API je okamžitý retry útok — dlhšie čakanie mu dá vydýchnuť.'],
      ['+ random.random()', 'Jitter: keby 100 serverov čakalo presne 2 s, udrú znova naraz. Náhoda ich rozloží.'],
      ['if pokus == max_pokusov: raise', 'Retry nie je nekonečný — po vyčerpaní pokusov chybu pošli vyššie, nech rozhodne ďalšia vrstva.'],
      ['zalozny.invoke(...)', 'Graceful degradation: horšia odpoveď z gpt-4o-mini je pre používateľa lepšia než „Skúste neskôr".'],
    ]},
    { t: 'box', kind: 'tip', title: 'Circuit breaker — poistka pre opakované zlyhania', x: 'Keď hlavný model zlyhá 10× za minútu, nemá zmysel, aby každá ďalšia požiadavka absolvovala 3 pokusy × 8 sekúnd. <strong>Circuit breaker</strong> po sérii zlyhaní „vyhodí poistku": na pár minút posiela všetko rovno na fallback a hlavný model medzitým občas otestuje. Hotové implementácie circuit breakera: <code>pybreaker</code>, <code>circuitbreaker</code>, <code>purgatory</code>. Na samotný <strong>retry</strong> s backoffom a jitterom použi v produkcii <code>tenacity</code> namiesto vlastného <code>s_opakovanim</code> — pozor, tenacity rieši retry, nie circuit breaker.' },
    { t: 'h', x: 'API design: zmluva s klientmi' },
    { t: 'ul', items: [
      '<strong>Verzuj od prvého dňa</strong> — <code>/v1/chat</code>. Keď o rok zmeníš formát odpovede, spustíš <code>/v2</code> a klienti na v1 sa nerozbijú.',
      '<strong>Autentifikácia</strong> — API kľúč v hlavičke (<code>X-API-Key</code>) ako minimum; OAuth2/JWT, keď máš používateľov. Nikdy kľúč v URL (končí v logoch!).',
      '<strong>Správne stavové kódy</strong> — 401 zlý kľúč, 422 zlý vstup, <strong>429 rate limit</strong> (s hlavičkou <code>Retry-After</code>), 503 preťaženie. Klient podľa nich vie, čo robiť.',
      '<strong>Idempotencia</strong> — klient pošle požiadavku 2× (retry po timeoute); vďaka <code>Idempotency-Key</code> hlavičke nevykonáš akciu dvakrát.',
    ]},
    { t: 'pycharm', title: 'api.py — verzovaný endpoint so streamingom (SSE)', files: [
      { name: 'api.py', active: true, code: `from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os

app = FastAPI(title="AI API", version="1.0")

class Otazka(BaseModel):
    text: str

def over_kluc(x_api_key: str):
    if x_api_key != os.getenv("API_KLUC"):
        raise HTTPException(status_code=401, detail="Neplatný API kľúč")

@app.post("/v1/chat")                    # verzia v ceste od prvého dňa
async def chat(otazka: Otazka, x_api_key: str = Header(...)):
    over_kluc(x_api_key)

    async def generuj():
        async for kusok in chain.astream({"otazka": otazka.text}):
            yield f"data: {kusok}\\n\\n"   # formát Server-Sent Events

    return StreamingResponse(generuj(), media_type="text/event-stream")` }
    ], output: `INFO:     Uvicorn running on http://0.0.0.0:8000
data: RAG
data:  kombinuje
data:  vyhľadávanie...`,
      note: '<b>SSE</b> (Server-Sent Events) je najjednoduchší spôsob streamovania LLM odpovedí do prehliadača — obyčajné HTTP, žiadne WebSockety. Presne takto streamuje aj ChatGPT.' },
    { t: 'box', kind: 'key', title: 'Observability — tri piliere', x: 'V produkcii potrebuješ vidieť dovnútra: <strong>metriky</strong> (počty požiadaviek, latencie p95, cena/deň — Prometheus/Grafana), <strong>logy</strong> (štruktúrované JSON riadky z lekcie 37), <strong>trace</strong> (celá cesta požiadavky — LangSmith pre LLM časť). Alert nastav na symptómy používateľa (chybovosť, latencia), nie na CPU.' },
  ],
  quiz: [
    { q: 'Prečo musí byť appka stateless, keď beží vo viacerých kópiách?',
      opts: ['Šetrí to pamäť', 'Požiadavky používateľa chodia cez load balancer na rôzne kópie — stav v pamäti jednej by sa „strácal"', 'Vyžaduje to Docker', 'Kvôli GDPR'],
      correct: 1, explain: 'Stav (história, sessions, čítače) patrí do zdieľaných služieb (Postgres, Redis) — potom je jedno, ktorá kópia požiadavku obslúži.' },
    { q: 'Načo je jitter (náhodný prídavok) v backoffe?',
      opts: ['Spomaľuje appku', 'Aby stovky klientov po výpadku neudreli na API znova presne naraz', 'Je to chyba v kóde', 'Zvyšuje presnosť'],
      correct: 1, explain: 'Synchronizované retry vytvoria „thundering herd" — vlnu, ktorá preťažené API dorazí. Náhoda vlnu rozloží.' },
    { q: 'Čo je graceful degradation pri LLM appke?',
      opts: ['Pomalé vypnutie servera', 'Pri výpadku hlavného modelu odpovie záložný menší — horšia odpoveď je lepšia než žiadna', 'Zníženie verzie API', 'Vymazanie cache'],
      correct: 1, explain: 'Systém sa nepoloží, ale zhorší službu kontrolovane: fallback model, kratší kontext, odpoveď z cache.' },
    { q: 'Čo robí circuit breaker?',
      opts: ['Vypína server v noci', 'Po sérii zlyhaní prestane volať chorú službu a posiela všetko na fallback, kým sa služba nezotaví', 'Blokuje útočníkov', 'Rozdeľuje záťaž'],
      correct: 1, explain: 'Bez neho každá požiadavka absolvuje plné retry proti mŕtvej službe — poistka šetrí čas aj peniaze a chorej službe dá vydýchnuť.' },
    { q: 'Prečo verzovať API (/v1/chat) od prvého dňa?',
      opts: ['Vyzerá to profesionálne', 'Budúca zmena formátu pôjde do /v2 a existujúci klienti sa nerozbijú', 'FastAPI to vyžaduje', 'Kvôli rýchlosti'],
      correct: 1, explain: 'API je zmluva. Verzia v ceste umožní evolúciu bez rozbitia klientov — dodatočne sa pridáva veľmi bolestivo.' },
  ],
  exercises: [
    { t: 'order', title: 'Kaskáda odolnosti', xp: 25,
      intro: 'Zoraď reakcie systému na zlyhávajúce LLM API od prvej po poslednú.',
      items: [
        'Timeout ukončí visiace volanie po 15 sekundách',
        'Retry s exponenciálnym backoffom a jitterom (2s, 4s, 8s)',
        'Po vyčerpaní pokusov sa použije záložný menší model',
        'Circuit breaker po sérii zlyhaní obíde hlavný model úplne',
        'Monitoring spustí alert pri zvýšenej chybovosti' ] },
    { t: 'blanks', title: 'Retry s backoffom', xp: 25,
      intro: 'Doplň exponenciálne čakanie s jitterom.',
      code: `def s_opakovanim(funkcia, max_pokusov=3):
    for pokus in range(1, max_pokusov + 1):
        try:
            return funkcia()
        except Exception:
            if pokus == max_pokusov:
                ⟦0⟧                        # vyčerpané — chybu vyššie
            cakanie = ⟦1⟧ ** pokus + random.⟦2⟧()
            time.sleep(cakanie)`,
      blanks: [['raise'], ['2'], ['random']],
      hint: 'Chybu znovu vyhodí raise, exponenciálny rast dáva 2 ** pokus a jitter pridáva random.random().' },
    { t: 'write', title: 'Fallback model', xp: 30,
      task: 'Napíš funkciu <code>odpovedz(otazka)</code>, ktorá v bloku <code>try</code> zavolá <code>hlavny.invoke(otazka).content</code> a pri výnimke (<code>except Exception</code>) vráti odpoveď záložného modelu <code>zalozny</code> s dovetkom „(záložný model)". Zavolaj ju a výsledok vypíš.',
      starter: `from langchain_openai import ChatOpenAI

hlavny = ChatOpenAI(model="gpt-4o", timeout=15)
zalozny = ChatOpenAI(model="gpt-4o-mini", timeout=15)

# tvoj kód...`,
      must: [['def odpovedz'], ['try'], ['hlavny.invoke('], ['except Exception'], ['zalozny.invoke(']],
      hint: 'Kostra: try: return hlavny.invoke(...).content, except Exception: return zalozny.invoke(...).content + " (záložný model)". Horšia odpoveď > chybová hláška.',
      solution: `from langchain_openai import ChatOpenAI

hlavny = ChatOpenAI(model="gpt-4o", timeout=15)
zalozny = ChatOpenAI(model="gpt-4o-mini", timeout=15)

def odpovedz(otazka):
    """Graceful degradation: výpadok hlavného modelu skryje záložný."""
    try:
        return hlavny.invoke(otazka).content
    except Exception:
        return zalozny.invoke(otazka).content + " (záložný model)"

print(odpovedz("Zhrň RAG do jednej vety.")[:80])` }
  ]
};

/* ============================================================
   LEKCIA 43 — LlamaIndex
   ============================================================ */
window.COURSE.lessons.l43 = {
  id: 'l43', num: 43, section: 's7', icon: '🦙', duration: '12 min',
  title: 'LlamaIndex — druhý framework, ktorý treba poznať',
  intro: 'Inzeráty píšu „LangChain, LangGraph, LlamaIndex" jedným dychom. LlamaIndex nie je konkurent na zostrelenie — je to framework špecializovaný na dátovú (RAG) časť, ktorý sa s LangChainom pokojne kombinuje. Po tejto lekcii budeš vedieť, čím sa líšia, kedy siahnuť po ktorom a ako vyzerá LlamaIndex kód.',
  goals: [
    'Vysvetliť rozdiel vo filozofii LangChain vs LlamaIndex',
    'Postaviť základný RAG v LlamaIndex (5 riadkov)',
    'Vedieť, kedy zvoliť ktorý framework — a kedy oba naraz',
    'Odpovedať na pohovorovú otázku o ekosystéme frameworkov'
  ],
  blocks: [
    { t: 'h', x: 'Dve filozofie' },
    { t: 'p', x: '<strong>LangChain</strong> je univerzálna stavebnica na orchestráciu: chainy, agenti, nástroje, integrácie — RAG je jedna z vecí, ktoré vieš poskladať. <strong>LlamaIndex</strong> vyrástol opačne: začal ako „GPT Index", knižnica na pripojenie LLM k tvojim dátam — indexovanie, retrieval a dopytovanie má ako <strong>jadro</strong>, nie ako jeden z modulov. Preto je na čistý RAG často stručnejší a má prepracovanejšie indexové štruktúry.' },
    { t: 'compare', a: { title: '🦜 LangChain', items: [
        'Orchestrácia: chainy, agenti, nástroje',
        'LCEL pipe skladanie, obrovský ekosystém',
        'LangGraph na zložité agentické toky',
        'RAG poskladáš z dielov (loader, splitter, retriever…)'
      ]}, b: { title: '🦙 LlamaIndex', items: [
        'Dáta: indexovanie, retrieval, dopyty',
        'RAG „na 5 riadkov" s rozumnými defaultmi',
        'Bohaté indexy: vector, summary, tree, knowledge graph',
        'LlamaHub: stovky konektorov na dátové zdroje'
      ]} },
    { t: 'h', x: 'RAG v LlamaIndex' },
    { t: 'pycharm', title: 'llamaindex_rag.py — celý RAG v pár riadkoch', files: [
      { name: 'llamaindex_rag.py', active: true, code: `from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

load_dotenv()

# 1) Načítaj všetko z priečinka (PDF, txt, docx — vyberie loader sám)
dokumenty = SimpleDirectoryReader("data").load_data()

# 2) Index: rozsekanie, embeddingy, uloženie — všetko s defaultmi
index = VectorStoreIndex.from_documents(dokumenty)

# 3) Query engine: retriever + prompt + syntéza odpovede v jednom
engine = index.as_query_engine(similarity_top_k=4)

odpoved = engine.query("Aká je záručná doba?")
print(odpoved)
print("Zdroje:", [z.metadata["file_name"] for z in odpoved.source_nodes])` }
    ], output: `Záručná doba na všetky produkty je 24 mesiacov od dátumu nákupu.
Zdroje: ['faq.pdf']`,
      note: 'Porovnaj s lekciou 15: v LangChaine si skladal loader + splitter + embeddings + Chroma + retriever + chain. Tu to <b>SimpleDirectoryReader → VectorStoreIndex → as_query_engine</b> spraví s defaultmi. Menej kontroly, rýchlejší štart.' },
    { t: 'explain', title: 'Rozbor kódu — LlamaIndex pojmy', rows: [
      ['SimpleDirectoryReader("data")', 'Načíta celý priečinok a podľa prípon sám vyberie parser — obdoba DirectoryLoader, ale s viac formátmi out-of-the-box.'],
      ['VectorStoreIndex.from_documents(...)', 'Jeden riadok = splitting + embeddingy + uloženie. Interne robí presne to, čo si v lekcii 14 skladal ručne.'],
      ['as_query_engine(similarity_top_k=4)', 'Obdoba retrievera + chainu naraz: nájde top 4 chunky a rovno syntetizuje odpoveď. top_k je „k" z LangChainu.'],
      ['odpoved.source_nodes', 'Citácie zdrojov máš v odpovedi automaticky — v LangChaine si ich vyberal z result["context"].'],
    ]},
    { t: 'h', x: 'Kedy ktorý — a kedy oba' },
    { t: 'table', head: ['Situácia', 'Voľba', 'Prečo'], rows: [
      ['Chatbot s nástrojmi, agenti, zložité toky', '<strong>LangChain / LangGraph</strong>', 'Orchestrácia a stavové grafy sú ich domáca pôda'],
      ['Čistý RAG nad dokumentmi, rýchly štart', '<strong>LlamaIndex</strong>', 'Menej kódu, silné defaulty, bohaté indexy'],
      ['Zložitý retrieval (hierarchie, sumarizačné indexy, grafy)', '<strong>LlamaIndex</strong>', 'Tree/summary/knowledge-graph indexy má hotové'],
      ['Agent (LangGraph), ktorý potrebuje špičkový retrieval', '<strong>Oba</strong>', 'LlamaIndex index zabalíš ako retriever/nástroj do LangChain agenta'],
      ['Firma už má jeden z nich v produkcii', 'ten existujúci', 'Konzistencia tímu > osobná preferencia'],
    ] },
    { t: 'box', kind: 'tip', title: 'Kombinácia v praxi', x: 'Balík <code>llama-index</code> ponúka adaptéry, cez ktoré sa LlamaIndex query engine správa ako LangChain nástroj — agent v LangGraphe potom volá „vyhľadaj v dokumentoch" a pod kapotou beží LlamaIndex. Frameworky sa NEVYLUČUJÚ; senior vie, že otázka nie je „ktorý je lepší", ale „ktorý diel skladačky odkiaľ".' },
    { t: 'box', kind: 'key', title: 'Odpoveď na pohovor', x: '<em>„LangChain používam na orchestráciu a agentov (s LangGraphom pre stavové toky), LlamaIndex poznám ako špecialistu na dátovú vrstvu — na čistý RAG je rýchlejší a má bohatšie indexové štruktúry. Viem ich skombinovať: LlamaIndex ako retrieval nástroj vnútri LangChain agenta. Výber závisí od úlohy a od toho, čo už tím používa."</em> — presne toto chce počuť.' },
  ],
  quiz: [
    { q: 'Aký je základný rozdiel vo filozofii LangChain a LlamaIndex?',
      opts: ['Žiadny, sú identické', 'LangChain je univerzálna orchestrácia (chainy, agenti), LlamaIndex je špecialista na dátovú/RAG vrstvu', 'LlamaIndex je len pre lamy', 'LangChain nepodporuje RAG'],
      correct: 1, explain: 'LangChain skladá aplikácie; LlamaIndex vyrástol z indexovania dát pre LLM — na RAG je stručnejší, na agentov slabší.' },
    { q: 'Čo robí VectorStoreIndex.from_documents(dokumenty)?',
      opts: ['Len uloží texty', 'Rozseká dokumenty, spočíta embeddingy a uloží ich — celý indexačný proces jedným volaním', 'Vytvorí SQL tabuľku', 'Stiahne dokumenty z webu'],
      correct: 1, explain: 'Jeden riadok robí to, čo v LangChaine splitter + embeddings + vector store dokopy — s rozumnými defaultmi.' },
    { q: 'Čo je as_query_engine() v LlamaIndex?',
      opts: ['SQL parser', 'Retriever + prompt + syntéza odpovede v jednom objekte — obdoba retrieval chainu', 'Webový server', 'Embedding model'],
      correct: 1, explain: 'Query engine nájde relevantné uzly a rovno vygeneruje odpoveď aj so zdrojmi (source_nodes).' },
    { q: 'Kedy má zmysel použiť OBA frameworky naraz?',
      opts: ['Nikdy, bijú sa', 'Agent v LangChain/LangGraph volá LlamaIndex query engine ako svoj retrieval nástroj', 'Len pri malých projektoch', 'Keď je málo dát'],
      correct: 1, explain: 'Adaptéry umožnia zabaliť LlamaIndex ako LangChain nástroj — orchestrácia z jedného, dátová vrstva z druhého.' },
    { q: 'Firma už používa LangChain v produkcii. Nový RAG modul píšeš v…?',
      opts: ['LlamaIndex, je novší', 'LangChaine — konzistencia tímu a codebase má prednosť pred osobnou preferenciou', 'Oboch naraz pre istotu', 'Vlastnom frameworku'],
      correct: 1, explain: 'Technologická konzistencia znižuje náklady na údržbu a onboarding — senior rozhoduje aj podľa kontextu tímu, nie len technických parametrov.' },
  ],
  exercises: [
    { t: 'order', title: 'RAG v LlamaIndex krok po kroku', xp: 25,
      intro: 'Zoraď kroky od dokumentov po odpoveď so zdrojmi.',
      items: [
        'SimpleDirectoryReader načíta priečinok s dokumentmi',
        'VectorStoreIndex.from_documents rozseká a zaembeduje',
        'as_query_engine vytvorí dopytovací objekt',
        'engine.query() nájde chunky a syntetizuje odpoveď',
        'odpoved.source_nodes ukáže citované zdroje' ] },
    { t: 'blanks', title: 'Minimálny RAG', xp: 25,
      intro: 'Doplň LlamaIndex triedy a metódy.',
      code: `from llama_index.core import ⟦0⟧, SimpleDirectoryReader

dokumenty = SimpleDirectoryReader("data").⟦1⟧()
index = VectorStoreIndex.⟦2⟧(dokumenty)
engine = index.⟦3⟧(similarity_top_k=4)
print(engine.query("Aká je záruka?"))`,
      blanks: [['VectorStoreIndex'], ['load_data'], ['from_documents'], ['as_query_engine']],
      hint: 'Index je VectorStoreIndex, čítačka vracia dáta cez load_data(), index vzniká z from_documents a dopytuje sa cez as_query_engine.' },
    { t: 'write', title: 'Výber frameworku', xp: 30,
      task: 'Napíš funkciu <code>vyber_framework(uloha)</code>: pre úlohu obsahujúcu „agent" alebo „nástroje" vráti <code>"LangChain + LangGraph"</code>, pre úlohu obsahujúcu „dokument" alebo „rag" (porovnávaj cez <code>.lower()</code>) vráti <code>"LlamaIndex"</code>, inak <code>"LangChain"</code>. Otestuj na dvoch úlohách.',
      starter: `# tvoj kód...`,
      must: [['def vyber_framework'], ['.lower()'], ['LangChain + LangGraph'], ['LlamaIndex'], ['#2:print(']],
      hint: 'Dve podmienky s in a or: najprv agentické signály, potom dátové. Poradie podmienok je dôležité — agentická úloha s dokumentmi je stále agentická.',
      solution: `def vyber_framework(uloha):
    """Heuristika výberu frameworku podľa typu úlohy."""
    u = uloha.lower()
    if "agent" in u or "nástroje" in u:
        return "LangChain + LangGraph"
    if "dokument" in u or "rag" in u:
        return "LlamaIndex"
    return "LangChain"

print(vyber_framework("Agent s nástrojmi na rezervácie"))
print(vyber_framework("RAG nad internými dokumentmi"))` }
  ]
};

/* ============================================================
   LEKCIA 44 — Líderstvo, trade-offy a agile
   ============================================================ */
window.COURSE.lessons.l44 = {
  id: 'l44', num: 44, section: 's7', icon: '🧭', duration: '13 min',
  title: 'Senior zručnosti: trade-offy, ADR, mentoring a agile',
  intro: 'Posledný kus inzerátu nie je o kóde: viesť ľudí, obhájiť rozhodnutia, vysvetliť architektúru biznisu a fungovať v agile. Sú to zručnosti, ktoré sa učia praxou — ale majú svoje remeselné nástroje a slovník, a tie sa naučiť dajú. Táto lekcia ti dá kostru, na ktorú prax nabaľuješ.',
  goals: [
    'Rozhodovať cez explicitné trade-offy a zapisovať ich ako ADR',
    'Vysvetliť technickú vec netechnickému človeku (pravidlo dôsledku)',
    'Poznať Scrum, XP a Lean natoľko, aby si v nich vedel fungovať',
    'Mentorovať cez otázky a code review, nie cez hotové odpovede'
  ],
  blocks: [
    { t: 'h', x: 'Trade-off: neexistuje „najlepšie", existuje „najvhodnejšie"' },
    { t: 'p', x: 'Junior sa pýta „ktorá technológia je najlepšia?" Senior sa pýta <strong>„čo obetujem a čo získam v NAŠEJ situácii?"</strong> Každé rozhodnutie z tohto kurzu bol trade-off: pgvector (jednoduchosť) vs Pinecone (škála), RAG (aktuálnosť) vs fine-tuning (štýl), veľký model (kvalita) vs malý (cena a rýchlosť). Rozhodnutie bez pomenovanej obete je len názor.' },
    { t: 'h', x: 'ADR — pamäť tímu' },
    { t: 'p', x: '<strong>Architecture Decision Record</strong> je krátky dokument (pol strany!) o jednom rozhodnutí: kontext → zvažované možnosti → rozhodnutie → dôsledky. O rok, keď sa nový kolega spýta „prečo tu preboha máme pgvector a nie Pinecone?", odpoveď existuje písomne — aj s dôvodmi, ktoré vtedy platili:' },
    { t: 'pycharm', title: 'docs/adr/001-vektorova-databaza.md', files: [
      { name: '001-vektorova-databaza.md', active: true, code: `# ADR-001: PostgreSQL + pgvector ako vektorový store

## Stav
Prijaté (2026-07-31)

## Kontext
RAG nad ~50 000 internými dokumentmi, tím 4 ľudia bez DevOps
špecialistu. PostgreSQL už beží (používatelia, fakturácia).
Očakávaný rast: ~200 000 dokumentov do 2 rokov.

## Zvažované možnosti
1. pgvector       — rozšírenie existujúceho Postgresu
2. Pinecone       — spravovaná vektorová DB
3. Chroma         — self-host open source

## Rozhodnutie
pgvector.

## Dôvody a trade-offy
+ žiadny nový systém: jedna záloha, jeden monitoring, transakcie
+ JOIN vektorov s biznis dátami (filter na aktívnych zákazníkov)
+ objem do ~1M vektorov zvládne s HNSW indexom bez problémov
- pri >10M vektorov bude treba migrovať (akceptované riziko)
- horšie škálovanie zápisov než Pinecone (náš zápis je ~1k/deň)

## Dôsledky
Retrieval vrstvu píšeme za rozhranie (as_retriever), aby prípadná
migrácia na Pinecone menila jeden modul, nie celú appku.` }
    ], output: `(dokument — ukladá sa do repozitára vedľa kódu, review ako kód)`,
      note: 'Všimni si <b>mínusy v rozhodnutí</b>: dobrý ADR priznáva slabiny zvolenej cesty. A posledná sekcia rovno diktuje architektúru (rozhranie na migráciu) — rozhodnutie a kód sa držia za ruky.' },
    { t: 'explain', title: 'Rozbor ADR — prečo každá sekcia', rows: [
      ['Kontext', 'Čísla a obmedzenia, ktoré platili PRI rozhodovaní. O rok budú iné — a práve preto musí byť zapísané, z čoho sa vychádzalo.'],
      ['Zvažované možnosti', 'Dôkaz, že sa nešlo na prvý nápad. Stačia 2–3 reálne alternatívy.'],
      ['+ a − pri rozhodnutí', 'Explicitný trade-off. ADR bez mínusov je marketing, nie inžinierstvo.'],
      ['Dôsledky', 'Čo z rozhodnutia vyplýva pre kód a tím — vrátane prijatých rizík a únikovej cesty.'],
    ]},
    { t: 'h', x: 'Vysvetľovanie biznisu: pravidlo dôsledku' },
    { t: 'p', x: 'Stakeholder nepotrebuje vedieť, ČO je Redis — potrebuje vedieť, <strong>čo to preňho znamená</strong>. Preklad robíš vždy rovnako: technická vec → dôsledok v peniazoch, čase alebo riziku.' },
    { t: 'compare', a: { title: '❌ Inžiniersky', items: [
        '„Nasadíme Redis cache pre LLM volania"',
        '„pgvector má HNSW index"',
        '„Chýba nám eval pipeline"',
        '„API nemá rate limiting"'
      ]}, b: { title: '✅ Jazykom dôsledkov', items: [
        '„Opakované otázky budú zadarmo — ušetríme ~30 % nákladov na AI"',
        '„Vyhľadávanie ostane rýchle aj pri 10× viac dokumentoch"',
        '„Zmeny bota púšťame naslepo — toto je poistka proti zhoršeniu"',
        '„Jeden zákazník nám dnes vie vyčerpať celý mesačný rozpočet"'
      ]} },
    { t: 'h', x: 'Agile: Scrum, XP, Lean za tri minúty' },
    { t: 'table', head: ['Rámec', 'Jadro', 'Čo si z neho vezmeš pri AI projekte'], rows: [
      ['<strong>Scrum</strong>', 'šprinty (1–4 týždne), backlog, denný standup, retro', 'Rytmus a priorizácia. AI úlohy odhaduj opatrne — experiment sa nedá naplánovať presne, časti radšej time-boxni'],
      ['<strong>XP</strong>', 'párové programovanie, TDD, continuous integration, malé release', 'Technická disciplína: testy a CI (lekcia 41) sú XP dedičstvo. Pri promptoch: eval-driven development'],
      ['<strong>Lean</strong>', 'eliminuj plytvanie, malé dávky, meraj → uč sa', 'MVP myslenie: najmenší experiment, ktorý overí hodnotu — jeden prompt + eval skôr než platforma na pol roka'],
    ] },
    { t: 'box', kind: 'tip', title: 'AI špecifikum v agile', x: 'Klasická úloha: „hotové = prešli testy". AI úloha: „hotové = eval skóre ≥ X na golden datasete". Definíciu hotového (Definition of Done) pre AI featury doplň o merateľné kritérium kvality — inak sa „ešte doladím prompt" nikdy neskončí.' },
    { t: 'h', x: 'Mentoring: otázky namiesto odpovedí' },
    { t: 'ul', items: [
      '<strong>Code review ako učebňa</strong> — namiesto „prepíš to na abatch" napíš „čo sa stane, keď príde 100 dokumentov naraz?" Nájde riešenie sám a nabudúce otázku nepotrebuje.',
      '<strong>Nechaj bezpečne zlyhať</strong> — na stagingu, s časovým limitom. Skúsenosť z vlastnej chyby > tvoja prednáška.',
      '<strong>Zdieľaj kontext, nie príkazy</strong> — „zákazník má dáta v EÚ, preto Azure" učí rozhodovanie; „použi Azure" učí poslušnosť.',
      '<strong>Pravidelnosť</strong> — 30 minút 1:1 týždenne s vlastnou agendou juniora zmôže viac než občasný hodinový výklad.',
    ]},
    { t: 'box', kind: 'key', title: 'Senior checklist na pohovor', x: 'Priprav si <strong>tri príbehy</strong>: (1) rozhodnutie s trade-offom, ktoré si obhájil — vrátane toho, čo si obetoval; (2) situácia, keď si zmenil názor pod váhou argumentov; (3) človek, ktorého si vytiahol hore, a ako. Toto je „leading engineers" v praxi — nie titul v podpise.' },
  ],
  quiz: [
    { q: 'Čo odlišuje seniorské rozhodnutie od juniorského?',
      opts: ['Vždy vyberie novšiu technológiu', 'Explicitne pomenuje trade-off: čo získavam a čo obetujem v danom kontexte', 'Rozhoduje rýchlejšie', 'Vždy vyberie osvedčenú klasiku'],
      correct: 1, explain: '„Najlepšia technológia" neexistuje — existuje najvhodnejšia pre daný kontext, a ten treba pomenovať aj s obeťami.' },
    { q: 'Čo je ADR?',
      opts: ['Diagram architektúry', 'Krátky dokument o jednom rozhodnutí: kontext, možnosti, rozhodnutie s + aj −, dôsledky', 'Zápisnica z porady', 'Automatický report'],
      correct: 1, explain: 'Architecture Decision Record — pamäť tímu. Odpovedá na budúce „prečo sme to preboha spravili takto?".' },
    { q: 'Ako povieš stakeholderovi, že chcete pridať Redis cache?',
      opts: ['„Nasadíme in-memory key-value store"', '„Opakované otázky budú zadarmo — ušetríme asi 30 % nákladov na AI"', '„Je to industry standard"', 'Nepoviem, je to technický detail'],
      correct: 1, explain: 'Pravidlo dôsledku: technická vec → dopad v peniazoch, čase alebo riziku. To je jazyk, v ktorom sa stakeholder rozhoduje.' },
    { q: 'Čím doplníš Definition of Done pre AI featuru?',
      opts: ['Ničím, stačia testy', 'Merateľným kritériom kvality: eval skóre ≥ X na golden datasete', 'Schválením marketingu', 'Screenshotom odpovede'],
      correct: 1, explain: 'Bez merateľného kritéria sa „doladím prompt" nikdy neskončí — a nikto nevie povedať, či je featura hotová.' },
    { q: 'Junior poslal kód so sekvenčným spracovaním 100 dokumentov. Najlepšia mentoringová reakcia?',
      opts: ['Prepísať mu to', '„Čo sa stane, keď príde 100 dokumentov naraz?" — otázka, ktorá ho dovedie k riešeniu', 'Schváliť, nech sa učí z produkcie', 'Poslať mu dokumentáciu asyncio'],
      correct: 1, explain: 'Otázky budujú úsudok; hotové odpovede budujú závislosť. (A produkcia nie je učebňa — na to je staging.)' },
  ],
  exercises: [
    { t: 'order', title: 'Sekcie ADR v správnom poradí', xp: 25,
      intro: 'Zoraď časti Architecture Decision Record.',
      items: [
        'Stav (návrh / prijaté / nahradené)',
        'Kontext: čísla a obmedzenia platné pri rozhodovaní',
        'Zvažované možnosti (2–3 reálne alternatívy)',
        'Rozhodnutie s plusmi AJ mínusmi',
        'Dôsledky pre kód, tím a prijaté riziká' ] },
    { t: 'blanks', title: 'Preklad pre stakeholdera', xp: 25,
      intro: 'Doplň prekladovú funkciu podľa pravidla dôsledku.',
      code: `PREKLADY = {
    "redis_cache": "Opakované otázky budú zadarmo — ušetríme ~30 % nákladov.",
    "eval_pipeline": "Poistka, že zmeny bota nezhoršia odpovede zákazníkom.",
}

def pre_biznis(technicka_vec):
    return PREKLADY.⟦0⟧(technicka_vec,
        "Technický základ — rád vysvetlím ⟦1⟧, čo znamená pre náklady.")

print(pre_biznis("⟦2⟧"))`,
      blanks: [['get'], ['osobne'], ['redis_cache']],
      hint: 'Bezpečné čítanie s náhradou je .get(kľúč, default); ako ukážku vypíš preklad pre redis_cache.' },
    { t: 'write', title: 'Rozhodnutie s trade-offom', xp: 30,
      task: 'Vytvor slovník <code>MOZNOSTI</code>, kde každá možnosť (napr. <code>"pgvector"</code>, <code>"pinecone"</code>) má slovník s kľúčmi <code>"plusy"</code>, <code>"minusy"</code> (zoznamy) a <code>"skore"</code> (číslo). Napíš funkciu <code>odporuc()</code>, ktorá vráti možnosť s najvyšším skóre cez <code>max(..., key=...)</code>, a vypíš ju aj s mínusmi — rozhodnutie bez priznaných mínusov je len názor.',
      starter: `# tvoj kód...`,
      must: [['MOZNOSTI'], ['plusy'], ['minusy'], ['def odporuc'], ['max(']],
      hint: 'max(MOZNOSTI, key=lambda m: MOZNOSTI[m]["skore"]) vráti kľúč s najvyšším skóre. Pri výpise ukáž aj MOZNOSTI[vitaz]["minusy"] — priznanie slabín je podstata ADR.',
      solution: `MOZNOSTI = {
    "pgvector": {"plusy": ["jeden systém", "JOIN s dátami"],
                  "minusy": ["migrácia pri >10M vektorov"], "skore": 8},
    "pinecone": {"plusy": ["škáluje samo"],
                  "minusy": ["ďalší systém", "cena"], "skore": 6},
}

def odporuc():
    """Vráti možnosť s najvyšším skóre."""
    return max(MOZNOSTI, key=lambda m: MOZNOSTI[m]["skore"])

vitaz = odporuc()
print(f"Odporúčanie: {vitaz}")
print(f"Priznané mínusy: {MOZNOSTI[vitaz]['minusy']}")` }
  ]
};
