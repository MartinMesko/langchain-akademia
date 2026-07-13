/* ============================================================
   OBSAH KURZU — Lekcie 6–12
   ============================================================ */

/* ============================================================
   LEKCIA 6 — Output Parsers
   ============================================================ */
window.COURSE.lessons.l6 = {
  id: 'l6', num: 6, section: 's1', icon: '📦', duration: '5 min',
  title: 'Output Parsers — extrakcia výstupov modelu',
  intro: 'Model vždy vracia text. Ale tvoja aplikácia často potrebuje zoznam, slovník alebo validovaný objekt. Output parsery sú prekladatelia medzi „rečou modelu" a dátovými štruktúrami Pythonu.',
  goals: [
    'Premeniť AIMessage na čistý string cez StrOutputParser',
    'Získať z modelu Python zoznam cez CommaSeparatedListOutputParser',
    'Vynútiť JSON výstup cez JsonOutputParser a format_instructions',
    'Validovať štruktúru odpovede cez PydanticOutputParser'
  ],
  blocks: [
    { t: 'h', x: 'Problém: všetko je len text' },
    { t: 'p', x: 'Požiadaš model o zoznam ingrediencií a dostaneš pekný odsek textu s odrážkami. Lenže ty potrebuješ <code>["múka", "vajcia", "mlieko"]</code> — skutočný Python list, s ktorým vieš ďalej pracovať. Parser rieši obe strany problému: <strong>povie modelu, v akom formáte má odpovedať</strong>, a potom <strong>odpoveď prevedie na Python objekt</strong>.' },
    { t: 'table', head: ['Parser', 'Výstup', 'Typické použitie'], rows: [
      ['<code>StrOutputParser</code>', '<code>str</code>', 'Najčastejší — len vytiahne text z AIMessage'],
      ['<code>CommaSeparatedListOutputParser</code>', '<code>list[str]</code>', 'Zoznamy: nápady, tagy, ingrediencie'],
      ['<code>JsonOutputParser</code>', '<code>dict</code>', 'Štruktúrované dáta: extrakcia polí z textu'],
      ['<code>PydanticOutputParser</code>', 'Pydantic objekt', 'Validované dáta s typmi — pre serióznu produkciu']
    ] },
    { t: 'h', x: 'Zoznam namiesto odseku' },
    { t: 'p', x: 'Parsery majú geniálny trik: metódu <code>get_format_instructions()</code>. Tá vygeneruje inštrukciu pre model („odpovedz hodnotami oddelenými čiarkami…"), ktorú vložíš do promptu. Model poslúchne a parser potom výstup bez problémov rozseká:' },
    { t: 'pycharm', title: 'main.py — zoznam z modelu', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import CommaSeparatedListOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

parser = CommaSeparatedListOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Odpovedáš presne podľa formátu: {format_instructions}"),
    ("human", "Vymenuj 5 ingrediencií na {jedlo}.")
]).partial(format_instructions=parser.get_format_instructions())

chain = prompt | model | parser

ingrediencie = chain.invoke({"jedlo": "palacinky"})
print(ingrediencie)
print("Počet:", len(ingrediencie), "| Prvá:", ingrediencie[0])` }
    ], output: `['múka', 'mlieko', 'vajcia', 'cukor', 'soľ']
Počet: 5 | Prvá: múka`,
      note: '<b>.partial()</b> preddosadí format_instructions hneď pri tvorbe šablóny — pri invoke() potom posielaš už len {jedlo}. Výsledok je skutočný Python list!' },
    { t: 'h', x: 'JSON — štruktúrovaná extrakcia' },
    { t: 'p', x: 'Najužitočnejší scenár v praxi: z neštruktúrovaného textu (e-mail, recenzia, životopis) vytiahnuť <strong>konkrétne polia</strong>. <code>JsonOutputParser</code> vráti rovno slovník:' },
    { t: 'pycharm', title: 'main.py — extrakcia údajov do JSON', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_template(
    "Z textu vytiahni polia: meno, mesto, vek. "
    "Odpovedz iba čistým JSON.\\n\\nText: {text}"
)

chain = prompt | model | parser

data = chain.invoke({"text": "Volám sa Jana Nováková, mám 29 rokov a žijem v Trnave."})
print(data)
print("Meno z dict:", data["meno"])` }
    ], output: `{'meno': 'Jana Nováková', 'mesto': 'Trnava', 'vek': 29}
Meno z dict: Jana Nováková` },
    { t: 'h', x: 'Pydantic — keď to musí byť nepriestrelné' },
    { t: 'p', x: 'JSON parser ti verí, že model vráti správne polia. <code>PydanticOutputParser</code> ide ďalej: definuje <strong>presnú schému s typmi</strong> a odpoveď proti nej <strong>zvaliduje</strong>. Ak model vráti nezmysel, dozvieš sa to okamžite výnimkou, nie tichým bugom:' },
    { t: 'pycharm', title: 'main.py — validovaný výstup cez Pydantic', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

class Recept(BaseModel):
    nazov: str = Field(description="názov jedla")
    porcie: int = Field(description="počet porcií")
    ingrediencie: list[str] = Field(description="zoznam ingrediencií")

parser = PydanticOutputParser(pydantic_object=Recept)

prompt = ChatPromptTemplate.from_template(
    "Vytvor jednoduchý recept na {jedlo}.\\n{format_instructions}"
).partial(format_instructions=parser.get_format_instructions())

chain = prompt | model | parser

recept = chain.invoke({"jedlo": "bryndzové halušky"})
print("Typ:", type(recept).__name__)
print("Názov:", recept.nazov, "| Porcie:", recept.porcie)
print("Ingrediencie:", recept.ingrediencie)` }
    ], output: `Typ: Recept
Názov: Bryndzové halušky | Porcie: 4
Ingrediencie: ['zemiaky', 'hrubá múka', 'bryndza', 'slanina', 'soľ']`,
      note: 'Výsledok je plnohodnotný objekt triedy Recept — IDE ti našepkáva polia, typy sú garantované. Toto je zlatý štandard pre produkčné aplikácie.' },
    { t: 'box', kind: 'tip', title: 'Ktorý parser kedy?', x: 'Rýchly prototyp či chat → <strong>StrOutputParser</strong>. Jednoduchý zoznam → <strong>CommaSeparatedList</strong>. Extrakcia polí → <strong>JsonOutputParser</strong>. Produkčný kód, kde na štruktúre záleží → <strong>PydanticOutputParser</strong>.' }
  ],
  quiz: [
    { q: 'Čo vráti chain prompt | model | StrOutputParser()?',
      opts: ['AIMessage', 'Čistý string s textom odpovede', 'Slovník', 'PromptValue'],
      correct: 1, explain: 'StrOutputParser vytiahne z AIMessage obsah .content — výsledkom reťaze je obyčajný string.' },
    { q: 'Ako sa model dozvie, v akom formáte má odpovedať?',
      opts: ['Parser mu to povie telepaticky po vygenerovaní', 'Cez format_instructions od parsera, ktoré vložíme do promptu', 'LangChain upraví váhy modelu', 'Formát sa nedá ovplyvniť'],
      correct: 1, explain: 'parser.get_format_instructions() vygeneruje textovú inštrukciu o formáte — tú vložíš do promptu (často cez .partial()). Parser potom výstup spracuje.' },
    { q: 'Aká je hlavná výhoda PydanticOutputParser oproti JsonOutputParser?',
      opts: ['Je rýchlejší', 'Výstup validuje proti schéme s typmi — chyby odhalí okamžite', 'Nepotrebuje model', 'Vracia krajší text'],
      correct: 1, explain: 'Pydantic parser vráti typovaný, zvalidovaný objekt. Ak model vráti zlé polia či typy, dostaneš výnimku namiesto tichej chyby v dátach.' },
    { q: 'Čo robí metóda .partial() na šablóne?',
      opts: ['Spustí šablónu len čiastočne', 'Preddosadí časť premenných vopred — zvyšok doplníš pri invoke()', 'Rozdelí prompt na polovice', 'Zmaže premenné zo šablóny'],
      correct: 1, explain: 'partial() vytvorí šablónu s už dosadenými niektorými hodnotami (typicky format_instructions). Pri volaní potom posielaš len zvyšné premenné.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Chain so zoznamom', xp: 20,
      intro: 'Doplň parser tak, aby chain vrátil skutočný Python list nápadov.',
      code: `parser = ⟦0⟧()

prompt = ChatPromptTemplate.from_messages([
    ("system", "{format_instructions}"),
    ("human", "Vymysli 4 názvy pre {co}.")
]).partial(format_instructions=parser.⟦1⟧())

chain = prompt | model | ⟦2⟧

napady = chain.invoke({"co": "kaviareň"})
print(napady[0])  # prvý nápad zo zoznamu`,
      blanks: [['CommaSeparatedListOutputParser'], ['get_format_instructions'], ['parser']],
      hint: 'Zoznamový parser sa volá CommaSeparatedListOutputParser, inštrukcie generuje get_format_instructions() a na konci reťaze stojí samotný parser.' },
    { t: 'write', title: 'Extraktor úloh z e-mailu', xp: 30,
      intro: 'Praktická úloha ako z reálnej firmy: štruktúrovaná extrakcia.',
      task: 'Postav chain s <code>JsonOutputParser</code>, ktorý z textu e-mailu vytiahne polia <code>odosielatel</code> a <code>uloha</code>. Použi šablónu s premennou <code>{text}</code>, model s <code>temperature=0</code> a výsledok (slovník) vypíš.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
# tvoj kód...`,
      must: [['JsonOutputParser'], ['temperature=0', 'temperature = 0'], ['{text}'], ['.invoke(']],
      hint: 'Prompt typu: "Z e-mailu vytiahni odosielateľa a úlohu. Odpovedz iba JSON s poľami odosielatel, uloha. E-mail: {text}". Chain = prompt | model | parser.',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_template(
    "Z e-mailu vytiahni polia: odosielatel, uloha. "
    "Odpovedz iba čistým JSON. E-mail: {text}"
)

chain = prompt | model | parser
data = chain.invoke({"text": "Ahoj, tu Peter z účtarne. Pošli mi prosím faktúry za máj."})
print(data)` }
  ]
};

/* ============================================================
   LEKCIA 7 — LCEL
   ============================================================ */
window.COURSE.lessons.l7 = {
  id: 'l7', num: 7, section: 's1', icon: '🔗', duration: '3 min',
  title: 'LCEL — LangChain Expression Language',
  intro: 'Ten operátor |, ktorý používaš od lekcie o chainoch, má meno: LCEL. Je to celý „jazyk" na skladanie komponentov — a každý článok v ňom automaticky vie invoke, batch aj stream. Spoznaj jeho tri superschopnosti.',
  goals: [
    'Pochopiť rozhranie Runnable: invoke / batch / stream má každý komponent',
    'Spracovať viac vstupov naraz cez batch()',
    'Spúšťať viac chainov súčasne cez RunnableParallel',
    'Vkladať vlastné funkcie do reťaze cez RunnableLambda'
  ],
  blocks: [
    { t: 'h', x: 'Všetko je Runnable' },
    { t: 'p', x: 'LCEL (LangChain Expression Language) stojí na jednej myšlienke: <strong>každý komponent</strong> — šablóna, model, parser, retriever aj celý chain — implementuje rovnaké rozhranie <code>Runnable</code>. A keď spojíš dva Runnable cez <code>|</code>, vznikne… opäť Runnable. Preto sa dajú skladať donekonečna.' },
    { t: 'table', head: ['Metóda', 'Čo robí', 'Príklad'], rows: [
      ['<code>invoke(vstup)</code>', 'Jeden vstup → jeden výstup', '<code>chain.invoke({"tema": "more"})</code>'],
      ['<code>batch([v1, v2…])</code>', 'Zoznam vstupov naraz — paralelne!', '<code>chain.batch([{...}, {...}])</code>'],
      ['<code>stream(vstup)</code>', 'Výstup po chunkoch, ako rastie', '<code>for ch in chain.stream({...})</code>']
    ] },
    { t: 'pycharm', title: 'main.py — batch a stream na celom chaine', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

chain = (
    ChatPromptTemplate.from_template("Jednou vetou: čo je {pojem}?")
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | StrOutputParser()
)

# BATCH: tri otázky jedným volaním (bežia súbežne)
odpovede = chain.batch([
    {"pojem": "algoritmus"},
    {"pojem": "premenná"},
    {"pojem": "funkcia"},
])
for o in odpovede:
    print("•", o)

# STREAM: odpoveď nabieha postupne
for chunk in chain.stream({"pojem": "rekurzia"}):
    print(chunk, end="", flush=True)` }
    ], output: `• Algoritmus je presný postup krokov, ktorý vedie k vyriešeniu úlohy.
• Premenná je pomenované miesto v pamäti, kde program uchováva hodnotu.
• Funkcia je pomenovaný blok kódu, ktorý vykoná úlohu a dá sa opakovane volať.
Rekurzia je technika, pri ktorej funkcia volá samú seba, kým nedosiahne základný prípad.`,
      note: 'batch() interne paralelizuje volania API — tri otázky netrvajú 3× dlhšie, ale približne ako jedna.' },
    { t: 'h', x: 'RunnableParallel — vetvenie reťaze' },
    { t: 'p', x: 'Keď chceš z jedného vstupu vyrobiť <strong>viac výstupov naraz</strong> (napr. vtip aj báseň na rovnakú tému), použiješ <code>RunnableParallel</code>. Výsledkom je slovník — kľúče si volíš sám:' },
    { t: 'pycharm', title: 'main.py — dva chainy paralelne', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
parser = StrOutputParser()

chain_vtip = ChatPromptTemplate.from_template("Krátky vtip o {tema}.") | model | parser
chain_fakt = ChatPromptTemplate.from_template("Jeden zaujímavý fakt o {tema}.") | model | parser

paralel = RunnableParallel(vtip=chain_vtip, fakt=chain_fakt)

vysledok = paralel.invoke({"tema": "kávе"})
print("VTIP:", vysledok["vtip"])
print("FAKT:", vysledok["fakt"])

# RunnableLambda: vlastná funkcia ako článok reťaze
na_velke = RunnableLambda(lambda text: text.upper())
chain_krik = chain_vtip | na_velke
print(chain_krik.invoke({"tema": "pondelok"}))` }
    ], output: `VTIP: Prečo si káva nikdy nič nepamätá? Lebo má krátkodobú espresso pamäť!
FAKT: Káva je po rope druhá najobchodovanejšia komodita sveta.
PREČO PROGRAMÁTOR NEZNÁŠA PONDELOK? LEBO SA NEDÁ ZAKOMENTOVAŤ.`,
      note: 'Obe vetvy RunnableParallel bežia súčasne. RunnableLambda zabalí hocijakú Python funkciu, aby sa dala zapojiť do reťaze cez |.' },
    { t: 'box', kind: 'key', title: 'LCEL v kocke', x: '<code>|</code> = sekvencia (za sebou) · <code>RunnableParallel</code> = vetvenie (vedľa seba) · <code>RunnableLambda</code> = vlastná funkcia v reťazi · <code>RunnablePassthrough</code> = pošli vstup ďalej nezmenený (zíde sa pri RAG v lekcii 15). Z týchto kociek poskladáš ľubovoľnú architektúru.' }
  ],
  quiz: [
    { q: 'Ktoré tri metódy má automaticky každý Runnable (aj celý chain)?',
      opts: ['run, execute, start', 'invoke, batch, stream', 'get, post, put', 'call, apply, map'],
      correct: 1, explain: 'Rozhranie Runnable garantuje invoke (jeden vstup), batch (zoznam vstupov paralelne) a stream (postupný výstup). Platí pre každý komponent aj ich kompozície.' },
    { q: 'Čo vráti RunnableParallel(vtip=chain1, fakt=chain2).invoke({...})?',
      opts: ['Zoznam dvoch stringov', 'Slovník {"vtip": ..., "fakt": ...}', 'Len výstup rýchlejšieho chainu', 'Tuple'],
      correct: 1, explain: 'RunnableParallel spustí vetvy súčasne a výsledky vráti v slovníku pod kľúčmi, ktoré si zvolil pri jeho tvorbe.' },
    { q: 'Načo slúži RunnableLambda?',
      opts: ['Na spúšťanie AWS Lambda funkcií', 'Zabalí obyčajnú Python funkciu, aby mohla byť článkom reťaze', 'Na anonymné volania API', 'Nahrádza model v chaine'],
      correct: 1, explain: 'RunnableLambda(moja_funkcia) urobí z funkcie plnohodnotný Runnable — môžeš ju vložiť do reťaze cez | a transformovať dáta medzi článkami.' },
    { q: 'Máš 50 recenzií a chceš ich všetky klasifikovať čo najrýchlejšie. Čo použiješ?',
      opts: ['50× invoke() v cykle', 'chain.batch(zoznam_recenzii)', 'chain.stream()', 'RunnableLambda'],
      correct: 1, explain: 'batch() spracuje zoznam vstupov paralelne — výrazne rýchlejšie než sekvenčný cyklus s invoke().' }
  ],
  exercises: [
    { t: 'blanks', title: 'Tri superschopnosti', xp: 20,
      intro: 'Doplň správne metódy LCEL rozhrania.',
      code: `# 1) jeden vstup
odpoved = chain.⟦0⟧({"tema": "Python"})

# 2) viac vstupov naraz (paralelne)
odpovede = chain.⟦1⟧([{"tema": "Java"}, {"tema": "C++"}])

# 3) postupný výstup po kúskoch
for chunk in chain.⟦2⟧({"tema": "Rust"}):
    print(chunk, end="")`,
      blanks: [['invoke'], ['batch'], ['stream']],
      hint: 'Jeden vstup = invoke, zoznam vstupov = batch, postupné generovanie = stream.' },
    { t: 'order', title: 'Poskladaj LCEL reťaz', xp: 20,
      intro: 'Zoraď komponenty tak, ako nimi tečú dáta pri chain.invoke().',
      items: [
        'Vstupný slovník od používateľa',
        'ChatPromptTemplate doplní premenné',
        'ChatOpenAI vygeneruje AIMessage',
        'RunnableLambda upraví text vlastnou funkciou',
        'Finálny výstup chainu' ] },
    { t: 'write', title: 'Paralelný prekladač', xp: 30,
      intro: 'Jeden vstup, dva jazyky, jedno volanie.',
      task: 'Vytvor dva chainy — jeden prekladá <code>{text}</code> do angličtiny, druhý do nemčiny. Spoj ich cez <code>RunnableParallel(en=..., de=...)</code>, zavolaj s ľubovoľnou vetou a vypíš obe hodnoty zo slovníka.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = StrOutputParser()
# tvoj kód...`,
      must: [['RunnableParallel'], ['{text}'], ['.invoke(']],
      hint: 'chain_en = prompt_en | model | parser (a podobne de). Potom RunnableParallel(en=chain_en, de=chain_de).invoke({"text": "..."}) vráti slovník s kľúčmi en a de.',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = StrOutputParser()

chain_en = ChatPromptTemplate.from_template("Prelož do angličtiny: {text}") | model | parser
chain_de = ChatPromptTemplate.from_template("Prelož do nemčiny: {text}") | model | parser

paralel = RunnableParallel(en=chain_en, de=chain_de)
vysledok = paralel.invoke({"text": "Dnes je krásny deň."})
print("EN:", vysledok["en"])
print("DE:", vysledok["de"])` }
  ]
};

/* ============================================================
   LEKCIA 8 — Tools
   ============================================================ */
window.COURSE.lessons.l8 = {
  id: 'l8', num: 8, section: 's1', icon: '🧰', duration: '7 min',
  title: 'Tools — nástroje na všetko možné',
  intro: 'Jazykový model nevie, koľko je hodín, nespočíta presne 4 587 × 1 093 a nepozná dnešné správy. Nástroje (tools) mu požičajú ruky: Python funkcie, ktoré môže model požiadať o vykonanie. Sú základom agentov.',
  goals: [
    'Pochopiť, prečo model potrebuje nástroje (limity LLM)',
    'Vytvoriť vlastný nástroj dekorátorom @tool',
    'Vedieť, prečo je docstring nástroja kriticky dôležitý',
    'Pripojiť nástroje k modelu cez bind_tools() a čítať tool_calls'
  ],
  blocks: [
    { t: 'h', x: 'Čo model nedokáže sám' },
    { t: 'ul', items: [
      '<strong>Aktuálne informácie</strong> — model má znalosti len do dátumu tréningu (knowledge cutoff)',
      '<strong>Presné výpočty</strong> — LLM „háda" číslice štatisticky, pri veľkých číslach sa mýli',
      '<strong>Akcie vo svete</strong> — poslať e-mail, zapísať do databázy, zavolať API',
      '<strong>Tvoje súkromné dáta</strong> — firemné systémy, interné databázy'
    ]},
    { t: 'p', x: 'Riešenie: dáš modelu k dispozícii <strong>nástroje</strong> — obyčajné Python funkcie s dobrým popisom. Model potom pri otázke sám rozhodne: „na toto potrebujem nástroj X s argumentmi Y".' },
    { t: 'h', x: 'Dekorátor @tool' },
    { t: 'p', x: 'Nástroj vyrobíš z funkcie jediným riadkom — dekorátorom <code>@tool</code>. Kľúčové sú tri veci: <strong>výstižný názov</strong>, <strong>typové anotácie</strong> argumentov a hlavne <strong>docstring</strong> — práve z neho model pochopí, kedy nástroj použiť:' },
    { t: 'pycharm', title: 'main.py — prvý vlastný nástroj', files: [
      { name: 'main.py', active: true, code: `from datetime import datetime
from langchain_core.tools import tool

@tool
def aktualny_cas() -> str:
    """Vráti aktuálny dátum a čas. Použi vždy, keď sa otázka týka
    dnešného dátumu, dňa v týždni alebo aktuálneho času."""
    return datetime.now().strftime("%d.%m.%Y %H:%M")

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla a a b. Použi na akékoľvek násobenie."""
    return a * b

# Nástroj je Runnable — dá sa otestovať samostatne cez invoke
print("Názov:", vynasob.name)
print("Popis:", vynasob.description)
print("Test:", vynasob.invoke({"a": 4587, "b": 1093}))` }
    ], output: `Názov: vynasob
Popis: Presne vynásobí dve čísla a a b. Použi na akékoľvek násobenie.
Test: 5013591.0`,
      note: 'Dekorátor z funkcie vyrobil objekt s .name, .description (z docstringu!) a .args schémou. Aj nástroj má invoke() — všetko v LangChaine je Runnable.' },
    { t: 'box', kind: 'warn', title: 'Docstring nie je formalita', x: 'Model vyberá nástroj <strong>výhradne podľa názvu a docstringu</strong>. Nejasný popis („pomocná funkcia") = model nástroj nepoužije alebo použije zle. Píš docstring ako návod pre kolegu: čo nástroj robí a KEDY ho použiť.' },
    { t: 'h', x: 'bind_tools — model sa dozvie o nástrojoch' },
    { t: 'p', x: 'Metóda <code>bind_tools()</code> pripojí zoznam nástrojov k modelu. Pozor na kľúčový moment: model nástroj <strong>nespúšťa</strong>! Len vráti štruktúrovanú požiadavku <code>tool_calls</code> — „prosím, zavolaj vynasob s a=25, b=17". Spustenie je na nás (alebo na agentovi, ktorého spoznáš v ďalšej lekcii):' },
    { t: 'pycharm', title: 'main.py — model si pýta nástroj', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

load_dotenv()

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla a a b."""
    return a * b

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_s_nastrojmi = model.bind_tools([vynasob])

odpoved = model_s_nastrojmi.invoke("Koľko je 25 krát 17?")

print("Text odpovede:", repr(odpoved.content))
print("Tool calls:", odpoved.tool_calls)

# Spustíme nástroj ručne s argumentmi od modelu
volanie = odpoved.tool_calls[0]
vysledok = vynasob.invoke(volanie["args"])
print("Výsledok nástroja:", vysledok)` }
    ], output: `Text odpovede: ''
Tool calls: [{'name': 'vynasob', 'args': {'a': 25, 'b': 17}, 'id': 'call_Xk2...', 'type': 'tool_call'}]
Výsledok nástroja: 425.0`,
      note: 'Všimni si: content je prázdny — model namiesto odpovede vrátil požiadavku na nástroj so správne vyplnenými argumentmi. Presne tento mechanizmus poháňa agentov.' },
    { t: 'h', x: 'Hotové nástroje od komunity' },
    { t: 'p', x: 'Nemusíš všetko písať sám — balík <code>langchain_community</code> obsahuje stovky hotových nástrojov: vyhľadávanie na webe (<code>DuckDuckGoSearchRun</code>), Wikipedia (<code>WikipediaQueryRun</code>), Python interpreter, SQL databázy, Gmail a ďalšie. Inštalujú sa cez <code>pip install langchain-community duckduckgo-search wikipedia</code>.' }
  ],
  quiz: [
    { q: 'Podľa čoho sa model rozhoduje, ktorý nástroj použiť?',
      opts: ['Podľa poradia v zozname', 'Podľa názvu a docstringu (popisu) nástroja', 'Skúša všetky postupne', 'Náhodne'],
      correct: 1, explain: 'Model dostane názvy, popisy a schémy argumentov nástrojov. Rozhoduje sa čisto podľa nich — preto je kvalitný docstring kritický.' },
    { q: 'Čo urobí model po bind_tools(), keď otázka vyžaduje nástroj?',
      opts: ['Sám nástroj spustí a vráti výsledok', 'Vráti tool_calls — štruktúrovanú požiadavku na zavolanie nástroja', 'Odmietne odpovedať', 'Vráti kód nástroja'],
      correct: 1, explain: 'Model nástroje nikdy nespúšťa — len vráti tool_calls s názvom a argumentmi. Vykonanie je na našej strane (ručne alebo cez AgentExecutor).' },
    { q: 'Prečo LLM potrebuje nástroj na násobenie veľkých čísel?',
      opts: ['Lebo Python nevie násobiť', 'Model generuje číslice štatisticky a pri veľkých číslach sa často pomýli', 'Násobenie je zakázané v API', 'Nepotrebuje — modely počítajú bezchybne'],
      correct: 1, explain: 'LLM nepočíta, ale predpovedá tokeny. Pri zložitejšej aritmetike preto chybuje — presný výpočet zabezpečí Python funkcia.' },
    { q: 'Ktorý zápis správne vytvorí nástroj?',
      opts: ['def moj_tool(): pass  # bez ničoho', '@tool nad funkciou s docstringom a typmi', 'tool = Tool() bez funkcie', 'model.add_tool(funkcia)'],
      correct: 1, explain: 'Najjednoduchšia cesta: dekorátor @tool nad funkciou, ktorá má typové anotácie a opisný docstring.' }
  ],
  exercises: [
    { t: 'write', title: 'Vlastný nástroj: počítadlo znakov', xp: 30,
      intro: 'LLM nevie spoľahlivo počítať písmená v slove — vyrob mu na to nástroj!',
      task: 'Vytvor nástroj <code>pocet_znakov</code> dekorátorom <code>@tool</code>: funkcia dostane <code>text: str</code>, vráti <code>int</code> a má docstring vysvetľujúci kedy ju použiť. Potom ju otestuj cez <code>.invoke({"text": "LangChain"})</code> a vypíš výsledok.',
      starter: `from langchain_core.tools import tool

# tvoj kód...`,
      must: [['@tool'], ['def pocet_znakov'], ['"""'], ['.invoke(']],
      hint: 'Dekorátor @tool píš priamo nad def. Docstring v trojitých úvodzovkách hneď pod def. Telo: return len(text).',
      solution: `from langchain_core.tools import tool

@tool
def pocet_znakov(text: str) -> int:
    """Spočíta presný počet znakov v texte.
    Použi vždy, keď treba zistiť dĺžku slova alebo vety."""
    return len(text)

print(pocet_znakov.invoke({"text": "LangChain"}))` },
    { t: 'blanks', title: 'Pripoj nástroje k modelu', xp: 20,
      intro: 'Doplň kód, ktorý modelu sprístupní nástroje a prečíta jeho požiadavku.',
      code: `model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

model_s_nastrojmi = model.⟦0⟧([vynasob, aktualny_cas])

odpoved = model_s_nastrojmi.invoke("Koľko je 111 krát 222?")

# zoznam požiadaviek na nástroje
print(odpoved.⟦1⟧)

# spustíme nástroj s argumentmi od modelu
args = odpoved.tool_calls[0]["⟦2⟧"]
print(vynasob.invoke(args))`,
      blanks: [['bind_tools'], ['tool_calls'], ['args']],
      hint: 'Nástroje sa pripájajú cez bind_tools([...]). Požiadavky nájdeš v odpoved.tool_calls a argumenty pod kľúčom "args".' },
    { t: 'order', title: 'Ako prebieha tool calling', xp: 20,
      intro: 'Zoraď kroky od otázky používateľa po finálnu odpoveď.',
      items: [
        'Používateľ položí otázku („Koľko je 25 × 17?")',
        'Model s bind_tools rozpozná, že potrebuje nástroj',
        'Model vráti tool_calls s názvom nástroja a argumentmi',
        'Náš kód nástroj spustí a získa výsledok',
        'Výsledok pošleme modelu ako ToolMessage',
        'Model sformuluje finálnu odpoveď pre používateľa' ] }
  ]
};

