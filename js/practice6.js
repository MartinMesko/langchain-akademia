/* ============================================================
   EXTRA „NAPÍŠ KÓD" CVIČENIA — časť 6
   Sekcia s8 Docker do hĺbky (l45–l47): 9 cvičení na lekciu.
   Píše sa v nich shell, Dockerfile a YAML — nie Python.
   ============================================================ */
(function () {
  const W = (title, task, starter, must, hint, solution) =>
    ({ t: 'write', title, task, starter, must, hint, solution });

  window.EXTRA_WRITE = window.EXTRA_WRITE || {};
  const pridaj = (lid, zoznam) => {
    window.EXTRA_WRITE[lid] = (window.EXTRA_WRITE[lid] || []).concat(zoznam);
  };

  /* ── l45: obrazy a kontajnery ── */
  pridaj('l45', [
    W('Prvý kontajner',
      'Napíš dva príkazy: stiahni obraz <code>nginx</code> a potom vypíš zoznam lokálnych obrazov.',
      `# tvoje príkazy...`,
      [['docker pull nginx'], ['docker images']],
      'Sťahovanie robí docker pull, lokálne obrazy vypíše docker images (alebo docker image ls).',
      `docker pull nginx
docker images`),

    W('Web server na pozadí',
      'Spusti nginx <b>na pozadí</b> pod menom <code>web</code> s mapovaním portu 8080 (hostiteľ) na 80 (kontajner). Na ďalší riadok pridaj príkaz, ktorý overí, že beží.',
      `# tvoje príkazy...`,
      [['docker run'], ['-d'], ['-p 8080:80'], ['--name web'], ['docker ps']],
      'Poradie prepínačov je voľné, ale obraz musí byť až za nimi. Port sa píše HOSŤ:KONTAJNER.',
      `docker run -d -p 8080:80 --name web nginx
docker ps`),

    W('Zisti, čo sa deje vnútri',
      'Napíš príkaz, ktorý vypíše logy kontajnera <code>web</code>, a druhý, ktorý vnútri neho spustí príkaz <code>hostname</code>.',
      `# tvoje príkazy...`,
      [['docker logs web'], ['docker exec web'], ['hostname']],
      'Logy = docker logs <meno>. Príkaz vnútri = docker exec <meno> <príkaz>.',
      `docker logs web
docker exec web hostname`),

    W('Zastav a zmaž',
      'Napíš tri príkazy: zastav kontajner <code>web</code>, zmaž ho a vypíš <b>všetky</b> kontajnery (aj zastavené), aby si overil, že je preč.',
      `# tvoje príkazy...`,
      [['docker stop web'], ['docker rm web'], ['docker ps -a']],
      'Bežiaci kontajner sa nedá zmazať — najprv stop, potom rm. Skratka pre oboje naraz je docker rm -f web.',
      `docker stop web
docker rm web
docker ps -a`),

    W('Premenné prostredia',
      'Spusti <code>postgres:16</code> na pozadí pod menom <code>db</code> a odovzdaj mu premennú <code>POSTGRES_PASSWORD</code> s ľubovoľnou hodnotou.',
      `# tvoj príkaz...`,
      [['docker run'], ['-d'], ['--name db'], ['-e POSTGRES_PASSWORD='], ['postgres:16']],
      'Premenná prostredia sa odovzdáva prepínačom -e KLUC=hodnota. Bez hesla sa postgres odmietne spustiť.',
      `docker run -d --name db -e POSTGRES_PASSWORD=tajne postgres:16`),

    W('Jednorazový kontajner',
      'Spusti <code>hello-world</code> tak, aby sa kontajner po dobehnutí <b>sám zmazal</b>, a potom over cez výpis všetkých kontajnerov, že po ňom nič neostalo.',
      `# tvoje príkazy...`,
      [['docker run'], ['--rm'], ['hello-world'], ['docker ps -a']],
      'Prepínač --rm zmaže kontajner hneď po skončení. Hodí sa na jednorazové príkazy, aby ti nezaplňovali systém.',
      `docker run --rm hello-world
docker ps -a`),

    W('Dva servery naraz',
      'Spusti dva nginx kontajnery na pozadí (<code>w1</code> a <code>w2</code>) tak, aby bežali súčasne — každý na inom hostiteľskom porte (9000 a 9001), oba na kontajnerový port 80.',
      `# tvoje príkazy...`,
      [['#2:docker run'], ['-p 9000:80'], ['-p 9001:80'], ['--name w1'], ['--name w2']],
      'Jeden hostiteľský port môže obsadiť len jeden kontajner — mení sa teda len číslo pred dvojbodkou.',
      `docker run -d -p 9000:80 --name w1 nginx
docker run -d -p 9001:80 --name w2 nginx`),

    W('Reštart a inšpekcia',
      'Napíš príkaz, ktorý reštartuje kontajner <code>db</code>, a druhý, ktorý vypíše jeho podrobnú konfiguráciu v JSON formáte.',
      `# tvoje príkazy...`,
      [['docker restart db'], ['docker inspect db']],
      'docker inspect vypíše všetko: premenné prostredia, pripojené volumes, siete, stav aj exit kód.',
      `docker restart db
docker inspect db`),

    W('Veľké upratovanie',
      'Napíš dva príkazy: násilne zmaž bežiaci kontajner <code>db</code> (jedným príkazom aj so zastavením) a potom pozametaj zastavené kontajnery aj <b>všetky nepoužité obrazy</b> — bez pýtania sa na potvrdenie.',
      `# tvoje príkazy...`,
      [['docker rm -f db'], ['docker system prune'], ['-a'], ['-f']],
      'docker rm -f = stop + rm naraz. Samotné docker system prune -f zmaže len kontajnery a VISIACE (dangling) obrazy — na otagované nepoužité obrazy treba pridať -a.',
      `docker rm -f db
docker system prune -a -f`),
  ]);

  /* ── l46: Dockerfile ── */
  pridaj('l46', [
    W('Minimálny Dockerfile',
      'Napíš najkratší zmysluplný Dockerfile: základ <code>python:3.12-slim</code>, pracovný adresár <code>/app</code>, skopíruj všetko z kontextu a spusti <code>app.py</code> cez <code>CMD</code> v tvare zoznamu.',
      `# Dockerfile
# tvoj kód...`,
      [['FROM python:3.12-slim'], ['WORKDIR /app'], ['COPY'], ['CMD [']],
      'Štyri riadky stačia: FROM, WORKDIR, COPY . . a CMD ["python", "app.py"].',
      `FROM python:3.12-slim
WORKDIR /app
COPY . .
CMD ["python", "app.py"]`),

    W('Build a spustenie',
      'Napíš dva príkazy: postav z Dockerfilu obraz s menom <code>moja-appka</code> a tagom <code>1.0</code> (kontext je aktuálny priečinok) a potom z neho spusti kontajner na pozadí s portom 8000.',
      `# tvoje príkazy...`,
      [['docker build'], ['-t moja-appka:1.0'], ['docker run'], ['-p 8000:8000']],
      'Nezabudni na bodku na konci buildu — je to kontext, nie preklep.',
      `docker build -t moja-appka:1.0 .
docker run -d -p 8000:8000 --name api moja-appka:1.0`),

    W('Poradie kvôli cache',
      'Napíš Dockerfile, ktorý správne využíva cache: najprv skopíruj <b>iba</b> <code>requirements.txt</code>, nainštaluj závislosti cez <code>pip install --no-cache-dir</code> a <b>až potom</b> skopíruj zvyšok kódu.',
      `FROM python:3.12-slim
WORKDIR /app
# tvoj kód...`,
      [['COPY requirements.txt'], ['RUN pip install'], ['--no-cache-dir'], ['COPY . .']],
      'Stabilné veci hore, často meniace sa dole. Vďaka tomu zmena kódu nespustí preinštalovanie závislostí.',
      `FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["python", "app.py"]`),

    W('Súbor .dockerignore',
      'Napíš obsah <code>.dockerignore</code>, ktorý z kontextu vylúči aspoň: priečinok <code>.git</code>, virtuálne prostredie <code>.venv</code>, cache <code>__pycache__</code> a hlavne súbor <code>.env</code> s kľúčmi.',
      `# .dockerignore
# tvoj kód...`,
      [['.git'], ['.venv'], ['__pycache__'], ['.env']],
      'Každý vzor na vlastný riadok. .env je najdôležitejší — kľúče sa nikdy nesmú dostať do obrazu.',
      `.git
.venv
__pycache__
*.pyc
.env
.pytest_cache`),

    W('Konfigurácia a port',
      'Doplň Dockerfile o predvolenú premennú prostredia <code>PORT</code> s hodnotou 8000 (cez <code>ENV</code>) a o deklaráciu portu 8000 (cez <code>EXPOSE</code>).',
      `FROM python:3.12-slim
WORKDIR /app
COPY . .
# tvoj kód...
CMD ["python", "app.py"]`,
      [['ENV PORT=8000', 'ENV PORT 8000'], ['EXPOSE 8000']],
      'ENV nastaví predvolenú hodnotu (dá sa prepísať cez -e pri run). EXPOSE je len dokumentácia — port otvorí až -p.',
      `FROM python:3.12-slim
WORKDIR /app
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD ["python", "app.py"]`),

    W('Multi-stage build',
      'Napíš dvojfázový Dockerfile: prvá fáza <code>FROM python:3.12 AS build</code> nainštaluje závislosti, druhá fáza <code>FROM python:3.12-slim</code> prenesie výsledok cez <code>COPY --from=build</code> a spustí appku.',
      `# Dockerfile
# tvoj kód...`,
      [['AS build'], ['#2:FROM python'], ['COPY --from=build'], ['CMD [']],
      'Druhý FROM začína čistý obraz — z prvej fázy si musíš výslovne prekopírovať, čo potrebuješ.',
      `FROM python:3.12 AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/instalacia -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=build /instalacia /usr/local
COPY . .
CMD ["python", "app.py"]`),

    W('Non-root používateľ',
      'Doplň do Dockerfilu vytvorenie používateľa <code>appka</code> cez <code>RUN useradd</code> a prepnutie naň cez <code>USER</code> — tesne pred <code>CMD</code>.',
      `FROM python:3.12-slim
WORKDIR /app
COPY . .
# tvoj kód...
CMD ["python", "app.py"]`,
      [['RUN useradd'], ['appka'], ['USER appka']],
      'Prepnutie na bežného používateľa je bezpečnostné minimum — ak by útočník prenikol dnu, nemá rootovské práva.',
      `FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN useradd -m appka
USER appka
CMD ["python", "app.py"]`),

    W('Zafixovaná verzia základu',
      'Napíš dva riadky ako komentované porovnanie: nesprávny <code>FROM python:latest</code> (ako komentár s vysvetlením) a správny <code>FROM python:3.12-slim</code>.',
      `# Dockerfile
# tvoj kód...`,
      [['python:latest'], ['FROM python:3.12-slim'], ['#']],
      'latest znamená „čokoľvek je práve najnovšie" — build potom nie je reprodukovateľný a o mesiac ti môže spadnúť bez zmeny kódu.',
      `# ❌ FROM python:latest   — build nie je reprodukovateľný, verzia sa mení pod rukami
FROM python:3.12-slim`),

    W('Kontrola veľkosti obrazu',
      'Napíš dva príkazy: postav obraz s tagom <code>moja-appka:slim</code> a potom vypíš zoznam obrazov, aby si porovnal veľkosti.',
      `# tvoje príkazy...`,
      [['docker build'], ['-t moja-appka:slim'], ['docker images']],
      'Stĺpec SIZE vo výpise docker images je jediná spätná väzba, ktorú na diétu obrazu potrebuješ.',
      `docker build -t moja-appka:slim .
docker images`),
  ]);

  /* ── l47: dáta, siete, compose ── */
  pridaj('l47', [
    W('Databáza s volume',
      'Spusti <code>postgres:16</code> na pozadí pod menom <code>db</code> s heslom v <code>POSTGRES_PASSWORD</code> a s pomenovaným volume <code>dbdata</code> pripojeným do <code>/var/lib/postgresql/data</code>.',
      `# tvoj príkaz...`,
      [['docker run'], ['-d'], ['--name db'], ['-v dbdata:/var/lib/postgresql/data'], ['postgres:16']],
      'Pomenovaný volume vytvorí Docker sám, ak ešte neexistuje. Zápis je -v MENO:/cesta/v/kontajneri.',
      `docker run -d --name db -e POSTGRES_PASSWORD=tajne -v dbdata:/var/lib/postgresql/data postgres:16`),

    W('Správa volumes',
      'Napíš tri príkazy: vytvor volume <code>zaloha</code>, vypíš všetky volumes a potom volume <code>zaloha</code> zmaž.',
      `# tvoje príkazy...`,
      [['docker volume create'], ['docker volume ls'], ['docker volume rm']],
      'Volume sa nedá zmazať, kým ho používa nejaký kontajner — Docker ťa v takom prípade zastaví.',
      `docker volume create zaloha
docker volume ls
docker volume rm zaloha`),

    W('Bind mount pre vývoj',
      'Spusti <code>python:3.12-slim</code> tak, aby sa aktuálny priečinok (<code>$(pwd)</code> alebo <code>.</code>) pripojil do <code>/app</code> v kontajneri, pracovným adresárom bolo <code>/app</code> (prepínač <code>-w</code>) a spustil sa <code>python app.py</code>.',
      `# tvoj príkaz...`,
      [['docker run'], ['-v'], ['/app'], ['-w /app'], ['python app.py']],
      'Bind mount = -v CESTA_NA_PC:/cesta/v/kontajneri. Vďaka nemu vidíš zmeny v kóde okamžite, bez prestavby obrazu.',
      `docker run --rm -v $(pwd):/app -w /app python:3.12-slim python app.py`),

    W('Vlastná sieť',
      'Napíš tri príkazy: vytvor sieť <code>moja-siet</code>, spusti v nej redis pod menom <code>cache</code> a vypíš zoznam sietí.',
      `# tvoje príkazy...`,
      [['docker network create'], ['moja-siet'], ['--network moja-siet'], ['docker network ls']],
      'V predvolenej sieti bridge sa kontajnery menami nevidia — preto vlastná sieť. Do nej sa kontajner pripojí cez --network.',
      `docker network create moja-siet
docker run -d --name cache --network moja-siet redis:7
docker network ls`),

    W('Appka pripojená na cache',
      'Spusti kontajner <code>api</code> z obrazu <code>moja-appka:1.0</code> v sieti <code>moja-siet</code>, s portom 8000 a s premennou <code>REDIS_URL</code>, ktorá sa na cache odkazuje <b>menom</b> (<code>redis://cache:6379</code>).',
      `# tvoj príkaz...`,
      [['docker run'], ['--network moja-siet'], ['-e REDIS_URL=redis://cache:6379'], ['-p 8000:8000'], ['moja-appka:1.0']],
      'Meno kontajnera funguje ako hostname — žiadne IP adresy netreba zisťovať.',
      `docker run -d --name api --network moja-siet -e REDIS_URL=redis://cache:6379 -p 8000:8000 moja-appka:1.0`),

    W('Compose so službami',
      'Napíš <code>docker-compose.yml</code> s dvomi službami: <code>api</code> (obraz <code>moja-appka:1.0</code>, port 8000:8000, závislosť na cache) a <code>cache</code> (obraz <code>redis:7</code>, bez portov).',
      `# docker-compose.yml
# tvoj kód...`,
      [['services:'], ['api:'], ['ports:'], ['depends_on:'], ['cache:'], ['image: redis:7']],
      'Odsadenie v YAML je dôležité: services na začiatku riadka, názvy služieb o 2 medzery, ich vlastnosti o 4.',
      `services:
  api:
    image: moja-appka:1.0
    ports:
      - "8000:8000"
    depends_on:
      - cache

  cache:
    image: redis:7`),

    W('Compose s volume',
      'Doplň do compose súboru službu <code>db</code> (obraz <code>postgres:16</code>, heslo cez environment) s pomenovaným volume <code>dbdata</code> — vrátane deklarácie volume na konci súboru.',
      `services:
  db:
    image: postgres:16
# tvoj kód...`,
      [['environment:'], ['POSTGRES_PASSWORD'], ['volumes:'], ['dbdata:/var/lib/postgresql/data'], ['#2:volumes:']],
      'Volume treba uviesť dvakrát: raz pri službe (kam sa pripojí) a raz v hornej úrovni súboru (deklarácia).',
      `services:
  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=tajne
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:`),

    W('Ovládanie stacku',
      'Napíš štyri príkazy Compose: spusti stack na pozadí, vypíš stav služieb, sleduj logy služby <code>api</code> a nakoniec celý stack zhoď.',
      `# tvoje príkazy...`,
      [['docker compose up'], ['-d'], ['docker compose ps'], ['docker compose logs'], ['docker compose down']],
      'Sledovanie logov naživo zapína prepínač -f (follow): docker compose logs -f api.',
      `docker compose up -d
docker compose ps
docker compose logs -f api
docker compose down`),

    W('Prestavba po zmene kódu',
      'Napíš príkaz, ktorý spustí stack na pozadí a <b>zároveň vynúti prestavbu</b> obrazov, a druhý príkaz, ktorý stack zhodí <b>aj s volumes</b> (pozor, maže dáta).',
      `# tvoje príkazy...`,
      [['docker compose up'], ['--build'], ['docker compose down'], ['-v']],
      'up --build prestaví obrazy pred štartom. down -v zmaže aj volumes — používaj vedome, dáta sú preč.',
      `docker compose up -d --build
docker compose down -v`),
  ]);
})();
