/* ============================================================
   PRÍPRAVNÁ SEKCIA — Python základy (rýchlokurz pre nováčikov)
   Vkladá sa na ZAČIATOK kurzu (unshift), načítava sa po data1-4.
   ============================================================ */

window.COURSE.sections.unshift({
  id: 's0', icon: '🐍', color: '#c2a3da',
  title: 'Python základy (rýchlokurz)',
  subtitle: 'Nováčik v Pythone? Tieto dve lekcie ťa naučia presne tie kúsky jazyka, na ktorých stojí každý príklad v kurze.',
  lessons: ['lA', 'lB']
});

/* ============================================================
   LEKCIA A — Python rýchlokurz I
   ============================================================ */
window.COURSE.lessons.lA = {
  id: 'lA', num: 'A', section: 's0', icon: '📦', duration: '15 min',
  title: 'Python rýchlokurz I — premenné, texty, zoznamy a slovníky',
  intro: 'Nemusíš byť Python expert, aby si zvládol tento kurz — ale štyri veci potrebuješ mať v malíčku: premenné, texty (f-stringy), zoznamy a hlavne slovníky. Presne tie uvidíš v každom LangChain príklade. Poďme si ich vysvetliť úplne od nuly.',
  goals: [
    'Pochopiť premennú ako škatuľku s menovkou',
    'Skladať texty pomocou f-stringov: f"Ahoj {meno}"',
    'Rozlišovať zoznam [1, 2, 3] a slovník {"kľúč": "hodnota"}',
    'Vedieť, prečo LangChain všade používa slovníky — invoke({"tema": "..."})'
  ],
  blocks: [
    { t: 'h', x: 'Prečo tento rýchlokurz' },
    { t: 'p', x: 'LangChain je knižnica pre jazyk <strong>Python</strong>. Dobrá správa: na tento kurz nepotrebuješ celý Python — stačí ti <strong>zopár stavebných kociek</strong>, ktoré sa opakujú v každom príklade. V tejto lekcii sa naučíš pracovať s dátami (premenné, texty, zoznamy, slovníky), v ďalšej s logikou (funkcie, importy, cykly). Ak Python ovládaš, pokojne obe lekcie preskoč.' },

    { t: 'h', x: 'Premenné — škatuľky s menovkou' },
    { t: 'p', x: 'Premenná je <strong>škatuľka, do ktorej si odložíš hodnotu</strong> a nalepíš na ňu menovku. Keď neskôr menovku použiješ, Python siahne do škatuľky a hodnotu vytiahne. Vytvára sa znakom <code>=</code> (čítaj „ulož do"):' },
    { t: 'pycharm', title: 'zaklady.py — premenné', files: [
      { name: 'zaklady.py', active: true, code: `# Všetko za mriežkou # je komentár — Python ho ignoruje.
# Komentáre píšeme pre ľudí, nie pre počítač.

meno = "Martin"        # text (string) — vždy v úvodzovkách
vek = 29               # celé číslo (int) — bez úvodzoviek
teplota = 0.7          # desatinné číslo (float) — bodka, nie čiarka!
je_student = True      # pravdivostná hodnota (bool): True / False

print(meno)            # print() = vypíš do konzoly
print(vek + 1)         # s číslami sa dá počítať` }
    ], output: `Martin
30` },
    { t: 'explain', title: 'Rozbor kódu — čo robí ktorý riadok', rows: [
      ['meno = "Martin"', 'Vytvor škatuľku s menovkou <code>meno</code> a vlož do nej text „Martin". Texty (stringy) sú <strong>vždy v úvodzovkách</strong> — bez nich by Python hľadal premennú s názvom Martin.'],
      ['vek = 29', 'Číslo sa píše bez úvodzoviek. <code>29</code> je číslo, s ktorým sa dá počítať; <code>"29"</code> by bol len text.'],
      ['teplota = 0.7', 'Desatinné čísla používajú <strong>bodku</strong> (americký zápis). Presne takto nastavíš „kreativitu" modelu: <code>temperature=0.7</code>.'],
      ['je_student = True', '<code>True</code> a <code>False</code> (s veľkým písmenom!) sú odpovede áno/nie. Stretneš ich napr. pri <code>verbose=True</code> u agentov.'],
      ['print(meno)', '<code>print()</code> je funkcia — príkaz „vypíš na obrazovku". Do zátvoriek dáš, ČO chceš vypísať. Zátvorky znamenajú „vykonaj teraz".'],
      ['print(vek + 1)', 'Python najprv vypočíta <code>29 + 1</code> a až výsledok (30) pošle do print. Hodnota v škatuľke <code>vek</code> sa pritom nemení.']
    ]},
    { t: 'box', kind: 'tip', title: 'Názvy premenných', x: 'Píšu sa malými písmenami a slová sa oddeľujú podčiarkovníkom: <code>api_kluc</code>, <code>chat_history</code>, <code>pocet_tokenov</code>. Python rozlišuje veľké a malé písmená — <code>Meno</code> a <code>meno</code> sú dve rôzne škatuľky!' },

    { t: 'h', x: 'f-stringy — skladanie textov s hodnotami' },
    { t: 'p', x: 'Najčastejšia vec, akú budeš s textami robiť: <strong>vložiť do nich hodnotu premennej</strong>. Na to slúži <strong>f-string</strong> — text, pred ktorým stojí písmeno <code>f</code> a v ktorom <code>{zložené zátvorky}</code> fungujú ako okienka na hodnoty:' },
    { t: 'pycharm', title: 'zaklady.py — f-stringy', files: [
      { name: 'zaklady.py', active: true, code: `meno = "Martin"
kurz = "LangChain"
progres = 42

# f-string: f pred úvodzovkou, {premenné} v okienkach
sprava = f"Ahoj {meno}, v kurze {kurz} máš hotových {progres} %."
print(sprava)

# okienko zvládne aj výpočet
print(f"Zostáva ti {100 - progres} % kurzu.")` }
    ], output: `Ahoj Martin, v kurze LangChain máš hotových 42 %.
Zostáva ti 58 % kurzu.`,
      note: 'Pozor na rozdiel: f-string vkladá hodnoty OKAMŽITE. Šablóny LangChainu (lekcia 3) vyzerajú podobne — {tema} — ale hodnoty sa dosádzajú AŽ pri volaní invoke(). Preto sa v šablónach f nepíše!' },

    { t: 'h', x: 'Zoznamy — očíslované poličky' },
    { t: 'p', x: '<strong>Zoznam (list)</strong> je polička, kde má každá vec svoje <strong>poradové číslo (index)</strong>. Vytvára sa hranatými zátvorkami <code>[ ]</code>. Pozor na prekvapenie: <strong>Python počíta od nuly</strong> — prvá vec má index 0! V kurze budú zoznamami napríklad správy konverzácie či nájdené dokumenty:' },
    { t: 'pycharm', title: 'zaklady.py — zoznamy', files: [
      { name: 'zaklady.py', active: true, code: `nakup = ["mlieko", "chlieb", "syr"]

print(nakup[0])        # prvá položka má index 0!
print(len(nakup))      # len() = počet položiek (length)

nakup.append("káva")  # .append() pridá NA KONIEC
print(nakup)

for polozka in nakup:  # cyklus: prejdi položky jednu po druhej
    print("Kúpiť:", polozka)` }
    ], output: `mlieko
3
['mlieko', 'chlieb', 'syr', 'káva']
Kúpiť: mlieko
Kúpiť: chlieb
Kúpiť: syr
Kúpiť: káva` },
    { t: 'explain', title: 'Rozbor kódu — zoznamy v akcii', rows: [
      ['nakup = ["mlieko", "chlieb", "syr"]', 'Zoznam troch textov. Hranaté zátvorky = zoznam, položky oddeľuješ čiarkami.'],
      ['nakup[0]', 'Hranaté zátvorky ZA menom premennej = „daj mi položku s týmto indexom". Index 0 je prvá, 1 druhá, 2 tretia…'],
      ['len(nakup)', 'Vstavaná funkcia <code>len()</code> vráti počet položiek. Uvidíš ju napr. pri počítaní chunkov dokumentov.'],
      ['nakup.append("káva")', 'Bodka za premennou = „urob so zoznamom operáciu". <code>.append()</code> pridá položku na koniec — presne takto chatbot pridáva správy do histórie.'],
      ['for polozka in nakup:', 'Cyklus for = „pre každú položku v zozname urob…". Premenná <code>polozka</code> postupne nadobúda hodnoty mlieko, chlieb… Riadky patriace cyklu sú <strong>odsadené</strong> (4 medzery).']
    ]},
    { t: 'box', kind: 'warn', title: 'Odsadenie nie je okrasa!', x: 'V Pythone <strong>odsadenie (medzery na začiatku riadku) určuje, čo kam patrí</strong>. Riadky odsadené pod <code>for</code> alebo <code>if</code> sa vykonajú v rámci nich. Zlé odsadenie = chyba <code>IndentationError</code>. PyCharm odsadzuje za teba klávesom Tab.' },

    { t: 'h', x: 'Slovníky — poličky s menovkami (NAJDÔLEŽITEJŠIE!)' },
    { t: 'p', x: '<strong>Slovník (dictionary)</strong> je ako zoznam, ale položky nemajú čísla — majú <strong>menovky (kľúče)</strong>. Vytvára sa zloženými zátvorkami <code>{ }</code> a zápis je vždy <code>"kľúč": hodnota</code>. Toto je <strong>štruktúra číslo 1 celého kurzu</strong> — cez slovníky sa LangChainu odovzdávajú vstupy aj čítajú výstupy:' },
    { t: 'pycharm', title: 'zaklady.py — slovníky', files: [
      { name: 'zaklady.py', active: true, code: `student = {
    "meno": "Martin",
    "kurz": "LangChain",
    "progres": 42,
}

print(student["meno"])       # hodnotu vytiahneš KĽÚČOM
print(student["progres"])

student["progres"] = 55      # zmena hodnoty
student["mesto"] = "Žilina" # nový kľúč sa len priradí
print(student)` }
    ], output: `Martin
42
{'meno': 'Martin', 'kurz': 'LangChain', 'progres': 55, 'mesto': 'Žilina'}` },
    { t: 'explain', title: 'Rozbor kódu — slovník kúsok po kúsku', rows: [
      ['student = { ... }', 'Zložené zátvorky = slovník. Môže byť pokojne na viac riadkov — Python číta až po zatváraciu zátvorku.'],
      ['"meno": "Martin",', 'Jedna položka: kľúč <code>"meno"</code>, dvojbodka, hodnota <code>"Martin"</code>. Položky oddeľuje čiarka (aj za poslednou môže byť — je to zvyk).'],
      ['student["meno"]', 'Namiesto čísla ako pri zozname použiješ <strong>kľúč</strong>. Čítaj: „zo slovníka student daj hodnotu pod kľúčom meno".'],
      ['student["progres"] = 55', 'Priradením do existujúceho kľúča hodnotu prepíšeš…'],
      ['student["mesto"] = "Žilina"', '…a priradením do nového kľúča položku pridáš. Žiadny append netreba.']
    ]},
    { t: 'box', kind: 'key', title: 'Prečo je slovník srdcom LangChainu', x: 'Keď v kurze uvidíš <code>chain.invoke({"tema": "more"})</code> — to je presne tento slovník! Kľúč <code>"tema"</code> sa napojí na okienko <code>{tema}</code> v šablóne promptu. A keď RAG chain vráti výsledok, je to tiež slovník: odpoveď vytiahneš cez <code>vysledok["answer"]</code>. Slovník dnu, slovník von.' },
    { t: 'compare', a: { title: '📋 Zoznam [ ]', items: [
        'Položky idú <strong>po poradí</strong>',
        'Prístup číslom: <code>historia[0]</code>',
        'Pridávanie: <code>.append(...)</code>',
        'V kurze: história správ, chunky dokumentov'
      ]}, b: { title: '🏷️ Slovník { }', items: [
        'Položky majú <strong>menovky (kľúče)</strong>',
        'Prístup kľúčom: <code>vysledok["answer"]</code>',
        'Pridávanie: <code>slovnik["novy"] = hodnota</code>',
        'V kurze: vstupy do invoke(), výstupy chainov'
      ]} }
  ],
  quiz: [
    { q: 'Čo vypíše print(f"Mám {vek} rokov"), ak vek = 25?',
      opts: ['Mám {vek} rokov', 'Mám 25 rokov', 'f"Mám 25 rokov"', 'Chybu — texty sa takto spájať nedajú'],
      correct: 1, explain: 'f-string nahradí okienko {vek} hodnotou premennej. Bez písmena f na začiatku by sa vypísalo doslova „Mám {vek} rokov".' },
    { q: 'Ako zo slovníka mesto = {"nazov": "Bratislava"} vytiahneš hodnotu „Bratislava"?',
      opts: ['mesto[0]', 'mesto["nazov"]', 'mesto.nazov()', 'nazov[mesto]'],
      correct: 1, explain: 'Do slovníka sa siaha kľúčom v hranatých zátvorkách. mesto[0] by fungovalo pri zozname — slovník čísla nemá.' },
    { q: 'Aký index má PRVÁ položka zoznamu?',
      opts: ['1', '0', '-1', 'Podľa toho, čo v zozname je'],
      correct: 1, explain: 'Python (ako väčšina jazykov) počíta od nuly: zoznam[0] je prvá položka, zoznam[1] druhá…' },
    { q: 'Čo urobí historia.append(sprava)?',
      opts: ['Zmaže zoznam historia', 'Pridá spravu na koniec zoznamu historia', 'Vypíše zoznam', 'Zoradí zoznam abecedne'],
      correct: 1, explain: '.append() pridáva na koniec — presne takto si chatbot ukladá nové správy do pamäte (lekcia 17).' },
    { q: 'Prečo sa do chain.invoke() posiela slovník, napr. {"tema": "vesmír"}?',
      opts: ['Je to len zvyk, dal by sa poslať hocijaký text', 'Kľúč slovníka sa napojí na rovnomenné okienko {tema} v šablóne promptu', 'Slovník je rýchlejší než text', 'Aby sa dáta zašifrovali'],
      correct: 1, explain: 'Šablóna má okienka {tema}, {otazka}… a slovník hovorí, čo do ktorého okienka patrí. Preto musia názvy kľúčov presne sedieť.' }
  ],
  exercises: [
    { t: 'blanks', title: 'f-string, slovník a zoznam v jednom', xp: 20,
      intro: 'Doplň chýbajúce kúsky — presne tieto vzory budeš používať celý kurz.',
      code: `meno = "Martin"
kurz = "LangChain"
print(⟦0⟧"Ahoj {meno}, vitaj v kurze {kurz}!")

# slovník pre chain.invoke() — kľúč musí sedieť so šablónou {tema}
vstup = {"⟦1⟧": "vesmír"}

zoznam = ["prvý", "druhý"]
zoznam.⟦2⟧("tretí")     # pridaj na koniec
print(zoznam[⟦3⟧])       # vypíš PRVÚ položku`,
      blanks: [['f'], ['tema'], ['append'], ['0']],
      hint: 'Text s okienkami začína písmenom f. Kľúč v slovníku je text v úvodzovkách. Na koniec zoznamu pridáva .append() a prvá položka má index 0.' },
    { t: 'order', title: 'Ako Python číta skript', xp: 20,
      intro: 'Zoraď kroky tak, ako ich Python vykoná pri spustení jednoduchého skriptu.',
      items: [
        'Python otvorí súbor a číta ho zhora nadol, riadok po riadku',
        'Vytvorí premennú meno a uloží do nej text',
        'Poskladá f-string — nahradí {meno} hodnotou zo škatuľky',
        'Funkcia print() pošle hotový text do konzoly',
        'Skript končí — Process finished with exit code 0' ] },
    { t: 'write', title: 'Vizitka zo slovníka', xp: 30,
      intro: 'Prvý vlastný Python kód — slovník + f-string.',
      task: 'Vytvor slovník <code>kniha</code> s kľúčmi <code>"nazov"</code> a <code>"rok"</code> (hodnoty si vymysli). Potom cez <code>print()</code> a f-string vypíš vetu v tvare: <em>Kniha NÁZOV vyšla v roku ROK.</em> — hodnoty vytiahni zo slovníka kľúčmi.',
      starter: `# tvoj kód...`,
      must: [['kniha = {', 'kniha={'], ['"nazov"', "'nazov'"], ['"rok"', "'rok'"], ['f"', "f'"], ['print(']],
      hint: 'kniha = {"nazov": "...", "rok": 2024} a potom print(f"Kniha {kniha[\'nazov\']} vyšla v roku {kniha[\'rok\']}.") — vo vnútri f-stringu použi opačný typ úvodzoviek než okolo neho.',
      solution: `kniha = {"nazov": "Duna", "rok": 1965}

print(f"Kniha {kniha['nazov']} vyšla v roku {kniha['rok']}.")` }
  ]
};

