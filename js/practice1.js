/* ============================================================
   EXTRA „NAPÍŠ KÓD" CVIČENIA — časť 1 (lA, lB, l1–l9)
   9 cvičení na lekciu, gradovaných od najľahších po najťažšie.
   XP a úvodný text dopĺňa app.js podľa poradia (1–3 / 4–6 / 7–9).
   W(title, task, starter, must, hint, solution)
   ============================================================ */
(function () {
  const W = (title, task, starter, must, hint, solution) =>
    ({ t: 'write', title, task, starter, must, hint, solution });

  window.EXTRA_WRITE = window.EXTRA_WRITE || {};

  /* ── lA: premenné, f-stringy, zoznamy, slovníky ── */
  window.EXTRA_WRITE.lA = [
    W('Prvé premenné',
      'Vytvor premennú <code>meno</code> (tvoje meno ako text) a <code>vek</code> (číslo). Obe vypíš cez <code>print()</code>.',
      `# tvoj kód...`,
      [['meno ='], ['vek ='], ['print(']],
      'Text patrí do úvodzoviek, číslo nie. print(meno) a print(vek).',
      `meno = "Martin"
vek = 29
print(meno)
print(vek)`),
    W('Veta z f-stringu',
      'Vytvor premenné <code>mesto</code> a <code>teplota</code> a vypíš f-stringom vetu: <em>V meste X je Y stupňov.</em>',
      `# tvoj kód...`,
      [['mesto ='], ['teplota ='], ['f"', "f'"], ['{mesto}'], ['{teplota}']],
      'f pred úvodzovkou a premenné v {okienkach}: f"V meste {mesto} je {teplota} stupňov."',
      `mesto = "Žilina"
teplota = 23
print(f"V meste {mesto} je {teplota} stupňov.")`),
    W('Zoznam miest',
      'Vytvor zoznam <code>mesta</code> s tromi mestami, pridaj štvrté cez <code>.append()</code> a vypíš PRVÉ mesto zo zoznamu.',
      `# tvoj kód...`,
      [['mesta = ['], ['.append('], ['mesta[0]']],
      'Zoznam = hranaté zátvorky. Prvá položka má index 0: print(mesta[0]).',
      `mesta = ["Žilina", "Košice", "Nitra"]
mesta.append("Trnava")
print(mesta[0])`),
    W('Počet a súčet',
      'Vytvor zoznam <code>ceny</code> so 4 číslami. Vypíš počet položiek cez <code>len()</code> a ich súčet cez <code>sum()</code>.',
      `# tvoj kód...`,
      [['ceny = ['], ['len(ceny)'], ['sum(ceny)']],
      'len(zoznam) vráti počet, sum(zoznam) súčet — obe rovno do print().',
      `ceny = [12, 8, 25, 5]
print(len(ceny))
print(sum(ceny))`),
    W('Slovník osoby',
      'Vytvor slovník <code>osoba</code> s kľúčmi <code>"meno"</code> a <code>"mesto"</code> a vypíš hodnotu pod kľúčom <code>"mesto"</code>.',
      `# tvoj kód...`,
      [['osoba = {'], ['"meno"', "'meno'"], ['osoba["mesto"]', "osoba['mesto']"]],
      'Slovník = zložené zátvorky, dvojice "kľúč": hodnota. Čítanie: osoba["mesto"].',
      `osoba = {"meno": "Martin", "mesto": "Žilina"}
print(osoba["mesto"])`),
    W('Uprav a pridaj kľúč',
      'Vezmi slovník <code>student</code> zo startera: zmeň <code>"progres"</code> na 80 a PRIDAJ nový kľúč <code>"level"</code> s hodnotou 3. Slovník vypíš.',
      `student = {"meno": "Jana", "progres": 42}
# tvoj kód...`,
      [['student["progres"] = 80', "student['progres'] = 80"], ['student["level"]', "student['level']"], ['print(student)']],
      'Zmena aj pridanie sú to isté priradenie: student["kľúč"] = hodnota.',
      `student = {"meno": "Jana", "progres": 42}
student["progres"] = 80
student["level"] = 3
print(student)`),
    W('Cyklus cez nákup',
      'Vytvor zoznam <code>nakup</code> s 3 položkami a cyklom <code>for</code> vypíš pre každú riadok <em>Kúpiť: položka</em> (f-string).',
      `# tvoj kód...`,
      [['nakup = ['], ['for '], [' in nakup'], ['f"Kúpiť: {', 'f"Kúpiť:{', '"Kúpiť:", ']],
      'for polozka in nakup: → odsadený print(f"Kúpiť: {polozka}").',
      `nakup = ["mlieko", "chlieb", "syr"]
for polozka in nakup:
    print(f"Kúpiť: {polozka}")`),
    W('Zoznam slovníkov',
      'Vytvor zoznam <code>studenti</code> s DVOMA slovníkmi (kľúče <code>"meno"</code> a <code>"body"</code>). Cyklom vypíš pre každého: <em>meno má X bodov</em>.',
      `# tvoj kód...`,
      [['studenti = ['], ['{"meno"', "{'meno'"], ['for '], ['["meno"]', "['meno']"], ['["body"]', "['body']"]],
      'Položky zoznamu sú slovníky — v cykle k nim pristupuješ s["meno"], s["body"].',
      `studenti = [
    {"meno": "Martin", "body": 85},
    {"meno": "Jana", "body": 92},
]
for s in studenti:
    print(f"{s['meno']} má {s['body']} bodov")`),
    W('Vstup pre chain (ako v LangChaine)',
      'Priprav slovník <code>vstup</code> s kľúčmi <code>"tema"</code> a <code>"jazyk"</code> a funkciu... zatiaľ bez funkcie: vypíš f-stringom vetu <em>Chain dostane tému X v jazyku Y</em> — hodnoty čítaj ZO slovníka (v okienkach f-stringu).',
      `# tvoj kód...`,
      [['vstup = {'], ['"tema"', "'tema'"], ["vstup['tema']", 'vstup["tema"]'], ["vstup['jazyk']", 'vstup["jazyk"]']],
      'Vo f-stringu použi opačné úvodzovky než okolo neho: f"... {vstup[\'tema\']} ...".',
      `vstup = {"tema": "vesmír", "jazyk": "slovenčina"}
print(f"Chain dostane tému {vstup['tema']} v jazyku {vstup['jazyk']}")`),
  ];

  /* ── lB: funkcie, importy, cykly, objekty ── */
  window.EXTRA_WRITE.lB = [
    W('Funkcia bez parametrov',
      'Napíš funkciu <code>privitanie()</code>, ktorá vypíše „Vitaj v kurze!" — a potom ju zavolaj.',
      `# tvoj kód...`,
      [['def privitanie'], ['print('], ['privitanie()']],
      'def privitanie(): → odsadený print → volanie privitanie() bez odsadenia.',
      `def privitanie():
    print("Vitaj v kurze!")

privitanie()`),
    W('Parameter a return',
      'Napíš funkciu <code>stvorec(n)</code>, ktorá vráti <code>n * n</code>. Zavolaj ju s číslom 7 a výsledok vypíš.',
      `# tvoj kód...`,
      [['def stvorec'], ['return n * n', 'return n*n'], ['stvorec(7)']],
      'return vracia hodnotu volajúcemu: print(stvorec(7)) vypíše 49.',
      `def stvorec(n):
    return n * n

print(stvorec(7))`),
    W('Docstring a typy',
      'Napíš funkciu <code>scitaj(a: int, b: int) -> int</code> s docstringom v trojitých úvodzovkách a <code>return a + b</code>. Otestuj.',
      `# tvoj kód...`,
      [['def scitaj'], ['"""'], ['return a + b', 'return a+b'], ['print(']],
      'Docstring hneď pod def: """Sčíta dve čísla.""" — presne tento vzor chce @tool v lekcii 8.',
      `def scitaj(a: int, b: int) -> int:
    """Sčíta dve čísla a vráti výsledok."""
    return a + b

print(scitaj(2, 3))`),
    W('Import celej knižnice',
      'Importuj knižnicu <code>math</code> a vypíš <code>math.pi</code> a odmocninu zo 144 cez <code>math.sqrt()</code>.',
      `# tvoj kód...`,
      [['import math'], ['math.pi'], ['math.sqrt(144)']],
      'import math → prístup s predponou: math.pi, math.sqrt(144).',
      `import math

print(math.pi)
print(math.sqrt(144))`),
    W('From-import',
      'Z knižnice <code>datetime</code> importuj <code>datetime</code> a vypíš aktuálny rok: <code>datetime.now().year</code>.',
      `# tvoj kód...`,
      [['from datetime import datetime'], ['datetime.now()'], ['.year']],
      'from datetime import datetime → datetime.now() vráti objekt, .year je jeho atribút (bez zátvoriek!).',
      `from datetime import datetime

print(datetime.now().year)`),
    W('Rozhodovanie if/else',
      'Napíš funkciu <code>parne(n)</code>, ktorá vráti <code>"párne"</code>, ak je n deliteľné 2 (<code>n % 2 == 0</code>), inak <code>"nepárne"</code>. Otestuj na 4 aj 7.',
      `# tvoj kód...`,
      [['def parne'], ['n % 2 == 0', 'n%2==0'], ['return "párne"', "return 'párne'"], ['else']],
      '% je zvyšok po delení. if n % 2 == 0: return "párne" / else: return "nepárne".',
      `def parne(n):
    if n % 2 == 0:
        return "párne"
    else:
        return "nepárne"

print(parne(4))
print(parne(7))`),
    W('Echo slučka',
      'Napíš slučku <code>while True</code>: prečítaj vstup cez <code>input()</code>, pri „koniec" sprav <code>break</code>, inak vstup vypíš späť s predponou „Echo:".',
      `# tvoj kód...`,
      [['while True'], ['input('], ['break'], ['Echo']],
      'Kostra chatbota: if veta == "koniec": break — inak print(f"Echo: {veta}").',
      `while True:
    veta = input("Ty: ")
    if veta == "koniec":
        break
    print(f"Echo: {veta}")`),
    W('Reťazenie metód',
      'Vezmi text zo startera, prerob ho metódami na malé písmená (<code>.lower()</code>), nahraď „python" za „Python" (<code>.replace()</code>) a výsledok vypíš — všetko v JEDNOM riadku reťazením bodiek.',
      `text = "MILUJEM PYTHON A PYTHON MILUJE MŇA"
# tvoj kód...`,
      [['.lower()'], ['.replace('], ['print(']],
      'Bodky sa reťazia zľava: text.lower().replace("python", "Python").',
      `text = "MILUJEM PYTHON A PYTHON MILUJE MŇA"
print(text.lower().replace("python", "Python"))`),
    W('Funkcia v slučke (mini bot)',
      'Napíš funkciu <code>odpovedz(text)</code>, ktorá vráti f-string <em>„Hovoríš: text"</em>. Potom slučku <code>while True</code> s <code>input()</code>, ukončením na „koniec" a volaním funkcie pre každý vstup.',
      `# tvoj kód...`,
      [['def odpovedz'], ['return f"', "return f'"], ['while True'], ['break'], ['odpovedz(']],
      'Presne takto v lekcii 16 vymeníš odpovedz() za chain.invoke() — a máš AI bota.',
      `def odpovedz(text):
    return f"Hovoríš: {text}"

while True:
    veta = input("Ty: ")
    if veta == "koniec":
        break
    print(odpovedz(veta))`),
  ];

  /* ── l1: setup a .env ── */
  window.EXTRA_WRITE.l1 = [
    W('Kontrolný výpis',
      'Napíš skript, ktorý vypíše dva riadky: „Prostredie pripravené" a „Ideme na LangChain!" — over si, že ti PyCharm beží.',
      `# tvoj kód...`,
      [['print("Prostredie pripravené")', "print('Prostredie pripravené')"], ['print(']],
      'Dva printy pod sebou. Spusti zeleným ▶ a hľadaj exit code 0.',
      `print("Prostredie pripravené")
print("Ideme na LangChain!")`),
    W('Prečítaj premennú prostredia',
      'Cez <code>os.getenv()</code> načítaj premennú <code>"USER"</code> do premennej a vypíš ju.',
      `import os
# tvoj kód...`,
      [['os.getenv('], ['"USER"', "'USER'"], ['print(']],
      'pouzivatel = os.getenv("USER") → print(pouzivatel). Na Macu vráti tvoje používateľské meno.',
      `import os

pouzivatel = os.getenv("USER")
print(pouzivatel)`),
    W('Kľúč s podmienkou',
      'Zavolaj <code>load_dotenv()</code>, načítaj <code>OPENAI_API_KEY</code> a cez <code>if/else</code> vypíš „Kľúč OK" alebo „Kľúč chýba!".',
      `import os
from dotenv import load_dotenv
# tvoj kód...`,
      [['load_dotenv()'], ['os.getenv("OPENAI_API_KEY")', "os.getenv('OPENAI_API_KEY')"], ['if '], ['else']],
      'if api_key: → „OK" vetva; else: → „chýba". Prázdno/None sa v podmienke počíta ako nepravda.',
      `import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("Kľúč OK")
else:
    print("Kľúč chýba!")`),
    W('Dĺžka kľúča',
      'Načítaj kľúč z .env a vypíš, koľko má znakov (cez <code>len()</code>) — bez vypísania samotného kľúča!',
      `import os
from dotenv import load_dotenv

load_dotenv()
# tvoj kód...`,
      [['os.getenv('], ['len(']],
      'print(len(api_key)) — dĺžku smieš ukázať, obsah nie. Bezpečnostný návyk od prvého dňa.',
      `import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print(len(api_key))`),
    W('Funkcia over_kluc()',
      'Napíš funkciu <code>over_kluc()</code>, ktorá vráti <code>True</code>, ak <code>OPENAI_API_KEY</code> existuje, inak <code>False</code>. Výsledok vypíš.',
      `import os
from dotenv import load_dotenv

load_dotenv()
# tvoj kód...`,
      [['def over_kluc'], ['os.getenv('], ['is not None', 'return True'], ['print(']],
      'return os.getenv("OPENAI_API_KEY") is not None — porovnanie rovno vráti True/False.',
      `import os
from dotenv import load_dotenv

load_dotenv()

def over_kluc():
    return os.getenv("OPENAI_API_KEY") is not None

print(over_kluc())`),
    W('Bezpečná ukážka kľúča',
      'Načítaj kľúč a vypíš len jeho prvých 8 znakov + „…" (výrez <code>[:8]</code>). Presne takto sa kľúče ukazujú v logoch.',
      `import os
from dotenv import load_dotenv

load_dotenv()
kluc = os.getenv("OPENAI_API_KEY")
# tvoj kód...`,
      [['[:8]'], ['print(']],
      'print(kluc[:8] + "…") alebo f-string f"{kluc[:8]}…".',
      `import os
from dotenv import load_dotenv

load_dotenv()
kluc = os.getenv("OPENAI_API_KEY")
print(kluc[:8] + "…")`),
    W('Kontrola viacerých premenných',
      'Zoznam <code>POTREBNE</code> obsahuje názvy premenných. Cyklom over každú cez <code>os.getenv()</code> a vypíš „NÁZOV: OK" alebo „NÁZOV: CHÝBA".',
      `import os
from dotenv import load_dotenv

load_dotenv()
POTREBNE = ["OPENAI_API_KEY", "LANGCHAIN_API_KEY"]
# tvoj kód...`,
      [['for '], ['os.getenv('], ['if '], ['CHÝBA', 'CHYBA', 'chýba']],
      'for nazov in POTREBNE: hodnota = os.getenv(nazov) → if/else print.',
      `import os
from dotenv import load_dotenv

load_dotenv()
POTREBNE = ["OPENAI_API_KEY", "LANGCHAIN_API_KEY"]
for nazov in POTREBNE:
    if os.getenv(nazov):
        print(f"{nazov}: OK")
    else:
        print(f"{nazov}: CHÝBA")`),
    W('Funkcia maskuj()',
      'Napíš funkciu <code>maskuj(kluc)</code>, ktorá vráti prvých 5 znakov + <code>"***"</code>. Otestuj na vymyslenom kľúči.',
      `# tvoj kód...`,
      [['def maskuj'], ['[:5]'], ['***'], ['return']],
      'return kluc[:5] + "***" — výrez + zlepenie textov plusom.',
      `def maskuj(kluc):
    return kluc[:5] + "***"

print(maskuj("sk-proj-AbCdEfGh"))`),
    W('Diagnostika prostredia',
      'Napíš kompletný diagnostický skript: vypíš verziu Pythonu (<code>sys.version</code>, prvých 6 znakov), zavolaj <code>load_dotenv()</code>, over kľúč cez if/else a na záver vypíš „Diagnostika hotová".',
      `import sys
import os
from dotenv import load_dotenv
# tvoj kód...`,
      [['sys.version'], ['[:6]'], ['load_dotenv()'], ['os.getenv('], ['Diagnostika hotová']],
      'print(sys.version[:6]) → load_dotenv() → if os.getenv(...) → záverečný print. Skladáš všetko z lekcie dokopy.',
      `import sys
import os
from dotenv import load_dotenv

print("Python:", sys.version[:6])
load_dotenv()
if os.getenv("OPENAI_API_KEY"):
    print("Kľúč: OK")
else:
    print("Kľúč: CHÝBA")
print("Diagnostika hotová")`),
  ];

  /* ── l2: modely ── */
  window.EXTRA_WRITE.l2 = [
    W('Prvé volanie modelu',
      'Vytvor <code>ChatOpenAI</code> model <code>gpt-4o-mini</code>, polož mu ľubovoľnú otázku cez <code>invoke()</code> a vypíš <code>.content</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
# tvoj kód...`,
      [['ChatOpenAI('], ['gpt-4o-mini'], ['.invoke('], ['.content']],
      'model = ChatOpenAI(model="gpt-4o-mini") → odpoved = model.invoke("...") → print(odpoved.content).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
odpoved = model.invoke("Čo je LangChain? Jednou vetou.")
print(odpoved.content)`),
    W('Faktický model (T=0)',
      'Vytvor model s <code>temperature=0</code> a spýtaj sa ho na hlavné mesto Francúzska. Vypíš odpoveď.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
# tvoj kód...`,
      [['temperature=0', 'temperature = 0'], ['.invoke('], ['.content']],
      'Fakty = temperature=0, aby odpoveď bola vždy rovnaká a vecná.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
print(model.invoke("Aké je hlavné mesto Francúzska?").content)`),
    W('Krátka odpoveď (max_tokens)',
      'Vytvor model s <code>max_tokens=30</code> a nechaj ho opísať more. Sleduj, ako sa odpoveď utne — vypíš ju.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
# tvoj kód...`,
      [['max_tokens=30', 'max_tokens = 30'], ['.invoke('], ['.content']],
      'max_tokens je strop dĺžky odpovede — ochrana proti dlhým (drahým) výstupom.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", max_tokens=30)
print(model.invoke("Opíš more.").content)`),
    W('Dve otázky za sebou',
      'Jednému modelu polož DVE rôzne otázky (dve samostatné <code>invoke()</code>) a vypíš obe odpovede. Všimni si: druhá otázka o prvej nič nevie!',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['.invoke('], ['.content'], ['print(']],
      'Dva bloky invoke+print. Model je bezstavový — každé volanie začína od nuly (preto neskôr história!).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

print(model.invoke("Volám sa Martin. Zapamätaj si to.").content)
print(model.invoke("Ako sa volám?").content)  # nevie — bezstavový!`),
    W('Koľko stáli tokeny',
      'Polož otázku a z <code>response_metadata["token_usage"]</code> vypíš <code>total_tokens</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['response_metadata'], ['token_usage'], ['total_tokens']],
      'odpoved.response_metadata["token_usage"]["total_tokens"] — dva slovníky do seba.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
odpoved = model.invoke("Pozdrav ma.")
print(odpoved.response_metadata["token_usage"]["total_tokens"])`),
    W('Súboj teplôt',
      'Vytvor DVA modely (T=0 a T=1.3), polož obom rovnakú kreatívnu otázku a vypíš odpovede s označením „T=0:" a „T=1.3:".',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
# tvoj kód...`,
      [['temperature=0', 'temperature = 0'], ['temperature=1.3', 'temperature = 1.3'], ['.invoke(']],
      'Dva objekty ChatOpenAI s rôznou temperature, rovnaký string do oboch invoke.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
presny = ChatOpenAI(model="gpt-4o-mini", temperature=0)
divoky = ChatOpenAI(model="gpt-4o-mini", temperature=1.3)

otazka = "Vymysli názov pre robotickú kaviareň."
print("T=0:", presny.invoke(otazka).content)
print("T=1.3:", divoky.invoke(otazka).content)`),
    W('Streamuj odpoveď',
      'Cez <code>model.stream()</code> nechaj model vymenovať 5 planét — chunky vypisuj plynulo cez <code>print(chunk.content, end="", flush=True)</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['.stream('], ['end=""', "end=''"], ['flush=True']],
      'for chunk in model.stream("..."): print(chunk.content, end="", flush=True).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
for chunk in model.stream("Vymenuj 5 planét slnečnej sústavy."):
    print(chunk.content, end="", flush=True)`),
    W('Funkcia opytaj()',
      'Napíš funkciu <code>opytaj(otazka: str) -> str</code>, ktorá zavolá model a vráti <code>.content</code>. Zavolaj ju dvakrát s rôznymi otázkami.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['def opytaj'], ['return'], ['.content'], ['opytaj(']],
      'def opytaj(otazka): return model.invoke(otazka).content — a dvakrát print(opytaj(...)).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

def opytaj(otazka: str) -> str:
    return model.invoke(otazka).content

print(opytaj("Čo je token?"))
print(opytaj("A čo je temperature?"))`),
    W('Mini konzolový pýtač',
      'Sprav slučku <code>while True</code>: čítaj otázky cez <code>input()</code>, „koniec" ukončí, inak zavolaj model a vypíš odpoveď. Tvoj prvý AI program s interakciou!',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['while True'], ['input('], ['break'], ['.invoke('], ['.content']],
      'Kostra z lekcie B + model.invoke(otazka).content namiesto echa.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

while True:
    otazka = input("Ty: ")
    if otazka == "koniec":
        break
    print("AI:", model.invoke(otazka).content)`),
  ];

  /* ── l3: šablóny ── */
  window.EXTRA_WRITE.l3 = [
    W('Prvá šablóna',
      'Vytvor <code>PromptTemplate.from_template</code> s premennou <code>{zviera}</code> („Napíš fakt o {zviera}."), zavolaj <code>invoke()</code> a vypíš <code>to_string()</code>.',
      `from langchain_core.prompts import PromptTemplate
# tvoj kód...`,
      [['PromptTemplate.from_template'], ['{zviera}'], ['.invoke('], ['to_string()']],
      'sablona.invoke({"zviera": "sova"}) → print(prompt.to_string()).',
      `from langchain_core.prompts import PromptTemplate

sablona = PromptTemplate.from_template("Napíš fakt o {zviera}.")
prompt = sablona.invoke({"zviera": "sova"})
print(prompt.to_string())`),
    W('Dve premenné',
      'Vytvor šablónu s premennými <code>{pocet}</code> a <code>{tema}</code> („Vymysli {pocet} otázok na tému {tema}.") a vypíš ju vyplnenú.',
      `from langchain_core.prompts import PromptTemplate
# tvoj kód...`,
      [['{pocet}'], ['{tema}'], ['.invoke('], ['to_string()']],
      'invoke dostane slovník s OBOMA kľúčmi: {"pocet": 3, "tema": "vesmír"}.',
      `from langchain_core.prompts import PromptTemplate

sablona = PromptTemplate.from_template("Vymysli {pocet} otázok na tému {tema}.")
print(sablona.invoke({"pocet": 3, "tema": "vesmír"}).to_string())`),
    W('Chat šablóna s rolami',
      'Vytvor <code>ChatPromptTemplate.from_messages</code>: system „Si stručný učiteľ." + human s premennou <code>{otazka}</code>. Zavolaj invoke a vypíš výsledok.',
      `from langchain_core.prompts import ChatPromptTemplate
# tvoj kód...`,
      [['from_messages'], ['("system"', "('system'"], ['("human"', "('human'"], ['{otazka}']],
      'Zoznam dvojíc: [("system", "..."), ("human", "{otazka}")].',
      `from langchain_core.prompts import ChatPromptTemplate

sablona = ChatPromptTemplate.from_messages([
    ("system", "Si stručný učiteľ."),
    ("human", "{otazka}"),
])
print(sablona.invoke({"otazka": "Čo je gravitácia?"}))`),
    W('Šablóna → model',
      'Sprav dva kroky ručne: šablónou vyrob prompt (premenná <code>{jedlo}</code>) a prompt pošli do modelu. Vypíš odpoveď.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['{jedlo}'], ['sablona.invoke', '.invoke({'], ['model.invoke(prompt)', 'model.invoke( prompt']],
      'prompt = sablona.invoke({...}) → odpoved = model.invoke(prompt) → print(odpoved.content).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

sablona = ChatPromptTemplate.from_template("Napíš krátku ódu na {jedlo}.")
prompt = sablona.invoke({"jedlo": "pizzu"})
print(model.invoke(prompt).content)`),
    W('Partial — preddosadenie',
      'Vytvor šablónu s <code>{jazyk}</code> a <code>{text}</code>, cez <code>.partial(jazyk="nemčina")</code> preddosaď jazyk a potom invokuj UŽ LEN s textom.',
      `from langchain_core.prompts import ChatPromptTemplate
# tvoj kód...`,
      [['{jazyk}'], ['{text}'], ['.partial('], ['jazyk="nemčina"', "jazyk='nemčina'"]],
      'sablona2 = sablona.partial(jazyk="nemčina") → sablona2.invoke({"text": "..."}) — jazyk už netreba.',
      `from langchain_core.prompts import ChatPromptTemplate

sablona = ChatPromptTemplate.from_template("Prelož do jazyka {jazyk}: {text}")
nemecka = sablona.partial(jazyk="nemčina")
print(nemecka.invoke({"text": "Dobrý deň"}))`),
    W('Literálne zátvorky',
      'Vytvor šablónu, ktorá modelu ukazuje vzor JSON: „Odpovedz vo formáte {{"mesto": "..."}}. Otázka: {otazka}" — dvojité zátvorky ostanú v texte ako jednoduché.',
      `from langchain_core.prompts import ChatPromptTemplate
# tvoj kód...`,
      [['{{'], ['}}'], ['{otazka}'], ['.invoke(']],
      '{{ a }} = literálne { } v šablóne. Jednoduché {otazka} zostáva premennou.',
      `from langchain_core.prompts import ChatPromptTemplate

sablona = ChatPromptTemplate.from_template(
    'Odpovedz vo formáte {{"mesto": "..."}}. Otázka: {otazka}'
)
print(sablona.invoke({"otazka": "Kde je Eiffelovka?"}).to_string())`),
    W('Funkcia vyrob_prompt()',
      'Napíš funkciu <code>vyrob_prompt(tema)</code>, ktorá vytvorí šablónu („Vysvetli {tema} dieťaťu.") a vráti VYPLNENÝ prompt. Zavolaj ju s dvomi témami.',
      `from langchain_core.prompts import ChatPromptTemplate
# tvoj kód...`,
      [['def vyrob_prompt'], ['{tema}'], ['return'], ['vyrob_prompt(']],
      'Funkcia vnútri: sablona.invoke({"tema": tema}) a return výsledku.',
      `from langchain_core.prompts import ChatPromptTemplate

def vyrob_prompt(tema):
    sablona = ChatPromptTemplate.from_template("Vysvetli {tema} dieťaťu.")
    return sablona.invoke({"tema": tema})

print(vyrob_prompt("blesk").to_string())
print(vyrob_prompt("dúhu").to_string())`),
    W('Trojpremenná rola',
      'Postav chat šablónu: system s premennými <code>{rola}</code> a <code>{styl}</code> („Si {rola}. Odpovedáš {styl}."), human s <code>{otazka}</code>. Vyplň všetky tri a pošli do modelu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['{rola}'], ['{styl}'], ['{otazka}'], ['model.invoke(']],
      'Slovník v invoke musí mať tri kľúče: rola, styl, otazka.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

sablona = ChatPromptTemplate.from_messages([
    ("system", "Si {rola}. Odpovedáš {styl}."),
    ("human", "{otazka}"),
])
prompt = sablona.invoke({"rola": "kuchár", "styl": "vtipne", "otazka": "Ako uvarím ryžu?"})
print(model.invoke(prompt).content)`),
    W('Filmový kritik',
      'Poskladaj celé: system „Si filmový kritik, odpovedáš sarkasticky.", human s premennými <code>{film}</code> a <code>{rok}</code>. Šablónu vyplň, pošli do modelu a vypíš recenziu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
# tvoj kód...`,
      [['from_messages'], ['kritik'], ['{film}'], ['{rok}'], ['model.invoke(']],
      'Rovnaký vzor ako reštauračný kritik z lekcie — len iná doména a premenné.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)

sablona = ChatPromptTemplate.from_messages([
    ("system", "Si filmový kritik, odpovedáš sarkasticky."),
    ("human", "Napíš mini recenziu na film {film} z roku {rok}."),
])
prompt = sablona.invoke({"film": "Titanic", "rok": 1997})
print(model.invoke(prompt).content)`),
  ];

  /* ── l4: messages ── */
  window.EXTRA_WRITE.l4 = [
    W('System + Human',
      'Zostav zoznam so <code>SystemMessage</code> („Odpovedáš jedným slovom.") a <code>HumanMessage</code> (ľubovoľná otázka) a pošli ho do modelu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['SystemMessage(content='], ['HumanMessage(content='], ['model.invoke(']],
      'spravy = [SystemMessage(...), HumanMessage(...)] → model.invoke(spravy).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

spravy = [
    SystemMessage(content="Odpovedáš jedným slovom."),
    HumanMessage(content="Aká farba má citrón?"),
]
print(model.invoke(spravy).content)`),
    W('História s AIMessage',
      'Zostav históriu: human „Volám sa Martin", AI odpoveď „Teší ma, Martin!", nová human otázka „Ako sa volám?". Pošli celý zoznam a vypíš odpoveď.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['HumanMessage(content='], ['AIMessage(content='], ['model.invoke(']],
      'Model pozná meno len z histórie — preto ho v odpovedi zopakuje.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

historia = [
    HumanMessage(content="Volám sa Martin."),
    AIMessage(content="Teší ma, Martin!"),
    HumanMessage(content="Ako sa volám?"),
]
print(model.invoke(historia).content)`),
    W('Pirát na dve otázky',
      'System správa: pirát. Polož prvú otázku, odpoveď PRIDAJ do zoznamu ako <code>AIMessage</code>, pridaj druhú otázku a zavolaj model znova.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['SystemMessage('], ['.append(AIMessage(content=', 'AIMessage(content='], ['.append(HumanMessage', 'HumanMessage(content='], ['model.invoke(']],
      'odpoved1 = model.invoke(spravy) → spravy.append(AIMessage(content=odpoved1.content)) → append novej otázky → invoke znova.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

spravy = [
    SystemMessage(content="Si pirát, odpovedáš krátko so slangom."),
    HumanMessage(content="Ako sa máš?"),
]
odpoved1 = model.invoke(spravy)
print(odpoved1.content)

spravy.append(AIMessage(content=odpoved1.content))
spravy.append(HumanMessage(content="A čo tvoja loď?"))
print(model.invoke(spravy).content)`),
    W('Few-shot skratkovač',
      'Nauč model ukážkami rozpisovať skratky: 2 dvojice Human/AI („BTW" → „mimochodom", „IMHO" → „podľa môjho skromného názoru") + ostrá otázka „FYI".',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['SystemMessage('], ['HumanMessage(content="BTW"', "HumanMessage(content='BTW'"], ['AIMessage('], ['FYI']],
      'Ukážky sú dvojice Human→AI. Model z nich odvodí formát pre FYI.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

spravy = [
    SystemMessage(content="Rozpisuješ internetové skratky po slovensky."),
    HumanMessage(content="BTW"),
    AIMessage(content="mimochodom"),
    HumanMessage(content="IMHO"),
    AIMessage(content="podľa môjho skromného názoru"),
    HumanMessage(content="FYI"),
]
print(model.invoke(spravy).content)`),
    W('Formátové pravidlo',
      'System správou vynúť formát „maximálne 5 slov, žiadne emoji" a over dvoma rôznymi otázkami, že model pravidlo drží.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['SystemMessage('], ['5 slov', 'päť slov'], ['model.invoke(']],
      'Pravidlá do system správy; potom dve volania s rôznymi HumanMessage.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

system = SystemMessage(content="Odpovedáš maximálne 5 slovami, žiadne emoji.")
print(model.invoke([system, HumanMessage(content="Čo je Python?")]).content)
print(model.invoke([system, HumanMessage(content="Prečo prší?")]).content)`),
    W('Funkcia poloz_otazku()',
      'Napíš funkciu <code>poloz_otazku(historia, text)</code>: pridá <code>HumanMessage</code>, zavolá model, pridá <code>AIMessage</code> s odpoveďou a odpoveď vráti. Použi ju na 2 otázky.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
historia = []
# tvoj kód...`,
      [['def poloz_otazku'], ['historia.append(HumanMessage', '.append(HumanMessage'], ['.append(AIMessage'], ['return']],
      'Vo funkcii: append human → invoke → append AI → return odpoveď.content. Toto je jadro chatbota s pamäťou!',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
historia = []

def poloz_otazku(historia, text):
    historia.append(HumanMessage(content=text))
    odpoved = model.invoke(historia)
    historia.append(AIMessage(content=odpoved.content))
    return odpoved.content

print(poloz_otazku(historia, "Volám sa Martin a mám psa Dunča."))
print(poloz_otazku(historia, "Ako sa volá môj pes?"))`),
    W('Few-shot klasifikátor nálady',
      'Postav klasifikátor: system + 3 few-shot dvojice (POZITÍVNA/NEGATÍVNA/NEUTRÁLNA) + ostrá veta. Model musí vrátiť len jedno slovo.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['SystemMessage('], ['POZITÍVNA'], ['NEGATÍVNA'], ['NEUTRÁLNA'], ['model.invoke(']],
      'Tri ukážkové dvojice Human/AI — každá kategória raz — a na koniec ostrá HumanMessage.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

spravy = [
    SystemMessage(content="Klasifikuješ nálady viet. Odpovedáš jedným slovom."),
    HumanMessage(content="Dnes je nádherný deň!"),
    AIMessage(content="POZITÍVNA"),
    HumanMessage(content="Všetko sa mi pokazilo."),
    AIMessage(content="NEGATÍVNA"),
    HumanMessage(content="Vonku je oblačno."),
    AIMessage(content="NEUTRÁLNA"),
    HumanMessage(content="Vyhral som súťaž, ale zlomil som si nohu."),
]
print(model.invoke(spravy).content)`),
    W('Slučka s históriou správ',
      'Postav mini chatbota BEZ šablóny — len zoznam správ: system na začiatku, v slučke <code>while</code> pridávaj Human/AI správy a udržuj pamäť.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['SystemMessage('], ['while True'], ['break'], ['.append(HumanMessage'], ['.append(AIMessage']],
      'historia = [SystemMessage(...)] → v slučke: append human → invoke(historia) → print → append AI.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

historia = [SystemMessage(content="Si stručný asistent.")]
while True:
    otazka = input("Ty: ")
    if otazka == "koniec":
        break
    historia.append(HumanMessage(content=otazka))
    odpoved = model.invoke(historia)
    print("Bot:", odpoved.content)
    historia.append(AIMessage(content=odpoved.content))`),
    W('Extraktor miest (few-shot majster)',
      'Nauč model ukážkami vyťahovať mesto z vety: 3 dvojice („Bývam v Nitre už rok." → „Nitra"…), ostrá veta na záver. Ak mesto nie je, má vrátiť „–" (pridaj aj takú ukážku!).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['SystemMessage('], ['AIMessage('], ['"–"', "'–'", '"-"', "'-'"], ['model.invoke(']],
      'Štyri ukážky: tri s mestom, jedna bez („Mám rád kávu." → „–"). Negatívna ukážka je kľúč k spoľahlivosti.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

spravy = [
    SystemMessage(content="Z vety vytiahneš názov mesta. Ak tam nie je, odpovieš –."),
    HumanMessage(content="Bývam v Nitre už rok."),
    AIMessage(content="Nitra"),
    HumanMessage(content="Cez víkend idem do Košíc."),
    AIMessage(content="Košice"),
    HumanMessage(content="Mám rád kávu."),
    AIMessage(content="–"),
    HumanMessage(content="Presťahovali sme sa do Martina kvôli horám."),
]
print(model.invoke(spravy).content)`),
  ];

  /* ── l5: chainy ── */
  window.EXTRA_WRITE.l5 = [
    W('Trojčlánková rúra',
      'Zlož chain <code>prompt | model | parser</code> so šablónou „Vysvetli {pojem} jednou vetou." a zavolaj ho.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['{pojem}'], ['| model'], ['StrOutputParser()'], ['.invoke(']],
      'chain = prompt | model | StrOutputParser() → chain.invoke({"pojem": "..."}).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_template("Vysvetli {pojem} jednou vetou.")
chain = prompt | model | StrOutputParser()
print(chain.invoke({"pojem": "algoritmus"}))`),
    W('Chain s dvomi premennými',
      'Postav chain so šablónou obsahujúcou <code>{produkt}</code> a <code>{cielovka}</code> („Napíš reklamný text na {produkt} pre {cielovka}.") a zavolaj ho.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
# tvoj kód...`,
      [['{produkt}'], ['{cielovka}'], ['| model |'], ['.invoke(']],
      'Slovník v invoke má oba kľúče: {"produkt": "...", "cielovka": "..."}.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)

prompt = ChatPromptTemplate.from_template("Napíš reklamný text na {produkt} pre {cielovka}.")
chain = prompt | model | StrOutputParser()
print(chain.invoke({"produkt": "smart hodinky", "cielovka": "bežcov"}))`),
    W('S parserom vs. bez',
      'Postav DVA chainy: jeden bez parsera, druhý s <code>StrOutputParser</code>. Zavolaj oba s rovnakým vstupom a vypíš typ výsledku cez <code>type(...).__name__</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("Pozdrav {koho}.")
# tvoj kód...`,
      [['prompt | model'], ['StrOutputParser()'], ['type('], ['__name__']],
      'chain1 = prompt | model; chain2 = prompt | model | StrOutputParser(). Uvidíš AIMessage vs. str.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("Pozdrav {koho}.")

bez = prompt | model
s_parserom = prompt | model | StrOutputParser()

print(type(bez.invoke({"koho": "Martina"})).__name__)
print(type(s_parserom.invoke({"koho": "Martina"})).__name__)`),
    W('Továreň na chainy',
      'Napíš funkciu <code>vyrob_chain(system_text)</code>, ktorá vráti chain so zadanou system správou a human <code>{otazka}</code>. Vyrob ňou dva rôzne chainy a otestuj.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['def vyrob_chain'], ['("system", system_text)', "('system', system_text)"], ['return'], ['vyrob_chain(']],
      'Vo funkcii poskladaj from_messages([("system", system_text), ("human", "{otazka}")]) | model | parser a vráť ho.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

def vyrob_chain(system_text):
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_text),
        ("human", "{otazka}"),
    ])
    return prompt | model | StrOutputParser()

basnik = vyrob_chain("Si básnik, odpovedáš v rýmoch.")
vedec = vyrob_chain("Si vedec, odpovedáš presne a stroho.")
print(basnik.invoke({"otazka": "Prečo prší?"}))
print(vedec.invoke({"otazka": "Prečo prší?"}))`),
    W('Tri témy cyklom',
      'Vytvor chain na krátke vysvetlenia a cyklom <code>for</code> ho zavolaj pre tri témy zo zoznamu. Každú odpoveď vypíš s názvom témy.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
temy = ["blockchain", "fotosyntéza", "inflácia"]
# tvoj kód...`,
      [['for '], [' in temy'], ['.invoke('], ['f"', "f'"]],
      'for tema in temy: odpoved = chain.invoke({"tema": tema}) → print(f"{tema}: {odpoved}").',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
temy = ["blockchain", "fotosyntéza", "inflácia"]

chain = ChatPromptTemplate.from_template("Vysvetli {tema} jednou vetou.") | model | StrOutputParser()
for tema in temy:
    print(f"{tema}: {chain.invoke({'tema': tema})}")`),
    W('Stručnosť cez partial',
      'Vytvor šablónu so system premennou <code>{limit}</code> („Odpovedáš maximálne {limit} slovami.") a human <code>{otazka}</code>. Cez <code>.partial(limit="10")</code> vyrob stručný chain.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['{limit}'], ['.partial('], ['| model |'], ['.invoke(']],
      'sablona.partial(limit="10") vráti novú šablónu — tú zapoj do chainu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

sablona = ChatPromptTemplate.from_messages([
    ("system", "Odpovedáš maximálne {limit} slovami."),
    ("human", "{otazka}"),
])
strucny = sablona.partial(limit="10") | model | StrOutputParser()
print(strucny.invoke({"otazka": "Čo je umelá inteligencia?"}))`),
    W('Reťaz reťazí',
      'Chain 1 vymyslí názov kapely pre <code>{zaner}</code>. Chain 2 k názvu (<code>{nazov}</code>) napíše slogan. Prepoj ich cez lambda „prebaľovač" a spusti dokopy.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
parser = StrOutputParser()
# tvoj kód...`,
      [['{zaner}'], ['{nazov}'], ['lambda'], ['.invoke(']],
      'mega = chain_nazov | (lambda n: {"nazov": n}) | chain_slogan — lambda prebalí string na slovník pre druhú šablónu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
parser = StrOutputParser()

chain_nazov = ChatPromptTemplate.from_template(
    "Vymysli jeden názov kapely žánru {zaner}. Len názov.") | model | parser
chain_slogan = ChatPromptTemplate.from_template(
    "Napíš slogan pre kapelu {nazov}.") | model | parser

mega = chain_nazov | (lambda n: {"nazov": n}) | chain_slogan
print(mega.invoke({"zaner": "rock"}))`),
    W('Prekladateľský kolotoč',
      'Postav chain SK→EN a slučku <code>while True</code>, ktorá prekladá vety, kým nenapíšeš „koniec".',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['| model |'], ['while True'], ['break'], ['.invoke(']],
      'Chain zlož raz PRED slučkou; v slučke len invoke s novým textom.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = ChatPromptTemplate.from_template(
    "Prelož do angličtiny: {text}") | model | StrOutputParser()

while True:
    veta = input("SK: ")
    if veta == "koniec":
        break
    print("EN:", chain.invoke({"text": veta}))`),
    W('Redakčný dvojkrok',
      'Chain 1 napíše krátky odsek o <code>{tema}</code>. Chain 2 dostane <code>{text}</code> a skráti ho na jednu vetu. Spoj ich lambdou a vypíš finálnu vetu pre tému „vesmírne výťahy".',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()
# tvoj kód...`,
      [['{tema}'], ['{text}'], ['lambda'], ['vesmírne výťahy']],
      'Presne vzor „reťaz reťazí": autor | (lambda t: {"text": t}) | editor.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

autor = ChatPromptTemplate.from_template("Napíš krátky odsek o téme {tema}.") | model | parser
editor = ChatPromptTemplate.from_template("Skráť na jednu vetu: {text}") | model | parser

redakcia = autor | (lambda t: {"text": t}) | editor
print(redakcia.invoke({"tema": "vesmírne výťahy"}))`),
  ];

  /* ── l6: parsery ── */
  window.EXTRA_WRITE.l6 = [
    W('String parser v akcii',
      'Postav chain s <code>StrOutputParser</code> a over cez <code>type(...).__name__</code>, že výsledok je naozaj <code>str</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['StrOutputParser()'], ['type('], ['__name__']],
      'vysledok = chain.invoke(...) → print(type(vysledok).__name__) → „str".',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

chain = ChatPromptTemplate.from_template("Pozdrav.") | model | StrOutputParser()
vysledok = chain.invoke({})
print(vysledok)
print(type(vysledok).__name__)`),
    W('Zoznam farieb',
      'Cez <code>CommaSeparatedListOutputParser</code> vypýtaj od modelu 5 farieb a vypíš PRVÚ zo zoznamu + počet cez <code>len()</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import CommaSeparatedListOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['CommaSeparatedListOutputParser()'], ['get_format_instructions'], ['[0]'], ['len(']],
      'Nezabudni format_instructions do promptu cez .partial() — inak model vráti odrážky namiesto čiarok.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import CommaSeparatedListOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = CommaSeparatedListOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "{format_instructions}"),
    ("human", "Vymenuj 5 farieb."),
]).partial(format_instructions=parser.get_format_instructions())

farby = (prompt | model | parser).invoke({})
print(farby[0])
print(len(farby))`),
    W('Pozri, čo parser posiela',
      'Vytvor <code>CommaSeparatedListOutputParser</code> a LEN vypíš, čo vráti <code>get_format_instructions()</code> — uvidíš presnú inštrukciu pre model.',
      `from langchain_core.output_parsers import CommaSeparatedListOutputParser
# tvoj kód...`,
      [['CommaSeparatedListOutputParser()'], ['get_format_instructions()'], ['print(']],
      'print(parser.get_format_instructions()) — žiadny model netreba, je to obyčajný text.',
      `from langchain_core.output_parsers import CommaSeparatedListOutputParser

parser = CommaSeparatedListOutputParser()
print(parser.get_format_instructions())`),
    W('JSON o meste',
      'Cez <code>JsonOutputParser</code> vypýtaj slovník s poľami <code>mesto</code> a <code>krajina</code> pre Eiffelovku a vypíš hodnoty cez kľúče.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['JsonOutputParser()'], ['["mesto"]', "['mesto']"], ['["krajina"]', "['krajina']"]],
      'Prompt: „Odpovedz iba čistým JSON s poľami mesto a krajina. Kde stojí Eiffelova veža?"',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_template(
    "Kde stojí Eiffelova veža? Odpovedz iba čistým JSON s poľami mesto a krajina."
)
data = (prompt | model | JsonOutputParser()).invoke({})
print(data["mesto"])
print(data["krajina"])`),
    W('Extrakcia z vety',
      'Z vety „Peter má 34 rokov a pracuje ako kuchár." vytiahni JSON s poľami <code>meno</code>, <code>vek</code>, <code>povolanie</code> a vypíš každé na riadok.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['JsonOutputParser'], ['{text}'], ['["meno"]', "['meno']"], ['["vek"]', "['vek']"]],
      'Šablóna s {text} + inštrukcia na čistý JSON. Potom tri printy cez kľúče.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_template(
    "Z textu vytiahni meno, vek a povolanie. Iba čistý JSON. Text: {text}"
)
data = (prompt | model | JsonOutputParser()).invoke(
    {"text": "Peter má 34 rokov a pracuje ako kuchár."})
print(data["meno"])
print(data["vek"])
print(data["povolanie"])`),
    W('Pydantic Osoba',
      'Definuj triedu <code>Osoba(BaseModel)</code> s poľami <code>meno: str</code> a <code>vek: int</code>, postav <code>PydanticOutputParser</code> chain a nechaj model vyplniť osobu z vety.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['class Osoba(BaseModel)'], ['meno: str'], ['vek: int'], ['PydanticOutputParser(pydantic_object=Osoba)']],
      'parser = PydanticOutputParser(pydantic_object=Osoba) + format_instructions cez partial. Výsledok má .meno a .vek!',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

class Osoba(BaseModel):
    meno: str
    vek: int

parser = PydanticOutputParser(pydantic_object=Osoba)
prompt = ChatPromptTemplate.from_template(
    "Vyplň údaje z textu.\\n{format_instructions}\\nText: {text}"
).partial(format_instructions=parser.get_format_instructions())

osoba = (prompt | model | parser).invoke({"text": "Jana má 29 rokov."})
print(osoba.meno, osoba.vek)`),
    W('Produkt s popismi polí',
      'Definuj <code>Produkt(BaseModel)</code> s poľami <code>nazov: str</code> a <code>cena: float</code>, obe s <code>Field(description=...)</code>. Nechaj model vymyslieť produkt pre e-shop so športovým tovarom.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['class Produkt(BaseModel)'], ['Field(description='], ['cena: float'], ['PydanticOutputParser(']],
      'Field(description="…") pomáha modelu pochopiť, čo do poľa patrí. Cena float = desatinné číslo.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

class Produkt(BaseModel):
    nazov: str = Field(description="chytľavý názov produktu")
    cena: float = Field(description="cena v eurách")

parser = PydanticOutputParser(pydantic_object=Produkt)
prompt = ChatPromptTemplate.from_template(
    "Vymysli produkt pre športový e-shop.\\n{format_instructions}"
).partial(format_instructions=parser.get_format_instructions())

p = (prompt | model | parser).invoke({})
print(f"{p.nazov} — {p.cena} €")`),
    W('Hromadná extrakcia',
      'Zoznam <code>vety</code> obsahuje 3 vety o ľuďoch. Cyklom prežeň každú JSON chainom (meno + vek) a výsledky pridávaj do zoznamu <code>ludia</code>. Nakoniec vypíš celý zoznam.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
vety = [
    "Anna má 25 rokov.",
    "Boris oslávil tridsiatku, má 30.",
    "Cyril má 42 rokov.",
]
# tvoj kód...`,
      [['for '], ['.invoke('], ['ludia.append(', '.append('], ['print(ludia)', 'print( ludia']],
      'ludia = [] → for veta in vety: data = chain.invoke({"text": veta}) → ludia.append(data).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
vety = [
    "Anna má 25 rokov.",
    "Boris oslávil tridsiatku, má 30.",
    "Cyril má 42 rokov.",
]

chain = ChatPromptTemplate.from_template(
    "Vytiahni meno a vek. Iba čistý JSON. Text: {text}"
) | model | JsonOutputParser()

ludia = []
for veta in vety:
    ludia.append(chain.invoke({"text": veta}))
print(ludia)`),
    W('Pydantic recept s výpisom',
      'Definuj <code>Kokteil(BaseModel)</code>: <code>nazov: str</code>, <code>ingrediencie: list[str]</code>. Nechaj model vymyslieť nealko kokteil a ingrediencie vypíš očíslované cez <code>enumerate</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['class Kokteil(BaseModel)'], ['list[str]'], ['PydanticOutputParser('], ['enumerate(']],
      'for i, ing in enumerate(k.ingrediencie, start=1): print(f"{i}. {ing}").',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

class Kokteil(BaseModel):
    nazov: str
    ingrediencie: list[str]

parser = PydanticOutputParser(pydantic_object=Kokteil)
prompt = ChatPromptTemplate.from_template(
    "Vymysli nealko kokteil.\\n{format_instructions}"
).partial(format_instructions=parser.get_format_instructions())

k = (prompt | model | parser).invoke({})
print(k.nazov)
for i, ing in enumerate(k.ingrediencie, start=1):
    print(f"{i}. {ing}")`),
  ];

  /* ── l7: LCEL ── */
  window.EXTRA_WRITE.l7 = [
    W('Batch tri naraz',
      'Postav jednoduchý chain a cez <code>batch()</code> mu pošli TRI vstupy naraz. Odpovede vypíš cyklom.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['.batch(['], ['for ']],
      'chain.batch([{...}, {...}, {...}]) vráti zoznam odpovedí v rovnakom poradí.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = ChatPromptTemplate.from_template("Jednou vetou: čo je {pojem}?") | model | StrOutputParser()
odpovede = chain.batch([{"pojem": "atóm"}, {"pojem": "gén"}, {"pojem": "bit"}])
for o in odpovede:
    print("•", o)`),
    W('Stream cez celý chain',
      'Postav chain so <code>StrOutputParser</code> a streamuj odpoveď — chunky sú rovno stringy, žiadne <code>.content</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['.stream('], ['end=""', "end=''"], ['flush=True']],
      'for chunk in chain.stream({...}): print(chunk, end="", flush=True) — chunk je string.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

chain = ChatPromptTemplate.from_template("Napíš 3 vety o {tema}.") | model | StrOutputParser()
for chunk in chain.stream({"tema": "sopkách"}):
    print(chunk, end="", flush=True)`),
    W('Lambda v rúre',
      'Za parser zapoj <code>RunnableLambda</code>, ktorá text prevedie na VEĽKÉ písmená. Spusti a sleduj kričiaci výstup.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['RunnableLambda('], ['lambda'], ['.upper()']],
      'chain = prompt | model | parser | RunnableLambda(lambda t: t.upper()).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

chain = (ChatPromptTemplate.from_template("Krátky pozdrav pre {koho}.")
         | model | StrOutputParser()
         | RunnableLambda(lambda t: t.upper()))
print(chain.invoke({"koho": "programátorov"}))`),
    W('Dve vetvy naraz',
      'Cez <code>RunnableParallel</code> spusti naraz chain na vtip a chain na fakt o rovnakej téme. Vypíš obe hodnoty zo slovníka.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
parser = StrOutputParser()
# tvoj kód...`,
      [['RunnableParallel('], ['vtip='], ['fakt='], ['["vtip"]', "['vtip']"]],
      'paralel = RunnableParallel(vtip=chain1, fakt=chain2) → vysledok["vtip"], vysledok["fakt"].',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
parser = StrOutputParser()

chain_vtip = ChatPromptTemplate.from_template("Vtip o {tema}.") | model | parser
chain_fakt = ChatPromptTemplate.from_template("Fakt o {tema}.") | model | parser

paralel = RunnableParallel(vtip=chain_vtip, fakt=chain_fakt)
v = paralel.invoke({"tema": "mačkách"})
print("VTIP:", v["vtip"])
print("FAKT:", v["fakt"])`),
    W('Trojitá paralelka',
      'Rozšír paralelu na TRI vetvy: vtip, fakt a báseň (2 verše). Všetky tri vypíš s nadpismi.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
parser = StrOutputParser()
# tvoj kód...`,
      [['RunnableParallel('], ['vtip='], ['fakt='], ['basen=', 'báseň=']],
      'Tri pomenované parametre = tri vetvy. Všetky dostanú ten istý vstup {"tema": ...}.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
parser = StrOutputParser()

paralel = RunnableParallel(
    vtip=ChatPromptTemplate.from_template("Vtip o {tema}.") | model | parser,
    fakt=ChatPromptTemplate.from_template("Fakt o {tema}.") | model | parser,
    basen=ChatPromptTemplate.from_template("Báseň (2 verše) o {tema}.") | model | parser,
)
v = paralel.invoke({"tema": "káve"})
print("VTIP:", v["vtip"])
print("FAKT:", v["fakt"])
print("BÁSEŇ:", v["basen"])`),
    W('Počítadlo slov za rúrou',
      'Za parser zapoj lambdu, ktorá vráti POČET slov odpovede (<code>len(text.split())</code>). Chain tak vráti číslo — vypíš ho.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
# tvoj kód...`,
      [['RunnableLambda('], ['.split()'], ['len(']],
      'RunnableLambda(lambda t: len(t.split())) — z textu spraví číslo. Rúra môže meniť aj typ dát!',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

chain = (ChatPromptTemplate.from_template("Napíš odsek o {tema}.")
         | model | StrOutputParser()
         | RunnableLambda(lambda t: len(t.split())))
print("Počet slov odpovede:", chain.invoke({"tema": "oceáne"}))`),
    W('Passthrough — string namiesto slovníka',
      'Cez <code>{"text": RunnablePassthrough()}</code> na začiatku rúry sprav chain, ktorý sa volá OBYČAJNÝM STRINGOM: <code>chain.invoke("Ahoj")</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['RunnablePassthrough()'], ['{"text": ', "{'text': "], ['.invoke("', ".invoke('"]],
      'Slovník-mapa {"text": RunnablePassthrough()} prevedie prichádzajúci string na {"text": string} pre šablónu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = ({"text": RunnablePassthrough()}
         | ChatPromptTemplate.from_template("Prelož do angličtiny: {text}")
         | model | StrOutputParser())
print(chain.invoke("Dobré ráno, svet!"))`),
    W('Batch nad datasetom',
      'Zoznam <code>recenzie</code> má 4 texty. Cez <code>batch()</code> ich klasifikuj (POZITÍVNA/NEGATÍVNA) a cez <code>zip()</code> vypíš dvojice recenzia → verdikt.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
recenzie = ["Skvelé!", "Hrozné, nikdy viac.", "Prekonalo očakávania.", "Sklamanie."]
# tvoj kód...`,
      [['.batch('], ['zip('], ['for ']],
      'vstupy = [{"text": r} for r in recenzie] → verdikty = chain.batch(vstupy) → for r, v in zip(recenzie, verdikty).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
recenzie = ["Skvelé!", "Hrozné, nikdy viac.", "Prekonalo očakávania.", "Sklamanie."]

chain = ChatPromptTemplate.from_template(
    "Klasifikuj recenziu jedným slovom POZITÍVNA alebo NEGATÍVNA: {text}"
) | model | StrOutputParser()

verdikty = chain.batch([{"text": r} for r in recenzie])
for r, v in zip(recenzie, verdikty):
    print(f"{r}  →  {v}")`),
    W('Paralelka + spájač',
      'Spusti paralelne slogan a hashtagy pre produkt a za paralelu zapoj lambdu, ktorá z oboch častí zlepí JEDEN text (f-string so slovníkom). Vypíš finálny text.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
parser = StrOutputParser()
# tvoj kód...`,
      [['RunnableParallel('], ['RunnableLambda('], ["['slogan']", '["slogan"]'], ['.invoke(']],
      'paralel | RunnableLambda(lambda v: f"{v[\'slogan\']}\\n{v[\'hashtagy\']}") — lambda dostane slovník vetiev.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
parser = StrOutputParser()

paralel = RunnableParallel(
    slogan=ChatPromptTemplate.from_template("Slogan pre {produkt}.") | model | parser,
    hashtagy=ChatPromptTemplate.from_template("3 hashtagy pre {produkt}.") | model | parser,
)
spajac = RunnableLambda(lambda v: f"{v['slogan']}\\n{v['hashtagy']}")

kampan = paralel | spajac
print(kampan.invoke({"produkt": "ekologická fľaša"}))`),
  ];

  /* ── l8: tools ── */
  window.EXTRA_WRITE.l8 = [
    W('Nástroj na odčítanie',
      'Vytvor nástroj <code>odcitaj(a, b)</code> dekorátorom <code>@tool</code> (s docstringom!) a otestuj ho cez <code>.invoke({"a": 10, "b": 4})</code>.',
      `from langchain_core.tools import tool
# tvoj kód...`,
      [['@tool'], ['def odcitaj'], ['"""'], ['.invoke(']],
      '@tool nad def, docstring pod def, return a - b. Test: odcitaj.invoke({"a": 10, "b": 4}).',
      `from langchain_core.tools import tool

@tool
def odcitaj(a: float, b: float) -> float:
    """Odčíta číslo b od čísla a."""
    return a - b

print(odcitaj.invoke({"a": 10, "b": 4}))`),
    W('Nástroj s dátumom',
      'Vytvor nástroj <code>dnesny_datum()</code> bez parametrov, ktorý vráti dnešný dátum cez <code>datetime.now().strftime("%d.%m.%Y")</code>. Otestuj invoke-om.',
      `from langchain_core.tools import tool
from datetime import datetime
# tvoj kód...`,
      [['@tool'], ['def dnesny_datum'], ['strftime('], ['.invoke({})']],
      'Nástroj bez parametrov sa testuje prázdnym slovníkom: dnesny_datum.invoke({}).',
      `from langchain_core.tools import tool
from datetime import datetime

@tool
def dnesny_datum() -> str:
    """Vráti dnešný dátum. Použi pri otázkach o dnešku."""
    return datetime.now().strftime("%d.%m.%Y")

print(dnesny_datum.invoke({}))`),
    W('Čo o sebe nástroj vie',
      'Vytvor ľubovoľný nástroj a vypíš jeho <code>.name</code>, <code>.description</code> aj <code>.args</code> — presne toto vidí model!',
      `from langchain_core.tools import tool

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

# tvoj kód...`,
      [['.name'], ['.description'], ['.args']],
      'print(vynasob.name), print(vynasob.description), print(vynasob.args) — tri riadky.',
      `from langchain_core.tools import tool

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

print(vynasob.name)
print(vynasob.description)
print(vynasob.args)`),
    W('Model si pýta nástroj',
      'Priviaž nástroj <code>vynasob</code> k modelu cez <code>bind_tools</code>, polož otázku „Koľko je 77 × 88?" a vypíš <code>tool_calls</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

load_dotenv()

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['bind_tools(['], ['.invoke('], ['tool_calls']],
      'model_n = model.bind_tools([vynasob]) → odpoved = model_n.invoke("...") → print(odpoved.tool_calls).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

load_dotenv()

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_n = model.bind_tools([vynasob])
odpoved = model_n.invoke("Koľko je 77 × 88?")
print(odpoved.tool_calls)`),
    W('Vykonaj požiadavku modelu',
      'Nadviaž na predošlé cvičenie: z <code>tool_calls[0]</code> vytiahni <code>"args"</code> a nástroj s nimi REÁLNE spusti. Vypíš výsledok.',
      `# model_n a vynasob máš z predošlého cvičenia
odpoved = model_n.invoke("Koľko je 77 × 88?")
# tvoj kód...`,
      [['tool_calls[0]'], ['["args"]', "['args']"], ['vynasob.invoke(']],
      'volanie = odpoved.tool_calls[0] → vysledok = vynasob.invoke(volanie["args"]).',
      `odpoved = model_n.invoke("Koľko je 77 × 88?")

volanie = odpoved.tool_calls[0]
vysledok = vynasob.invoke(volanie["args"])
print(vysledok)`),
    W('Dva nástroje — kto vyhrá?',
      'Priviaž k modelu DVA nástroje (napr. <code>vynasob</code> a <code>dnesny_datum</code>), polož otázku o dnešku a vypíš <code>tool_calls[0]["name"]</code> — over, že model vybral správny.',
      `# nástroje vynasob a dnesny_datum už máš definované
model_n = model.bind_tools([vynasob, dnesny_datum])
# tvoj kód...`,
      [['.invoke('], ['tool_calls[0]'], ['["name"]', "['name']"]],
      'Otázka „Aký je dnes dátum?" → v tool_calls[0]["name"] má byť dnesny_datum. Výber riadi docstring!',
      `model_n = model.bind_tools([vynasob, dnesny_datum])

odpoved = model_n.invoke("Aký je dnes dátum?")
print(odpoved.tool_calls[0]["name"])`),
    W('Bezpečné delenie',
      'Vytvor nástroj <code>vydel(a, b)</code>, ktorý pri <code>b == 0</code> vráti text „Delenie nulou nie je možné." — inak podiel. Otestuj OBA prípady invoke-om.',
      `from langchain_core.tools import tool
# tvoj kód...`,
      [['@tool'], ['def vydel'], ['b == 0', 'b==0'], ['a / b', 'a/b']],
      'if b == 0: return "..." — nástroj nikdy nesmie spadnúť, model potrebuje odpoveď.',
      `from langchain_core.tools import tool

@tool
def vydel(a: float, b: float) -> str:
    """Vydelí číslo a číslom b."""
    if b == 0:
        return "Delenie nulou nie je možné."
    return str(a / b)

print(vydel.invoke({"a": 10, "b": 2}))
print(vydel.invoke({"a": 5, "b": 0}))`),
    W('Textový nástroj',
      'Vytvor nástroj <code>pocet_slov(text)</code> (vráti počet slov cez <code>len(text.split())</code>), priviaž ho k modelu a nechaj model spočítať slová vo vete — celý cyklus: tool_calls → spusti → vypíš.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['@tool'], ['def pocet_slov'], ['.split()'], ['bind_tools'], ['["args"]', "['args']"]],
      'Model slová počítať nevie — nástroj áno. args z tool_calls pošli do pocet_slov.invoke().',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

@tool
def pocet_slov(text: str) -> int:
    """Spočíta presný počet slov v texte."""
    return len(text.split())

model_n = model.bind_tools([pocet_slov])
odpoved = model_n.invoke('Koľko slov má veta "LangChain je super knižnica na AI"?')
volanie = odpoved.tool_calls[0]
print(pocet_slov.invoke(volanie["args"]))`),
    W('Celý kruh s ToolMessage',
      'Uzavri slučku ručne: otázka → <code>tool_calls</code> → spusti nástroj → výsledok vráť modelu ako <code>ToolMessage(content=..., tool_call_id=...)</code> → model sformuluje finálnu ľudskú odpoveď.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage

load_dotenv()

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_n = model.bind_tools([vynasob])
# tvoj kód...`,
      [['HumanMessage('], ['tool_calls[0]'], ['ToolMessage('], ['tool_call_id='], ['model_n.invoke(', 'model.invoke(']],
      'spravy = [HumanMessage(...)] → ai = model_n.invoke(spravy) → spravy.append(ai) → spusti nástroj → spravy.append(ToolMessage(content=str(vysledok), tool_call_id=volanie["id"])) → finálne invoke.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage

load_dotenv()

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_n = model.bind_tools([vynasob])

spravy = [HumanMessage(content="Koľko je 123 × 456?")]
ai = model_n.invoke(spravy)
spravy.append(ai)

volanie = ai.tool_calls[0]
vysledok = vynasob.invoke(volanie["args"])
spravy.append(ToolMessage(content=str(vysledok), tool_call_id=volanie["id"]))

final = model_n.invoke(spravy)
print(final.content)`),
  ];

  /* ── l9: agents ── */
  window.EXTRA_WRITE.l9 = [
    W('Prompt pre agenta',
      'Zostav prompt agenta: system správa, human <code>{input}</code> a POVINNÝ <code>MessagesPlaceholder("agent_scratchpad")</code>.',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# tvoj kód...`,
      [['from_messages'], ['{input}'], ['MessagesPlaceholder("agent_scratchpad")', "MessagesPlaceholder('agent_scratchpad')"]],
      'Tri položky v zozname: ("system", ...), ("human", "{input}"), MessagesPlaceholder("agent_scratchpad").',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si užitočný asistent."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
print(prompt)`),
    W('Zlož mozog agenta',
      'Cez <code>create_tool_calling_agent(model, nastroje, prompt)</code> vytvor agenta (mozog — zatiaľ bez spúšťania).',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent

load_dotenv()

@tool
def scitaj(a: float, b: float) -> float:
    """Sčíta dve čísla."""
    return a + b

nastroje = [scitaj]
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód (prompt + agent)...`,
      [['MessagesPlaceholder("agent_scratchpad")', "MessagesPlaceholder('agent_scratchpad')"], ['create_tool_calling_agent(model, nastroje, prompt)', 'create_tool_calling_agent(']],
      'agent = create_tool_calling_agent(model, nastroje, prompt) — poradie: model, nástroje, prompt.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent

load_dotenv()

@tool
def scitaj(a: float, b: float) -> float:
    """Sčíta dve čísla."""
    return a + b

nastroje = [scitaj]
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si asistent, na výpočty používaš nástroje."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
agent = create_tool_calling_agent(model, nastroje, prompt)
print("Agent zložený!")`),
    W('Spusti cez executor',
      'Zabaľ agenta do <code>AgentExecutor</code>, zavolaj <code>invoke({"input": ...})</code> a vypíš odpoveď zo slovníka pod kľúčom <code>"output"</code>.',
      `# agent a nastroje máš z predošlého cvičenia
from langchain.agents import AgentExecutor
# tvoj kód...`,
      [['AgentExecutor(agent=agent', 'AgentExecutor('], ['tools=nastroje', 'tools='], ['{"input"', "{'input'"], ['["output"]', "['output']"]],
      'executor = AgentExecutor(agent=agent, tools=nastroje) → vysledok = executor.invoke({"input": "..."}) → vysledok["output"].',
      `from langchain.agents import AgentExecutor

executor = AgentExecutor(agent=agent, tools=nastroje)
vysledok = executor.invoke({"input": "Koľko je 1500 + 2700?"})
print(vysledok["output"])`),
    W('Sleduj uvažovanie',
      'Zapni <code>verbose=True</code> a polož executor-u dve rôzne otázky — jednu na nástroj, jednu všeobecnú. Sleduj v konzole rozdiel v uvažovaní.',
      `# agent a nastroje máš pripravené
from langchain.agents import AgentExecutor
# tvoj kód...`,
      [['verbose=True'], ['.invoke(', 'invoke({']],
      'Pri všeobecnej otázke agent nástroj nezavolá — uvidíš to priamo vo verbose výpise.',
      `from langchain.agents import AgentExecutor

executor = AgentExecutor(agent=agent, tools=nastroje, verbose=True)
print(executor.invoke({"input": "Koľko je 88 + 12?"})["output"])
print(executor.invoke({"input": "Aké je hlavné mesto Talianska?"})["output"])`),
    W('Agent s dvoma nástrojmi',
      'Postav agenta s nástrojmi <code>aktualny_datum</code> a <code>vynasob</code> a polož otázku, ktorá vyžaduje OBA naraz („Aký je dátum a koľko je 6×7?").',
      `from dotenv import load_dotenv
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()
# tvoj kód...`,
      [['@tool'], ['def aktualny_datum'], ['def vynasob'], ['create_tool_calling_agent'], ['AgentExecutor(']],
      'Dva @tool nástroje do zoznamu, zvyšok stavby ako v lekcii. Agent oba zavolá v jednom behu.',
      `from dotenv import load_dotenv
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()

@tool
def aktualny_datum() -> str:
    """Vráti dnešný dátum."""
    return datetime.now().strftime("%d.%m.%Y")

@tool
def vynasob(a: float, b: float) -> float:
    """Presne vynásobí dve čísla."""
    return a * b

nastroje = [aktualny_datum, vynasob]
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si asistent."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
agent = create_tool_calling_agent(model, nastroje, prompt)
executor = AgentExecutor(agent=agent, tools=nastroje, verbose=True)
print(executor.invoke({"input": "Aký je dátum a koľko je 6×7?"})["output"])`),
    W('Odolný executor',
      'Vytvor executor s parametrami <code>handle_parsing_errors=True</code> a <code>max_iterations=3</code> — poistky proti pádom a zacykleniu.',
      `# agent a nastroje máš pripravené
from langchain.agents import AgentExecutor
# tvoj kód...`,
      [['handle_parsing_errors=True'], ['max_iterations=3']],
      'Oba parametre idú priamo do AgentExecutor(...). max_iterations obmedzí počet obehov slučky.',
      `from langchain.agents import AgentExecutor

executor = AgentExecutor(
    agent=agent,
    tools=nastroje,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=3,
)
print(executor.invoke({"input": "Koľko je 5 + 5?"})["output"])`),
    W('Slovenský agent-účtovník',
      'Postav agenta s nástrojmi <code>scitaj</code> a <code>vynasob</code>, system správou „Si účtovník, odpovedáš po slovensky s €" a otázkou „3 kusy po 12,50 € plus doprava 4,90 € — koľko spolu?".',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()
# tvoj kód...`,
      [['def scitaj'], ['def vynasob'], ['účtovník', 'uctovnik'], ['create_tool_calling_agent'], ['["output"]', "['output']"]],
      'Agent musí najprv vynásobiť 3 × 12.50 a potom pripočítať 4.90 — dva kroky slučky.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()

@tool
def scitaj(a: float, b: float) -> float:
    """Sčíta dve čísla."""
    return a + b

@tool
def vynasob(a: float, b: float) -> float:
    """Vynásobí dve čísla."""
    return a * b

nastroje = [scitaj, vynasob]
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si účtovník, odpovedáš po slovensky a sumy uvádzaš s €."),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
agent = create_tool_calling_agent(model, nastroje, prompt)
executor = AgentExecutor(agent=agent, tools=nastroje, verbose=True)
print(executor.invoke(
    {"input": "3 kusy po 12,50 € plus doprava 4,90 € — koľko spolu?"})["output"])`),
    W('Továreň na agentov',
      'Napíš funkciu <code>vyrob_agenta(nastroje, osobnost)</code>, ktorá zostaví prompt (system = osobnost), agenta aj executor a executor VRÁTI. Vyrob si ňou agenta a otestuj.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# nástroje scitaj/vynasob máš definované
# tvoj kód...`,
      [['def vyrob_agenta'], ['("system", osobnost)', "('system', osobnost)"], ['return'], ['vyrob_agenta(']],
      'Celá stavba (prompt→agent→executor) do funkcie; return executor. Znovupoužiteľnosť ako pri vyrob_chain.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def vyrob_agenta(nastroje, osobnost):
    prompt = ChatPromptTemplate.from_messages([
        ("system", osobnost),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])
    agent = create_tool_calling_agent(model, nastroje, prompt)
    return AgentExecutor(agent=agent, tools=nastroje, verbose=True)

matik = vyrob_agenta([scitaj, vynasob], "Si prísny učiteľ matematiky.")
print(matik.invoke({"input": "Koľko je 15 + 27?"})["output"])`),
    W('Agent v chatovej slučke',
      'Spoj agenta so slučkou <code>while True</code>: každý vstup ide do <code>executor.invoke</code>, „koniec" ukončí. Máš agenta, s ktorým sa dá rozprávať!',
      `# executor máš pripravený z predošlých cvičení
# tvoj kód...`,
      [['while True'], ['input('], ['break'], ['executor.invoke('], ['["output"]', "['output']"]],
      'Presne ako chatbot z lekcie 16, len namiesto chainu voláš executor s {"input": otazka}.',
      `while True:
    otazka = input("Ty: ")
    if otazka == "koniec":
        break
    vysledok = executor.invoke({"input": otazka})
    print("Agent:", vysledok["output"])`),
  ];
})();
