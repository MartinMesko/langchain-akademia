/* ============================================================
   SEKCIA s8 — Docker do hĺbky
   Lekcie 45–47. Učí Docker ako nástroj (nie len ako krok
   pri nasadení LangChain appky) a napája sa na Playground,
   kde si každý príkaz hneď vyskúšaš.
   ============================================================ */

window.COURSE.sections.push({
  id: 's8', icon: '🐳', color: '#6ab0f3',
  title: 'Docker do hĺbky',
  subtitle: 'Obrazy, kontajnery a ich životný cyklus, Dockerfile a stavba malých obrazov, dáta, siete a Compose. Ku každej lekcii si všetko vyskúšaš v Docker Playgrounde.',
  lessons: ['l45', 'l46', 'l47']
});

/* ============================================================
   LEKCIA 45 — Obrazy, kontajnery, životný cyklus
   ============================================================ */
window.COURSE.lessons.l45 = {
  id: 'l45', num: 45, section: 's8', icon: '📦', duration: '15 min',
  title: 'Obrazy a kontajnery — ako Docker vlastne funguje',
  intro: 'Docker sa väčšina ľudí naučí ako zoznam príkazov, ktoré si kopírujú zo Stack Overflow. Stačí však pochopiť jeden rozdiel — <b>obraz verzus kontajner</b> — a zvyšok začne dávať zmysel sám. V tejto lekcii ho pochopíš a hneď si to vyskúšaš v Playgrounde.',
  goals: [
    'Rozlíšiť obraz (image) a kontajner — a prečo je to ako trieda a inštancia',
    'Ovládať životný cyklus: run → ps → logs → exec → stop → rm',
    'Rozumieť mapovaniu portov a premenným prostredia',
    'Vedieť diagnostikovať kontajner, ktorý hneď spadol'
  ],
  blocks: [
    { t: 'h', x: 'Prečo vôbec kontajnery' },
    { t: 'p', x: 'Klasický problém: „u mňa to funguje". Ty máš Python 3.12 a knižnicu vo verzii 0.3.25, kolega 3.10 a 0.2.9, server má niečo tretie. Kontajner tento problém <strong>vyrieši definitívne</strong>: zabalí aplikáciu <em>aj s celým prostredím</em> (Python, knižnice, systémové balíky, súbory) do jedného balíka, ktorý beží rovnako všade.' },
    { t: 'compare', a: { title: '🖥️ Virtuálny stroj', items: [
        'Obsahuje celý operačný systém',
        'Štart trvá minúty, veľkosť v GB',
        'Silná izolácia (vlastné jadro)',
        'Na jednom serveri ich beží pár'
      ]}, b: { title: '📦 Kontajner', items: [
        'Zdieľa jadro hostiteľa, balí len appku',
        'Štart za sekundu, veľkosť v MB',
        'Izolácia procesov (ľahšia, ale postačujúca)',
        'Na jednom serveri ich bežia desiatky'
      ]} },
    { t: 'h', x: 'Obraz vs kontajner — jediný rozdiel, ktorý musíš pochopiť' },
    { t: 'p', x: 'Ak poznáš Python triedy z lekcie B, máš to zadarmo: <strong>obraz je trieda, kontajner je inštancia</strong>. Obraz je nemenná šablóna na disku (recept + poskladané ingrediencie). Kontajner je bežiaci proces vytvorený z tejto šablóny. Z jedného obrazu vieš spustiť desať kontajnerov — tak ako z jednej triedy desať objektov.' },
    { t: 'table', head: ['', 'Obraz (image)', 'Kontajner (container)'], rows: [
      ['Čo to je', 'Nemenná šablóna na disku', 'Bežiaci (alebo zastavený) proces z tejto šablóny'],
      ['Analógia', 'Trieda / recept / inštalačka', 'Objekt / uvarené jedlo / nainštalovaný program'],
      ['Koľko', 'Jeden obraz', '→ ľubovoľne veľa kontajnerov'],
      ['Vypíšeš', '<code>docker images</code>', '<code>docker ps</code> (bežiace), <code>docker ps -a</code> (všetky)'],
      ['Zmažeš', '<code>docker rmi</code>', '<code>docker rm</code>'],
      ['Zmeny prežijú?', 'Áno, obraz je trvalý', '<strong>Nie</strong> — po zmazaní kontajnera sú preč (preto volumes, lekcia 47)'],
    ] },
    { t: 'box', kind: 'key', title: 'Vrstvy — prečo je Docker rýchly', x: 'Obraz nie je jeden blok, ale <strong>stoh vrstiev</strong> (layers). Každá inštrukcia v Dockerfile pridá jednu vrstvu. Keď dva obrazy stoja na tom istom <code>python:3.12-slim</code>, tú spodnú vrstvu majú <strong>spoločnú a uloženú len raz</strong>. Preto sa druhý build a druhý pull tvária, že takmer nič nesťahujú.' },
    { t: 'h', x: 'Životný cyklus v šiestich príkazoch' },
    { t: 'flow', steps: ['⬇️ pull<br><small>stiahni obraz</small>', '▶️ run<br><small>vytvor a spusti</small>', '👀 ps / logs<br><small>čo beží, čo píše</small>', '🔧 exec<br><small>zasiahni dnu</small>', '⏹ stop<br><small>zastav</small>', '🗑 rm<br><small>zmaž</small>'] },
    { t: 'pycharm', title: 'Terminal — celý cyklus na nginx', terminal: true, files: [
      { name: 'terminal', active: true, code: `# 1) stiahni obraz z Docker Hubu
docker pull nginx

# 2) spusti kontajner na pozadí, port 8080 na tvojom PC -> 80 v kontajneri
docker run -d -p 8080:80 --name web nginx

# 3) beží?
docker ps

# 4) čo vypísal pri štarte?
docker logs web

# 5) pozri sa dnu (spusti príkaz vnútri kontajnera)
docker exec web hostname

# 6) uprac po sebe
docker stop web
docker rm web` }
    ], output: `CONTAINER ID   IMAGE          COMMAND                  STATUS         PORTS                  NAMES
f769470fd614   nginx:latest   "/docker-entrypoint.…"   Up 3 seconds   0.0.0.0:8080->80/tcp   web`,
      note: 'Presne tieto príkazy si teraz môžeš naklikať v <b>🐳 Docker Playgrounde</b> — misie 1 až 5 ťa nimi prevedú a samy skontrolujú výsledok.' },
    { t: 'explain', title: 'Rozbor príkazov — čo ktorý prepínač robí', rows: [
      ['<code>-d</code> (detach)', 'Spusti na pozadí a vráť mi terminál. Bez neho kontajner obsadí okno a po Ctrl+C skončí — najčastejší zmätok začiatočníkov.'],
      ['<code>-p 8080:80</code>', 'Mapovanie portu <strong>HOSŤ:KONTAJNER</strong>. Vnútri kontajnera nginx počúva na 80, ty ho navštíviš na localhost:8080. Poradie si pamätaj: „zvonku:zvnútra".'],
      ['<code>--name web</code>', 'Vlastné meno. Bez neho ti Docker vygeneruje niečo ako <em>vibrant_tesla</em> a budeš ho hľadať v <code>docker ps</code>.'],
      ['<code>docker logs</code>', 'Vypíše, čo kontajner poslal na výstup. <strong>Prvá vec, ktorú spustíš, keď niečo nefunguje.</strong>'],
      ['<code>docker exec web hostname</code>', 'Spustí príkaz <em>vnútri</em> bežiaceho kontajnera. Užitočné na obhliadku: <code>ls</code>, <code>env</code>, <code>cat súbor</code>.'],
      ['<code>docker rm</code>', 'Zmaže kontajner (musí byť zastavený, alebo použi <code>-f</code>). Obraz ostáva — ten maže <code>docker rmi</code>.'],
    ]},
    { t: 'h', x: 'Premenné prostredia: konfigurácia zvonku' },
    { t: 'p', x: 'Kontajner nemá tvoj <code>.env</code> súbor — konfiguráciu mu musíš odovzdať. Slúži na to prepínač <code>-e</code>. Toto je zároveň najčastejšia príčina, prečo kontajner „hneď spadne":' },
    { t: 'pycharm', title: 'Terminal — kontajner, ktorý spadol', terminal: true, files: [
      { name: 'terminal', active: true, code: `# postgres bez hesla sa odmietne spustiť
docker run -d --name db postgres:16
docker ps                 # ...nič nebeží?!
docker ps -a              # aha, Exited (1)
docker logs db            # a tu je dôvod

# správne: heslo cez premennú prostredia
docker rm db
docker run -d --name db -e POSTGRES_PASSWORD=tajne postgres:16` }
    ], output: `Error: Database is uninitialized and superuser password is not specified.
       You must specify POSTGRES_PASSWORD to a non-empty value for the
       superuser. For example, -e POSTGRES_PASSWORD=password on "docker run".`,
      note: 'Zapamätaj si tento postup: <b>docker ps -a</b> (naozaj spadol?) → <b>docker logs</b> (prečo?). Vyrieši ti to deväť z desiatich problémov s kontajnermi.' },
    { t: 'box', kind: 'warn', title: 'Kontajner nie je virtuálka', x: 'Kontajner beží dovtedy, dokým beží jeho <strong>hlavný proces</strong>. Keď ten skončí, kontajner skončí — aj keby „vnútri" bolo všetko v poriadku. Preto <code>docker run python:3.12-slim</code> okamžite skončí: spustil sa Python, nemal čo robiť a vypol sa. Nie je to chyba, je to celý princíp.' },
    { t: 'box', kind: 'tip', title: 'Skratky, ktoré ušetria čas', x: '<code>docker rm -f web</code> = zastav a zmaž naraz. <code>docker run --rm …</code> = kontajner sa po skončení sám zmaže (ideálne na jednorazové príkazy). <code>docker ps -a</code> ukáže aj mŕtvoly, ktoré ti inak potichu zaberajú miesto — a <code>docker system prune -f</code> ich pozametá.' },
  ],
  quiz: [
    { q: 'Aký je vzťah medzi obrazom a kontajnerom?',
      opts: ['Sú to synonymá', 'Obraz je nemenná šablóna (ako trieda), kontajner je bežiaca inštancia z nej', 'Kontajner je väčší obraz', 'Obraz beží, kontajner sa ukladá'],
      correct: 1, explain: 'Z jedného obrazu vieš spustiť ľubovoľne veľa kontajnerov — presne ako objekty z triedy.' },
    { q: 'Čo znamená -p 8080:80?',
      opts: ['Kontajner dostane 80 MB pamäte', 'Port 8080 na tvojom počítači smeruje na port 80 v kontajneri', 'Port 80 na počítači smeruje na 8080 v kontajneri', 'Kontajner sa spustí o 80 sekúnd'],
      correct: 1, explain: 'Poradie je HOSŤ:KONTAJNER — teda „zvonku:zvnútra". Zámena je klasická chyba.' },
    { q: 'Kontajner si spustil bez -d a po Ctrl+C zmizol. Prečo?',
      opts: ['Docker je pokazený', 'Bez -d beží v popredí a Ctrl+C ukončí jeho hlavný proces — a s ním kontajner', 'Chýbal --name', 'Obraz bol poškodený'],
      correct: 1, explain: 'Kontajner žije, dokým žije jeho hlavný proces. -d (detach) ho pustí na pozadí.' },
    { q: 'Kontajner hneď po spustení skončil. Aký je prvý diagnostický krok?',
      opts: ['Reštartovať Docker', 'docker ps -a a potom docker logs <meno>', 'Preinštalovať obraz', 'Zmeniť port'],
      correct: 1, explain: 'ps -a ukáže, že a s akým kódom skončil; logs povedia prečo. Deväť z desiatich prípadov je vyriešených.' },
    { q: 'Prečo je druhý pull podobného obrazu oveľa rýchlejší?',
      opts: ['Docker si pamätá heslá', 'Obrazy sa skladajú z vrstiev a spoločné vrstvy sú uložené len raz', 'Sťahuje sa komprimovane', 'Druhý pull je len naoko'],
      correct: 1, explain: 'Vrstvy sa zdieľajú medzi obrazmi — spoločný základ (napr. python:3.12-slim) sa nesťahuje ani neukladá dvakrát.' },
  ],
  exercises: [
    { t: 'order', title: 'Životný cyklus kontajnera', xp: 25,
      intro: 'Zoraď príkazy tak, ako ich pri práci s novým kontajnerom prirodzene použiješ.',
      items: [
        'docker pull nginx — stiahni obraz',
        'docker run -d -p 8080:80 --name web nginx — spusti',
        'docker ps — over, že beží',
        'docker logs web — pozri, čo vypísal',
        'docker stop web — zastav',
        'docker rm web — zmaž kontajner' ] },
    { t: 'blanks', title: 'Poskladaj docker run', xp: 25,
      intro: 'Doplň prepínače príkazu, ktorý spustí nginx na pozadí na porte 8080 pod menom web.',
      code: `docker run ⟦0⟧ ⟦1⟧ 8080:80 ⟦2⟧ web nginx

# a keď dobehne: zastav a zmaž jedným príkazom
docker rm ⟦3⟧ web`,
      blanks: [['-d'], ['-p'], ['--name'], ['-f']],
      hint: 'Na pozadí = -d, port = -p HOSŤ:KONTAJNER, meno = --name. Vynútené zmazanie bežiaceho kontajnera = -f.' },
    { t: 'write', title: 'Diagnostika spadnutého kontajnera', xp: 30,
      task: 'Napíš sériu príkazov (každý na vlastný riadok), ktorou zistíš, prečo kontajner <code>db</code> spadol, a potom ho spustíš správne: (1) vypíš <b>všetky</b> kontajnery vrátane zastavených, (2) vypíš logy kontajnera <code>db</code>, (3) zmaž ho, (4) spusti postgres:16 znova — na pozadí, pod menom <code>db</code> a s premennou <code>POSTGRES_PASSWORD</code>.',
      starter: `# tvoje príkazy...`,
      must: [['docker ps -a'], ['docker logs db'], ['docker rm'], ['docker run'], ['-e POSTGRES_PASSWORD']],
      hint: 'Poradie diagnostiky je vždy rovnaké: ps -a → logs → oprava. Premenná prostredia sa pridáva prepínačom -e KLUC=hodnota.',
      solution: `docker ps -a
docker logs db
docker rm db
docker run -d --name db -e POSTGRES_PASSWORD=tajne postgres:16` }
  ]
};

