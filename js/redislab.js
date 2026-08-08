/* ============================================================
   REDIS PLAYGROUND — misie
   Nadväzujú na lekciu 40 (cache, rate limit) a lekciu 37 (limity).
   ============================================================ */
window.REDIS_MISIE = [
  {
    id: 'r1', xp: 15, titul: 'Kľúč a hodnota',
    zadanie: 'Redis je obrovský slovník v pamäti. Ulož pod kľúč <code>pozdrav</code> hodnotu <code>ahoj</code>, prečítaj ju späť a over, koľko kľúčov je v databáze.',
    ciel: 'Kľúč <code>pozdrav</code> existuje s hodnotou <code>ahoj</code>',
    tipy: [
      'Uloženie: <code>SET kľúč hodnota</code>',
      'Prečítanie: <code>GET pozdrav</code>. Počet kľúčov: <code>DBSIZE</code>.',
      'Riešenie: <code>SET pozdrav ahoj</code> → <code>GET pozdrav</code> → <code>DBSIZE</code>',
    ],
    kontrola(e) {
      const z = e.stav.data.get('pozdrav');
      if (!z) return { ok: false, preco: 'Kľúč pozdrav zatiaľ neexistuje.' };
      if (z.hodnota !== 'ahoj') return { ok: false, preco: `Kľúč má hodnotu "${z.hodnota}", má byť "ahoj".` };
      if (!e.stav.historia.some(c => /^GET\s+pozdrav/i.test(c))) return { ok: false, preco: 'Ešte si hodnotu neprečítal cez GET pozdrav.' };
      return { ok: true };
    },
  },
  {
    id: 'r2', xp: 25, titul: 'Cache, ktorá sama zmizne',
    zadanie: 'Toto je dôvod, prečo sa Redis používa na cache: ulož kľúč <code>cache:odpoved</code> s platnosťou <b>60 sekúnd</b> a over zostávajúci čas. Nič nemusíš mazať — Redis to spraví sám.',
    ciel: 'Kľúč <code>cache:odpoved</code> má nastavenú expiráciu a pozrel si si jeho TTL',
    tipy: [
      'Buď rovno pri ukladaní: <code>SET cache:odpoved "text" EX 60</code>, alebo <code>SETEX cache:odpoved 60 "text"</code>.',
      'Zostávajúci čas: <code>TTL cache:odpoved</code>',
      'Skús aj <code>TTL</code> na kľúč bez expirácie (vráti −1) a na neexistujúci (vráti −2).',
    ],
    kontrola(e) {
      const z = e.stav.data.get('cache:odpoved');
      if (!z) return { ok: false, preco: 'Kľúč cache:odpoved neexistuje (alebo už expiroval — skús znova).' };
      if (!z.expiruje) return { ok: false, preco: 'Kľúč nemá expiráciu — použi SET … EX 60 alebo SETEX.' };
      if (!e.stav.historia.some(c => /^TTL\s/i.test(c))) return { ok: false, preco: 'Over si zostávajúci čas cez TTL cache:odpoved.' };
      return { ok: true };
    },
  },
  {
    id: 'r3', xp: 30, titul: 'Rate limiter na vlastnej koži',
    zadanie: 'Postav si rate limiter presne ako v lekcii 40: zvýš čítač <code>rl:user-1</code> a hneď mu nastav platnosť 60 sekúnd. Potom čítač zvyšuj ďalej a sleduj, ako rastie — pri prekročení limitu by appka dopyt odmietla.',
    ciel: 'Kľúč <code>rl:user-1</code> je čítač s hodnotou aspoň 3 a má nastavenú expiráciu',
    tipy: [
      'Čítač zvyšuje <code>INCR rl:user-1</code> — ak kľúč neexistuje, začne od 1.',
      'Okno nastavíš hneď po prvom zvýšení: <code>EXPIRE rl:user-1 60</code>',
      'Zvýš ho ešte dvakrát a pozri <code>GET rl:user-1</code> aj <code>TTL rl:user-1</code>.',
    ],
    kontrola(e) {
      const z = e.stav.data.get('rl:user-1');
      if (!z) return { ok: false, preco: 'Čítač rl:user-1 neexistuje — vytvor ho cez INCR rl:user-1.' };
      if (parseInt(z.hodnota, 10) < 3) return { ok: false, preco: `Čítač je na ${z.hodnota} — zvýš ho aspoň na 3.` };
      if (!z.expiruje) return { ok: false, preco: 'Čítaču chýba okno — nastav EXPIRE rl:user-1 60.' };
      return { ok: true };
    },
  },
  {
    id: 'r4', xp: 25, titul: 'Prečo pevné okno pustí dvojnásobok',
    zadanie: 'Ukáž si slabinu z lekcie 40 naživo: nastav čítač <code>rl:test</code> s <b>veľmi krátkym oknom (2 sekundy)</b>, vyčerpaj ho na 3, počkaj kým expiruje (over cez <code>TTL</code>, kým nevráti −2) a potom <b>hneď</b> nabehni znova. Uvidíš, že hneď po hranici okna môžeš minúť celý limit odznova.',
    ciel: 'Čítač <code>rl:test</code> raz expiroval (TTL vrátilo −2) a znova beží od nízkej hodnoty',
    tipy: [
      '<code>INCR rl:test</code> → <code>EXPIRE rl:test 2</code> → ešte dvakrát <code>INCR</code>.',
      'Potom opakovane <code>TTL rl:test</code>, kým nevráti <code>-2</code> (kľúč zmizol).',
      'Nakoniec <code>INCR rl:test</code> — je znova na 1, hoci od predošlých troch prešli 2 sekundy. Práve preto sa pri prísnych limitoch používa posuvné okno cez sorted set.',
    ],
    kontrola(e) {
      const bolo = e.stav.historia.some(c => /^EXPIRE\s+rl:test/i.test(c));
      if (!bolo) return { ok: false, preco: 'Najprv vytvor čítač rl:test a daj mu krátke okno cez EXPIRE rl:test 2.' };
      if (!e.stav.historia.some(c => /^TTL\s+rl:test/i.test(c))) {
        return { ok: false, preco: 'Sleduj odpočet cez TTL rl:test, kým nevráti -2.' };
      }
      const z = e.stav.data.get('rl:test');
      if (!z) return { ok: false, preco: 'Kľúč expiroval — a teraz ho ešte raz zvýš cez INCR rl:test, nech vidíš, že začína odznova.' };
      if (z.expiruje) return { ok: false, preco: 'Nový čítač po expirácii nemá okno — presne to je tá diera. Nechaj ho tak a hotovo.' };
      return { ok: true };
    },
  },
  {
    id: 'r5', xp: 25, titul: 'História chatu ako zoznam',
    zadanie: 'Zoznamy sa hodia na poradie — napríklad na históriu správ. Do zoznamu <code>chat:session-1</code> pridaj <b>tri správy</b> na koniec a potom vypíš celý zoznam.',
    ciel: 'Zoznam <code>chat:session-1</code> má aspoň 3 položky',
    tipy: [
      'Na koniec pridáva <code>RPUSH</code>, na začiatok <code>LPUSH</code>.',
      'Naraz vieš pridať aj viac: <code>RPUSH chat:session-1 "ahoj" "ako sa mas" "dobre"</code>',
      'Výpis celého zoznamu: <code>LRANGE chat:session-1 0 -1</code> (−1 = po koniec).',
    ],
    kontrola(e) {
      const z = e.stav.data.get('chat:session-1');
      if (!z) return { ok: false, preco: 'Zoznam chat:session-1 neexistuje — vytvor ho cez RPUSH.' };
      if (z.typ !== 'list') return { ok: false, preco: 'chat:session-1 nie je zoznam — zmaž ho (DEL) a použi RPUSH.' };
      if (z.hodnota.length < 3) return { ok: false, preco: `Zoznam má ${z.hodnota.length} položky, treba aspoň 3.` };
      if (!e.stav.historia.some(c => /^LRANGE\s/i.test(c))) return { ok: false, preco: 'Vypíš zoznam cez LRANGE chat:session-1 0 -1.' };
      return { ok: true };
    },
  },
  {
    id: 'r6', xp: 25, titul: 'Profil používateľa ako hash',
    zadanie: 'Hash je „slovník v slovníku" — ideálny na objekt s poľami. Ulož do <code>user:1</code> polia <code>meno</code> a <code>plan</code> a vypíš celý hash naraz.',
    ciel: 'Hash <code>user:1</code> má aspoň polia <code>meno</code> a <code>plan</code>',
    tipy: [
      'Zápis: <code>HSET user:1 meno Martin plan pro</code> (dvojice pole–hodnota).',
      'Jedno pole: <code>HGET user:1 meno</code>. Všetko: <code>HGETALL user:1</code>.',
      'Výhoda oproti SET s JSON-om: zmeníš jedno pole bez načítania celého objektu.',
    ],
    kontrola(e) {
      const z = e.stav.data.get('user:1');
      if (!z) return { ok: false, preco: 'Kľúč user:1 neexistuje — vytvor ho cez HSET.' };
      if (z.typ !== 'hash') return { ok: false, preco: 'user:1 nie je hash — zmaž ho (DEL user:1) a použi HSET.' };
      if (!z.hodnota.meno || !z.hodnota.plan) return { ok: false, preco: 'V hashi chýba pole meno alebo plan.' };
      if (!e.stav.historia.some(c => /^HGETALL\s/i.test(c))) return { ok: false, preco: 'Vypíš celý hash cez HGETALL user:1.' };
      return { ok: true };
    },
  },
  {
    id: 'r7', xp: 25, titul: 'Zlý typ na kľúči',
    zadanie: 'Toto je chyba, ktorú v produkcii uvidíš: skús na kľúč typu <b>string</b> použiť príkaz pre zoznam (napr. <code>LPUSH</code> na kľúč <code>pozdrav</code>). Prečítaj si hlášku, potom si typ over cez <code>TYPE</code>.',
    ciel: 'Videl si chybu WRONGTYPE a použil <code>TYPE</code>',
    tipy: [
      'Skús <code>LPUSH pozdrav nieco</code> — <code>pozdrav</code> je string z prvej misie.',
      'Redis odpovie <code>WRONGTYPE Operation against a key holding the wrong kind of value</code>.',
      'Typ kľúča zistíš cez <code>TYPE pozdrav</code> (vráti <code>string</code>).',
    ],
    kontrola(e) {
      if (!e.stav.historia.some(c => /^TYPE\s/i.test(c))) {
        return { ok: false, preco: 'Ešte si nepoužil TYPE na overenie typu kľúča.' };
      }
      const skusil = e.stav.historia.some(c => /^(LPUSH|RPUSH|HSET|SADD|LRANGE|HGETALL|SMEMBERS)\s+pozdrav/i.test(c));
      if (!skusil) return { ok: false, preco: 'Skús zámerne použiť príkaz pre iný typ na kľúči pozdrav — napr. LPUSH pozdrav nieco.' };
      return { ok: true };
    },
  },
  {
    id: 'r8', xp: 30, titul: 'Prehľad a upratanie',
    zadanie: 'Vypíš všetky kľúče, ktoré začínajú na <code>cache:</code>, potom zisti celkový počet kľúčov a nakoniec databázu <b>úplne vyprázdni</b>.',
    ciel: 'Databáza je prázdna a použil si vzor v <code>KEYS</code>',
    tipy: [
      'Vzor: <code>KEYS cache:*</code> (hviezdička = čokoľvek).',
      'Počet: <code>DBSIZE</code>.',
      'Vyprázdnenie: <code>FLUSHALL</code>. V produkcii je to nebezpečný príkaz — tu si ho vyskúšaj pokojne.',
    ],
    kontrola(e) {
      if (!e.stav.historia.some(c => /^KEYS\s+\S*\*/i.test(c))) {
        return { ok: false, preco: 'Ešte si nepoužil KEYS so vzorom (napr. KEYS cache:*).' };
      }
      if (!e.stav.historia.some(c => /^DBSIZE/i.test(c))) return { ok: false, preco: 'Zisti počet kľúčov cez DBSIZE.' };
      if (e.stav.data.size > 0) return { ok: false, preco: `V databáze ostáva ${e.stav.data.size} kľúčov — vyprázdni ju cez FLUSHALL.` };
      return { ok: true };
    },
  },
];
