/* ============================================================
   OBSAH KURZU — Lekcie 20–23 (Nasadenie a nástroje)
   ============================================================ */

/* ============================================================
   LEKCIA 20 — Streamlit UI
   ============================================================ */
window.COURSE.lessons.l20 = {
  id: 'l20', num: 20, section: 's4', icon: '🖥️', duration: '8 min',
  title: 'Streamlit UI — ChatBot v prehliadači',
  intro: 'Konzola je fajn na vývoj, ale používateľom dáš web. Streamlit je Python knižnica, ktorá z tvojho skriptu vyrobí webovú aplikáciu — bez HTML, CSS či JavaScriptu. Chat rozhranie ako z ChatGPT postavíš na ~30 riadkov.',
  goals: [
    'Pochopiť model fungovania Streamlitu: skript sa spúšťa odznova pri každej interakcii',
    'Použiť chatové komponenty st.chat_input a st.chat_message',
    'Udržať históriu medzi rerunmi cez st.session_state',
    'Spustiť aplikáciu príkazom streamlit run'
  ],
  blocks: [
    { t: 'h', x: 'Ako Streamlit premýšľa' },
    { t: 'p', x: 'Streamlit má jedno zvláštne, ale geniálne pravidlo: <strong>pri každej interakcii (kliknutie, odoslanie správy) sa celý skript spustí odznova zhora nadol</strong>. Žiadne callbacky, žiadne routery — len obyčajný Python skript. Háčik? Obyčajné premenné sa pri rerune vynulujú. Preto existuje <code>st.session_state</code> — slovník, ktorý reruny prežíva.' },
    { t: 'box', kind: 'key', title: 'Tri chatové superkomponenty', x: '<code>st.chat_input("...")</code> — vstupné pole dole ako v ChatGPT · <code>st.chat_message("user"/"assistant")</code> — bublina správy s avatarom · <code>st.session_state</code> — pamäť medzi rerunmi. Z týchto troch vecí je celé chat UI.' },
    { t: 'pycharm', title: 'app.py — chatbot v prehliadači', files: [
      { name: 'app.py', active: true, code: `import streamlit as st
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

st.title("🦜 Môj LangChain ChatBot")

# História prežíva reruny v session_state
if "historia" not in st.session_state:
    st.session_state.historia = []

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si priateľský asistent. Odpovedáš po slovensky."),
    MessagesPlaceholder("chat_history"),
    ("human", "{otazka}"),
])
chain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()

# 1) Vykresli doterajšiu konverzáciu
for sprava in st.session_state.historia:
    rola = "user" if isinstance(sprava, HumanMessage) else "assistant"
    with st.chat_message(rola):
        st.write(sprava.content)

# 2) Spracuj novú správu
if otazka := st.chat_input("Napíš správu…"):
    with st.chat_message("user"):
        st.write(otazka)

    odpoved = chain.invoke({
        "chat_history": st.session_state.historia,
        "otazka": otazka,
    })

    with st.chat_message("assistant"):
        st.write(odpoved)

    st.session_state.historia.append(HumanMessage(content=otazka))
    st.session_state.historia.append(AIMessage(content=odpoved))` }
    ], output: `(.venv) langchain_kurz % streamlit run app.py

  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.1.23:8501

  ✨ Aplikácia beží — otvor prehliadač a chatuj!`,
      note: 'Aplikáciu spúšťaš z terminálu: <b>streamlit run app.py</b> (nie zeleným ▶ — to by spustilo len skript bez webového servera). Inštalácia: pip install streamlit.' },
    { t: 'h', x: 'Prečo ten kód vyzerá práve takto' },
    { t: 'ul', items: [
      '<strong>if "historia" not in st.session_state</strong> — inicializácia prebehne len pri prvom spustení; pri rerunoch už história existuje.',
      '<strong>Cyklus cez históriu</strong> — po každom rerune treba konverzáciu nakresliť celú odznova (skript predsa beží od nuly).',
      '<strong>walrus operátor :=</strong> — <code>if otazka := st.chat_input(...)</code> priradí aj otestuje naraz: blok beží, len keď používateľ niečo odoslal.',
      '<strong>append až na konci</strong> — históriu dopĺňame po vykreslení odpovede, aby sa pri ďalšom rerune zobrazila správne.'
    ]},
    { t: 'box', kind: 'tip', title: 'Streaming aj v Streamlite', x: 'Efekt písania ako v ChatGPT dosiahneš jedným riadkom: namiesto <code>st.write(odpoved)</code> použi <code>odpoved = st.write_stream(chain.stream({...}))</code> — Streamlit chunky vypisuje priebežne a vráti celý text.' },
    { t: 'box', kind: 'info', title: 'Bonus komponenty pre RAG appku', x: '<code>st.sidebar</code> — bočný panel na nastavenia · <code>st.file_uploader("Nahraj PDF")</code> — upload dokumentov od používateľa · <code>st.spinner("Premýšľam…")</code> — indikátor počas invoke. Presne tieto použiješ v záverečnom projekte.' }
  ],
  quiz: [
    { q: 'Čo sa stane so Streamlit skriptom, keď používateľ odošle správu?',
      opts: ['Zavolá sa len funkcia on_message', 'Celý skript sa spustí odznova zhora nadol', 'Nič, Streamlit čaká na refresh', 'Spustí sa nové vlákno'],
      correct: 1, explain: 'Streamlit pri každej interakcii rerunuje celý skript. Preto treba históriu držať v session_state a konverzáciu vykresľovať celú.' },
    { q: 'Prečo história nemôže byť obyčajná premenná historia = []?',
      opts: ['Streamlit zoznamy nepodporuje', 'Pri každom rerune by sa vynulovala — session_state reruny prežíva', 'Zoznam je pomalý', 'Kvôli bezpečnosti'],
      correct: 1, explain: 'Obyčajná premenná vznikne pri rerune nanovo (prázdna). st.session_state je perzistentný slovník danej používateľskej session.' },
    { q: 'Ako správne spustíš Streamlit aplikáciu?',
      opts: ['Zeleným ▶ v PyCharme', 'streamlit run app.py v terminále', 'python app.py', 'flask run'],
      correct: 1, explain: 'streamlit run app.py naštartuje webový server (typicky localhost:8501). Obyčajné spustenie skriptu UI nevytvorí.' },
    { q: 'Ktorý komponent vykreslí chatovú bublinu so správou?',
      opts: ['st.bubble()', 'st.chat_message("user"/"assistant") + st.write(...)', 'st.print()', 'st.message_box()'],
      correct: 1, explain: 'with st.chat_message("user"): st.write(text) — kontextový manažér vytvorí bublinu s avatarom podľa roly.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Streamlit chat kostra', xp: 20,
      intro: 'Doplň kľúčové Streamlit volania.',
      code: `import streamlit as st

st.⟦0⟧("Môj ChatBot")

if "historia" not in st.⟦1⟧:
    st.session_state.historia = []

if otazka := st.⟦2⟧("Napíš správu…"):
    with st.⟦3⟧("user"):
        st.write(otazka)`,
      blanks: [['title'], ['session_state'], ['chat_input'], ['chat_message']],
      hint: 'Nadpis = st.title, pamäť = st.session_state, vstup = st.chat_input, bublina = st.chat_message.' },
    { t: 'order', title: 'Tok jedného rerunu', xp: 20,
      intro: 'Zoraď, čo sa deje v Streamlit appke po odoslaní správy.',
      items: [
        'Používateľ odošle text v st.chat_input',
        'Streamlit spustí celý skript odznova',
        'Z session_state sa vykreslí doterajšia história',
        'Nová otázka prejde chainom a vykreslí sa odpoveď',
        'Otázka aj odpoveď sa appendnú do session_state' ] },
    { t: 'write', title: 'Vlastná Streamlit appka', xp: 30,
      intro: 'Posklad minimálny chat — kostru appky z tejto lekcie.',
      task: 'Napíš Streamlit appku: <code>st.title</code>, inicializácia <code>st.session_state.historia</code> (cez <code>if "historia" not in...</code>), <code>st.chat_input</code>, vykreslenie odpovede v <code>st.chat_message("assistant")</code> a append do histórie.',
      starter: `import streamlit as st
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      must: [['st.title('], ['session_state'], ['chat_input'], ['chat_message'], ['append']],
      hint: 'Drž sa kostry z lekcie: title → if not in session_state → chat_input s := → chat_message → invoke → append.',
      solution: `import streamlit as st
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

st.title("Môj prvý AI web")

if "historia" not in st.session_state:
    st.session_state.historia = []

if otazka := st.chat_input("Napíš správu…"):
    with st.chat_message("user"):
        st.write(otazka)
    odpoved = model.invoke(otazka).content
    with st.chat_message("assistant"):
        st.write(odpoved)
    st.session_state.historia.append((otazka, odpoved))` }
  ]
};

/* ============================================================
   LEKCIA 21 — LLM modely v počítači
   ============================================================ */
window.COURSE.lessons.l21 = {
  id: 'l21', num: 21, section: 's4', icon: '💻', duration: '5 min',
  title: 'LLM modely v počítači',
  intro: 'Čo keby model bežal priamo na tvojom notebooku — zadarmo, offline a bez posielania dát do cloudu? Presne to umožňuje Ollama. A vďaka LangChain abstrakcii vymeníš OpenAI za lokálny model jediným riadkom.',
  goals: [
    'Nainštalovať Ollama a stiahnuť model (llama3.2)',
    'Použiť ChatOllama v LangChaine namiesto ChatOpenAI',
    'Poznať výhody a limity lokálnych modelov',
    'Pochopiť silu LangChain abstrakcie: výmena modelu = 1 riadok'
  ],
  blocks: [
    { t: 'h', x: 'Ollama — Docker pre jazykové modely' },
    { t: 'p', x: '<strong>Ollama</strong> je nástroj, ktorý správu lokálnych LLM zjednoduší na úroveň jedného príkazu. Stiahneš inštalátor z <code>ollama.com</code>, a potom v terminále:' },
    { t: 'pycharm', title: 'Terminal — inštalácia modelu', terminal: true, files: [
      { name: 'Terminal', code: `# stiahni model (≈2 GB, open-source od Meta)
ollama pull llama3.2

# rýchly test priamo v terminále
ollama run llama3.2 "Ahoj, kto si?"` }
    ], output: `pulling manifest
pulling dde5aa3fc5ff... 100% ▕████████████████▏ 2.0 GB
verifying sha256 digest
writing manifest
success

Ahoj! Som Llama, jazykový model od spoločnosti Meta. Bežím
priamo na tvojom počítači. Ako ti môžem pomôcť?`,
      note: 'Populárne modely: <b>llama3.2</b> (rýchly všeobecný), <b>mistral</b> (kvalitný 7B), <b>phi3</b> (maličký od Microsoftu), <b>llava</b> (rozumie obrázkom). Zoznam: ollama.com/library.' },
    { t: 'h', x: 'ChatOllama — jeden riadok a si lokálny' },
    { t: 'p', x: 'A teraz tá krása LangChainu: <code>ChatOllama</code> je tiež chatmodel — má rovnaké <code>invoke</code>, <code>stream</code>, funguje v chainoch, agentoch aj RAGu. Celá tvoja aplikácia ostáva nezmenená, vymeníš len jeden riadok:' },
    { t: 'pycharm', title: 'main.py — lokálny model v chaine', files: [
      { name: 'main.py', active: true, code: `from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Žiadny API kľúč, žiadny internet, žiadne poplatky!
model = ChatOllama(model="llama3.2", temperature=0.7)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si stručný asistent. Odpovedáš po slovensky."),
    ("human", "{otazka}"),
])

chain = prompt | model | StrOutputParser()

print(chain.invoke({"otazka": "Prečo je nebo modré?"}))` }
    ], output: `Slnečné svetlo sa v atmosfére rozptyľuje na molekulách vzduchu, pričom modrá zložka svetla sa rozptyľuje najviac — preto vidíme oblohu modrú.`,
      note: 'Inštalácia integrácie: <b>pip install langchain-ollama</b>. Ollama musí bežať na pozadí (spustí sa automaticky po inštalácii).' },
    { t: 'h', x: 'Cloud vs. lokál — kedy čo' },
    { t: 'compare', a: { title: '☁️ Cloud (OpenAI)', items: [
        'Špičková kvalita odpovedí (GPT-4o)',
        'Žiadny nárok na hardvér',
        'Platíš za každý token',
        'Dáta odchádzajú na servery tretej strany',
        'Vyžaduje internet'
      ]}, b: { title: '💻 Lokál (Ollama)', items: [
        'Zadarmo a bez limitov volaní',
        '100 % súkromie — dáta neopustia počítač',
        'Funguje offline',
        'Slabšia kvalita než veľké cloudové modely',
        'Potrebuje výkon (ideálne 16 GB RAM / GPU)'
      ]} },
    { t: 'box', kind: 'key', title: 'Typický scenár z praxe', x: 'Firmy často kombinujú: <strong>vývoj a testy na Ollame</strong> (zadarmo, rýchle iterácie, žiadne dáta von) a <strong>produkcia na GPT-4o</strong> (kvalita). Vďaka tomu, že všetko je v LangChaine „chatmodel", je prepnutie otázkou konfigurácie.' },
    { t: 'box', kind: 'tip', title: 'Citlivé dáta? Lokál!', x: 'Zdravotné záznamy, právne dokumenty, osobné údaje — ak dáta nesmú opustiť firmu, lokálny model + lokálna Chroma znamená, že CELÝ tvoj RAG beží on-premise. Aj embeddingy vieš robiť lokálne (OllamaEmbeddings).' }
  ],
  quiz: [
    { q: 'Akým príkazom stiahneš model llama3.2 cez Ollama?',
      opts: ['ollama install llama3.2', 'ollama pull llama3.2', 'pip install llama3.2', 'ollama download llama3.2'],
      correct: 1, explain: 'ollama pull <model> stiahne model do lokálneho úložiska; ollama run ho rovno spustí na chat v terminále.' },
    { q: 'Čo treba zmeniť v LangChain aplikácii pri prechode z OpenAI na Ollama?',
      opts: ['Prepísať všetky chainy', 'Vymeniť ChatOpenAI za ChatOllama — zvyšok kódu ostáva', 'Zmeniť programovací jazyk', 'Prejsť na inú knižnicu'],
      correct: 1, explain: 'Obe triedy implementujú rovnaké chatmodel rozhranie (Runnable). Prompty, chainy, parsery aj RAG fungujú bez zmeny.' },
    { q: 'Ktorá situácia NAJVIAC volá po lokálnom modeli?',
      opts: ['Marketingový generátor pre verejný web', 'Spracovanie zdravotných záznamov, ktoré nesmú opustiť nemocnicu', 'Chatbot s miliónom používateľov', 'Maximálna kvalita odpovedí'],
      correct: 1, explain: 'Súkromie je killer-feature lokálnych modelov: dáta nikdy neopustia vlastnú infraštruktúru.' },
    { q: 'Hlavná nevýhoda lokálnych modelov oproti GPT-4o?',
      opts: ['Vyžadujú API kľúč', 'Slabšia kvalita odpovedí a nároky na hardvér', 'Sú drahšie', 'Nefungujú s LangChainom'],
      correct: 1, explain: 'Malé open-source modely (3–8B parametrov) nedosahujú kvalitu veľkých cloudových; a potrebuješ slušnú RAM/GPU.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Prepni appku na lokál', xp: 20,
      intro: 'Doplň kód tak, aby chain bežal na lokálnom modeli.',
      code: `from langchain_ollama import ⟦0⟧

model = ChatOllama(⟦1⟧="llama3.2", temperature=0)

chain = prompt | ⟦2⟧ | StrOutputParser()
print(chain.invoke({"otazka": "Čo je Python?"}))`,
      blanks: [['ChatOllama'], ['model'], ['model']],
      hint: 'Trieda sa volá ChatOllama, názov modelu ide do parametra model a v chaine stojí premenná model presne ako pri OpenAI.' },
    { t: 'order', title: 'Od nuly k lokálnemu chatu', xp: 20,
      intro: 'Zoraď kroky sprevádzkovania lokálneho LLM.',
      items: [
        'Nainštaluj Ollama z ollama.com',
        'ollama pull llama3.2 stiahne model',
        'pip install langchain-ollama',
        'V kóde vymeň ChatOpenAI za ChatOllama',
        'Spusti appku — beží offline a zadarmo' ] },
    { t: 'write', title: 'Offline asistent', xp: 30,
      intro: 'Postav kompletný lokálny chain.',
      task: 'Vytvor chain s <code>ChatOllama</code> (model <code>llama3.2</code>), šablónou so system správou a premennou <code>{otazka}</code> a <code>StrOutputParser</code>. Zavolaj ho a vypíš odpoveď.',
      starter: `from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# tvoj kód...`,
      must: [['ChatOllama('], ['llama3.2'], ['from_messages', 'from_template'], ['StrOutputParser'], ['.invoke(']],
      hint: 'Identická stavba ako s OpenAI — len model = ChatOllama(model="llama3.2"). Všimni si: žiadny load_dotenv netreba!',
      solution: `from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOllama(model="llama3.2", temperature=0.7)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si stručný offline asistent."),
    ("human", "{otazka}"),
])

chain = prompt | model | StrOutputParser()
print(chain.invoke({"otazka": "Vysvetli rekurziu jednou vetou."}))` }
  ]
};

