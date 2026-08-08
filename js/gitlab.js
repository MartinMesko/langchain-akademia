/* ============================================================
   GIT PLAYGROUND — misie
   Kontroly sa pozerajú na skutočný stav repozitára (commity,
   vetvy, staging, súbory), nie na text zadaných príkazov.
   ============================================================ */
window.GIT_MISIE = [
  {
    id: 'g1', xp: 15, titul: 'Založ repozitár',
    zadanie: 'V priečinku máš dva súbory (<code>README.md</code>, <code>app.py</code>), ale Git o nich zatiaľ nevie. Založ repozitár, pozri sa na stav a <b>ulož oba súbory do prvého commitu</b>.',
    ciel: 'Repozitár existuje a má aspoň jeden commit s oboma súbormi',
    tipy: [
      'Repozitár založí <code>git init</code>. Potom sa vždy oplatí <code>git status</code>.',
      'Súbory treba najprv pripraviť (<code>git add .</code>) a až potom uložiť (<code>git commit</code>).',
      'Riešenie: <code>git init</code> → <code>git add .</code> → <code>git commit -m "prvý commit"</code>',
    ],
    kontrola(e) {
      if (!e.stav.init) return { ok: false, preco: 'Repozitár ešte neexistuje — spusti git init.' };
      const h = e.hlavaCommit();
      if (!h) return { ok: false, preco: 'Zatiaľ nemáš žiadny commit. Priprav zmeny cez git add . a ulož cez git commit -m "…".' };
      const s = e.stav.commity[h].strom;
      if (!s['README.md'] || !s['app.py']) return { ok: false, preco: 'V commite chýba jeden zo súborov — použi git add . (bodka = všetko).' };
      return { ok: true };
    },
  },
  {
    id: 'g2', xp: 20, titul: 'Tri zóny Gitu',
    zadanie: 'Git má tri zóny: <b>pracovný adresár</b> → <b>staging</b> → <b>commit</b>. Zmeň obsah <code>app.py</code> (napr. <code>echo "print(\'ahoj\')" > app.py</code>), pozri <code>git status</code>, potom zmenu <b>priprav</b> — ale <b>zatiaľ ju necommituj</b>.',
    ciel: 'Zmena v <code>app.py</code> je v stagingu a čaká na commit',
    tipy: [
      'Súbor zmeníš v editore vpravo alebo príkazom <code>echo "text" > app.py</code>.',
      '<code>git status</code> ti ukáže sekciu „Changes not staged for commit".',
      'Do stagingu ju presunie <code>git add app.py</code> — potom bude v „Changes to be committed".',
    ],
    kontrola(e) {
      const z = e.zmeny();
      const pripr = z.pripravene.find(x => x.f === 'app.py');
      if (!pripr) {
        if (z.nepripravene.find(x => x.f === 'app.py')) {
          return { ok: false, preco: 'Zmenu už máš, ale ešte nie je v stagingu — pridaj ju cez git add app.py.' };
        }
        return { ok: false, preco: 'Zatiaľ si app.py nezmenil. Skús: echo "print(\'ahoj\')" > app.py' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g3', xp: 20, titul: 'Čo presne sa zmenilo',
    zadanie: 'Pred commitom sa vždy oplatí pozrieť, čo presne odovzdávaš. Zobraz rozdiel <b>pripravených</b> zmien a potom ich ulož commitom so zmysluplnou správou.',
    ciel: 'Použil si <code>git diff --staged</code> a máš aspoň dva commity',
    tipy: [
      'Nepripravené zmeny ukáže <code>git diff</code>, pripravené <code>git diff --staged</code>.',
      'Správa commitu má povedať PREČO, nie „zmeny" — napr. „uprav pozdrav v app.py".',
      'Riešenie: <code>git diff --staged</code> → <code>git commit -m "uprav pozdrav"</code>',
    ],
    kontrola(e) {
      if (!e.stav.historia.some(c => /^git\s+diff\s+--(staged|cached)/.test(c))) {
        return { ok: false, preco: 'Ešte si nepozrel pripravené zmeny cez git diff --staged.' };
      }
      if (Object.keys(e.stav.commity).length < 2) {
        return { ok: false, preco: 'Zmenu ešte treba uložiť druhým commitom.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g4', xp: 25, titul: 'Kľúče do repozitára nepatria',
    zadanie: 'Vytvor súbor <code>.env</code> s tajomstvom (napr. <code>echo "OPENAI_API_KEY=sk-tajne" > .env</code>) a potom sa postaraj, aby ho Git <b>ignoroval</b> — po <code>git add .</code> sa nesmie dostať do stagingu.',
    ciel: 'Existuje <code>.gitignore</code> so vzorom <code>.env</code> a <code>.env</code> nie je sledovaný',
    tipy: [
      'Git ignoruje to, čo je uvedené v súbore <code>.gitignore</code> — každý vzor na vlastnom riadku.',
      'Vytvor ho: <code>echo ".env" > .gitignore</code>',
      'Potom <code>git add .</code> a <code>git status</code> — <code>.env</code> sa už nesmie objaviť.',
    ],
    kontrola(e) {
      const gi = e.stav.subory['.gitignore'];
      if (!e.stav.subory['.env']) return { ok: false, preco: 'Súbor .env zatiaľ neexistuje — vytvor ho aj s nejakým „tajomstvom".' };
      if (!gi) return { ok: false, preco: 'Chýba súbor .gitignore.' };
      if (!gi.split('\n').map(r => r.trim()).includes('.env')) {
        return { ok: false, preco: 'V .gitignore ešte nie je riadok .env (pozor: musí byť na vlastnom riadku, bez komentára za ním).' };
      }
      if (e.stav.staging && e.stav.staging['.env'] !== undefined) {
        return { ok: false, preco: '.env sa dostal do stagingu — vyhoď ho: git restore --staged .env' };
      }
      const h = e.hlavaCommit();
      if (h && e.stav.commity[h].strom['.env'] !== undefined) {
        return { ok: false, preco: '.env sa už dostal do commitu! V realite by kľúč bol v histórii navždy — tu si daj reset a skús to znova.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g5', xp: 25, titul: 'Vetva a zlúčenie',
    zadanie: 'Vytvor vetvu <code>funkcia</code>, prepni sa na ňu, pridaj nový súbor a commitni ho. Potom sa vráť na <code>main</code> a vetvu do nej <b>zlúč</b>.',
    ciel: 'Na <code>main</code> je súbor z vetvy a obe vetvy ukazujú na ten istý commit',
    tipy: [
      'Vetvu vytvoríš a hneď sa na ňu prepneš: <code>git switch -c funkcia</code> (staršie: <code>git checkout -b</code>).',
      'Nový súbor: <code>echo "def pozdrav(): pass" > funkcia.py</code>, potom <code>git add .</code> a <code>git commit -m "…"</code>.',
      'Späť na main: <code>git switch main</code>, zlúčenie: <code>git merge funkcia</code>',
    ],
    kontrola(e) {
      if (e.stav.vetvy['funkcia'] === undefined) return { ok: false, preco: 'Vetva funkcia zatiaľ neexistuje.' };
      if (e.stav.HEAD.vetva !== 'main') return { ok: false, preco: 'Na zlúčenie sa musíš vrátiť na main: git switch main' };
      if (e.stav.vetvy['main'] !== e.stav.vetvy['funkcia']) {
        return { ok: false, preco: 'Vetva ešte nie je zlúčená do main — spusti git merge funkcia.' };
      }
      const s = e.stav.commity[e.stav.vetvy['main']].strom;
      if (Object.keys(s).length < 3) return { ok: false, preco: 'Na vetve si zabudol pridať a commitnúť nový súbor.' };
      return { ok: true };
    },
  },
  {
    id: 'g6', xp: 40, titul: 'Merge konflikt',
    zadanie: 'Toto je moment, ktorý väčšina ľudí prvýkrát zažije v strese. Vyrob konflikt zámerne: na vetve <code>oprava</code> zmeň <code>app.py</code> a commitni, potom na <code>main</code> zmeň <b>ten istý súbor inak</b> a commitni. Skús <code>git merge oprava</code>, prečítaj si značky v súbore, <b>vyber správnu verziu</b> a dokonči zlúčenie.',
    ciel: 'Konflikt je vyriešený, <code>app.py</code> už neobsahuje značky a existuje merge commit',
    tipy: [
      'Vytvor vetvu a zmeň súbor: <code>git switch -c oprava</code> → <code>echo "verzia A" > app.py</code> → <code>git add .</code> → <code>git commit -m "oprava"</code>',
      'Na main to isté inak: <code>git switch main</code> → <code>echo "verzia B" > app.py</code> → <code>git add .</code> → <code>git commit -m "main"</code> → <code>git merge oprava</code>',
      'Git vloží do súboru značky <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. Uprav súbor tak, aby ostala len správna verzia, potom <code>git add app.py</code> a <code>git commit -m "vyrieš konflikt"</code>.',
    ],
    kontrola(e) {
      if (!e.stav.vyriesilKonflikt) {
        if (e.stav.konflikt) return { ok: false, preco: `Konflikt je otvorený v súbore ${e.stav.konflikt.subory[0]} — uprav ho v editore a pridaj cez git add.` };
        return { ok: false, preco: 'Zatiaľ si žiadny konflikt nevyrobil ani nevyriešil. Zmeň ten istý súbor na dvoch vetvách a skús merge.' };
      }
      const obsah = e.stav.subory['app.py'] || '';
      if (/<<<<<<<|=======|>>>>>>>/.test(obsah)) {
        return { ok: false, preco: 'V app.py ešte ostali konfliktné značky — zmaž ich a nechaj len správnu verziu.' };
      }
      const h = e.hlavaCommit();
      if (!h || (e.stav.commity[h].rodicia || []).length < 2) {
        return { ok: false, preco: 'Chýba merge commit — po vyriešení konfliktu spusti git commit -m "vyrieš konflikt".' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g7', xp: 30, titul: 'Odlož rozrobené (stash)',
    zadanie: 'Rozrobil si zmenu a zrazu treba súrne opraviť niečo iné. Zmeň <code>README.md</code>, <b>odlož</b> zmenu bokom, over že pracovný adresár je čistý — a potom si ju <b>vráť späť</b>.',
    ciel: 'Zmena bola odložená cez stash a následne obnovená',
    tipy: [
      'Odloženie: <code>git stash</code> — pracovný adresár sa vráti do stavu posledného commitu.',
      'Zoznam odložených: <code>git stash list</code>. Kontrola: <code>git status</code>.',
      'Vrátenie: <code>git stash pop</code>',
    ],
    kontrola(e) {
      const h = e.stav.historia;
      if (!h.some(c => /^git\s+stash(\s|$)/.test(c) && !/pop|list|apply/.test(c))) {
        return { ok: false, preco: 'Ešte si nič neodložil — najprv zmeň README.md a spusti git stash.' };
      }
      if (!h.some(c => /^git\s+stash\s+(pop|apply)/.test(c))) {
        return { ok: false, preco: 'Odložené máš — teraz si zmenu vráť cez git stash pop.' };
      }
      const z = e.zmeny();
      if (!z.nepripravene.length && !z.pripravene.length) {
        return { ok: false, preco: 'Po git stash pop by mala byť zmena späť v pracovnom adresári. Skús to znova.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g8', xp: 30, titul: 'Vrátenie zmien: reset',
    zadanie: 'Sprav commit, ktorý tam nemal byť, a potom ho zruš cez <code>git reset --soft HEAD~1</code> — commit zmizne, ale <b>zmeny ti ostanú pripravené</b>. Pozri si <code>git status</code> aj <code>git log</code>, aby si videl rozdiel.',
    ciel: 'Použil si <code>reset --soft</code> a zmeny ostali v stagingu',
    tipy: [
      '<code>HEAD~1</code> znamená „o jeden commit späť".',
      '<code>--soft</code> = commit preč, zmeny ostanú pripravené · <code>--mixed</code> (default) = zmeny ostanú, ale nepripravené · <code>--hard</code> = <b>zmeny sa nenávratne zahodia</b>.',
      'Riešenie: sprav commit, potom <code>git reset --soft HEAD~1</code> a <code>git status</code>.',
    ],
    kontrola(e) {
      if (!e.stav.historia.some(c => /^git\s+reset\s+--soft/.test(c))) {
        return { ok: false, preco: 'Ešte si nepoužil git reset --soft HEAD~1.' };
      }
      const z = e.zmeny();
      if (!z.pripravene.length) {
        return { ok: false, preco: 'Po reset --soft majú zmeny ostať v stagingu — skús to na commite, ktorý naozaj niečo menil.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g9', xp: 30, titul: 'Bezpečné vrátenie: revert',
    zadanie: 'Na rozdiel od resetu <code>git revert</code> históriu neprepisuje — pridá <b>nový commit</b>, ktorý zmeny vráti späť. Preto je to jediná bezpečná možnosť, keď si už commit poslal ostatným. Commitni nejakú zmenu a potom ju revertni.',
    ciel: 'História obsahuje commit začínajúci <code>Revert</code> a pôvodný commit tam stále je',
    tipy: [
      'Najprv commitni zmenu (napr. <code>echo "chyba" > app.py</code>, <code>git add .</code>, <code>git commit -m "chybná zmena"</code>).',
      'Potom: <code>git revert HEAD</code>',
      'Pozri <code>git log --oneline</code> — uvidíš OBA commity: pôvodný aj revert.',
    ],
    kontrola(e) {
      if (!e.stav.pouzilRevert) return { ok: false, preco: 'Ešte si nepoužil git revert.' };
      const h = e.hlavaCommit();
      if (!h || !e.stav.commity[h].sprava.startsWith('Revert')) {
        return { ok: false, preco: 'Posledný commit nie je revert — skús git revert HEAD.' };
      }
      if (Object.keys(e.stav.commity).length < 3) {
        return { ok: false, preco: 'Potrebuješ pôvodný commit aj ten revertovací — pointa je, že história ostane celá.' };
      }
      return { ok: true };
    },
  },
  {
    id: 'g10', xp: 25, titul: 'Výlet do minulosti',
    zadanie: 'Prepni sa priamo na <b>starší commit</b> (jeho id nájdeš v <code>git log --oneline</code>). Git ťa upozorní na <b>detached HEAD</b> — pozri sa, ako vtedy vyzeral <code>app.py</code>, a potom sa vráť späť na <code>main</code>.',
    ciel: 'Bol si v detached HEAD a vrátil si sa na vetvu <code>main</code>',
    tipy: [
      'Id commitu zistíš cez <code>git log --oneline</code> (sedem znakov vľavo).',
      'Prepnutie: <code>git checkout &lt;id&gt;</code>. Súbory sa zmenia do vtedajšieho stavu — skús <code>cat app.py</code>.',
      'Návrat: <code>git switch main</code>',
    ],
    kontrola(e) {
      if (!e.stav.videlDetached) return { ok: false, preco: 'Ešte si sa neprepol na konkrétny commit (git checkout <id>).' };
      if (!e.stav.HEAD.vetva) return { ok: false, preco: 'Si stále v detached HEAD — vráť sa späť: git switch main' };
      return { ok: true };
    },
  },
  {
    id: 'g11', xp: 30, titul: 'Pošli to na server',
    zadanie: 'Priraď repozitáru vzdialený server (<code>origin</code>) a <b>pošli naň</b> vetvu <code>main</code> aj s nastavením sledovania. Potom over cez <code>git status</code>, že si zosúladený so serverom.',
    ciel: 'Remote <code>origin</code> existuje a má vetvu <code>main</code> na rovnakom commite ako lokálna',
    tipy: [
      'Pridanie: <code>git remote add origin https://github.com/ty/projekt.git</code>',
      'Prvé odoslanie s nastavením sledovania: <code>git push -u origin main</code>',
      'Kontrola: <code>git status</code> → „Your branch is up to date with \'origin/main\'".',
    ],
    kontrola(e) {
      if (!e.stav.remote) return { ok: false, preco: 'Zatiaľ nemáš remote — pridaj ho cez git remote add origin <url>.' };
      const lok = e.stav.vetvy['main'], vzd = e.stav.remote.vetvy['main'];
      if (vzd === undefined) return { ok: false, preco: 'Na server si ešte nič neposlal — skús git push -u origin main.' };
      if (lok !== vzd) return { ok: false, preco: 'Lokálna vetva je pred serverom — pošli zmeny znova cez git push.' };
      return { ok: true };
    },
  },
  {
    id: 'g12', xp: 25, titul: 'Poriadok vo vetvách',
    zadanie: 'Zlúčené vetvy sa majú mazať, inak sa v nich za mesiac nikto nevyzná. Vypíš zoznam vetiev a <b>zmaž všetky okrem <code>main</code></b>.',
    ciel: 'Existuje už len vetva <code>main</code> a si na nej',
    tipy: [
      'Zoznam vetiev: <code>git branch</code> (hviezdička označuje aktuálnu).',
      'Zmazanie: <code>git branch -d &lt;meno&gt;</code> — Git nedovolí zmazať vetvu, na ktorej práve stojíš.',
      'Ak si na inej vetve, najprv <code>git switch main</code>.',
    ],
    kontrola(e) {
      const mena = Object.keys(e.stav.vetvy);
      if (e.stav.HEAD.vetva !== 'main') return { ok: false, preco: 'Najprv sa prepni na main: git switch main' };
      if (mena.length > 1) return { ok: false, preco: `Ostávajú ešte vetvy: ${mena.filter(m => m !== 'main').join(', ')}` };
      if (!e.stav.historia.some(c => /^git\s+branch\s*$/.test(c.trim()))) {
        return { ok: false, preco: 'Vypíš si aj zoznam vetiev cez git branch.' };
      }
      return { ok: true };
    },
  },
];
