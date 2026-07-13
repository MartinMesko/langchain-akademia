/* ============================================================
   OBSAH KURZU — Sekcie + Lekcie 1–5 (Základy LangChain)
   Podľa kurzu: LangChain — Inteligentné aplikácie s ChatGPT (Skillmea)
   ============================================================ */
window.COURSE = {
  sections: [
    {
      id: 's1', icon: '🧱', color: '#8b5cf6',
      title: 'Základy LangChain',
      subtitle: 'Modely, prompty, messages, chainy, parsery, LCEL, tools a agenty — kompletný stavebný základ.',
      lessons: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9']
    },
    {
      id: 's2', icon: '📚', color: '#22d3ee',
      title: 'RAG — Retrieval-Augmented Generation',
      subtitle: 'Nauč model odpovedať z TVOJICH dokumentov: loaders, splitters, embeddingy, vektorové databázy a retrievery.',
      lessons: ['l10', 'l11', 'l12', 'l13', 'l14', 'l15']
    },
    {
      id: 's3', icon: '💬', color: '#34d399',
      title: 'ChatBoty',
      subtitle: 'Od jednoduchej slučky cez pamäť až po plnohodnotný RAG chatbot, ktorý si pamätá konverzáciu.',
      lessons: ['l16', 'l17', 'l18', 'l19']
    },
    {
      id: 's4', icon: '🚀', color: '#fbbf24',
      title: 'Nasadenie a nástroje',
      subtitle: 'Streamlit UI, lokálne LLM cez Ollama, monitoring s LangSmith a deployment cez LangServe.',
      lessons: ['l20', 'l21', 'l22', 'l23']
    }
  ],
  lessons: {}
};

/* ============================================================
   LEKCIA 1 — Setup vývojového prostredia
   ============================================================ */