/* ============================================================
   LEKCIA B — Python rýchlokurz II
   ============================================================ */
window.COURSE.lessons.lB = {
  id: 'lB', num: 'B', section: 's0', icon: '⚙️', duration: '15 min',
  title: 'Python rýchlokurz II — funkcie, importy, cykly a objekty',
  intro: 'Druhá polovica výbavy: funkcie (recepty s menom), importy (požičiavanie hotového náradia), cyklus while (motor chatbota) a objekty s bodkou — aby si presne rozumel, čo znamená model.invoke() alebo odpoved.content.',
  goals: [
    'Napísať vlastnú funkciu s def, parametrami a return',
    'Chápať importy: import os vs. from dotenv import load_dotenv',
    'Ovládať slučku while True + break — základ každého chatbota',
    'Rozumieť bodke: objekt.metóda() a objekt.atribút'
  ],
  blocks: [
    { t: 'h', x: 'Funkcie — recepty s menom' },
    { t: 'p', x: 'Funkcia je <strong>pomenovaný recept</strong>: raz ho zapíšeš, potom ho voláš, koľkokrát chceš. Definuje sa slovom <code>def</code>, do zátvoriek dáš <strong>parametre</strong> (suroviny) a slovom <code>return</code> vrátiš <strong>výsledok</strong>:' },
    { t: 'pycharm', title: 'funkcie.py — prvá funkcia', files: [
      { name: 'funkcie.py', active: true, code: `def pozdrav(meno: str) -> str:
    """Vytvorí pozdrav pre zadané meno."""
    text = f"Ahoj, {meno}! Vitaj v kurze."
    return text

# definícia sa nespustí sama — treba funkciu ZAVOLAŤ:
sprava = pozdrav("Martin")
print(sprava)
print(pozdrav("Jana"))    # znovupoužitie — o tom to je!` }
    ], output: `Ahoj, Martin! Vitaj v kurze.
Ahoj, Jana! Vitaj v kurze.` },
    { t: 'explain', title: 'Rozbor kódu — anatómia funkcie', rows: [
      ['def pozdrav(meno: str) -> str:', '<code>def</code> = „definujem funkciu". <code>pozdrav</code> je jej meno, <code>meno</code> je parameter (škatuľka, ktorá sa naplní pri volaní). <code>: str</code> a <code>-> str</code> sú <strong>typové anotácie</strong> — nápoveda „dnu ide text, von ide text". Python ich nevynucuje, ale LangChain ich pri nástrojoch (lekcia 8) aktívne číta!'],
      ['"""Vytvorí pozdrav..."""', '<strong>Docstring</strong> — popis funkcie v trojitých úvodzovkách hneď pod def. Pre bežný Python je to dokumentácia; pre LangChain agentov je to NÁVOD, podľa ktorého sa model rozhoduje, kedy funkciu použiť.'],
      ['    text = f"Ahoj, {meno}!..."', 'Telo funkcie — všetko odsadené o 4 medzery patrí do receptu. Použije sa hodnota parametra meno.'],
      ['    return text', '<code>return</code> = „toto je výsledok, končím". Výsledok sa vráti tomu, kto funkciu zavolal. Funkcia bez return vráti prázdno (<code>None</code>).'],
      ['sprava = pozdrav("Martin")', 'VOLANIE: meno funkcie + zátvorky s hodnotou pre parameter. Do škatuľky <code>meno</code> sa vloží „Martin", telo sa vykoná a return-hodnota pristane v premennej <code>sprava</code>.']
    ]},
    { t: 'box', kind: 'key', title: 'Definícia ≠ volanie', x: 'Keď Python narazí na <code>def</code>, recept si <strong>len zapamätá</strong> — nič nevarí. Variť začne až pri volaní <code>pozdrav("Martin")</code>. Preto poradie v skripte býva: hore definície, dole volania.' },

    { t: 'h', x: 'Importy — požičiavanie hotového náradia' },
    { t: 'p', x: 'Nikto nepíše všetko sám. <strong>Import</strong> ti požičia hotový kód — z Pythonu samotného alebo z nainštalovaných knižníc (tie sťahuje <code>pip install</code> — pozor, inštalácia a import sú dva rôzne kroky!). Existujú dva zápisy a budeš stretávať oba:' },
    { t: 'pycharm', title: 'importy.py — dva spôsoby importu', files: [
      { name: 'importy.py', active: true, code: `# 1) import celej knižnice — k veciam pristupuješ cez bodku
import os
kluc = os.getenv("OPENAI_API_KEY")

# 2) from-import — vytiahneš si len konkrétnu vec
from datetime import datetime
teraz = datetime.now()

print("Dnes je:", teraz.strftime("%d.%m.%Y"))
print("Kľúč nastavený:", kluc is not None)` }
    ], output: `Dnes je: 13.06.2026
Kľúč nastavený: False`,
      note: 'V kurze uvidíš takmer výhradne druhý zápis: from langchain_openai import ChatOpenAI — z veľkej knižnice si vytiahneš presne tú súčiastku, ktorú potrebuješ.' },
    { t: 'explain', title: 'Rozbor kódu — importy', rows: [
      ['import os', 'Požičaj CELÚ knižnicu os (operačný systém). Jej funkcie potom voláš s predponou: <code>os.getenv(...)</code> — „z knižnice os funkcia getenv".'],
      ['from datetime import datetime', 'Z knižnice datetime vytiahni LEN vec menom datetime. Odteraz ju používaš priamo, bez predpony.'],
      ['datetime.now()', 'Zátvorky = zavolaj. <code>now()</code> vráti objekt s aktuálnym dátumom a časom.'],
      ['kluc is not None', '<code>None</code> = „nič/prázdno". Ak premenná prostredia neexistuje, getenv vráti None. Výraz sa vyhodnotí na True/False.']
    ]},

    { t: 'h', x: 'while True + break — motor chatbota' },
    { t: 'p', x: 'Chatbot musí <strong>donekonečna čakať na otázky</strong> — a presne to robí slučka <code>while True</code>: opakuje svoje telo stále dokola. Von z nej vyskočíš príkazom <code>break</code>. Pridaj <code>input()</code> (prečítaj, čo používateľ napísal) a <code>if</code> (rozhodni sa) a máš kostru každého bota z tohto kurzu:' },
    { t: 'pycharm', title: 'slucka.py — kostra chatbota', files: [
      { name: 'slucka.py', active: true, code: `print("Papagáj-bot: napíš niečo ('koniec' = stop)")

while True:                        # opakuj donekonečna
    veta = input("Ty: ")           # počkaj na text od používateľa

    if veta.lower() == "koniec":  # .lower() = na malé písmená
        print("Bot: Čau!")
        break                      # vyskoč zo slučky

    print(f"Bot: {veta}! {veta}!")  # papagáj opakuje` }
    ], output: `Papagáj-bot: napíš niečo ('koniec' = stop)
Ty: Ahoj
Bot: Ahoj! Ahoj!
Ty: LangChain je super
Bot: LangChain je super! LangChain je super!
Ty: koniec
Bot: Čau!` },
    { t: 'explain', title: 'Rozbor kódu — slučka krok po kroku', rows: [
      ['while True:', '„Kým platí pravda, opakuj" — a True platí vždy, takže sa opakuje donekonečna. Všetko odsadené pod týmto riadkom je telo slučky.'],
      ['veta = input("Ty: ")', '<code>input()</code> vypíše výzvu, ZASTAVÍ program a čaká, kým používateľ napíše text a stlačí Enter. Napísaný text uloží do premennej.'],
      ['if veta.lower() == "koniec":', '<code>if</code> = rozhodnutie. <code>.lower()</code> prevedie text na malé písmená (zaberie aj „KONIEC"). Dvojité <code>==</code> POROVNÁVA (jedno = priraďuje!).'],
      ['break', 'Okamžite ukonči najbližšiu slučku a pokračuj za ňou. Bez break by while True naozaj nikdy neskončil.'],
      ['print(f"Bot: {veta}! ...")', 'Tento riadok sa vykoná len, keď if neplatil — a slučka sa vráti hore na input(). Presne sem v lekcii 16 dosadíme volanie AI modelu.']
    ]},

    { t: 'h', x: 'Objekty a bodka — čo znamená model.invoke()' },
    { t: 'p', x: 'V kurze stále uvidíš zápis <code>niečo.niečo</code>. Kľúč k pochopeniu: veľa vecí v Pythone sú <strong>objekty</strong> — „inteligentné spotrebiče", ktoré majú <strong>tlačidlá (metódy — volajú sa so zátvorkami)</strong> a <strong>displeje (atribúty — bez zátvoriek)</strong>. Bodka znamená „siahni do objektu":' },
    { t: 'pycharm', title: 'objekty.py — bodková notácia', files: [
      { name: 'objekty.py', active: true, code: `text = "LangChain Akadémia"

# METÓDY — tlačidlá objektu, volajú sa SO zátvorkami:
print(text.upper())        # prepni na veľké písmená
print(text.replace("Akadémia", "kurz"))

# takto to bude vyzerať s AI modelom (lekcia 2):
#   model = ChatOpenAI(model="gpt-4o-mini")   <- vyrob objekt
#   odpoved = model.invoke("Ahoj!")           <- stlač tlačidlo
#   print(odpoved.content)                    <- prečítaj displej

# ATRIBÚTY — displeje, ČÍTAJÚ sa BEZ zátvoriek:
import math
print(math.pi)             # hodnota, nie akcia => bez zátvoriek` }
    ], output: `LANGCHAIN AKADÉMIA
LangChain kurz
3.141592653589793` },
    { t: 'box', kind: 'key', title: 'Zlaté pravidlo bodky', x: '<code>objekt.metóda()</code> = <strong>urob niečo</strong> (akcia, so zátvorkami) · <code>objekt.atribút</code> = <strong>prečítaj hodnotu</strong> (bez zátvoriek). Preto <code>model.invoke("...")</code> má zátvorky (akcia: spýtaj sa modelu) a <code>odpoved.content</code> nemá (len čítaš text odpovede).' },
    { t: 'p', x: 'A odkiaľ sa objekty berú? Z <strong>tried</strong> — „výrobných foriem". Zápis <code>ChatOpenAI(model="gpt-4o-mini")</code> znamená: „výrobná forma ChatOpenAI, vyrob mi jeden kus s týmto nastavením". Triedy spoznáš podľa VeľkýchPísmenNaZačiatku. Posledný symbol, ktorý v kurze stretneš, je <strong>dekorátor</strong> <code>@tool</code> — „nálepka" nad funkciou, ktorá jej pridá schopnosti (z obyčajnej funkcie spraví nástroj pre AI). Detailne v lekcii 8.' }
  ],
  quiz: [
    { q: 'Čo urobí Python, keď pri čítaní súboru narazí na def moja_funkcia():?',
      opts: ['Funkciu hneď spustí', 'Funkciu si len zapamätá — spustí ju až volanie moja_funkcia()', 'Vypíše jej obsah', 'Skončí s chybou'],
      correct: 1, explain: 'def je len definícia receptu. Variť sa začne až pri volaní so zátvorkami.' },
    { q: 'Aký je rozdiel medzi „import os" a „from dotenv import load_dotenv"?',
      opts: ['Žiadny, sú zameniteľné', 'Prvý požičia celú knižnicu (voláš os.getenv), druhý vytiahne jednu konkrétnu vec (voláš load_dotenv priamo)', 'from-import je len pre vlastné súbory', 'import je novší zápis'],
      correct: 1, explain: 'import os = celá knižnica s predponou; from X import Y = konkrétna súčiastka bez predpony. LangChain kód používa takmer vždy druhý zápis.' },
    { q: 'Ako sa program dostane von zo slučky while True?',
      opts: ['Sám po 100 opakovaniach', 'Príkazom break (typicky vo vnútri if)', 'Príkazom stop', 'Nedá sa — treba vypnúť počítač'],
      correct: 1, explain: 'while True beží donekonečna; break ju okamžite ukončí. V chatbotovi: if otazka == "koniec": break.' },
    { q: 'Prečo má model.invoke("Ahoj") zátvorky, ale odpoved.content nie?',
      opts: ['Je to náhoda', 'invoke je metóda (akcia — urob), content je atribút (hodnota — prečítaj)', 'content je zastaraný zápis', 'Zátvorky sú nepovinné vždy'],
      correct: 1, explain: 'Zátvorky = vykonaj akciu. Bez zátvoriek = len čítaš uloženú hodnotu. Toto pravidlo ti rozlúskne 90 % LangChain kódu.' },
    { q: 'Načo je docstring ("""popis""") vo funkcii, ktorú chceme dať AI agentovi ako nástroj?',
      opts: ['Len okrasa pre programátora', 'Model sa PODĽA NEHO rozhoduje, kedy a načo nástroj použiť', 'Zrýchľuje beh funkcie', 'Je povinný v každom Pythone'],
      correct: 1, explain: 'Pri nástrojoch (lekcia 8) je docstring návod pre model — zlý popis = model nástroj nepoužije alebo ho použije zle.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Poskladaj funkciu', xp: 20,
      intro: 'Doplň kľúčové slová funkcie — def, return a volanie.',
      code: `⟦0⟧ pozdrav(meno: str) -> str:
    """Vytvorí pozdrav pre zadané meno."""
    ⟦1⟧ f"Ahoj, {meno}!"

sprava = ⟦2⟧("Martin")   # zavolaj funkciu
print(sprava)`,
      blanks: [['def'], ['return'], ['pozdrav']],
      hint: 'Funkcia sa definuje slovom def, výsledok vracia return a volá sa vlastným menom so zátvorkami.' },
    { t: 'order', title: 'Život jedného volania funkcie', xp: 20,
      intro: 'Zoraď, čo presne sa deje od definície po výpis.',
      items: [
        'Python prečíta def pozdrav(...) a recept si zapamätá',
        'Narazí na volanie pozdrav("Martin")',
        'Do parametra meno sa vloží hodnota "Martin"',
        'Telo funkcie poskladá f-string s menom',
        'return vráti hotový text volajúcemu',
        'print() vypíše vrátený text do konzoly' ] },
    { t: 'write', title: 'Kalkulačka ako funkcia', xp: 30,
      intro: 'Presne takúto funkciu v lekcii 8 premeníš na nástroj pre AI!',
      task: 'Napíš funkciu <code>scitaj(a, b)</code>, ktorá <code>return</code>-om vráti súčet <code>a + b</code>. Pridaj docstring v trojitých úvodzovkách. Funkciu zavolaj s číslami 5 a 3 a výsledok vypíš cez <code>print()</code>.',
      starter: `# tvoj kód...`,
      must: [['def scitaj'], ['"""'], ['return'], ['scitaj(5, 3)', 'scitaj(5,3)'], ['print(']],
      hint: 'def scitaj(a, b): → docstring → return a + b. Potom print(scitaj(5, 3)).',
      solution: `def scitaj(a, b):
    """Sčíta dve čísla a vráti výsledok."""
    return a + b

print(scitaj(5, 3))` }
  ]
};