/* ============================================================
   LEKCIA 9 — Agents
   ============================================================ */
window.COURSE.lessons.l9 = {
  id: 'l9', num: 9, section: 's1', icon: '🤖', duration: '11 min',
  title: 'Agents — nechajte chainy rozhodovať',
  intro: 'Chain je vlak na koľajniciach — vždy prejde rovnakú trasu. Agent je šofér s mapou: sám rozhodne, ktoré nástroje použije, v akom poradí, a kedy má hotovo. Toto je vrchol prvej sekcie kurzu.',
  goals: [
    'Pochopiť rozdiel medzi chainom (pevný tok) a agentom (rozhoduje sám)',
    'Spoznať slučku ReAct: Thought → Action → Observation',
    'Postaviť agenta cez create_tool_calling_agent a AgentExecutor',
    'Sledovať uvažovanie agenta cez verbose=True'
  ],
  blocks: [
    { t: 'h', x: 'Chain vs. agent' },
    { t: 'compare', a: { title: '⛓️ Chain', items: [
        'Pevne daný postup: A → B → C',
        'Vždy rovnaké kroky v rovnakom poradí',
        'Predvídateľný, lacný, rýchly',
        'Ideálny: preklady, extrakcia, RAG odpovede'
      ]}, b: { title: '🤖 Agent', items: [
        'LLM v slučke sám plánuje ďalší krok',
        'Sám vyberá nástroje a ich poradie',
        'Flexibilný — zvládne aj viackrokové úlohy',
        'Ideálny: úlohy, kde postup vopred nepoznáš'
      ]} },
    { t: 'h', x: 'Slučka ReAct: mysli → konaj → pozoruj' },
    { t: 'p', x: 'Agent funguje v cykle inšpirovanom paradigmou <strong>ReAct</strong> (Reasoning + Acting). Model dostane otázku, nástroje a „zápisník" doterajších krokov (<code>agent_scratchpad</code>). V každej iterácii sa rozhodne: použijem ďalší nástroj, alebo už viem odpovedať?' },
    { t: 'flow', steps: ['❓ Otázka', '🤔 Thought<br><small>čo potrebujem zistiť?</small>', '🛠️ Action<br><small>zavolám nástroj</small>', '👁️ Observation<br><small>výsledok nástroja</small>', '🔁 Opakuj<br><small>kým netreba ďalší nástroj</small>', '✅ Finálna odpoveď'] },
    { t: 'h', x: 'Stavba agenta krok za krokom' },
    { t: 'p', x: 'Moderný agent v LangChaine = <code>create_tool_calling_agent</code> (mozog: model + nástroje + prompt) zabalený do <code>AgentExecutor</code> (telo: spúšťa slučku, volá nástroje, stráži limity). Prompt agenta <strong>musí</strong> obsahovať <code>MessagesPlaceholder("agent_scratchpad")</code> — tam si agent ukladá históriu svojich krokov:' },
    { t: 'pycharm', title: 'main.py — agent s dvoma nástrojmi', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()

@tool
def aktualny_datum() -> str:
    """Vráti dnešný dátum. Použi pri otázkach o dnešku."""
    return datetime.now().strftime("%d.%m.%Y")

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

nastroje = [aktualny_datum, vynasob]

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si užitočný asistent. Odpovedáš po slovensky."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = create_tool_calling_agent(model, nastroje, prompt)
executor = AgentExecutor(agent=agent, tools=nastroje, verbose=True)

vysledok = executor.invoke({
    "input": "Aký je dnes dátum? A koľko je 48 krát 365?"
})
print("\\nODPOVEĎ:", vysledok["output"])` }
    ], output: `> Entering new AgentExecutor chain...

Invoking: \`aktualny_datum\` with \`{}\`
11.06.2026

Invoking: \`vynasob\` with \`{'a': 48, 'b': 365}\`
17520.0

Dnes je 11.06.2026 a 48 × 365 = 17 520.

> Finished chain.

ODPOVEĎ: Dnes je 11.06.2026 a 48 × 365 = 17 520.`,
      note: 'Vďaka <b>verbose=True</b> vidíš celé uvažovanie: agent sám pochopil, že otázka vyžaduje DVA rôzne nástroje, zavolal ich a výsledky spojil do odpovede. Toto nikde v kóde nie je naprogramované!' },
    { t: 'box', kind: 'key', title: 'Čo robí AgentExecutor', x: 'Točí slučku: pošli stav modelu → ak model vráti tool_calls, spusti nástroje a výsledky pridaj do scratchpadu → opakuj, kým model nevráti finálnu odpoveď. Navyše stráži <code>max_iterations</code> (default 15), aby sa agent nezacyklil, a cez <code>handle_parsing_errors=True</code> prežije aj kostrbatý výstup modelu.' },
    { t: 'h', x: 'Kedy agenta (ne)použiť' },
    { t: 'table', head: ['Situácia', 'Voľba', 'Prečo'], rows: [
      ['Preklad textu, sumarizácia', 'Chain', 'Postup je vždy rovnaký — agent by len pridal latenciu a cenu'],
      ['„Zisti počasie a podľa neho odporuč aktivitu"', 'Agent', 'Treba rozhodovanie a kombinovanie nástrojov'],
      ['Odpovede z firemných dokumentov', 'Chain (RAG)', 'Pevný tok: nájdi dokumenty → odpovedz (sekcia 2!)'],
      ['Asistent s prístupom k mailu, kalendáru a webu', 'Agent', 'Vopred nevieš, ktoré systémy bude úloha vyžadovať']
    ] },
    { t: 'box', kind: 'warn', title: 'Agent = viac volaní = vyššia cena', x: 'Každá iterácia slučky je jedno volanie modelu. Agent so 4 krokmi = 4–5× drahší a pomalší než chain. Pravidlo z praxe: <strong>ak vieš postup napísať ako pevný tok, napíš chain.</strong> Agenta nasaď tam, kde flexibilitu naozaj potrebuješ.' }
  ],
  quiz: [
    { q: 'Aký je zásadný rozdiel medzi chainom a agentom?',
      opts: ['Agent je rýchlejší', 'Chain má pevný postup, agent sa rozhoduje za behu, ktoré nástroje použije', 'Agent nepoužíva LLM', 'Chain nevie pracovať s promptami'],
      correct: 1, explain: 'Chain vykoná vždy tie isté kroky. Agent v slučke plánuje: sám vyberá nástroje, ich poradie a moment ukončenia.' },
    { q: 'Na čo slúži MessagesPlaceholder("agent_scratchpad") v prompte agenta?',
      opts: ['Na uloženie API kľúča', 'Je to miesto, kam sa vkladá história krokov agenta (volania nástrojov a výsledky)', 'Definuje osobnosť agenta', 'Obmedzuje počet tokenov'],
      correct: 1, explain: 'Scratchpad je agentov zápisník — pri každej iterácii v ňom model vidí, čo už skúsil a čo z toho vyšlo. Bez neho by sa točil v kruhu.' },
    { q: 'Čo robí verbose=True na AgentExecutore?',
      opts: ['Zrýchli vykonávanie', 'Vypisuje do konzoly celý priebeh: ktoré nástroje agent volá a s akými argumentmi', 'Vypne nástroje', 'Prepne model na väčší'],
      correct: 1, explain: 'verbose=True ukáže celé uvažovanie agenta — neoceniteľné pri ladení. V produkcii ho nahradí LangSmith (lekcia 22).' },
    { q: 'Slučka ReAct sa skladá z krokov:',
      opts: ['Read → Write → Execute', 'Thought → Action → Observation, opakovane až po finálnu odpoveď', 'Input → Output', 'Plan → Code → Deploy'],
      correct: 1, explain: 'Agent strieda uvažovanie (Thought), volanie nástroja (Action) a čítanie výsledku (Observation), kým nemá dosť informácií na odpoveď.' },
    { q: 'Kedy je chain lepšou voľbou než agent?',
      opts: ['Vždy — agenty sú zastarané', 'Keď je postup vopred známy a nemení sa (preklad, extrakcia, RAG)', 'Keď potrebuješ viac nástrojov', 'Keď chceš ušetriť na prompte'],
      correct: 1, explain: 'Pevný postup = chain: lacnejší, rýchlejší, predvídateľnejší. Agent má zmysel pri úlohách s neznámym postupom riešenia.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Zostav agenta', xp: 20,
      intro: 'Doplň chýbajúce diely stavby agenta.',
      code: `prompt = ChatPromptTemplate.from_messages([
    ("system", "Si asistent."),
    ("human", "{input}"),
    MessagesPlaceholder("⟦0⟧"),
])

agent = ⟦1⟧(model, nastroje, prompt)

executor = ⟦2⟧(agent=agent, tools=nastroje, ⟦3⟧=True)

vysledok = executor.invoke({"input": "Koľko je 7 × 8 a aký je dátum?"})
print(vysledok["output"])`,
      blanks: [['agent_scratchpad'], ['create_tool_calling_agent'], ['AgentExecutor'], ['verbose']],
      hint: 'Zápisník agenta = agent_scratchpad. Mozog tvorí create_tool_calling_agent, telo AgentExecutor a priebeh ukáže verbose=True.' },
    { t: 'order', title: 'Jeden obeh slučky agenta', xp: 20,
      intro: 'Zoraď, čo sa deje, keď agentovi položíš otázku vyžadujúcu nástroj.',
      items: [
        'Executor pošle modelu otázku + zoznam nástrojov + scratchpad',
        'Model usúdi, že potrebuje nástroj, a vráti tool_calls',
        'Executor nástroj spustí s argumentmi od modelu',
        'Výsledok nástroja sa zapíše do agent_scratchpad',
        'Model dostane aktualizovaný scratchpad a vráti finálnu odpoveď',
        'Executor vráti slovník s kľúčom "output"' ] },
    { t: 'write', title: 'Agent-matematik', xp: 30,
      intro: 'Posklad celého agenta od nástrojov po spustenie.',
      task: 'Vytvor nástroj <code>scitaj(a, b)</code> cez <code>@tool</code> (s docstringom!), prompt s <code>{input}</code> a <code>MessagesPlaceholder("agent_scratchpad")</code>, agenta cez <code>create_tool_calling_agent</code> a <code>AgentExecutor</code> s <code>verbose=True</code>. Spusti otázku „Koľko je 1234 + 5678?".',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()
# tvoj kód...`,
      must: [['@tool'], ['agent_scratchpad'], ['create_tool_calling_agent'], ['AgentExecutor'], ['verbose=True'], ['.invoke(']],
      hint: 'Postupuj presne podľa ukážky z lekcie: nástroj → prompt (human {input} + scratchpad) → create_tool_calling_agent(model, [scitaj], prompt) → AgentExecutor → invoke({"input": ...}).',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()

@tool
def scitaj(a: float, b: float) -> float:
    """Presne sčíta dve čísla a a b."""
    return a + b

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si asistent. Na výpočty používaš nástroje."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = create_tool_calling_agent(model, [scitaj], prompt)
executor = AgentExecutor(agent=agent, tools=[scitaj], verbose=True)

print(executor.invoke({"input": "Koľko je 1234 + 5678?"})["output"])` }
  ]
};

/* ============================================================
   LEKCIA 10 — RAG úvod
   ============================================================ */
window.COURSE.lessons.l10 = {
  id: 'l10', num: 10, section: 's2', icon: '📚', duration: '3 min',
  title: 'RAG — Retrieval-Augmented Generation',
  intro: 'Ako naučiť ChatGPT odpovedať z TVOJICH dokumentov — zmlúv, manuálov, firemnej wiki — bez drahého pretrénovania modelu? Odpoveď má tri písmená: RAG. Toto je najžiadanejšia technika AI vývoja súčasnosti.',
  goals: [
    'Pochopiť tri zásadné limity samotného LLM',
    'Vedieť vysvetliť princíp RAG jednou vetou',
    'Poznať obe fázy: indexovanie dokumentov a zodpovedanie otázok',
    'Vedieť, prečo je RAG lepší než fine-tuning pre znalostné aplikácie'
  ],
  blocks: [
    { t: 'h', x: 'Tri problémy čistého LLM' },
    { t: 'ul', items: [
      '<strong>Zastarané znalosti</strong> — model pozná svet len do dátumu tréningu. O včerajšej zmene tvojho cenníka nevie nič.',
      '<strong>Nepozná tvoje dáta</strong> — interné smernice, zmluvy, dokumentácia produktu… to v tréningových dátach nebolo a nebude.',
      '<strong>Halucinácie</strong> — keď model nevie, často si sebavedome vymýšľa. V biznise neprijateľné.'
    ]},
    { t: 'p', x: '<strong>RAG (Retrieval-Augmented Generation)</strong> — generovanie obohatené o vyhľadávanie — rieši všetky tri naraz. Princíp jednou vetou: <em>skôr než model odpovie, nájdeme v tvojich dokumentoch relevantné pasáže a vložíme mu ich do promptu ako kontext.</em> Model potom neodpovedá z pamäte, ale z dodaných faktov.' },
    { t: 'box', kind: 'info', title: 'Predstav si skúšku s ťahákom', x: 'Čistý LLM je študent odpovedajúci z hlavy — niečo vie, niečo si domyslí. RAG je ten istý študent, ktorému pred odpoveďou podáš presne tie strany skrípt, kde je odpoveď. Kvalita odpovede potom stojí na tom, ako dobre vieš nájsť správne strany — a presne to sa naučíš v tejto sekcii.' },
    { t: 'h', x: 'Fáza 1: Indexovanie (robí sa raz, vopred)' },
    { t: 'p', x: 'Dokumenty pripravíš do vyhľadateľnej podoby. Každý krok tejto rúry má v kurze vlastnú lekciu:' },
    { t: 'flow', steps: ['📄 Dokumenty<br><small>PDF, web, TXT…</small>', '📥 Loader<br><small>lekcia 11</small>', '✂️ Splitter<br><small>lekcia 12</small>', '🧭 Embeddings<br><small>lekcia 13</small>', '🗄️ Vector Store<br><small>lekcia 14</small>'] },
    { t: 'h', x: 'Fáza 2: Zodpovedanie otázky (pri každom dopyte)' },
    { t: 'flow', steps: ['❓ Otázka<br><small>používateľa</small>', '🧭 Embedding otázky<br><small>rovnaký model</small>', '🎣 Retriever<br><small>lekcia 15 — nájde podobné chunky</small>', '📝 Prompt<br><small>otázka + nájdený kontext</small>', '🧠 LLM<br><small>odpovie z kontextu</small>', '✅ Odpoveď'] },
    { t: 'h', x: 'RAG vs. fine-tuning' },
    { t: 'table', head: ['Kritérium', 'RAG', 'Fine-tuning'], rows: [
      ['Cena', 'Centy (embeddingy + bežné volania)', 'Stovky až tisíce € za tréning'],
      ['Aktualizácia dát', 'Okamžitá — len pridáš dokument do databázy', 'Nový tréning pri každej zmene'],
      ['Zdroj odpovede', 'Dohľadateľný — vieš, z ktorého dokumentu', 'Skrytý vo váhach modelu'],
      ['Halucinácie', 'Výrazne menšie (model cituje kontext)', 'Pretrvávajú'],
      ['Na čo sa hodí', '<strong>Znalosti</strong> — fakty, dokumenty, FAQ', '<strong>Štýl a formát</strong> — tón značky, špecifické správanie']
    ] },
    { t: 'box', kind: 'key', title: 'Zlaté pravidlo', x: 'Potrebuješ, aby model <strong>niečo vedel</strong>? → RAG. Potrebuješ, aby sa model <strong>nejako správal</strong>? → fine-tuning. V 90 % firemných prípadov je odpoveďou RAG — preto mu kurz venuje celú sekciu.' }
  ],
  quiz: [
    { q: 'Čo znamená skratka RAG?',
      opts: ['Rapid AI Generation', 'Retrieval-Augmented Generation — generovanie obohatené o vyhľadávanie', 'Random Answer Generator', 'Recursive Agent Graph'],
      correct: 1, explain: 'RAG = pred generovaním odpovede sa z databázy vyhľadajú (retrieval) relevantné dokumenty a pridajú sa modelu do promptu.' },
    { q: 'Ako RAG znižuje halucinácie?',
      opts: ['Používa väčší model', 'Model odpovedá z dodaného kontextu namiesto „z hlavy"', 'Blokuje kreatívne odpovede', 'Kontroluje odpoveď druhým modelom'],
      correct: 1, explain: 'Model dostane relevantné pasáže priamo v prompte a inštrukciu odpovedať z nich. Nemusí si nič domýšľať — a ak odpoveď v kontexte nie je, má povedať „neviem".' },
    { q: 'Ktoré kroky tvoria fázu indexovania?',
      opts: ['Otázka → odpoveď', 'Načítaj → rozdeľ → embeduj → ulož do vektorovej DB', 'Trénuj → validuj → nasaď', 'Prompt → model → parser'],
      correct: 1, explain: 'Indexovanie pripraví dokumenty: loader ich načíta, splitter rozseká na chunky, embedding model prevedie na vektory a vector store ich uloží.' },
    { q: 'Firma denne aktualizuje cenník a chce, aby chatbot vždy odpovedal podľa aktuálneho. Čo je správna voľba?',
      opts: ['Denný fine-tuning modelu', 'RAG — stačí preindexovať zmenený dokument', 'Väčší model s dlhším promptom', 'Nedá sa to riešiť'],
      correct: 1, explain: 'RAG oddeľuje znalosti od modelu: zmena dát = aktualizácia vektorovej DB za sekundy. Fine-tuning by bol pomalý, drahý a zbytočný.' }
  ],
  exercises: [
    { t: 'order', title: 'Poskladaj RAG pipeline', xp: 20,
      intro: 'Zoraď kompletný tok RAG od surových dokumentov po odpoveď používateľovi.',
      items: [
        'Loader načíta dokumenty (PDF, web…)',
        'Splitter ich rozdelí na menšie chunky',
        'Embedding model prevedie chunky na vektory',
        'Vector store vektory uloží',
        'Používateľ položí otázku',
        'Retriever nájde najpodobnejšie chunky k otázke',
        'Prompt spojí otázku s nájdeným kontextom',
        'LLM vygeneruje odpoveď podloženú kontextom' ] },
    { t: 'order', title: 'RAG alebo fine-tuning?', xp: 20,
      intro: 'Zoraď scenáre od NAJVHODNEJŠIEHO pre RAG po najvhodnejší pre fine-tuning.',
      items: [
        'Chatbot odpovedajúci z firemnej dokumentácie',
        'Asistent nad zmluvami, ktoré sa menia každý týždeň',
        'Bot, ktorý má vždy odpovedať v štýle značky',
        'Model píšuci básne presne v štýle konkrétneho autora' ] }
  ]
};

/* ============================================================
   LEKCIA 11 — Loaders
   ============================================================ */
window.COURSE.lessons.l11 = {
  id: 'l11', num: 11, section: 's2', icon: '📥', duration: '4 min',
  title: 'Loaders — načítanie dokumentov',
  intro: 'Prvý krok každého RAG systému: dostať dáta dnu. Document loadery načítajú čokoľvek — TXT, PDF, CSV, webstránky — a premenia to na jednotný formát: objekt Document.',
  goals: [
    'Pochopiť objekt Document: page_content + metadata',
    'Načítať textový súbor cez TextLoader a PDF cez PyPDFLoader',
    'Stiahnuť obsah webstránky cez WebBaseLoader',
    'Načítať celý priečinok dokumentov cez DirectoryLoader'
  ],
  blocks: [
    { t: 'h', x: 'Document — spoločná mena RAG sveta' },
    { t: 'p', x: 'Nech načítavaš čokoľvek, výsledkom je vždy zoznam objektov <code>Document</code> s dvoma poľami: <code>page_content</code> (samotný text) a <code>metadata</code> (slovník: zdroj, číslo strany, URL…). Metadáta sú dôležitejšie, než vyzerajú — vďaka nim vie chatbot neskôr <strong>citovať zdroj</strong> odpovede.' },
    { t: 'pycharm', title: 'main.py — TextLoader', files: [
      { name: 'smernica.txt', code: `INTERNÁ SMERNICA – DOVOLENKY
Každý zamestnanec má nárok na 25 dní dovolenky ročne.
Žiadosť sa podáva minimálne 14 dní vopred cez portál HRko.
Nevyčerpané dni sa prenášajú maximálne do 31. marca.` },
      { name: 'main.py', active: true, code: `from langchain_community.document_loaders import TextLoader

loader = TextLoader("smernica.txt", encoding="utf-8")
dokumenty = loader.load()

print("Počet dokumentov:", len(dokumenty))
print("Metadáta:", dokumenty[0].metadata)
print("Obsah:")
print(dokumenty[0].page_content[:80], "...")` }
    ], output: `Počet dokumentov: 1
Metadáta: {'source': 'smernica.txt'}
Obsah:
INTERNÁ SMERNICA – DOVOLENKY
Každý zamestnanec má nárok na 25 dní dovolenky ro ...`,
      note: 'Loadery sídlia v balíku <b>langchain_community.document_loaders</b> — nainštaluj cez pip install langchain-community.' },
    { t: 'h', x: 'PDF, web a celé priečinky' },
    { t: 'p', x: 'V praxi najčastejšie siahneš po týchto loaderoch (každý si vyžiada drobnú závislosť navyše):' },
    { t: 'table', head: ['Loader', 'Zdroj', 'Závislosť navyše', 'Poznámka'], rows: [
      ['<code>TextLoader</code>', '.txt, .md', '—', 'Jeden súbor = jeden Document'],
      ['<code>PyPDFLoader</code>', 'PDF', '<code>pip install pypdf</code>', 'Každá strana = samostatný Document s číslom strany v metadátach'],
      ['<code>CSVLoader</code>', 'CSV tabuľky', '—', 'Každý riadok = Document'],
      ['<code>WebBaseLoader</code>', 'webstránky', '<code>pip install beautifulsoup4</code>', 'Stiahne HTML a vytiahne čistý text'],
      ['<code>DirectoryLoader</code>', 'celý priečinok', '—', 'Hromadne načíta súbory podľa masky (glob)']
    ] },
    { t: 'pycharm', title: 'main.py — PDF a webstránka', files: [
      { name: 'main.py', active: true, code: `from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader

# PDF: každá strana je samostatný Document
pdf_loader = PyPDFLoader("manual_kavovar.pdf")
strany = pdf_loader.load()
print("PDF strán:", len(strany))
print("Strana 1, metadáta:", strany[0].metadata)

# Web: stiahne článok ako text
web_loader = WebBaseLoader("https://blog.langchain.dev/langgraph/")
clanky = web_loader.load()
print("Znakov z webu:", len(clanky[0].page_content))` }
    ], output: `PDF strán: 24
Strana 1, metadáta: {'source': 'manual_kavovar.pdf', 'page': 0}
Znakov z webu: 18342` },
    { t: 'box', kind: 'tip', title: 'Hromadné načítanie priečinka', x: '<code>DirectoryLoader("docs/", glob="**/*.pdf", loader_cls=PyPDFLoader)</code> načíta všetky PDF v priečinku aj podpriečinkoch naraz. Ideálne pre firemnú knižnicu dokumentov — presne takto začneš záverečný projekt.' },
    { t: 'box', kind: 'info', title: 'Loadery existujú na všetko', x: 'LangChain má cez 100 loaderov: Notion, Google Drive, Slack, YouTube titulky, GitHub, e-maily… Princíp je vždy rovnaký: <code>loader = XYLoader(...)</code> → <code>loader.load()</code> → zoznam Documentov. Keď vieš jeden, vieš všetky.' }
  ],
  quiz: [
    { q: 'Z čoho sa skladá objekt Document?',
      opts: ['text a obrázky', 'page_content (text) a metadata (slovník o zdroji)', 'header a body', 'content a footer'],
      correct: 1, explain: 'Document má page_content so samotným textom a metadata so zdrojom, stranou a pod. — vďaka nim vieš neskôr citovať, odkiaľ odpoveď pochádza.' },
    { q: 'Koľko Documentov vráti PyPDFLoader pre 24-stranové PDF?',
      opts: ['1', '24 — každá strana je samostatný Document', 'Záleží od veľkosti súboru', '0, PDF treba najprv previesť na text'],
      correct: 1, explain: 'PyPDFLoader vytvorí Document pre každú stranu a do metadát uloží jej číslo — to sa neskôr hodí pri citovaní zdrojov.' },
    { q: 'Ktorý loader použiješ na načítanie obsahu webstránky?',
      opts: ['TextLoader', 'WebBaseLoader', 'CSVLoader', 'HTTPLoader'],
      correct: 1, explain: 'WebBaseLoader stiahne stránku a pomocou BeautifulSoup z nej vytiahne čistý text.' },
    { q: 'Prečo sú metadáta dokumentov dôležité pre RAG aplikácie?',
      opts: ['Zrýchľujú vyhľadávanie', 'Umožňujú citovať zdroj odpovede (súbor, stranu, URL)', 'Sú povinné pre embeddingy', 'Šetria tokeny'],
      correct: 1, explain: 'Keď retriever nájde chunk, z metadát vieš povedať používateľovi: „odpoveď pochádza zo smernica.pdf, strana 3" — kľúčové pre dôveryhodnosť.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Načítaj smernicu', xp: 20,
      intro: 'Doplň kód na načítanie textového súboru a výpis jeho obsahu.',
      code: `from langchain_community.⟦0⟧ import TextLoader

loader = ⟦1⟧("smernica.txt", encoding="utf-8")
dokumenty = loader.⟦2⟧()

print(dokumenty[0].⟦3⟧)      # samotný text
print(dokumenty[0].metadata)   # zdroj`,
      blanks: [['document_loaders'], ['TextLoader'], ['load'], ['page_content']],
      hint: 'Loadery sú v module document_loaders. Načítanie spúšťa metóda load() a text dokumentu je v page_content.' },
    { t: 'write', title: 'Načítaj PDF manuál', xp: 30,
      intro: 'Práca s najbežnejším firemným formátom — PDF.',
      task: 'Importuj <code>PyPDFLoader</code>, načítaj súbor <code>"manual.pdf"</code>, vypíš počet strán cez <code>len()</code> a obsah prvej strany (<code>page_content</code>).',
      starter: `# pip install pypdf
# tvoj kód...`,
      must: [['PyPDFLoader'], ['.load()'], ['len('], ['page_content']],
      hint: 'from langchain_community.document_loaders import PyPDFLoader → loader = PyPDFLoader("manual.pdf") → strany = loader.load().',
      solution: `from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("manual.pdf")
strany = loader.load()

print("Počet strán:", len(strany))
print(strany[0].page_content)` },
    { t: 'order', title: 'Vyber správny loader', xp: 20,
      intro: 'Zoraď loadery podľa zadania: 1. firemné PDF zmluvy, 2. exportovaná tabuľka objednávok, 3. článok z blogu, 4. priečinok plný .txt poznámok.',
      items: [
        'PyPDFLoader',
        'CSVLoader',
        'WebBaseLoader',
        'DirectoryLoader s TextLoaderom' ] }
  ]
};