/* ============================================================
   LEKCIA 22 — LangSmith
   ============================================================ */
window.COURSE.lessons.l22 = {
  id: 'l22', num: 22, section: 's4', icon: '🔍', duration: '8 min',
  title: 'LangSmith — monitorovanie chainov',
  intro: 'Tvoj RAG odpovedá divne. Je problém v retrieveri? V prompte? V modeli? print() ti nepomôže. LangSmith je „röntgen" pre LangChain aplikácie: každé volanie zaznamená ako strom krokov s časmi, tokenmi a cenou.',
  goals: [
    'Pochopiť, čo je tracing a prečo je pri LLM aplikáciách nenahraditeľný',
    'Zapnúť LangSmith cez štyri premenné v .env — bez zmeny kódu',
    'Čítať trace: strom krokov, latencie, tokeny, cena',
    'Vedieť, čo v trace hľadať pri ladení RAG aplikácie'
  ],
  blocks: [
    { t: 'h', x: 'Problém: LLM aplikácia je čierna skrinka' },
    { t: 'p', x: 'Klasické ladenie cez <code>print()</code> pri reťazi „preformuluj → vyhľadaj → zlož prompt → generuj" rýchlo zlyhá: výstupy sú dlhé texty, krokov je veľa a navzájom sa ovplyvňujú. Potrebuješ vidieť <strong>celý strom volaní</strong> — presne to robí <strong>LangSmith</strong>, oficiálny monitorovací nástroj od tvorcov LangChainu.' },
    { t: 'h', x: 'Zapnutie: štyri riadky v .env' },
    { t: 'p', x: 'Najkrajšie na LangSmith: <strong>nemeníš ani riadok kódu</strong>. Zaregistruješ sa na <code>smith.langchain.com</code> (zadarmo pre vývojárov), vygeneruješ API kľúč a do <code>.env</code> pridáš:' },
    { t: 'pycharm', title: '.env + main.py — tracing bez zmeny kódu', files: [
      { name: '.env', active: true, code: `OPENAI_API_KEY=sk-proj-...tvoj-kluc...

# LangSmith tracing
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_...tvoj-langsmith-kluc...
LANGCHAIN_PROJECT=rag-chatbot-dev` },
      { name: 'main.py', code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()  # načíta aj LangSmith premenné — to je všetko!

chain = (
    ChatPromptTemplate.from_template("Vysvetli {pojem} jednou vetou.")
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)

print(chain.invoke({"pojem": "tracing"}))
# Každé volanie sa odteraz objaví na smith.langchain.com` }
    ], output: `Tracing je zaznamenávanie priebehu programu — každého kroku, jeho vstupov, výstupov a trvania — pre ladenie a monitorovanie.

✅ Trace odoslaný do projektu 'rag-chatbot-dev' na smith.langchain.com`,
      note: 'LANGCHAIN_TRACING_V2=true zapína zber, LANGCHAIN_PROJECT triedi behy do projektov (napr. „dev" vs „produkcia"). Od tejto chvíle sa KAŽDÝ invoke automaticky loguje.' },
    { t: 'h', x: 'Čo uvidíš v trace' },
    { t: 'p', x: 'Na webe smith.langchain.com sa každé volanie zobrazí ako <strong>rozklikávateľný strom</strong>. Pre RAG chatbota s pamäťou z lekcie 19 vyzerá takto:' },
    { t: 'flow', steps: ['🌳 RetrievalChain<br><small>2.84 s · $0.0011</small>', '↳ HistoryAwareRetriever<br><small>preformulovaná otázka!</small>', '↳ ChatOpenAI<br><small>812 tokenov</small>', '↳ Chroma retriever<br><small>3 nájdené chunky</small>', '↳ StuffDocuments<br><small>finálny prompt + odpoveď</small>'] },
    { t: 'table', head: ['Údaj v trace', 'Čo z neho vyčítaš'], rows: [
      ['Vstup/výstup každého kroku', 'PRESNÝ prompt, ktorý šiel do modelu — vrátane dosadeného kontextu z RAG'],
      ['Latencia po krokoch', 'Kde sa stráca čas: pomalý retrieval? pomalý model?'],
      ['Tokeny a cena', 'Koľko stojí jedno volanie — a ktorý krok žerie najviac'],
      ['Nájdené dokumenty', 'Či retriever vrátil SPRÁVNE chunky (najčastejší zdroj zlých odpovedí!)'],
      ['Chyby a retry', 'Ktorý krok spadol a s akou výnimkou']
    ] },
    { t: 'box', kind: 'key', title: 'Najčastejší debugging workflow', x: 'RAG odpovedá zle? Otvor trace → pozri krok retrievera → <strong>sú nájdené chunky relevantné?</strong> Ak nie: ladíš chunk_size, k, alebo search_type (lekcia 12 a 15). Ak áno: pozri finálny prompt — model dostal dobrý kontext a aj tak odpovedá zle? Ladíš system prompt. Bez LangSmith hádaš, s ním vidíš.' },
    { t: 'box', kind: 'tip', title: 'Viac než tracing', x: 'LangSmith vie aj: <strong>datasety a evaluácie</strong> (testovacie otázky + automatické hodnotenie odpovedí), <strong>porovnávanie promptov</strong>, <strong>monitoring produkcie</strong> (dashboardy, alerty) a <strong>anotácie</strong> (ľudia známkujú odpovede). Pre produkčné aplikácie nutnosť.' }
  ],
  quiz: [
    { q: 'Čo treba zmeniť v kóde, aby LangChain aplikácia posielala trace do LangSmith?',
      opts: ['Pridať @trace dekorátory všade', 'Nič — stačia premenné prostredia v .env', 'Prepísať chainy na TracedChain', 'Nainštalovať špeciálny model'],
      correct: 1, explain: 'LangChain má tracing zabudovaný: LANGCHAIN_TRACING_V2=true + API kľúč v prostredí a každé volanie sa loguje automaticky.' },
    { q: 'RAG bot odpovedá nezmysly. Čo skontroluješ v trace ako PRVÉ?',
      opts: ['Verziu Pythonu', 'Či retriever vrátil relevantné chunky k otázke', 'Farbu dashboardu', 'Počet používateľov'],
      correct: 1, explain: 'Najčastejší vinník je retrieval: zlé chunky = zlá odpoveď, nech je model akokoľvek dobrý. Trace ukáže presne, čo retriever našiel.' },
    { q: 'Na čo slúži premenná LANGCHAIN_PROJECT?',
      opts: ['Nastavuje názov Python projektu', 'Triedi traces do pomenovaných projektov (dev, produkcia…)', 'Vyberá model', 'Šifruje logy'],
      correct: 1, explain: 'Projekt je „priečinok" pre traces — oddelíš si vývoj od produkcie alebo rôzne aplikácie medzi sebou.' },
    { q: 'Ktorý údaj v trace NENÁJDEŠ?',
      opts: ['Presný prompt poslaný do modelu', 'Počet tokenov a cenu volania', 'Latenciu jednotlivých krokov', 'Zdrojový kód celej aplikácie'],
      correct: 3, explain: 'Trace zachytáva BEH (vstupy, výstupy, časy, tokeny každého kroku), nie tvoj repozitár.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Zapni tracing', xp: 20,
      intro: 'Doplň .env konfiguráciu LangSmith.',
      code: `# .env
OPENAI_API_KEY=sk-proj-...

LANGCHAIN_⟦0⟧=true
LANGCHAIN_⟦1⟧=lsv2_pt_...
LANGCHAIN_⟦2⟧=moj-chatbot-dev`,
      blanks: [['TRACING_V2'], ['API_KEY'], ['PROJECT']],
      hint: 'Tri premenné: TRACING_V2 (zapnutie), API_KEY (kľúč zo smith.langchain.com) a PROJECT (názov projektu).' },
    { t: 'order', title: 'Debugging zlej odpovede', xp: 20,
      intro: 'Zoraď profesionálny postup ladenia RAG aplikácie cez LangSmith.',
      items: [
        'Používateľ nahlási nezmyselnú odpoveď bota',
        'Otvor príslušný trace na smith.langchain.com',
        'Skontroluj preformulovanú otázku z history-aware retrievera',
        'Over, či nájdené chunky obsahujú odpoveď',
        'Pozri finálny prompt — dostal model správny kontext?',
        'Uprav slabé miesto (chunk_size / k / prompt) a porovnaj nový trace' ] },
    { t: 'write', title: 'Priprav appku na monitoring', xp: 30,
      intro: 'Skombinuj .env súbor a kód — presne ako v praxi.',
      task: 'Napíš obsah <code>.env</code> (OPENAI_API_KEY + tri LANGCHAIN_* premenné s projektom „kurz-final") a pod neho krátky Python skript, ktorý cez <code>load_dotenv()</code> spustí ľubovoľný chain — celé ako jeden súbor s komentárom oddeľujúcim časti.',
      starter: `# === .env ===
# (sem napíš premenné)

# === main.py ===
# (sem napíš kód)`,
      must: [['LANGCHAIN_TRACING_V2=true'], ['LANGCHAIN_API_KEY'], ['LANGCHAIN_PROJECT'], ['load_dotenv()']],
      hint: 'Štyri premenné do .env časti; v kóde stačí load_dotenv() + jednoduchý chain s invoke — tracing sa o zvyšok postará sám.',
      solution: `# === .env ===
OPENAI_API_KEY=sk-proj-XXXX
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_XXXX
LANGCHAIN_PROJECT=kurz-final

# === main.py ===
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
print(model.invoke("Test tracingu").content)` }
  ]
};

/* ============================================================
   LEKCIA 23 — LangServe
   ============================================================ */
window.COURSE.lessons.l23 = {
  id: 'l23', num: 23, section: 's4', icon: '🌐', duration: '4 min',
  title: 'LangServe — deployment modelov ako REST API',
  intro: 'Posledná lekcia kurzu! Tvoj chain funguje — ale ako ho dostane mobilná appka, web či kolegov systém? Cez REST API. LangServe vystaví ľubovoľný chain ako plnohodnotné API jediným volaním add_routes. Vrátane dokumentácie a testovacieho playgroundu.',
  goals: [
    'Vystaviť chain ako REST API cez FastAPI + add_routes',
    'Poznať vygenerované endpointy: /invoke, /batch, /stream, /playground',
    'Otestovať API v prehliadači aj cez RemoteRunnable',
    'Zavŕšiť kurz — máš celý životný cyklus LLM aplikácie'
  ],
  blocks: [
    { t: 'h', x: 'Od skriptu k službe' },
    { t: 'p', x: '<strong>LangServe</strong> spája LangChain so známym webovým frameworkom <strong>FastAPI</strong>. Princíp: vytvoríš FastAPI aplikáciu, zavoláš <code>add_routes(app, chain, path="/nieco")</code> a LangServe za teba vygeneruje kompletné API so všetkými metódami Runnable rozhrania. Inštalácia: <code>pip install "langserve[all]" fastapi uvicorn</code>.' },
    { t: 'pycharm', title: 'server.py — chain ako REST API', files: [
      { name: 'server.py', active: true, code: `from dotenv import load_dotenv
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langserve import add_routes
import uvicorn

load_dotenv()

chain = (
    ChatPromptTemplate.from_template(
        "Prelož nasledujúci text do jazyka {jazyk}: {text}"
    )
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | StrOutputParser()
)

app = FastAPI(title="Prekladač API", version="1.0")

# Jediný riadok: chain → REST API
add_routes(app, chain, path="/prekladac")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)` }
    ], output: `INFO:     Started server process [4821]
INFO:     Waiting for application startup.

     __          ___      .__   __.   _______      _______. _______ .______     ____    ____  _______
    |  |        /   \\     |  \\ |  |  /  _____|    /       ||   ____||   _  \\    \\   \\  /   / |   ____|
    |  |       /  ^  \\    |   \\|  | |  |  __     |   (---- |  |__   |  |_)  |    \\   \\/   /  |  |__
    |  |      /  /_\\  \\   |  . \`  | |  | |_ |     \\   \\    |   __|  |      /      \\      /   |   __|
    |  \`----./  _____  \\  |  |\\   | |  |__| | .----)   |   |  |____ |  |\\  \\----.  \\    /    |  |____
    |_______/__/     \\__\\ |__| \\__|  \\______| |_______/    |_______|| _| \`._____|   \\__/     |_______|

LANGSERVE: Playground for chain "/prekladac" is live at:  /prekladac/playground/
INFO:     Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)`,
      note: 'Server beží! Otvor <b>http://localhost:8000/prekladac/playground/</b> — LangServe vygeneroval aj interaktívne webové rozhranie na testovanie chainu.' },
    { t: 'h', x: 'Čo všetko API vie' },
    { t: 'table', head: ['Endpoint', 'Metóda', 'Čo robí'], rows: [
      ['<code>/prekladac/invoke</code>', 'POST', 'Jedno volanie chainu — telo: <code>{"input": {"jazyk": "...", "text": "..."}}</code>'],
      ['<code>/prekladac/batch</code>', 'POST', 'Viac vstupov naraz'],
      ['<code>/prekladac/stream</code>', 'POST', 'Streamovaná odpoveď (server-sent events)'],
      ['<code>/prekladac/playground/</code>', 'GET', 'Interaktívne testovacie UI v prehliadači'],
      ['<code>/docs</code>', 'GET', 'Automatická OpenAPI (Swagger) dokumentácia celého API']
    ] },
    { t: 'p', x: 'Všimni si: <code>/invoke</code>, <code>/batch</code>, <code>/stream</code> — presne metódy Runnable rozhrania z lekcie o LCEL! LangServe ich len vystavil cez HTTP. A klientská strana? LangChain má <code>RemoteRunnable</code> — vzdialený chain sa správa ako lokálny:' },
    { t: 'pycharm', title: 'klient.py — volanie API z inej aplikácie', files: [
      { name: 'klient.py', active: true, code: `from langserve import RemoteRunnable

# Vzdialený chain — rovnaké rozhranie ako lokálny!
prekladac = RemoteRunnable("http://localhost:8000/prekladac/")

vysledok = prekladac.invoke({
    "jazyk": "angličtina",
    "text": "LangChain kurz mám úspešne za sebou!"
})
print(vysledok)` }
    ], output: `I have successfully completed the LangChain course!`,
      note: 'RemoteRunnable má invoke, batch aj stream — API môžeš volať aj z JavaScriptu, mobilu či cez obyčajný curl/requests.' },
    { t: 'box', kind: 'key', title: 'Celý životný cyklus máš za sebou', x: 'Pozri, čo už ovládaš: <strong>vývoj</strong> (modely → prompty → chainy → RAG → chatboty) → <strong>UI</strong> (Streamlit) → <strong>alternatívy</strong> (lokálne LLM) → <strong>monitoring</strong> (LangSmith) → <strong>deployment</strong> (LangServe). To je kompletná výbava AI vývojára. Zostáva záverečný test a projekt! 🎓' }
  ],
  quiz: [
    { q: 'Ktorý riadok vystaví chain ako REST API?',
      opts: ['app.deploy(chain)', 'add_routes(app, chain, path="/prekladac")', 'chain.serve(port=8000)', 'fastapi.expose(chain)'],
      correct: 1, explain: 'add_routes z balíka langserve pripojí chain k FastAPI aplikácii a vygeneruje všetky endpointy.' },
    { q: 'Ktoré endpointy LangServe automaticky vytvorí?',
      opts: ['/run a /test', '/invoke, /batch, /stream a /playground', '/get a /post', '/chain a /model'],
      correct: 1, explain: 'Vystaví HTTP verzie metód Runnable rozhrania + bonusový interaktívny playground a OpenAPI dokumentáciu na /docs.' },
    { q: 'Na čo slúži RemoteRunnable?',
      opts: ['Spúšťa chain v cloude OpenAI', 'Volá vzdialené LangServe API s rovnakým rozhraním ako lokálny chain', 'Sťahuje modely', 'Nahrádza FastAPI'],
      correct: 1, explain: 'RemoteRunnable("http://...") je klient — má invoke/batch/stream, takže vzdialený chain používaš identicky ako lokálny.' },
    { q: 'Čo je /prekladac/playground/?',
      opts: ['Herňa pre vývojárov', 'Automaticky vygenerované webové UI na interaktívne testovanie chainu', 'Testovacie prostredie OpenAI', 'Záložná verzia API'],
      correct: 1, explain: 'LangServe ku každému chainu vygeneruje playground — formulár so vstupmi chainu priamo v prehliadači, ideálny na rýchle demo.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Vystav API', xp: 20,
      intro: 'Doplň minimálny LangServe server.',
      code: `from fastapi import FastAPI
from langserve import ⟦0⟧
import uvicorn

app = ⟦1⟧(title="Moje AI API")

⟦2⟧(app, chain, path="/asistent")

if __name__ == "__main__":
    uvicorn.⟦3⟧(app, host="localhost", port=8000)`,
      blanks: [['add_routes'], ['FastAPI'], ['add_routes'], ['run']],
      hint: 'Z langserve importuješ add_routes, aplikácia je FastAPI(...), a server spúšťa uvicorn.run.' },
    { t: 'order', title: 'Cesta k nasadeniu', xp: 20,
      intro: 'Zoraď kroky od hotového chainu po fungujúce API.',
      items: [
        'pip install "langserve[all]" fastapi uvicorn',
        'Vytvor FastAPI aplikáciu',
        'add_routes(app, chain, path="/sluzba")',
        'uvicorn.run(app, host="localhost", port=8000)',
        'Otestuj v playgrounde na /sluzba/playground/',
        'Klienti volajú API cez RemoteRunnable alebo HTTP' ] },
    { t: 'write', title: 'Nasaď sumarizátor', xp: 30,
      intro: 'Posledné cvičenie kurzu — nasaď vlastnú službu!',
      task: 'Napíš kompletný <code>server.py</code>: chain so šablónou „Zhrň text do jednej vety: {text}", model, parser; FastAPI app; <code>add_routes</code> s cestou <code>/sumar</code> a spustenie cez <code>uvicorn.run</code>.',
      starter: `from dotenv import load_dotenv
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langserve import add_routes
import uvicorn

load_dotenv()
# tvoj kód...`,
      must: [['{text}'], ['FastAPI('], ['add_routes(app'], ['/sumar'], ['uvicorn.run']],
      hint: 'chain = prompt | model | parser → app = FastAPI() → add_routes(app, chain, path="/sumar") → uvicorn.run(app, host="localhost", port=8000).',
      solution: `from dotenv import load_dotenv
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langserve import add_routes
import uvicorn

load_dotenv()

chain = (
    ChatPromptTemplate.from_template("Zhrň text do jednej vety: {text}")
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | StrOutputParser()
)

app = FastAPI(title="Sumarizátor API")
add_routes(app, chain, path="/sumar")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)` }
  ]
};