window.COURSE.lessons.l1 = {
  id: 'l1', num: 1, section: 's1', icon: '🛠️', duration: '7 min',
  title: 'Setup vývojového prostredia',
  intro: 'Skôr než napíšeme prvý riadok inteligentnej aplikácie, pripravíme si profesionálne vývojové prostredie — presne tak, ako sa to robí v praxi: PyCharm, virtuálne prostredie, knižnice a bezpečne uložený API kľúč.',
  goals: [
    'Vytvoriť nový projekt v PyCharme s virtuálnym prostredím (venv)',
    'Nainštalovať LangChain a všetky potrebné knižnice cez pip',
    'Získať OpenAI API kľúč a bezpečne ho uložiť do súboru .env',
    'Overiť, že všetko funguje, prvým spusteným skriptom'
  ],
  blocks: [
    { t: 'h', x: 'Čo budeme potrebovať' },
    { t: 'p', x: 'LangChain je <strong>Python knižnica</strong>, ktorá ti umožní skladať aplikácie nad veľkými jazykovými modelmi (LLM) ako stavebnicu — namiesto stoviek riadkov kódu okolo API napíšeš pár elegantných riadkov. Celý kurz budeme pracovať v <strong>PyCharme</strong>, najpopulárnejšom IDE pre Python.' },
    { t: 'ul', items: [
      '<strong>Python 3.10+</strong> — stiahni z <code>python.org</code> (pri inštalácii na Windows zaškrtni „Add to PATH")',
      '<strong>PyCharm</strong> — stačí bezplatná verzia Community Edition z <code>jetbrains.com/pycharm</code>',
      '<strong>OpenAI účet</strong> — na <code>platform.openai.com</code> si vygeneruješ API kľúč (potrebný malý kredit, ~5 $ vystačí na celý kurz)'
    ]},
    { t: 'h', x: 'Krok 1: Nový projekt v PyCharme' },
    { t: 'p', x: 'Otvor PyCharm a klikni na <strong>New Project</strong>. Pomenuj ho napríklad <code>langchain_kurz</code>. PyCharm automaticky ponúkne vytvorenie <strong>virtuálneho prostredia</strong> (venv) — nechaj túto voľbu zapnutú. Po potvrdení sa vytvorí priečinok projektu a v ňom skrytý priečinok <code>.venv</code>.' },
    { t: 'box', kind: 'info', title: 'Prečo virtuálne prostredie?', x: 'Venv je <strong>izolovaná „krabička" s knižnicami</strong> len pre tento projekt. Keď nainštaluješ LangChain do venv, neovplyvní to ostatné projekty ani systémový Python. Každý projekt tak môže mať vlastné verzie knižníc — bez konfliktov. V praxi je venv štandard, bez ktorého sa nezaobíde žiadny tím.' },
    { t: 'h', x: 'Krok 2: Inštalácia knižníc' },
    { t: 'p', x: 'V spodnej lište PyCharmu otvor záložku <strong>Terminal</strong> (PyCharm v ňom automaticky aktivuje tvoje venv — spoznáš to podľa <code>(.venv)</code> na začiatku riadku) a spusti inštaláciu:' },
    { t: 'pycharm', title: 'Terminal — inštalácia knižníc', terminal: true, files: [
      { name: 'Terminal', code: `(.venv) langchain_kurz % pip install langchain langchain-openai python-dotenv` }
    ], output: `Collecting langchain
  Downloading langchain-0.3.25-py3-none-any.whl (1.0 MB)
Collecting langchain-openai
  Downloading langchain_openai-0.3.18-py3-none-any.whl (63 kB)
Collecting python-dotenv
  Downloading python_dotenv-1.1.0-py3-none-any.whl (20 kB)
Installing collected packages: python-dotenv, langchain-core, openai, langchain-openai, langchain
Successfully installed langchain-0.3.25 langchain-openai-0.3.18 python-dotenv-1.1.0`,
      note: '<b>langchain</b> = jadro knižnice · <b>langchain-openai</b> = napojenie na modely OpenAI · <b>python-dotenv</b> = načítavanie API kľúčov zo súboru .env' },
    { t: 'h', x: 'Krok 3: OpenAI API kľúč' },
    { t: 'p', x: 'Choď na <code>platform.openai.com</code> → <strong>API keys</strong> → <strong>Create new secret key</strong>. Kľúč začínajúci <code>sk-...</code> si hneď skopíruj — OpenAI ti ho ukáže <strong>iba raz</strong>. V koreňovom priečinku projektu vytvor súbor s názvom <code>.env</code> (pravý klik na projekt → New → File) a kľúč vlož doň.' },
    { t: 'box', kind: 'warn', title: 'Bezpečnosť na prvom mieste', x: 'API kľúč <strong>nikdy nepíš priamo do kódu</strong> a nikdy ho nenahrávaj na GitHub! Každé volanie modelu sa účtuje z tvojho kreditu — uniknutý kľúč môže ktokoľvek zneužiť. Súbor <code>.env</code> patrí do <code>.gitignore</code>. Toto je najčastejšia začiatočnícka chyba.' },
    { t: 'h', x: 'Krok 4: Prvý skript — overenie' },
    { t: 'p', x: 'Vytvor súbor <code>main.py</code> a over, že sa API kľúč správne načíta. Funkcia <code>load_dotenv()</code> prečíta súbor <code>.env</code> a vloží jeho obsah medzi premenné prostredia — odtiaľ si ho LangChain neskôr automaticky vezme. Klikni na zelené ▶ v PyCharme:' },
    { t: 'pycharm', title: 'main.py — overenie setupu', files: [
      { name: '.env', code: `OPENAI_API_KEY=sk-proj-Ab3xK9...TVOJ_KLUC...9fQ2` },
      { name: 'main.py', active: true, code: `import os
from dotenv import load_dotenv

# Načíta premenné zo súboru .env do prostredia
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if api_key:
    print("API kľúč úspešne načítaný!")
    print("Začína sa:", api_key[:10] + "...")
else:
    print("Kľúč sa nenašiel — skontroluj súbor .env")` }
    ], output: `API kľúč úspešne načítaný!
Začína sa: sk-proj-Ab...` },
    { t: 'box', kind: 'tip', title: 'Štruktúra projektu', x: 'Po setupu by tvoj projekt mal vyzerať takto: <code>langchain_kurz/</code> obsahuje <code>.venv/</code> (knižnice), <code>.env</code> (tajný kľúč) a <code>main.py</code> (kód). Presne túto štruktúru uvidíš v ľavom paneli PyCharmu počas celého kurzu.' }
  ],
  quiz: [
    { q: 'Prečo vytvárame pre projekt virtuálne prostredie (venv)?',
      opts: ['Aby program bežal rýchlejšie', 'Aby boli knižnice projektu izolované a neovplyvňovali iné projekty', 'Je to povinnosť Pythonu — bez venv kód nebeží', 'Aby sme nemuseli inštalovať Python'],
      correct: 1, explain: 'Venv izoluje závislosti: každý projekt má vlastné verzie knižníc. Kód beží aj bez venv, ale skôr či neskôr narazíš na konflikt verzií medzi projektmi.' },
    { q: 'Kam patrí OpenAI API kľúč?',
      opts: ['Priamo do main.py ako premenná', 'Do komentára na začiatku súboru', 'Do súboru .env, ktorý nikdy nezdieľame', 'Do názvu projektu'],
      correct: 2, explain: 'Kľúč ukladáme do .env a načítavame cez load_dotenv(). Kód tak môžeš zdieľať bez rizika — kľúč ostáva len u teba.' },
    { q: 'Ktorý príkaz nainštaluje LangChain spolu s podporou OpenAI modelov?',
      opts: ['pip install langchain-all', 'pip install langchain langchain-openai', 'python install langchain', 'pip get langchain + openai'],
      correct: 1, explain: 'Jadro knižnice je balík langchain, integrácia s OpenAI je v samostatnom balíku langchain-openai. Integrácie sú zámerne oddelené, aby si inštaloval len to, čo používaš.' },
    { q: 'Čo presne robí funkcia load_dotenv()?',
      opts: ['Stiahne najnovšiu verziu LangChain', 'Prihlási ťa do OpenAI účtu', 'Načíta premenné zo súboru .env do premenných prostredia', 'Vytvorí nový .env súbor'],
      correct: 2, explain: 'load_dotenv() prečíta riadky KEY=hodnota zo súboru .env a sprístupní ich cez os.getenv(). LangChain si potom OPENAI_API_KEY nájde automaticky.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Doplň setup skript', xp: 20,
      intro: 'Doplň chýbajúce časti kódu, ktorý načíta API kľúč zo súboru <code>.env</code> a overí ho.',
      code: `# V terminále: pip ⟦0⟧ langchain langchain-openai python-dotenv

import os
from dotenv import ⟦1⟧

⟦2⟧()  # prečíta súbor .env

api_key = os.⟦3⟧("OPENAI_API_KEY")
print("OK!" if api_key else "Kľúč chýba!")`,
      blanks: [['install'], ['load_dotenv'], ['load_dotenv'], ['getenv']],
      hint: 'Knižnice inštalujeme cez „pip install …". Z knižnice dotenv importujeme funkciu load_dotenv a hneď ju aj zavoláme. Hodnotu premennej prostredia číta os.getenv().' },
    { t: 'order', title: 'Zoraď kroky setupu', xp: 20,
      intro: 'Zoraď kroky prípravy prostredia presne v poradí, v akom ich robíme v praxi.',
      items: [
        'Nainštaluj Python a PyCharm',
        'Vytvor nový projekt s virtuálnym prostredím (venv)',
        'V terminále: pip install langchain langchain-openai python-dotenv',
        'Vygeneruj API kľúč na platform.openai.com',
        'Vytvor súbor .env a vlož doň OPENAI_API_KEY',
        'V main.py zavolaj load_dotenv() a over kľúč' ] },
    { t: 'write', title: 'Napíš overovací skript', xp: 30,
      intro: 'Prvá samostatná úloha — napíš si vlastný overovací skript presne ako v PyCharme.',
      task: 'Napíš kód, ktorý: 1) importuje <code>load_dotenv</code> z knižnice <code>dotenv</code>, 2) zavolá ju, 3) cez <code>os.getenv()</code> načíta premennú <code>OPENAI_API_KEY</code> do premennej a 4) vypíše ju cez <code>print()</code>.',
      starter: `import os
# tvoj kód...`,
      must: [['from dotenv import load_dotenv'], ['load_dotenv()'], ['os.getenv'], ['print(']],
      hint: 'Postupuj presne podľa ukážky z lekcie: import → load_dotenv() → os.getenv("OPENAI_API_KEY") → print.',
      solution: `import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)` }
  ]
};

/* ============================================================
   LEKCIA 2 — LLM modely a chatmodely
   ============================================================ */
