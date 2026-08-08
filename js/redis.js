/* ============================================================
   REDIS PLAYGROUND — simulátor redis-cli
   Kľúče, TTL, čítače, zoznamy, hashe a sety. TTL beží v reálnom
   čase, takže expiráciu naozaj uvidíš.
   ============================================================ */
(function () {
  'use strict';

  function rozdel(riadok) {
    const von = [];
    let cur = '', q = null;
    for (const ch of riadok.trim()) {
      if (q) { if (ch === q) q = null; else cur += ch; }
      else if (ch === '"' || ch === "'") q = ch;
      else if (/\s/.test(ch)) { if (cur) { von.push(cur); cur = ''; } }
      else cur += ch;
    }
    if (cur) von.push(cur);
    return von;
  }

  function vyrobEngine() {
    const stav = {
      data: new Map(),        // kluc -> {typ, hodnota, expiruje|null}
      historia: [],
      pouziteTypy: new Set(), // pre misie: aké dátové typy si naozaj použil
    };

    const O = (text, cls) => ({ text, cls });
    const chyba = t => [O(t, 'err')];
    const OK = () => [O('OK', 'ok')];
    const cislo = n => [O(`(integer) ${n}`)];
    const nil = () => [O('(nil)', 'dim')];

    function upracExpirovane() {
      const teraz = Date.now();
      [...stav.data.entries()].forEach(([k, v]) => {
        if (v.expiruje && v.expiruje <= teraz) stav.data.delete(k);
      });
    }

    function daj(kluc, ocakavanyTyp) {
      upracExpirovane();
      const z = stav.data.get(kluc);
      if (!z) return null;
      if (ocakavanyTyp && z.typ !== ocakavanyTyp) return 'WRONGTYPE';
      return z;
    }

    function nastav(kluc, typ, hodnota, expiruje) {
      stav.data.set(kluc, { typ, hodnota, expiruje: expiruje ?? null });
      stav.pouziteTypy.add(typ);
    }

    const WRONGTYPE = () => chyba('(error) WRONGTYPE Operation against a key holding the wrong kind of value');

    function spusti(riadok) {
      const cely = riadok.trim();
      if (!cely) return [];
      stav.historia.push(cely);
      const t = rozdel(cely);
      const cmd = (t[0] || '').toUpperCase();
      const a = t.slice(1);
      upracExpirovane();

      const potrebuje = (n, tvar) => a.length < n
        ? chyba(`(error) ERR wrong number of arguments for '${cmd.toLowerCase()}' command` +
                (tvar ? `\nPoužitie: ${tvar}` : ''))
        : null;

      switch (cmd) {
        case 'HELP': case 'POMOC':
          return [
            O('Dostupné príkazy v Redis Playgrounde:', 'head'),
            O('  Reťazce:  SET kľúč hodnota [EX sekundy]  ·  GET kľúč  ·  DEL kľúč  ·  EXISTS kľúč'),
            O('  Expirácia: EXPIRE kľúč sekundy  ·  TTL kľúč  ·  PERSIST kľúč  ·  SETEX kľúč sek hodnota'),
            O('  Čítače:   INCR kľúč  ·  INCRBY kľúč n  ·  DECR kľúč'),
            O('  Zoznamy:  LPUSH/RPUSH kľúč hodnota…  ·  LRANGE kľúč 0 -1  ·  LPOP/RPOP  ·  LLEN'),
            O('  Hashe:    HSET kľúč pole hodnota  ·  HGET  ·  HGETALL  ·  HDEL'),
            O('  Množiny:  SADD kľúč člen…  ·  SMEMBERS  ·  SISMEMBER  ·  SCARD'),
            O('  Ostatné:  KEYS *  ·  TYPE kľúč  ·  DBSIZE  ·  FLUSHALL  ·  clear, reset'),
          ];

        /* ── reťazce ── */
        case 'SET': {
          const e = potrebuje(2, 'SET kľúč hodnota [EX sekundy]'); if (e) return e;
          let expiruje = null;
          const ix = a.findIndex(x => x.toUpperCase() === 'EX');
          if (ix !== -1) {
            const sek = parseInt(a[ix + 1], 10);
            if (isNaN(sek)) return chyba('(error) ERR value is not an integer or out of range');
            expiruje = Date.now() + sek * 1000;
          }
          nastav(a[0], 'string', a[1], expiruje);
          return OK();
        }
        case 'SETEX': {
          const e = potrebuje(3, 'SETEX kľúč sekundy hodnota'); if (e) return e;
          const sek = parseInt(a[1], 10);
          if (isNaN(sek) || sek <= 0) return chyba('(error) ERR invalid expire time in \'setex\' command');
          nastav(a[0], 'string', a[2], Date.now() + sek * 1000);
          return OK();
        }
        case 'GET': {
          const e = potrebuje(1, 'GET kľúč'); if (e) return e;
          const z = daj(a[0], 'string');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          return z ? [O(`"${z.hodnota}"`)] : nil();
        }
        case 'DEL': {
          const e = potrebuje(1, 'DEL kľúč'); if (e) return e;
          let n = 0;
          a.forEach(k => { if (stav.data.delete(k)) n++; });
          return cislo(n);
        }
        case 'EXISTS': {
          const e = potrebuje(1, 'EXISTS kľúč'); if (e) return e;
          return cislo(a.filter(k => stav.data.has(k)).length);
        }
        case 'TYPE': {
          const e = potrebuje(1, 'TYPE kľúč'); if (e) return e;
          const z = daj(a[0]);
          return [O(z ? z.typ : 'none')];
        }

        /* ── expirácia ── */
        case 'EXPIRE': {
          const e = potrebuje(2, 'EXPIRE kľúč sekundy'); if (e) return e;
          const z = daj(a[0]);
          if (!z) return cislo(0);
          const sek = parseInt(a[1], 10);
          if (isNaN(sek)) return chyba('(error) ERR value is not an integer or out of range');
          z.expiruje = Date.now() + sek * 1000;
          return cislo(1);
        }
        case 'TTL': {
          const e = potrebuje(1, 'TTL kľúč'); if (e) return e;
          const z = daj(a[0]);
          if (!z) return cislo(-2);                    // kľúč neexistuje
          if (!z.expiruje) return cislo(-1);           // bez expirácie
          return cislo(Math.max(0, Math.ceil((z.expiruje - Date.now()) / 1000)));
        }
        case 'PERSIST': {
          const e = potrebuje(1, 'PERSIST kľúč'); if (e) return e;
          const z = daj(a[0]);
          if (!z || !z.expiruje) return cislo(0);
          z.expiruje = null;
          return cislo(1);
        }

        /* ── čítače ── */
        case 'INCR': case 'DECR': case 'INCRBY': case 'DECRBY': {
          const e = potrebuje(1, `${cmd} kľúč${cmd.endsWith('BY') ? ' n' : ''}`); if (e) return e;
          const z = daj(a[0], 'string');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          const krok = cmd.endsWith('BY') ? parseInt(a[1], 10) : 1;
          if (isNaN(krok)) return chyba('(error) ERR value is not an integer or out of range');
          const znamienko = cmd.startsWith('DECR') ? -1 : 1;
          if (z) {
            if (!/^-?\d+$/.test(z.hodnota)) return chyba('(error) ERR value is not an integer or out of range');
            z.hodnota = String(parseInt(z.hodnota, 10) + znamienko * krok);
            return cislo(parseInt(z.hodnota, 10));
          }
          nastav(a[0], 'string', String(znamienko * krok), null);
          return cislo(znamienko * krok);
        }

        /* ── zoznamy ── */
        case 'LPUSH': case 'RPUSH': {
          const e = potrebuje(2, `${cmd} kľúč hodnota…`); if (e) return e;
          let z = daj(a[0], 'list');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z) { nastav(a[0], 'list', [], null); z = stav.data.get(a[0]); }
          a.slice(1).forEach(v => cmd === 'LPUSH' ? z.hodnota.unshift(v) : z.hodnota.push(v));
          return cislo(z.hodnota.length);
        }
        case 'LRANGE': {
          const e = potrebuje(3, 'LRANGE kľúč začiatok koniec (napr. 0 -1 = všetko)'); if (e) return e;
          const z = daj(a[0], 'list');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z) return [O('(empty array)', 'dim')];
          let od = parseInt(a[1], 10), po = parseInt(a[2], 10);
          const n = z.hodnota.length;
          if (od < 0) od = Math.max(0, n + od);
          if (po < 0) po = n + po;
          const vyrez = z.hodnota.slice(od, po + 1);
          return vyrez.length ? vyrez.map((v, i) => O(`${i + 1}) "${v}"`)) : [O('(empty array)', 'dim')];
        }
        case 'LPOP': case 'RPOP': {
          const e = potrebuje(1, `${cmd} kľúč`); if (e) return e;
          const z = daj(a[0], 'list');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z || !z.hodnota.length) return nil();
          const v = cmd === 'LPOP' ? z.hodnota.shift() : z.hodnota.pop();
          if (!z.hodnota.length) stav.data.delete(a[0]);
          return [O(`"${v}"`)];
        }
        case 'LLEN': {
          const e = potrebuje(1, 'LLEN kľúč'); if (e) return e;
          const z = daj(a[0], 'list');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          return cislo(z ? z.hodnota.length : 0);
        }

        /* ── hashe ── */
        case 'HSET': {
          const e = potrebuje(3, 'HSET kľúč pole hodnota'); if (e) return e;
          let z = daj(a[0], 'hash');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z) { nastav(a[0], 'hash', {}, null); z = stav.data.get(a[0]); }
          let nove = 0;
          for (let i = 1; i + 1 < a.length; i += 2) {
            if (!(a[i] in z.hodnota)) nove++;
            z.hodnota[a[i]] = a[i + 1];
          }
          return cislo(nove);
        }
        case 'HGET': {
          const e = potrebuje(2, 'HGET kľúč pole'); if (e) return e;
          const z = daj(a[0], 'hash');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          return z && a[1] in z.hodnota ? [O(`"${z.hodnota[a[1]]}"`)] : nil();
        }
        case 'HGETALL': {
          const e = potrebuje(1, 'HGETALL kľúč'); if (e) return e;
          const z = daj(a[0], 'hash');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z) return [O('(empty hash)', 'dim')];
          const von = [];
          Object.entries(z.hodnota).forEach(([p, h], i) => {
            von.push(O(`${i * 2 + 1}) "${p}"`));
            von.push(O(`${i * 2 + 2}) "${h}"`));
          });
          return von;
        }
        case 'HDEL': {
          const e = potrebuje(2, 'HDEL kľúč pole'); if (e) return e;
          const z = daj(a[0], 'hash');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z) return cislo(0);
          let n = 0;
          a.slice(1).forEach(p => { if (p in z.hodnota) { delete z.hodnota[p]; n++; } });
          return cislo(n);
        }

        /* ── množiny ── */
        case 'SADD': {
          const e = potrebuje(2, 'SADD kľúč člen…'); if (e) return e;
          let z = daj(a[0], 'set');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z) { nastav(a[0], 'set', [], null); z = stav.data.get(a[0]); }
          let n = 0;
          a.slice(1).forEach(v => { if (!z.hodnota.includes(v)) { z.hodnota.push(v); n++; } });
          return cislo(n);
        }
        case 'SMEMBERS': {
          const e = potrebuje(1, 'SMEMBERS kľúč'); if (e) return e;
          const z = daj(a[0], 'set');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          if (!z || !z.hodnota.length) return [O('(empty array)', 'dim')];
          return z.hodnota.map((v, i) => O(`${i + 1}) "${v}"`));
        }
        case 'SISMEMBER': {
          const e = potrebuje(2, 'SISMEMBER kľúč člen'); if (e) return e;
          const z = daj(a[0], 'set');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          return cislo(z && z.hodnota.includes(a[1]) ? 1 : 0);
        }
        case 'SCARD': {
          const e = potrebuje(1, 'SCARD kľúč'); if (e) return e;
          const z = daj(a[0], 'set');
          if (z === 'WRONGTYPE') return WRONGTYPE();
          return cislo(z ? z.hodnota.length : 0);
        }

        /* ── prehľad ── */
        case 'KEYS': {
          const vzor = a[0] || '*';
          const re = new RegExp('^' + vzor.replace(/[.+^${}()|[\]\\]/g, '\\$&')
            .replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
          const k = [...stav.data.keys()].filter(x => re.test(x)).sort();
          return k.length ? k.map((x, i) => O(`${i + 1}) "${x}"`)) : [O('(empty array)', 'dim')];
        }
        case 'DBSIZE': return cislo(stav.data.size);
        case 'FLUSHALL': case 'FLUSHDB': stav.data.clear(); return OK();
        case 'PING': return [O(a.length ? `"${a[0]}"` : 'PONG', 'ok')];
        case 'ECHO': return [O(`"${a.join(' ')}"`)];

        default:
          return chyba(`(error) ERR unknown command '${t[0]}'\nNapíš HELP pre zoznam príkazov.`);
      }
    }

    return {
      stav, spusti,
      // prehľad kľúčov pre bočný panel
      prehlad() {
        upracExpirovane();
        return [...stav.data.entries()].map(([k, v]) => ({
          kluc: k, typ: v.typ,
          nahlad: v.typ === 'string' ? v.hodnota
                : v.typ === 'list' ? `[${v.hodnota.length}] ${v.hodnota.slice(0, 3).join(', ')}`
                : v.typ === 'set' ? `{${v.hodnota.length}} ${v.hodnota.slice(0, 3).join(', ')}`
                : `${Object.keys(v.hodnota).length} polí`,
          ttl: v.expiruje ? Math.max(0, Math.ceil((v.expiruje - Date.now()) / 1000)) : null,
        })).sort((a, b) => a.kluc.localeCompare(b.kluc));
      },
      reset() {
        stav.data.clear();
        stav.historia.length = 0;
        stav.pouziteTypy.clear();
      },
    };
  }

  window.REDIS = { vyrobEngine };
})();