/* ============================================================
   LEKCIA 12 — Splitters
   ============================================================ */
window.COURSE.lessons.l12 = {
  id: 'l12', num: 12, section: 's2', icon: '✂️', duration: '8 min',
  title: 'Splitters — členenie dokumentov na časti',
  intro: 'Celé PDF do promptu nenapcháš — a aj keby áno, model by sa v ňom strácal. Dokumenty preto sekáme na chunky: dosť malé na presné vyhľadávanie, dosť veľké, aby nestratili význam. Toto nastavenie rozhoduje o kvalite celého RAG.',
  goals: [
    'Pochopiť, prečo sa dokumenty musia deliť na chunky',
    'Ovládať parametre chunk_size a chunk_overlap',
    'Použiť RecursiveCharacterTextSplitter — štandard pre bežný text',
    'Vedieť posúdiť vhodnú veľkosť chunku pre rôzne typy dokumentov'
  ],
  blocks: [
    { t: 'h', x: 'Prečo sekať?' },
    { t: 'ul', items: [
      '<strong>Presnosť vyhľadávania</strong> — k otázke „koľko dní dovolenky?" chceš nájsť presne ten odsek o dovolenke, nie celú 40-stranovú smernicu.',
      '<strong>Limit kontextu</strong> — do promptu sa zmestí obmedzený počet tokenov; posielaš len to najrelevantnejšie.',
      '<strong>Cena</strong> — platíš za každý token v prompte. Menší kontext = lacnejšie volanie.',
      '<strong>Kvalita embeddingov</strong> — vektor krátkeho súvislého textu vystihuje význam lepšie než vektor celej knihy.'
    ]},
    { t: 'h', x: 'RecursiveCharacterTextSplitter — tvoj štandard' },
    { t: 'p', x: 'Najpoužívanejší splitter sa snaží <strong>rešpektovať prirodzenú štruktúru textu</strong>. Skúša deliť postupne podľa hierarchie oddeľovačov: najprv na odseky (<code>\\n\\n</code>), potom na riadky (<code>\\n</code>), potom na slová (medzera) — a až v krajnom prípade reže uprostred slova. Výsledné chunky tak takmer vždy končia na hranici myšlienky:' },
    { t: 'pycharm', title: 'main.py — delenie smernice', files: [
      { name: 'main.py', active: true, code: `from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

dokumenty = TextLoader("smernica.txt", encoding="utf-8").load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,      # max. dĺžka chunku v znakoch
    chunk_overlap=50,    # prekrytie susedných chunkov
)

chunky = splitter.split_documents(dokumenty)

print("Počet chunkov:", len(chunky))
for i, ch in enumerate(chunky[:3]):
    print(f"--- chunk {i} ({len(ch.page_content)} znakov) ---")
    print(ch.page_content[:60], "...")` }
    ], output: `Počet chunkov: 9
--- chunk 0 (287 znakov) ---
INTERNÁ SMERNICA – DOVOLENKY
Každý zamestnanec má nárok na ...
--- chunk 1 (264 znakov) ---
Žiadosť sa podáva minimálne 14 dní vopred cez portál HRko ...
--- chunk 2 (291 znakov) ---
Nevyčerpané dni dovolenky sa prenášajú maximálne do 31. m ...`,
      note: '<b>split_documents()</b> berie zoznam Documentov a vracia zoznam menších Documentov — metadáta (zdroj!) sa automaticky dedia do každého chunku.' },
    { t: 'h', x: 'chunk_size a chunk_overlap do hĺbky' },
    { t: 'p', x: '<code>chunk_overlap</code> rieši problém <strong>rozseknutej myšlienky</strong>: ak by veta o výnimke zo smernice skončila presne na hranici chunkov, bez prekrytia by ju vyhľadávanie nemuselo nájsť celú. Prekrytie 10–20 % veľkosti chunku zabezpečí, že koniec jedného chunku sa zopakuje na začiatku ďalšieho:' },
    { t: 'flow', steps: ['Chunk 1<br><small>znaky 0–300</small>', 'Chunk 2<br><small>znaky 250–550<br>(50 spoločných)</small>', 'Chunk 3<br><small>znaky 500–800<br>(50 spoločných)</small>'] },
    { t: 'table', head: ['Typ obsahu', 'Odporúčaný chunk_size', 'Prečo'], rows: [
      ['FAQ, krátke odpovede', '200–400 znakov', 'Jedna otázka–odpoveď = jeden chunk'],
      ['Bežné dokumenty, smernice', '500–1000 znakov', 'Odsek až dva — zlatá stredná cesta, dobrý default'],
      ['Právne texty, zmluvy', '1000–1500 znakov', 'Klauzuly potrebujú okolitý kontext'],
      ['Zdrojový kód', 'podľa funkcií/tried', 'Použi špecializovaný splitter s jazykom (from_language)']
    ] },
    { t: 'box', kind: 'warn', title: 'Najčastejšia chyba RAG systémov', x: 'Príliš veľké chunky = vyhľadávanie nachádza „zriedený" obsah a do promptu tečie balast. Príliš malé = chunky strácajú kontext („ono" — ale čo?). Ak tvoj RAG odpovedá zle, <strong>prvé, čo ladíš, je chunk_size</strong> — nie model.' },
    { t: 'box', kind: 'tip', title: 'Experimentuj', x: 'Neexistuje univerzálne správna hodnota. Sprav si testovaciu sadu 10 otázok a skúšaj chunk_size 300 / 600 / 1000 — porovnaj, pri ktorom retriever nachádza najlepšie pasáže. Toto je bežná inžinierska prax, nie hack.' }
  ],
  quiz: [
    { q: 'Prečo dokumenty pred uložením do vektorovej DB delíme na chunky?',
      opts: ['Aby sa súbory zmestili na disk', 'Pre presnejšie vyhľadávanie, limit kontextu, nižšiu cenu a kvalitnejšie embeddingy', 'Je to požiadavka OpenAI', 'Aby sa dokumenty rýchlejšie načítali'],
      correct: 1, explain: 'Malé súvislé chunky = presné nájdenie relevantnej pasáže, menej tokenov v prompte a embeddingy, ktoré skutočne vystihujú význam textu.' },
    { q: 'Čo robí chunk_overlap=50?',
      opts: ['Vynechá 50 znakov medzi chunkami', 'Posledných ~50 znakov chunku sa zopakuje na začiatku nasledujúceho', 'Obmedzí počet chunkov na 50', 'Zlúči chunky kratšie než 50 znakov'],
      correct: 1, explain: 'Prekrytie zabezpečuje, že myšlienka rozseknutá na hranici chunkov ostane celá aspoň v jednom z nich.' },
    { q: 'V akom poradí skúša RecursiveCharacterTextSplitter oddeľovače?',
      opts: ['Náhodne', 'Odseky (\\n\\n) → riadky (\\n) → medzery → jednotlivé znaky', 'Od najmenších po najväčšie', 'Iba podľa bodiek'],
      correct: 1, explain: '„Recursive" = skúša hierarchiu od najprirodzenejších hraníc (odsek) po núdzové (znak). Preto chunky končia na hraniciach myšlienok.' },
    { q: 'RAG nachádza nepresné pasáže a odpovede sú rozvláčne. Čo upraviť ako prvé?',
      opts: ['Vymeniť model za väčší', 'Zmenšiť chunk_size a otestovať kvalitu vyhľadávania', 'Zvýšiť temperature', 'Pridať viac dokumentov'],
      correct: 1, explain: 'Kvalita RAG stojí a padá na chunkovaní. Ladenie chunk_size (a overlapu) je vždy prvý krok — lacnejší a účinnejší než výmena modelu.' },
    { q: 'Aký je rozdiel medzi split_documents() a split_text()?',
      opts: ['Žiadny', 'split_documents berie Documenty (zachová metadáta), split_text berie obyčajný string', 'split_text je rýchlejší variant', 'split_documents funguje len na PDF'],
      correct: 1, explain: 'split_documents() spracuje zoznam Documentov a metadáta zdedí každý chunk. split_text() seká čistý string a vráti zoznam stringov.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Nastav splitter', xp: 20,
      intro: 'Doplň splitter so 600-znakovými chunkami a 90-znakovým prekrytím.',
      code: `from langchain_text_splitters import ⟦0⟧

splitter = RecursiveCharacterTextSplitter(
    ⟦1⟧=600,
    ⟦2⟧=90,
)

chunky = splitter.⟦3⟧(dokumenty)
print("Vzniklo chunkov:", len(chunky))`,
      blanks: [['RecursiveCharacterTextSplitter'], ['chunk_size'], ['chunk_overlap'], ['split_documents']],
      hint: 'Veľkosť chunku = chunk_size, prekrytie = chunk_overlap. Pre zoznam Documentov sa používa split_documents().' },
    { t: 'order', title: 'Od súboru k chunkom', xp: 20,
      intro: 'Zoraď úplný postup prípravy dokumentu na embedding.',
      items: [
        'TextLoader("smernica.txt") načíta súbor',
        'loader.load() vráti zoznam Documentov',
        'Vytvoríš RecursiveCharacterTextSplitter s chunk_size a chunk_overlap',
        'splitter.split_documents(dokumenty) vráti chunky',
        'Chunky putujú do embedding modelu (ďalšia lekcia)' ] },
    { t: 'write', title: 'Rozsekaj PDF zmluvu', xp: 30,
      intro: 'Spoj lekcie 11 a 12: loader + splitter.',
      task: 'Načítaj <code>"zmluva.pdf"</code> cez <code>PyPDFLoader</code>, rozdeľ ju <code>RecursiveCharacterTextSplitter</code>-om s <code>chunk_size=1000</code> a <code>chunk_overlap=150</code> (právny text!) a vypíš počet strán aj počet výsledných chunkov.',
      starter: `from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# tvoj kód...`,
      must: [['PyPDFLoader('], ['chunk_size=1000'], ['chunk_overlap=150'], ['split_documents'], ['len(']],
      hint: 'strany = PyPDFLoader("zmluva.pdf").load() → splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150) → chunky = splitter.split_documents(strany).',
      solution: `from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

strany = PyPDFLoader("zmluva.pdf").load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
chunky = splitter.split_documents(strany)

print("Strán:", len(strany))
print("Chunkov:", len(chunky))` }
  ]
};