window.COURSE.lessons.l2 = {
  id: 'l2', num: 2, section: 's1', icon: '🧠', duration: '10 min',
  title: 'LLM modely a chatmodely',
  intro: 'Srdcom každej inteligentnej aplikácie je jazykový model. LangChain rozlišuje dva druhy — klasické LLM a chatmodely. Naučíš sa ich vytvoriť, nastaviť ich „kreativitu" a poslať im prvú správu.',
  goals: [
    'Pochopiť rozdiel medzi LLM (text → text) a chatmodelom (správy → správa)',
    'Vytvoriť inštanciu ChatOpenAI a zavolať ju cez invoke()',
    'Ovládať parametre model, temperature a max_tokens',
    'Čítať odpoveď modelu: content aj metadáta o tokenoch',
    'Streamovať odpoveď po kúskoch ako v ChatGPT'
  ],
  blocks: [
    { t: 'h', x: 'Dva druhy modelov' },
    { t: 'p', x: 'LangChain pracuje s dvoma typmi jazykových modelov. <strong>LLM</strong> je „dokončovač textu": pošleš mu čistý reťazec a on naň nadviaže. <strong>Chatmodel</strong> je novšia generácia: komunikuje cez <strong>správy s rolami</strong> (system, human, AI) — presne ako ChatGPT. Prakticky všetky moderné modely (GPT-4o, Claude, Gemini, Llama) sú chatmodely.' },
    { t: 'compare', a: { title: '📜 LLM (textový model)', items: [
        'Vstup: obyčajný string',
        'Výstup: obyčajný string',
        'Trieda: <code>OpenAI</code> z <code>langchain_openai</code>',
        'Napr. starší model gpt-3.5-turbo-instruct',
        'Dnes už skôr historická kategória'
      ]}, b: { title: '💬 Chatmodel', items: [
        'Vstup: zoznam správ (alebo string pre pohodlie)',
        'Výstup: objekt <code>AIMessage</code>',
        'Trieda: <code>ChatOpenAI</code> z <code>langchain_openai</code>',
        'Napr. gpt-4o-mini, gpt-4o',
        'Štandard pre všetky moderné aplikácie'
      ]} },
    { t: 'p', x: 'V celom kurze budeme používať <strong>chatmodely</strong> — konkrétne <code>gpt-4o-mini</code>, ktorý je rýchly, lacný a pre naše účely viac než dostatočný. Pozri, aké jednoduché je poslať modelu prvú otázku:' },
    { t: 'pycharm', title: 'main.py — prvé volanie chatmodelu', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

# Vytvoríme chatmodel — API kľúč si vezme z prostredia sám
model = ChatOpenAI(model="gpt-4o-mini")

# invoke() = pošli vstup a počkaj na celú odpoveď
odpoved = model.invoke("Vysvetli jednou vetou, čo je LangChain.")

print(odpoved.content)` }
    ], output: `LangChain je open-source knižnica, ktorá umožňuje jednoducho prepájať veľké jazykové modely s dátami, nástrojmi a logikou do funkčných aplikácií.` },
    { t: 'box', kind: 'key', title: 'Kľúčová metóda: invoke()', x: '<code>invoke()</code> je univerzálne „spusti" v celom LangChaine. Volá sa ňou model, prompt, chain aj agent. Zapamätaj si ju — budeš ju používať doslova všade.' },
    { t: 'h', x: 'Čo model vlastne vrátil? AIMessage' },
    { t: 'p', x: 'Chatmodel nevracia obyčajný text, ale objekt <code>AIMessage</code>. Samotný text odpovede je v atribúte <code>.content</code>, ale vo vnútri nájdeš aj cenné <strong>metadáta</strong> — napríklad počet spotrebovaných tokenov (a teda cenu volania):' },
    { t: 'pycharm', title: 'main.py — metadáta odpovede', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

odpoved = model.invoke("Pozdrav ma po slovensky.")

print("Text:", odpoved.content)
print("Typ objektu:", type(odpoved).__name__)
print("Tokeny:", odpoved.response_metadata["token_usage"]["total_tokens"])` }
    ], output: `Text: Ahoj! Prajem ti krásny deň!
Typ objektu: AIMessage
Tokeny: 31`,
      note: '<b>Token</b> ≈ kúsok slova (slovenské slovo má typicky 2–4 tokeny). OpenAI účtuje presne podľa počtu tokenov na vstupe aj výstupe.' },
    { t: 'h', x: 'Parametre modelu' },
    { t: 'p', x: 'Správanie modelu ladíš parametrami pri jeho vytváraní. Najdôležitejší je <code>temperature</code> — riadi mieru náhodnosti (kreativity) odpovedí:' },
    { t: 'table', head: ['Parameter', 'Čo robí', 'Typické hodnoty'], rows: [
      ['<code>model</code>', 'Ktorý model sa použije', '<code>"gpt-4o-mini"</code>, <code>"gpt-4o"</code>'],
      ['<code>temperature</code>', 'Náhodnosť: 0 = vždy rovnaká, vecná odpoveď; 2 = maximálna kreativita (a chaos)', '0 pre fakty a extrakciu, 0.7–1.0 pre kreatívny text'],
      ['<code>max_tokens</code>', 'Strop dĺžky odpovede — ochrana pred dlhými (drahými) výstupmi', 'napr. <code>500</code>'],
      ['<code>timeout</code>', 'Maximálny čas čakania na odpoveď', 'napr. <code>30</code>']
    ] },
    { t: 'pycharm', title: 'main.py — experiment s temperature', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

presny = ChatOpenAI(model="gpt-4o-mini", temperature=0)
kreativny = ChatOpenAI(model="gpt-4o-mini", temperature=1.4, max_tokens=60)

otazka = "Vymysli názov pre kaviareň pre programátorov."

print("T=0  :", presny.invoke(otazka).content)
print("T=1.4:", kreativny.invoke(otazka).content)` }
    ], output: `T=0  : Kód & Káva
T=1.4: Espresso Exception — kde sa výnimky zachytávajú s penou` },
    { t: 'box', kind: 'tip', title: 'Kedy akú teplotu?', x: 'Extrakcia dát, klasifikácia, odpovede z dokumentov (RAG) → <strong>temperature=0</strong>. Marketingové texty, brainstorming, príbehy → <strong>0.7 a viac</strong>. Keď si nie si istý, začni na 0 — deterministické správanie sa ľahšie ladí.' },
    { t: 'h', x: 'Streamovanie odpovede' },
    { t: 'p', x: 'Poznáš to z ChatGPT — odpoveď „nabieha" po slovách. To je <strong>streaming</strong>: namiesto čakania na celú odpoveď dostávaš kúsky (chunky) hneď, ako ich model generuje. V LangChaine stačí vymeniť <code>invoke()</code> za <code>stream()</code>:' },
    { t: 'pycharm', title: 'main.py — streamovanie', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

# stream() vracia generátor chunkov
for chunk in model.stream("Napíš krátku báseň o Pythone."):
    print(chunk.content, end="", flush=True)` }
    ], output: `Python syčí potichu,
v riadkoch nájdeš útechu.
Bez zložených zátvoriek
píšeš kód jak veršíkov.`,
      note: 'V konzole text reálne nabieha po kúskoch — <b>end=""</b> zabráni novému riadku po každom chunku a <b>flush=True</b> ho okamžite vypíše.' }
  ],
  quiz: [
    { q: 'Aký je hlavný rozdiel medzi LLM a chatmodelom?',
      opts: ['Chatmodel je vždy zadarmo', 'LLM pracuje s čistým textom, chatmodel so správami s rolami', 'LLM je novší typ modelu', 'Chatmodel nevie generovať text'],
      correct: 1, explain: 'LLM = text dnu, text von. Chatmodel = správy (system/human/AI) dnu, AIMessage von. Moderné modely sú prakticky všetky chatmodely.' },
    { q: 'Čo spôsobí nastavenie temperature=0?',
      opts: ['Model odpovedá pomalšie', 'Model odmietne kreatívne úlohy', 'Odpovede budú maximálne deterministické a vecné', 'Model použije menej tokenov'],
      correct: 2, explain: 'Temperature 0 = model vyberá vždy najpravdepodobnejšie tokeny → stabilné, opakovateľné odpovede. Ideálne pre fakty, extrakciu a RAG.' },
    { q: 'Akého typu je objekt, ktorý vráti chat_model.invoke("Ahoj")?',
      opts: ['str', 'dict', 'AIMessage', 'HumanMessage'],
      correct: 2, explain: 'Chatmodel vracia AIMessage — text je v .content a metadáta (tokeny, model…) v .response_metadata.' },
    { q: 'Ktorým riadkom správne vytvoríš model gpt-4o-mini?',
      opts: ['model = OpenAI("gpt-4o-mini")', 'model = ChatOpenAI(model="gpt-4o-mini")', 'model = LangChain(model="gpt-4o-mini")', 'model = GPT4Mini()'],
      correct: 1, explain: 'Chatmodely OpenAI vytvárame triedou ChatOpenAI z balíka langchain_openai a model určíme parametrom model.' },
    { q: 'Čím sa líši stream() od invoke()?',
      opts: ['stream() je lacnejší', 'stream() vracia odpoveď postupne po chunkoch, invoke() celú naraz', 'stream() funguje len pre gpt-4o', 'invoke() nevracia text'],
      correct: 1, explain: 'stream() vracia generátor — chunky odpovede spracúvaš hneď, ako vznikajú. Skvelé pre UX chatbotov.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Doplň volanie modelu', xp: 20,
      intro: 'Doplň kód tak, aby vytvoril presný (deterministický) model a vypísal text odpovede.',
      code: `from dotenv import load_dotenv
from langchain_openai import ⟦0⟧

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini", ⟦1⟧=0)

odpoved = model.⟦2⟧("Aké je hlavné mesto Slovenska?")
print(odpoved.⟦3⟧)`,
      blanks: [['ChatOpenAI'], ['temperature'], ['invoke'], ['content']],
      hint: 'Trieda chatmodelu sa volá ChatOpenAI. Determinizmus riadi temperature=0. Volanie = invoke(), text odpovede = .content.' },
    { t: 'blanks', title: 'Sprevádzkuj streaming', xp: 20,
      intro: 'Doplň kód, ktorý odpoveď vypisuje postupne — ako ChatGPT.',
      code: `for chunk in model.⟦0⟧("Vymenuj 3 výhody Pythonu."):
    print(chunk.⟦1⟧, end="", flush=True)`,
      blanks: [['stream'], ['content']],
      hint: 'Streamovacia metóda sa volá stream() a text každého chunku je v .content.' },
    { t: 'write', title: 'Kreatívny generátor sloganov', xp: 30,
      intro: 'Samostatná úloha na celý cyklus: model → otázka → odpoveď.',
      task: 'Napíš skript, ktorý vytvorí <code>ChatOpenAI</code> model <code>gpt-4o-mini</code> s <code>temperature=1.2</code>, cez <code>invoke()</code> ho požiada o slogan pre pizzeriu a vypíše <code>.content</code> odpovede.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
# tvoj kód...`,
      must: [['ChatOpenAI('], ['temperature=1.2', 'temperature = 1.2'], ['.invoke('], ['.content']],
      hint: 'Parametre modelu zadávaš pri vytváraní: ChatOpenAI(model="gpt-4o-mini", temperature=1.2). Potom invoke("...") a print(odpoved.content).',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini", temperature=1.2)
odpoved = model.invoke("Vymysli chytľavý slogan pre pizzeriu.")
print(odpoved.content)` }
  ]
};

/* ============================================================
   LEKCIA 3 — Prompty a templaty
   ============================================================ */
window.COURSE.lessons.l3 = {
  id: 'l3', num: 3, section: 's1', icon: '📝', duration: '7 min',
  title: 'Prompty a templaty — šablóny komunikácie s modelmi',
  intro: 'Písať prompt nanovo pre každý vstup je ako tlačiť leták ručne. Šablóny (templates) ti dajú prompt s dierami — premennými — do ktorých LangChain dosadí hodnoty. Toto je základ každej znovupoužiteľnej AI aplikácie.',
  goals: [
    'Pochopiť, prečo sú šablóny promptov nutnosť, nie luxus',
    'Vytvoriť PromptTemplate s premennými v {zložených zátvorkách}',
    'Postaviť ChatPromptTemplate so system a human správami',
    'Vedieť, čo je PromptValue a ako putuje do modelu'
  ],
  blocks: [
    { t: 'h', x: 'Problém: prompty „natvrdo"' },
    { t: 'p', x: 'Predstav si aplikáciu na preklady. Bez šablón by si pre každý jazyk a text skladal prompt ručne cez f-stringy roztrúsené po kóde. Šablóna to rieši elegantne: <strong>prompt napíšeš raz</strong> s vyznačenými premennými a potom doň len dosádzaš hodnoty. Získaš prehľadnosť, znovupoužiteľnosť a jediné miesto, kde prompt ladíš.' },
    { t: 'h', x: 'PromptTemplate — šablóna pre text' },
    { t: 'p', x: 'Najjednoduchšia šablóna je <code>PromptTemplate</code>. Premenné označíš <strong>zloženými zátvorkami</strong> <code>{takto}</code> a LangChain ich pri volaní nahradí:' },
    { t: 'pycharm', title: 'main.py — prvá šablóna', files: [
      { name: 'main.py', active: true, code: `from langchain_core.prompts import PromptTemplate

sablona = PromptTemplate.from_template(
    "Napíš {pocet} marketingové slogany pre firmu, ktorá predáva {produkt}."
)

# invoke() dosadí hodnoty a vráti hotový prompt
prompt = sablona.invoke({"pocet": 3, "produkt": "horské bicykle"})

print(prompt.to_string())` }
    ], output: `Napíš 3 marketingové slogany pre firmu, ktorá predáva horské bicykle.`,
      note: 'Výsledok invoke() nie je obyčajný string, ale <b>PromptValue</b> — objekt, ktorý vie LangChain poslať priamo do modelu. Na výpis ho prevedieme cez .to_string().' },
    { t: 'box', kind: 'key', title: 'Všimni si vzor', x: 'Šablóna sa volá rovnako ako model: metódou <code>invoke()</code>. Vstupom je <strong>slovník</strong> — kľúče musia presne sedieť s názvami premenných v šablóne. Tento jednotný vzor (všetko má invoke) je celá filozofia LangChainu.' },
    { t: 'h', x: 'ChatPromptTemplate — šablóna pre konverzáciu' },
    { t: 'p', x: 'Pri chatmodeloch chceš typicky nastaviť aj <strong>rolu a správanie</strong> modelu (system správa) a zvlášť <strong>vstup používateľa</strong> (human správa). Na to slúži <code>ChatPromptTemplate.from_messages()</code> — zoznam dvojíc <code>(rola, text)</code>:' },
    { t: 'pycharm', title: 'main.py — chat šablóna s rolami', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

sablona = ChatPromptTemplate.from_messages([
    ("system", "Si skúsený učiteľ. Vysvetľuješ {styl} a po slovensky."),
    ("human", "Vysvetli mi: {tema}")
])

prompt = sablona.invoke({
    "styl": "jednoducho, s prirovnaním z bežného života",
    "tema": "čo je API"
})

odpoved = model.invoke(prompt)
print(odpoved.content)` }
    ], output: `API je ako čašník v reštaurácii. Ty (aplikácia) si objednáš z menu, čašník (API) odnesie objednávku do kuchyne (systému) a prinesie ti hotové jedlo (dáta). Nemusíš vedieť, ako sa varí — stačí vedieť, čo si možno objednať.` },
    { t: 'p', x: 'Všimni si tok dát: šablóna cez <code>invoke()</code> vyrobila hotové správy a tie sme rovno poslali do modelu. V ďalšej lekcii o chainoch tieto dva kroky spojíme do jedného celku operátorom <code>|</code>.' },
    { t: 'h', x: 'Užitočné triky so šablónami' },
    { t: 'table', head: ['Technika', 'Ako', 'Kedy sa hodí'], rows: [
      ['Viac premenných', '<code>"Preloź {text} do {jazyk}a"</code>', 'Takmer vždy — šablóny mávajú 2–5 premenných'],
      ['Partial (preddosadenie)', '<code>sablona.partial(jazyk="nemčin")</code>', 'Časť hodnôt poznáš vopred, zvyšok doplníš pri volaní'],
      ['Literálne zátvorky', '<code>{{toto}}</code> → v texte ostane <code>{toto}</code>', 'Keď prompt obsahuje JSON alebo kód so zátvorkami'],
      ['Výpis správ', '<code>prompt.to_messages()</code>', 'Debugovanie — pozri, čo presne ide do modelu']
    ] },
    { t: 'box', kind: 'warn', title: 'Pozor na názvy premenných', x: 'Ak šablóna obsahuje <code>{tema}</code> a ty pošleš <code>{"téma": ...}</code> (s diakritikou navyše) alebo premennú zabudneš, LangChain vyhodí <code>KeyError</code>. Názvy v slovníku musia sedieť <strong>na znak presne</strong>.' }
  ],
  quiz: [
    { q: 'Ako sa v šablóne označuje premenná?',
      opts: ['<premenna>', '{premenna}', '$premenna', '%premenna%'],
      correct: 1, explain: 'Premenné sa píšu do zložených zátvoriek: {premenna}. Pri invoke() ich nahradia hodnoty zo slovníka.' },
    { q: 'Čo vráti zavolanie sablona.invoke({"tema": "AI"})?',
      opts: ['Obyčajný string', 'PromptValue — objekt pripravený pre model', 'AIMessage s odpoveďou', 'Slovník'],
      correct: 1, explain: 'Šablóna vracia PromptValue. Model ho prijme priamo; na výpis použiješ .to_string() alebo .to_messages().' },
    { q: 'Na čo slúži dvojica ("system", "...") v ChatPromptTemplate.from_messages?',
      opts: ['Definuje otázku používateľa', 'Nastavuje rolu, štýl a pravidlá správania modelu', 'Ukladá odpoveď modelu', 'Spúšťa systémové príkazy'],
      correct: 1, explain: 'System správa je „pracovná zmluva" modelu — kto je, ako odpovedá, aké má mantinely. Používateľov vstup ide do human správy.' },
    { q: 'Šablóna má premenné {text} a {jazyk}. Ktoré volanie je správne?',
      opts: ['sablona.invoke("Ahoj", "nemčina")', 'sablona.invoke({"text": "Ahoj", "jazyk": "nemčina"})', 'sablona.format("Ahoj do nemčiny")', 'sablona.run(text="Ahoj")'],
      correct: 1, explain: 'invoke() prijíma slovník, ktorého kľúče presne zodpovedajú názvom premenných v šablóne.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Doplň chat šablónu', xp: 20,
      intro: 'Doplň šablónu prekladateľa tak, aby mala system rolu a premenné <code>jazyk</code> a <code>text</code>.',
      code: `from langchain_core.prompts import ⟦0⟧

sablona = ChatPromptTemplate.⟦1⟧([
    ("⟦2⟧", "Si profesionálny prekladateľ do jazyka: {jazyk}."),
    ("⟦3⟧", "Prelož: {text}")
])

prompt = sablona.invoke({"jazyk": "taliančina", "text": "Dobré ráno"})`,
      blanks: [['ChatPromptTemplate'], ['from_messages'], ['system'], ['human']],
      hint: 'Chat šablóna sa tvorí cez ChatPromptTemplate.from_messages([...]) a roly v dvojiciach sú "system" a "human".' },
    { t: 'order', title: 'Život promptu', xp: 20,
      intro: 'Zoraď, čo sa deje s promptom od definície až po odpoveď modelu.',
      items: [
        'Definuješ šablónu s premennými {v zátvorkách}',
        'Zavoláš sablona.invoke({...}) so slovníkom hodnôt',
        'Vznikne PromptValue s hotovými správami',
        'PromptValue pošleš do model.invoke()',
        'Model vráti AIMessage s odpoveďou' ] },
    { t: 'write', title: 'Šablóna na recenzie', xp: 30,
      intro: 'Postav vlastnú šablónu a prežeň ju modelom.',
      task: 'Vytvor <code>ChatPromptTemplate.from_messages</code> so system správou „Si kritik reštaurácií, odpovedáš vtipne." a human správou s premennými <code>{jedlo}</code> a <code>{mesto}</code> (napr. „Napíš mini recenziu na {jedlo} v meste {mesto}."). Šablónu zavolaj cez <code>invoke()</code> s ľubovoľnými hodnotami a výsledok pošli do modelu.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      must: [['from_messages'], ['("system"', "('system'"], ['{jedlo}'], ['{mesto}'], ['.invoke(']],
      hint: 'from_messages dostane zoznam dvojíc ("system", "..."), ("human", "... {jedlo} ... {mesto} ..."). Potom sablona.invoke({"jedlo": ..., "mesto": ...}) a výsledok do model.invoke().',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

sablona = ChatPromptTemplate.from_messages([
    ("system", "Si kritik reštaurácií, odpovedáš vtipne."),
    ("human", "Napíš mini recenziu na {jedlo} v meste {mesto}.")
])

prompt = sablona.invoke({"jedlo": "bryndzové halušky", "mesto": "Žilina"})
print(model.invoke(prompt).content)` }
  ]
};

/* ============================================================
   LEKCIA 4 — Messages
   ============================================================ */
window.COURSE.lessons.l4 = {
  id: 'l4', num: 4, section: 's1', icon: '💬', duration: '7 min',
  title: 'Messages — ako sa baviť s modelom',
  intro: 'Chatmodely nehovoria v obyčajnom texte, ale v správach. Každá správa má rolu — kto ju hovorí — a obsah. Keď pochopíš tri základné typy správ, pochopíš celé fungovanie chatu, pamäte aj agentov.',
  goals: [
    'Poznať typy správ: SystemMessage, HumanMessage, AIMessage (a ToolMessage)',
    'Poslať modelu celú konverzáciu ako zoznam správ',
    'Pochopiť, že „pamäť" chatu = posielanie histórie správ',
    'Využiť správy na few-shot príklady (učenie ukážkou)'
  ],
  blocks: [
    { t: 'h', x: 'Tri hlavné roly v konverzácii' },
    { t: 'p', x: 'Každá správa v chate má <strong>rolu</strong> (kto hovorí) a <strong>content</strong> (čo hovorí). LangChain pre ne má samostatné triedy z balíka <code>langchain_core.messages</code>:' },
    { t: 'table', head: ['Trieda', 'Rola', 'Na čo slúži'], rows: [
      ['<code>SystemMessage</code>', 'system', 'Inštrukcie a „osobnosť" modelu. Model ju berie ako záväzné pravidlá hry.'],
      ['<code>HumanMessage</code>', 'human / user', 'Vstup od používateľa — otázky, príkazy, dáta.'],
      ['<code>AIMessage</code>', 'ai / assistant', 'Odpoveď modelu. Vracia ju model, ale vieme ju aj sami vložiť do histórie.'],
      ['<code>ToolMessage</code>', 'tool', 'Výsledok behu nástroja (spoznáš v lekcii o tools a agentoch).']
    ] },
    { t: 'pycharm', title: 'main.py — konverzácia zo správ', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

spravy = [
    SystemMessage(content="Si pirát. Odpovedáš krátko a používaš pirátsky slang."),
    HumanMessage(content="Ako sa dnes máš?")
]

odpoved = model.invoke(spravy)
print(odpoved.content)` }
    ], output: `Arrr! Skvele, more je pokojné a rum ešte nedošiel! 🏴‍☠️` },
    { t: 'box', kind: 'key', title: 'System správa = superschopnosť', x: 'Do system správy patrí všetko, čo má platiť počas celej konverzácie: tón, jazyk, formát odpovedí, zakázané témy, doménové znalosti. Dobre napísaná system správa je polovica úspechu každej AI aplikácie.' },
    { t: 'h', x: 'História = zoznam správ' },
    { t: 'p', x: 'Tu prichádza zásadný moment: <strong>jazykové modely si nič nepamätajú</strong>. Každé volanie začína od nuly. „Pamäť" ChatGPT je trik — pri každej otázke sa modelu posiela <strong>celá doterajšia konverzácia</strong> ako zoznam správ. Vyskúšajme si to ručne:' },
    { t: 'pycharm', title: 'main.py — model si „pamätá" vďaka histórii', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

historia = [
    SystemMessage(content="Si stručný asistent."),
    HumanMessage(content="Volám sa Martin a učím sa LangChain."),
    AIMessage(content="Teší ma, Martin! LangChain je výborná voľba."),
    HumanMessage(content="Ako sa volám a čo sa učím?")
]

odpoved = model.invoke(historia)
print(odpoved.content)` }
    ], output: `Voláš sa Martin a učíš sa LangChain.`,
      note: 'Model „vie" meno len preto, že ho dostal v histórii. Keby sme poslali iba poslednú otázku, odpovedal by, že to nevie. Na tomto princípe postavíme chatbota s pamäťou v sekcii 3.' },
    { t: 'h', x: 'Few-shot: nauč model ukážkami' },
    { t: 'p', x: 'Dvojice Human/AI správ môžeš využiť aj ako <strong>príklady správneho správania</strong> — modelu ukážeš vzorové otázky a vzorové odpovede a on štýl napodobní. Hovorí sa tomu <em>few-shot prompting</em>:' },
    { t: 'pycharm', title: 'main.py — few-shot príklady', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

spravy = [
    SystemMessage(content="Klasifikuješ sentiment recenzií."),
    # ukážka 1
    HumanMessage(content="Jedlo bolo vynikajúce!"),
    AIMessage(content="POZITÍVNA"),
    # ukážka 2
    HumanMessage(content="Čakali sme hodinu a polievka studená."),
    AIMessage(content="NEGATÍVNA"),
    # ostrá otázka
    HumanMessage(content="Obsluha milá, ale porcie maličké.")
]

print(model.invoke(spravy).content)` }
    ], output: `NEUTRÁLNA`,
      note: 'Model z dvoch ukážok pochopil formát (jedno slovo, veľké písmená) aj úlohu — bez jediného pravidla v texte.' },
    { t: 'box', kind: 'tip', title: 'Skratka: dvojice namiesto tried', x: 'V šablónach (lekcia 3) si videl zápis <code>("system", "text")</code> — LangChain ho interne prevedie na SystemMessage. Obe formy sú rovnocenné; triedy používaš, keď správy skladáš v kóde dynamicky.' }
  ],
  quiz: [
    { q: 'Ktorá správa definuje správanie a rolu modelu počas celej konverzácie?',
      opts: ['HumanMessage', 'AIMessage', 'SystemMessage', 'ToolMessage'],
      correct: 2, explain: 'SystemMessage je inštrukčná správa — určuje tón, pravidlá a rolu. Píše sa typicky ako prvá v zozname.' },
    { q: 'Prečo si model „pamätá" predchádzajúce správy v ChatGPT?',
      opts: ['Model má internú databázu používateľov', 'Pri každom volaní sa mu posiela celá doterajšia história správ', 'OpenAI ukladá konverzácie do modelu', 'Modely majú trvalú pamäť RAM'],
      correct: 1, explain: 'Modely sú bezstavové. Ilúzia pamäte vzniká tak, že klient pri každej otázke pošle aj históriu. Presne to budeme robiť pri stavbe chatbota.' },
    { q: 'Čo je few-shot prompting?',
      opts: ['Posielanie krátkych promptov', 'Učenie modelu vzorovými dvojicami otázka–odpoveď priamo v promptе', 'Tréning modelu na vlastných dátach', 'Obmedzenie počtu tokenov'],
      correct: 1, explain: 'Few-shot = do promptu vložíš niekoľko ukážok správneho vstupu a výstupu (Human/AI dvojice). Model formát a logiku napodobní.' },
    { q: 'V akom poradí typicky skladáme správy pre jednoduchú otázku?',
      opts: ['HumanMessage, SystemMessage', 'SystemMessage, HumanMessage', 'AIMessage, HumanMessage', 'Na poradí vôbec nezáleží'],
      correct: 1, explain: 'System správa ide prvá (nastaví pravidlá), potom nasleduje vstup používateľa. Pri histórii sa Human a AI správy striedajú v poradí, v akom zazneli.' }
  ],
  exercises: [
    { t: 'order', title: 'Zostav konverzáciu', xp: 20,
      intro: 'Zoraď správy tak, aby vznikla zmysluplná konverzácia s pamäťou: najprv pravidlá, potom striedanie otázok a odpovedí.',
      items: [
        'SystemMessage("Si trpezlivý učiteľ matematiky.")',
        'HumanMessage("Koľko je 12 × 12?")',
        'AIMessage("12 × 12 = 144.")',
        'HumanMessage("A koľko je to deleno 2?")',
        'model.invoke(historia) → AIMessage("72.")' ] },
    { t: 'blanks', title: 'Doplň správy', xp: 20,
      intro: 'Doplň importy a triedy správ pre konverzáciu s básnikom.',
      code: `from langchain_core.messages import ⟦0⟧, ⟦1⟧, AIMessage

spravy = [
    ⟦2⟧(content="Si básnik. Odpovedáš v rýmoch."),
    HumanMessage(content="Aký bude víkend?"),
    AIMessage(content="Víkend bude plný krás, slnko zohreje nás."),
    ⟦3⟧(content="A čo pondelok?")
]

odpoved = model.invoke(spravy)`,
      blanks: [['SystemMessage'], ['HumanMessage'], ['SystemMessage'], ['HumanMessage']],
      hint: 'Importujeme SystemMessage a HumanMessage (AIMessage už v importe je). Pravidlá = SystemMessage, otázky používateľa = HumanMessage.' },
    { t: 'write', title: 'Few-shot prekladač emoji', xp: 30,
      intro: 'Využi silu few-shot promptingu v praxi.',
      task: 'Zostav zoznam správ: <code>SystemMessage</code> („Prekladáš vety do emoji."), potom DVE ukážkové dvojice <code>HumanMessage</code>/<code>AIMessage</code> (napr. „Idem spať" → „😴🛏️") a nakoniec novú <code>HumanMessage</code>. Zavolaj model a vypíš odpoveď.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      must: [['SystemMessage('], ['HumanMessage('], ['AIMessage('], ['model.invoke', '.invoke(']],
      hint: 'Zoznam: [SystemMessage(...), HumanMessage(ukážka 1), AIMessage(emoji 1), HumanMessage(ukážka 2), AIMessage(emoji 2), HumanMessage(nová veta)] → model.invoke(zoznam).',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

spravy = [
    SystemMessage(content="Prekladáš vety do emoji."),
    HumanMessage(content="Idem spať."),
    AIMessage(content="😴🛏️"),
    HumanMessage(content="Milujem pizzu."),
    AIMessage(content="❤️🍕"),
    HumanMessage(content="Učím sa programovať.")
]

print(model.invoke(spravy).content)` }
  ]
};

/* ============================================================
   LEKCIA 5 — Chainy
   ============================================================ */
window.COURSE.lessons.l5 = {
  id: 'l5', num: 5, section: 's1', icon: '⛓️', duration: '7 min',
  title: 'Chainy v LangChaine',
  intro: 'Chain — reťaz — je dôvod, prečo sa knižnica volá LangChain. Namiesto ručného prelievania dát medzi šablónou, modelom a spracovaním výstupu pospájaš komponenty operátorom | do jednej rúry. Dáta ňou pretečú samé.',
  goals: [
    'Pochopiť koncept chainu: komponenty pospájané do jedného celku',
    'Postaviť prvý chain operátorom | (pipe)',
    'Volať chain jediným invoke() so vstupným slovníkom',
    'Skladať dlhšie reťaze: výstup jedného chainu ako vstup druhého'
  ],
  blocks: [
    { t: 'h', x: 'Od krokov k rúre' },
    { t: 'p', x: 'V minulých lekciách si robil tri kroky ručne: 1) šablóna vyrobí prompt, 2) prompt pošleš do modelu, 3) z odpovede vytiahneš <code>.content</code>. Chain tieto kroky <strong>zlepí dohromady</strong>. Použijeme operátor <code>|</code> (pipe — rúra), ktorý poznáš možno z Linuxu: výstup ľavej strany tečie ako vstup do pravej strany.' },
    { t: 'flow', steps: ['📥 Vstup<br><small>slovník hodnôt</small>', '📝 Prompt<br><small>šablóna doplní premenné</small>', '🧠 Model<br><small>vygeneruje AIMessage</small>', '📦 Parser<br><small>vytiahne čistý text</small>', '📤 Výstup<br><small>string</small>'] },
    { t: 'pycharm', title: 'main.py — prvý chain', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si copywriter. Odpovedáš jednou údernou vetou."),
    ("human", "Napíš slogan pre {firma}, ktorá predáva {produkt}.")
])
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
parser = StrOutputParser()

# Mágia: tri komponenty → jedna rúra
chain = prompt | model | parser

slogan = chain.invoke({"firma": "BikeMania", "produkt": "horské bicykle"})
print(slogan)` }
    ], output: `BikeMania — pretože hory sa samé nezídu.`,
      note: '<b>StrOutputParser</b> z AIMessage vytiahne čistý text — preto je výsledkom rovno string a nie objekt. Parserom sa venuje celá nasledujúca lekcia.' },
    { t: 'box', kind: 'key', title: 'Chain číta sa zľava doprava', x: '<code>prompt | model | parser</code> znamená: slovník → prompt (vyrobí správy) → model (vyrobí AIMessage) → parser (vyrobí string). Výstup každého článku <strong>musí typovo sedieť</strong> so vstupom nasledujúceho — preto na začiatku reťaze stojí šablóna, ktorá zje slovník.' },
    { t: 'h', x: 'Prečo je to lepšie ako tri riadky?' },
    { t: 'ul', items: [
      '<strong>Jeden objekt</strong> — chain pošleš kamkoľvek: do API, do Streamlitu, do testu. Volá sa jedným invoke().',
      '<strong>Streaming a batch zadarmo</strong> — chain.stream() a chain.batch() fungujú automaticky (uvidíš v lekcii o LCEL).',
      '<strong>Vymeniteľné diely</strong> — chceš iný model? Vymeníš jeden článok, zvyšok sa nemení.',
      '<strong>Pozorovateľnosť</strong> — nástroje ako LangSmith vidia každý článok reťaze zvlášť (lekcia 22).'
    ]},
    { t: 'h', x: 'Skladanie chainov: reťaz v reťazi' },
    { t: 'p', x: 'Skutočná sila príde, keď reťaze začneš <strong>skladať</strong>. Výstup jedného chainu môže byť vstupom ďalšieho — napríklad najprv vygeneruješ príbeh a potom ho iný chain zhodnotí:' },
    { t: 'pycharm', title: 'main.py — dva chainy za sebou', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# Chain 1: vymyslí názov produktu
prompt_nazov = ChatPromptTemplate.from_template(
    "Vymysli jeden krátky názov pre aplikáciu na {ucel}. Len názov."
)
chain_nazov = prompt_nazov | model | parser

# Chain 2: k názvu vymyslí popis do obchodu
prompt_popis = ChatPromptTemplate.from_template(
    "Napíš jednu vetu popisu do App Store pre appku menom {nazov}."
)
chain_popis = prompt_popis | model | parser

# Spojenie: výstup chainu 1 sa stane vstupom {nazov} chainu 2
mega_chain = chain_nazov | (lambda nazov: {"nazov": nazov}) | chain_popis

print(mega_chain.invoke({"ucel": "učenie slovíčok"}))` }
    ], output: `SlovkoHra — premeň každú voľnú minútu na nové slovíčka vďaka hravým výzvam a inteligentnému opakovaniu.`,
      note: 'Lambda funkcia medzi chainmi „prebalí" string na slovník, ktorý očakáva druhá šablóna. V lekcii o LCEL spoznáš na toto čistejšie nástroje (RunnableLambda, RunnablePassthrough).' },
    { t: 'box', kind: 'info', title: 'A čo LLMChain?', x: 'V starších tutoriáloch nájdeš triedu <code>LLMChain(llm=..., prompt=...)</code>. Je <strong>zastaraná (deprecated)</strong> — moderný LangChain stavia reťaze výhradne operátorom <code>|</code>. Ak LLMChain niekde uvidíš, v hlave si ju prelož na <code>prompt | model</code>.' }
  ],
  quiz: [
    { q: 'Čo robí operátor | v LangChaine?',
      opts: ['Logické ALEBO medzi podmienkami', 'Spája komponenty do reťaze — výstup ľavého tečie do pravého', 'Delí kód na sekcie', 'Spúšťa komponenty paralelne'],
      correct: 1, explain: 'Pipe operátor skladá komponenty do RunnableSequence: výstup jedného článku je vstupom nasledujúceho.' },
    { q: 'Čo je vstupom chainu prompt | model | parser?',
      opts: ['Obyčajný string', 'Slovník s hodnotami pre premenné šablóny', 'AIMessage', 'Zoznam modelov'],
      correct: 1, explain: 'Prvý článok je šablóna — a tá očakáva slovník, napr. {"firma": "...", "produkt": "..."}. Preto chain.invoke({...}).' },
    { q: 'Prečo je na konci chainu StrOutputParser?',
      opts: ['Aby model odpovedal po slovensky', 'Aby z AIMessage vytiahol čistý text — výsledkom je string', 'Aby sa chain spustil rýchlejšie', 'Je povinný, bez neho chain nefunguje'],
      correct: 1, explain: 'Parser premieňa AIMessage na čistý string. Nie je povinný — bez neho by chain vrátil AIMessage a text by si bral cez .content.' },
    { q: 'Ktorý zápis vytvorí funkčný chain?',
      opts: ['chain = model | prompt | parser', 'chain = prompt | model | parser', 'chain = parser | prompt | model', 'chain = prompt + model + parser'],
      correct: 1, explain: 'Poradie musí kopírovať tok dát: slovník → prompt → model → parser. Model nevie spracovať surový slovník a parser nevie spracovať prompt.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Postav chain', xp: 20,
      intro: 'Doplň operátory a volanie tak, aby vznikol funkčný chain na vysvetľovanie pojmov.',
      code: `prompt = ChatPromptTemplate.from_template(
    "Vysvetli pojem {pojem} jednou vetou pre dieťa."
)
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

chain = prompt ⟦0⟧ model ⟦1⟧ parser

vysledok = chain.⟦2⟧({"⟦3⟧": "gravitácia"})
print(vysledok)`,
      blanks: [['|'], ['|'], ['invoke'], ['pojem']],
      hint: 'Komponenty spája zvislá čiara | (pipe). Chain spúšťame cez invoke() a kľúč slovníka musí sedieť s premennou {pojem} v šablóne.' },
    { t: 'order', title: 'Tok dát chainom', xp: 20,
      intro: 'Zoraď, čo sa s dátami deje vo vnútri chainu prompt | model | parser.',
      items: [
        'chain.invoke() dostane slovník {"tema": "vesmír"}',
        'Šablóna dosadí hodnoty a vyrobí správy (PromptValue)',
        'Model dostane správy a vygeneruje AIMessage',
        'StrOutputParser vytiahne z AIMessage čistý text',
        'Chain vráti hotový string' ] },
    { t: 'write', title: 'Generátor vtipov ako chain', xp: 30,
      intro: 'Posklad celý chain sám — od importov po výpis.',
      task: 'Postav chain <code>prompt | model | parser</code>: šablóna nech má premennú <code>{tema}</code> a žiada krátky vtip, model je <code>gpt-4o-mini</code>, parser <code>StrOutputParser</code>. Chain zavolaj s témou „programátori" a výsledok vypíš.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
# tvoj kód...`,
      must: [['ChatPromptTemplate'], ['{tema}'], ['| model', '|model'], ['StrOutputParser'], ['.invoke(']],
      hint: 'chain = prompt | model | parser, potom chain.invoke({"tema": "programátori"}). Nezabudni parser vytvoriť: StrOutputParser().',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt = ChatPromptTemplate.from_template("Povedz krátky vtip na tému {tema}.")
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
parser = StrOutputParser()

chain = prompt | model | parser
print(chain.invoke({"tema": "programátori"}))` }
  ]
};