/* ============================================================
   LEKCIA 46 — Dockerfile
   ============================================================ */
window.COURSE.lessons.l46 = {
  id: 'l46', num: 46, section: 's8', icon: '📝', duration: '15 min',
  title: 'Dockerfile — postav si vlastný obraz (a maličký)',
  intro: 'Cudzie obrazy sú fajn, ale svoju appku musíš zabaliť sám. Dockerfile je recept: riadok po riadku hovoríš, ako sa obraz postaví. Naučíš sa ho písať tak, aby sa buildoval <b>rýchlo</b> a výsledok bol <b>malý a bezpečný</b> — v tom je celý rozdiel medzi amatérskym a produkčným obrazom.',
  goals: [
    'Poznať kľúčové inštrukcie: FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD',
    'Využiť cache vrstiev správnym poradím riadkov',
    'Zmenšiť obraz cez slim základ, .dockerignore a multi-stage build',
    'Nespúšťať kontajner pod rootom'
  ],
  blocks: [
    { t: 'h', x: 'Recept po riadkoch' },
    { t: 'pycharm', title: 'Dockerfile — komentovaný recept', files: [
      { name: 'Dockerfile', active: true, code: `# 1) Základ: na čom staviame (vždy konkrétna verzia, nikdy :latest!)
FROM python:3.12-slim

# 2) Pracovný adresár vnútri kontajnera — ďalšie príkazy bežia tu
WORKDIR /app

# 3) NAJPRV len zoznam závislostí (kvôli cache — vysvetlenie nižšie)
COPY requirements.txt .

# 4) Inštalácia závislostí
RUN pip install --no-cache-dir -r requirements.txt

# 5) AŽ POTOM zvyšok kódu (ten sa mení najčastejšie)
COPY . .

# 6) Predvolená konfigurácia (dá sa prepísať cez -e pri spustení)
ENV PORT=8000

# 7) Dokumentácia: na ktorom porte appka počúva
EXPOSE 8000

# 8) Čo sa spustí pri štarte kontajnera
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]` }
    ], output: `$ docker build -t moja-appka:1.0 .
[+] Building 24.1s (10/10) FINISHED
 => => naming to docker.io/library/moja-appka:1.0`,
      note: 'Bodka na konci <b>docker build -t moja-appka:1.0 .</b> je <b>kontext</b> — adresár, ktorý sa pošle Dockeru. Nie je to preklep.' },
    { t: 'table', head: ['Inštrukcia', 'Čo robí', 'Na čo pozor'], rows: [
      ['<code>FROM</code>', 'Základný obraz, na ktorom staviaš', 'Vždy konkrétna verzia (<code>python:3.12-slim</code>), nikdy <code>:latest</code> — inak sa ti build o mesiac zmení pod rukami'],
      ['<code>WORKDIR</code>', 'Nastaví pracovný adresár (a vytvorí ho)', 'Lepšie než <code>RUN cd /app</code> — to medzi riadkami nedrží'],
      ['<code>COPY</code>', 'Skopíruje súbory z kontextu do obrazu', 'Poradie rozhoduje o rýchlosti buildu (viď cache nižšie)'],
      ['<code>RUN</code>', 'Spustí príkaz <strong>pri stavbe</strong> obrazu', 'Vytvorí novú vrstvu; spájaj súvisiace príkazy cez <code>&amp;&amp;</code>'],
      ['<code>ENV</code>', 'Premenná prostredia s predvolenou hodnotou', '<strong>Nikdy sem nedávaj tajomstvá</strong> — ostanú v obraze navždy'],
      ['<code>EXPOSE</code>', 'Dokumentuje port', 'Sám o sebe port neotvorí — to robí <code>-p</code> pri <code>docker run</code>'],
      ['<code>CMD</code>', 'Príkaz spustený pri štarte kontajnera', 'Píš v tvare zoznamu <code>["a","b"]</code>, nie ako vetu'],
    ] },
    { t: 'h', x: 'Cache vrstiev — prečo záleží na poradí' },
    { t: 'p', x: 'Docker si každú vrstvu zapamätá. Pri ďalšom builde použije uloženú vrstvu dovtedy, kým sa niečo nezmení — a <strong>od prvej zmenenej vrstvy nižšie prestavia všetko</strong>. Preto sa dávajú <em>stabilné</em> veci hore a <em>často meniace sa</em> dole:' },
    { t: 'compare', a: { title: '🐌 Zle: kód pred závislosťami', items: [
        '<code>COPY . .</code>',
        '<code>RUN pip install -r requirements.txt</code>',
        'Zmeníš jedno písmeno v kóde…',
        '…a pip inštaluje všetko odznova (2 minúty)'
      ]}, b: { title: '⚡ Dobre: závislosti pred kódom', items: [
        '<code>COPY requirements.txt .</code>',
        '<code>RUN pip install -r requirements.txt</code>',
        '<code>COPY . .</code>',
        'Zmena kódu = build za 2 sekundy'
      ]} },
    { t: 'box', kind: 'key', title: 'Pravidlo poradia', x: 'Od <strong>najstabilnejšieho po najmenej stabilné</strong>: základný obraz → systémové balíky → zoznam závislostí → inštalácia závislostí → zdrojový kód. Toto jediné rozhodnutie ti pri dennodennom vývoji ušetrí hodiny.' },
    { t: 'h', x: '.dockerignore — nevoz do obrazu smeti' },
    { t: 'p', x: 'Pri builde sa <strong>celý</strong> kontext posiela Docker démonovi. Bez <code>.dockerignore</code> tam letí aj <code>.git</code>, virtuálne prostredie, cache a — čo je najhoršie — tvoj <code>.env</code> s API kľúčmi:' },
    { t: 'pycharm', title: '.dockerignore', files: [
      { name: '.dockerignore', active: true, code: `.git
.venv
__pycache__
*.pyc
# ⚠️ kľúče nikdy do obrazu — komentár MUSÍ byť na vlastnom riadku!
.env
.pytest_cache
*.md
Dockerfile` }
    ], output: `Pred:  transferring context: 284.51MB
Po:    transferring context: 47.2kB`,
      note: 'Menší kontext = rýchlejší build, menší obraz a hlavne <b>žiadne tajomstvá vnútri</b>. Kto má obraz, má aj všetko v ňom: <code>docker history</code> odhalí príkazy buildu aj hodnoty <code>ENV</code>, a súbor zmazaný v neskoršej vrstve sa dá vytiahnuť zo staršej cez <code>docker save</code> (alebo nástrojom <code>dive</code>). Pozor tiež na to, že v <code>.dockerignore</code> je komentárom iba riadok začínajúci <code>#</code> — inline komentár za vzorom vzor pokazí.' },
    { t: 'h', x: 'Multi-stage build — obraz na diéte' },
    { t: 'p', x: 'Na <em>stavbu</em> potrebuješ kompilátory a build nástroje; na <em>beh</em> nie. Multi-stage build postaví appku v jednom obraze a do finálneho prenesie <strong>len výsledok</strong>:' },
    { t: 'pycharm', title: 'Dockerfile — multi-stage', files: [
      { name: 'Dockerfile', active: true, code: `# ── 1. fáza: staviame (tu smie byť neporiadok) ──
FROM python:3.12 AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/instalacia -r requirements.txt

# ── 2. fáza: finálny obraz (len to, čo treba na beh) ──
FROM python:3.12-slim
WORKDIR /app

# prenesieme IBA nainštalované knižnice z prvej fázy
COPY --from=build /instalacia /usr/local
COPY . .

# beh pod neprivilegovaným používateľom
RUN useradd -m appka
USER appka

CMD ["python", "app.py"]` }
    ], output: `python:3.12 (build fáza)   1.02GB   ← zahodí sa
moja-appka:1.0 (finálny)    142MB   ← toto nasadzuješ`,
      note: 'Rozdiel 1 GB → 142 MB znamená rýchlejší deploy, menší útočný povrch a nižšie náklady na registry. <b>USER appka</b> navyše zaručí, že proces nebeží ako root — bezpečnostné minimum z lekcie 35.' },
    { t: 'explain', title: 'Rozbor multi-stage buildu', rows: [
      ['<code>FROM python:3.12 AS build</code>', 'Prvá fáza dostane meno <code>build</code>. Môže byť veľká a špinavá — do výsledku sa nedostane.'],
      ['<code>--prefix=/instalacia</code>', 'Knižnice sa nainštalujú do jedného priečinka, ktorý sa dá jednoducho prekopírovať ďalej.'],
      ['<code>FROM python:3.12-slim</code>', 'Druhý FROM začína <strong>nový, čistý obraz</strong>. Všetko z prvej fázy je zabudnuté, ak si to výslovne nezoberieš.'],
      ['<code>COPY --from=build …</code>', 'Kľúčový riadok: prenesie výsledok z prvej fázy. Bez neho by finálny obraz nemal závislosti.'],
      ['<code>RUN useradd -m appka</code> + <code>USER appka</code>', 'Vytvorí bežného používateľa a prepne naň. Odteraz proces nebeží ako root — ak by aj útočník prenikol dnu, má menšie práva.'],
    ]},
    { t: 'box', kind: 'warn', title: 'Tri chyby, ktoré uvidíš v každom druhom projekte', x: '<strong>1)</strong> <code>FROM python:latest</code> — build nie je reprodukovateľný. <strong>2)</strong> <code>COPY . .</code> hneď na začiatku — každá zmena kódu prestavia všetky závislosti. <strong>3)</strong> Kľúče cez <code>ENV OPENAI_API_KEY=sk-…</code> — kľúč ostane v obraze navždy a vytiahne ho z neho ktokoľvek.' },
  ],
  quiz: [
    { q: 'Prečo sa COPY requirements.txt dáva PRED COPY . . ?',
      opts: ['Je to abecedne', 'Kvôli cache vrstiev — inak sa pri každej zmene kódu preinštalujú všetky závislosti', 'requirements.txt musí byť prvý súbor', 'Inak build zlyhá'],
      correct: 1, explain: 'Docker prestavia všetko od prvej zmenenej vrstvy nižšie. Stabilné veci patria hore, často meniaci sa kód dole.' },
    { q: 'Čo robí EXPOSE 8000?',
      opts: ['Otvorí port navonok', 'Iba dokumentuje, na ktorom porte appka počúva — otvára ho až -p pri docker run', 'Presmeruje port', 'Nastaví premennú PORT'],
      correct: 1, explain: 'EXPOSE je dokumentácia pre človeka a nástroje. Skutočné mapovanie robí -p 8080:8000.' },
    { q: 'Na čo slúži multi-stage build?',
      opts: ['Na paralelný build', 'Build nástroje ostanú v prvej fáze a do finálneho obrazu ide len výsledok — obraz je oveľa menší', 'Na build viacerých appiek naraz', 'Na testovanie'],
      correct: 1, explain: 'Kompilátory a build závislosti nie sú na beh potrebné. Rozdiel býva rádovo (1 GB → 150 MB).' },
    { q: 'Prečo nedávať API kľúč cez ENV do Dockerfilu?',
      opts: ['Nefungovalo by to', 'Ostane natrvalo v obraze a vytiahne ho z neho každý, kto ho má', 'Docker to zakazuje', 'Spomalí to build'],
      correct: 1, explain: 'Vrstvy obrazu sú čitateľné (docker history). Tajomstvá sa odovzdávajú až pri spustení cez -e alebo secret manager.' },
    { q: 'Čo znamená bodka v docker build -t appka:1.0 .',
      opts: ['Skrytý súbor', 'Kontext buildu — adresár, ktorý sa pošle Dockeru (tu aktuálny)', 'Koniec príkazu', 'Tichý režim'],
      correct: 1, explain: 'Kontext je sada súborov, z ktorých môže COPY brať. Preto je dôležitý .dockerignore.' },
  ],
  exercises: [
    { t: 'order', title: 'Dockerfile v optimálnom poradí', xp: 25,
      intro: 'Zoraď inštrukcie tak, aby build maximálne využíval cache.',
      items: [
        'FROM python:3.12-slim',
        'WORKDIR /app',
        'COPY requirements.txt .',
        'RUN pip install --no-cache-dir -r requirements.txt',
        'COPY . .',
        'CMD ["python", "app.py"]' ] },
    { t: 'blanks', title: 'Doplň Dockerfile', xp: 25,
      intro: 'Doplň chýbajúce inštrukcie.',
      code: `⟦0⟧ python:3.12-slim
⟦1⟧ /app
COPY requirements.txt .
⟦2⟧ pip install --no-cache-dir -r requirements.txt
COPY . .
⟦3⟧ ["python", "app.py"]`,
      blanks: [['FROM'], ['WORKDIR'], ['RUN'], ['CMD']],
      hint: 'Základ určuje FROM, pracovný adresár WORKDIR, príkaz pri stavbe RUN a príkaz pri štarte kontajnera CMD.' },
    { t: 'write', title: 'Napíš vlastný Dockerfile', xp: 30,
      task: 'Napíš Dockerfile pre Python appku: základ <code>python:3.12-slim</code>, pracovný adresár <code>/app</code>, najprv skopíruj <code>requirements.txt</code> a nainštaluj závislosti cez <code>pip install --no-cache-dir</code>, potom skopíruj zvyšok kódu, deklaruj port 8000 cez <code>EXPOSE</code> a nastav <code>CMD</code> na spustenie <code>app.py</code> (v tvare zoznamu).',
      starter: `# Dockerfile
# tvoj kód...`,
      must: [['FROM python:3.12-slim'], ['WORKDIR /app'], ['#2:COPY'], ['RUN pip install'], ['EXPOSE 8000'], ['CMD [']],
      hint: 'Poradie kvôli cache: FROM → WORKDIR → COPY requirements.txt → RUN pip install → COPY . . → EXPOSE → CMD. CMD sa píše ako zoznam: CMD ["python", "app.py"].',
      solution: `FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "app.py"]` }
  ]
};

/* ============================================================
   LEKCIA 47 — Dáta, siete, Compose
   ============================================================ */
window.COURSE.lessons.l47 = {
  id: 'l47', num: 47, section: 's8', icon: '🔗', duration: '15 min',
  title: 'Dáta, siete a Docker Compose',
  intro: 'Jeden kontajner je cvičenie. Skutočná appka má API, databázu a cache — a tie sa musia navzájom nájsť a niekam si ukladať dáta. V tejto lekcii dorobíš zvyšok: perzistenciu cez volumes, komunikáciu cez siete a spustenie celého stacku jedným príkazom cez Compose.',
  goals: [
    'Zachovať dáta cez pomenované volumes (a vedieť, kedy bind mount)',
    'Pochopiť, ako sa kontajnery nachádzajú menom cez Docker sieť',
    'Napísať docker-compose.yml pre viac služieb',
    'Ovládať compose up / down / ps / logs'
  ],
  blocks: [
    { t: 'h', x: 'Kontajner je pominuteľný — dáta nesmú byť' },
    { t: 'p', x: 'Všetko, čo kontajner zapíše do svojho súborového systému, <strong>zmizne spolu s ním</strong>. Zmažeš databázový kontajner a máš po dátach. Riešením je volume: úložisko, ktoré žije <strong>mimo</strong> kontajnera a pripojí sa doň.' },
    { t: 'table', head: ['Typ', 'Zápis', 'Kedy použiť'], rows: [
      ['<strong>Pomenovaný volume</strong>', '<code>-v dbdata:/var/lib/postgresql/data</code>', 'Produkčné dáta. Spravuje ho Docker, prežije zmazanie kontajnera.'],
      ['<strong>Bind mount</strong>', '<code>-v ./kod:/app</code>', 'Vývoj — priečinok z tvojho PC vidno v kontajneri, zmeny sú okamžite viditeľné.'],
      ['<strong>tmpfs</strong>', '<code>--tmpfs /tmp</code>', 'Dočasné dáta len v pamäti (nikdy na disk).'],
      ['<strong>Nič</strong>', '(predvolené)', 'Bezstavové appky — API, ktoré si nič neukladá.'],
    ] },
    { t: 'pycharm', title: 'Terminal — dáta, ktoré prežijú', terminal: true, files: [
      { name: 'terminal', active: true, code: `# databáza s pomenovaným volume
docker run -d --name db \\
  -e POSTGRES_PASSWORD=tajne \\
  -v dbdata:/var/lib/postgresql/data \\
  postgres:16

docker volume ls          # dbdata existuje

# zmažeme celý kontajner...
docker rm -f db

# ...a spustíme nový nad tým istým volume — dáta sú stále tam
docker run -d --name db2 \\
  -e POSTGRES_PASSWORD=tajne \\
  -v dbdata:/var/lib/postgresql/data \\
  postgres:16` }
    ], output: `DRIVER    VOLUME NAME
local     dbdata`,
      note: 'Toto je misia 7 v Playgrounde. Skús si aj <code>docker volume rm dbdata</code>, kým kontajner beží — Docker ťa zastaví, lebo volume je v používaní.' },
    { t: 'box', kind: 'warn', title: 'Volume má prednosť pred obsahom obrazu', x: 'Keď pripojíš volume do priečinka, ktorý už v obraze niečo obsahoval, <strong>prekryje ho</strong> (ako keby si naň položil koberec). Pri prázdnom pomenovanom volume Docker obsah najprv skopíruje dnu, pri bind mounte nie — a to býva zdroj záhadného „veď tam tie súbory boli".' },
    { t: 'h', x: 'Siete: ako sa kontajnery nájdu' },
    { t: 'p', x: 'Kontajnery v <strong>rovnakej vlastnej sieti</strong> sa vidia navzájom <strong>podľa mena</strong> — Docker im poskytuje vlastné DNS. Appka sa teda pripojí na <code>redis://cache:6379</code>, kde <code>cache</code> je jednoducho meno kontajnera. Žiadne IP adresy netreba.' },
    { t: 'flow', steps: ['🌐 Vlastná sieť<br><small>docker network create</small>', '📦 api<br><small>--network moja-siet</small>', '🔎 DNS podľa mena', '📦 cache<br><small>redis://cache:6379</small>'] },
    { t: 'pycharm', title: 'Terminal — dva kontajnery, ktoré sa vidia', terminal: true, files: [
      { name: 'terminal', active: true, code: `# 1) vlastná sieť (predvolený "bridge" DNS podľa mena nevie)
docker network create moja-siet

# 2) cache v tejto sieti
docker run -d --name cache --network moja-siet redis:7

# 3) appka v tej istej sieti sa na cache pripojí MENOM
docker run -d --name api --network moja-siet \\
  -e REDIS_URL=redis://cache:6379 \\
  -p 8000:8000 moja-appka:1.0

docker network ls` }
    ], output: `NETWORK ID     NAME         DRIVER    SCOPE
a1b2c3d4e5f6   bridge       bridge    local
9f8e7d6c5b4a   moja-siet    bridge    local`,
      note: 'Dôležité: <b>porty cez -p</b> otváraš len tomu, čo má byť dostupné zvonku. Databáza a cache majú byť viditeľné iba vnútri siete — nemapuj im port na hostiteľa.' },
    { t: 'h', x: 'Docker Compose: celý stack jedným príkazom' },
    { t: 'p', x: 'Písať tri dlhé <code>docker run</code> príkazy zakaždým je otrava a zdroj chýb. Compose ich zapíše do jedného YAML súboru — a spustí ich jedným príkazom. <strong>Toto je spôsob, akým sa dnes lokálne vývojové prostredie robí.</strong>' },
    { t: 'pycharm', title: 'docker-compose.yml — API + cache + databáza', files: [
      { name: 'docker-compose.yml', active: true, code: `services:
  api:
    build: .                      # postav z Dockerfilu v tomto priečinku
    ports:
      - "8000:8000"               # jediná služba dostupná zvonku
    environment:
      - REDIS_URL=redis://cache:6379
      - DATABASE_URL=postgresql://app:tajne@db:5432/akademia
    depends_on:
      - cache
      - db

  cache:
    image: redis:7                # žiadne ports: — dostupná len zvnútra

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=tajne
      - POSTGRES_USER=app
      - POSTGRES_DB=akademia
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:                         # pomenovaný volume pre databázu` }
    ], output: `$ docker compose up -d
[+] Running 3/3
 ✔ Container akademia-cache-1  Started
 ✔ Container akademia-db-1     Started
 ✔ Container akademia-api-1    Started`,
      note: 'Compose vytvorí sieť automaticky — služby sa preto vidia menami <b>cache</b> a <b>db</b>, presne ako v connection stringoch vyššie. Vyskúšaj si to v misii 10.' },
    { t: 'explain', title: 'Rozbor compose súboru', rows: [
      ['<code>build: .</code>', 'Namiesto hotového obrazu postav z Dockerfilu. Alternatíva je <code>image: moja-appka:1.0</code>.'],
      ['<code>ports:</code> len pri api', 'Von púšťaš iba to, čo musí byť dostupné. Databáza bez <code>ports</code> je z internetu neviditeľná — bezpečnostné minimum.'],
      ['<code>redis://cache:6379</code>', 'Meno služby = hostname. Compose sa postará o DNS, nemusíš riešiť IP adresy.'],
      ['<code>depends_on</code>', 'Určí <strong>poradie štartu</strong>, nie pripravenosť! Databáza môže ešte nabiehať — appka musí vedieť zopakovať pripojenie (retry z lekcie 42).'],
      ['<code>volumes: dbdata:</code>', 'Deklarácia pomenovaného volume na konci súboru — bez nej by ho Compose nevytvoril.'],
    ]},
    { t: 'table', head: ['Príkaz', 'Čo urobí'], rows: [
      ['<code>docker compose up -d</code>', 'Postaví (ak treba) a spustí všetky služby na pozadí'],
      ['<code>docker compose ps</code>', 'Stav služieb'],
      ['<code>docker compose logs -f api</code>', 'Sleduje logy konkrétnej služby'],
      ['<code>docker compose down</code>', 'Zastaví a odstráni kontajnery aj sieť (volumes ostanú)'],
      ['<code>docker compose down -v</code>', '…aj s volumes — <strong>pozor, zmaže dáta</strong>'],
      ['<code>docker compose up -d --build</code>', 'Vynúti prestavbu obrazov'],
    ] },
    { t: 'box', kind: 'key', title: 'Zhrnutie celej sekcie', x: '<strong>Obraz</strong> je šablóna, <strong>kontajner</strong> je bežiaca inštancia. <strong>Dockerfile</strong> je recept — stabilné veci hore kvôli cache, multi-stage a non-root pre produkciu. <strong>Volume</strong> drží dáta, <strong>sieť</strong> spája kontajnery menami, <strong>Compose</strong> to celé spustí jedným príkazom. Teraz si to celé prejdi v <strong>🐳 Docker Playgrounde</strong> — 12 misií od prvého kontajnera po upratovanie.' },
  ],
  quiz: [
    { q: 'Zmažeš databázový kontajner. Čo sa stane s dátami?',
      opts: ['Zostanú v obraze', 'Zmiznú — pokiaľ neboli v pripojenom volume', 'Docker ich zálohuje sám', 'Presunú sa do iného kontajnera'],
      correct: 1, explain: 'Súborový systém kontajnera zaniká s kontajnerom. Trvalé dáta patria do pomenovaného volume.' },
    { q: 'Kedy použiť bind mount (-v ./kod:/app) namiesto pomenovaného volume?',
      opts: ['V produkcii pre databázu', 'Pri vývoji — chceš vidieť zmeny súborov z počítača okamžite v kontajneri', 'Nikdy', 'Na zálohovanie'],
      correct: 1, explain: 'Bind mount napojí konkrétny priečinok z hostiteľa. Na produkčné dáta je lepší pomenovaný volume spravovaný Dockerom.' },
    { q: 'Ako sa appka pripojí na Redis bežiaci v inom kontajneri?',
      opts: ['Cez IP adresu, ktorú si musí zistiť', 'Menom kontajnera/služby, ak sú v rovnakej vlastnej sieti (redis://cache:6379)', 'Cez localhost', 'Nedá sa'],
      correct: 1, explain: 'Docker poskytuje v používateľských sieťach DNS — meno kontajnera funguje ako hostname.' },
    { q: 'Čo NEznamená depends_on v Compose?',
      opts: ['Určuje poradie štartu služieb', 'Zaručuje, že závislá služba je už pripravená prijímať spojenia', 'Vzťah medzi službami', 'Že sa cache spustí pred api'],
      correct: 1, explain: 'depends_on rieši len poradie spustenia. Pripravenosť si musí appka overiť sama — preto retry logika.' },
    { q: 'Prečo databáza v compose súbore nemá sekciu ports?',
      opts: ['Je to chyba', 'Aby bola dostupná len vnútri Docker siete, nie z internetu', 'Postgres port nepotrebuje', 'Compose to nepodporuje'],
      correct: 1, explain: 'Von púšťaš len to, čo musí byť dostupné. Menej otvorených portov = menší útočný povrch.' },
  ],
  exercises: [
    { t: 'order', title: 'Od jedného kontajnera k stacku', xp: 25,
      intro: 'Zoraď kroky, ako sa z osamoteného kontajnera stane funkčný viac-službový stack.',
      items: [
        'Spusti databázu s pomenovaným volume, aby dáta prežili',
        'Vytvor vlastnú sieť, nech sa kontajnery vidia menami',
        'Pripoj appku na databázu cez meno služby, nie IP',
        'Prepíš spúšťacie príkazy do docker-compose.yml',
        'Spusti celý stack cez docker compose up -d' ] },
    { t: 'blanks', title: 'Doplň compose súbor', xp: 25,
      intro: 'Doplň kľúčové časti docker-compose.yml.',
      code: `⟦0⟧:
  api:
    image: moja-appka:1.0
    ⟦1⟧:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://⟦2⟧:6379
    depends_on:
      - cache

  cache:
    ⟦3⟧: redis:7`,
      blanks: [['services'], ['ports'], ['cache'], ['image']],
      hint: 'Zoznam služieb sa uvádza kľúčom services, mapovanie portov ports, hotový obraz image — a hostname je meno služby (cache).' },
    { t: 'write', title: 'Databáza s trvalými dátami', xp: 30,
      task: 'Napíš príkaz <code>docker run</code>, ktorý spustí <code>postgres:16</code> na pozadí pod menom <code>db</code>, s heslom v premennej <code>POSTGRES_PASSWORD</code> a s pomenovaným volume <code>dbdata</code> pripojeným do <code>/var/lib/postgresql/data</code>. Na druhý riadok pridaj príkaz, ktorý vypíše zoznam volumes.',
      starter: `# tvoje príkazy...`,
      must: [['docker run'], ['-d'], ['--name db'], ['-e POSTGRES_PASSWORD'], ['-v dbdata:/var/lib/postgresql/data'], ['docker volume ls']],
      hint: 'Volume sa pripája ako -v MENO:/cesta/v/kontajneri. Poradie prepínačov nie je dôležité, ale obraz musí byť až za nimi.',
      solution: `docker run -d --name db -e POSTGRES_PASSWORD=tajne -v dbdata:/var/lib/postgresql/data postgres:16
docker volume ls` }
  ]
};
