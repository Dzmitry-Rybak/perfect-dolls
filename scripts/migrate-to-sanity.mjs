/**
 * Разовый перенос содержимого сайта в Sanity.
 *
 * Источник правды — src/data/gallery.js и src/data/shopState.js: то,
 * что сейчас показывает сайт. Снимки берутся НЕ из public/art (там уже
 * уменьшенные до 675px копии), а из оригиналов в squidy/, dolls/ и
 * portrsits/ — чтобы CDN потом мог отдать и версию для retina.
 *
 * Скрипт можно запускать повторно: идентификаторы документов
 * детерминированы, повтор обновляет, а не плодит копии.
 *
 *   node scripts/migrate-to-sanity.mjs --dry     проверить, ничего не менять
 *   node scripts/migrate-to-sanity.mjs           перенести
 *
 * Токен читается из .env строкой SANITY_WRITE_TOKEN=...
 */
import { readFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, basename, extname } from 'node:path';
import { createClient } from '@sanity/client';
import { galleryItems } from '../src/data/gallery.js';
import { ORDERS } from '../src/data/shopState.js';

const DRY = process.argv.includes('--dry');
const ROOT = new URL('..', import.meta.url).pathname;

/** Длинная сторона загружаемого оригинала.
 *  В модалке снимок показывается максимум ~900px по высоте; 2400
 *  закрывает это с запасом даже на трёхкратной плотности экрана. */
const MAX_EDGE = 2400;

/* --- .env ----------------------------------------------------- */
function env(name) {
  if (process.env[name]) return process.env[name];
  const file = join(ROOT, '.env');
  if (!existsSync(file)) return null;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[1] === name) return m[2].replace(/^["']|["']$/g, '');
  }
  return null;
}

/* --- откуда какой снимок родом --------------------------------
   Имена в public/art я собирал, отсортировав каждую папку по имени
   файла: squidy/4 → squids/4-1, 4-2, 4-3. Здесь строим ту же карту
   в обратную сторону. */
const ls = (dir) =>
  readdirSync(join(ROOT, dir)).filter((f) => !f.startsWith('.')).sort();

function buildSourceMap() {
  const map = new Map();
  for (const [folder, prefix] of [['squidy', 'squids'], ['dolls', 'dolls']]) {
    for (const sub of ls(folder).filter((s) => /^\d+$/.test(s))) {
      ls(`${folder}/${sub}`).forEach((file, i) => {
        map.set(`/art/${prefix}/${sub}-${i + 1}.jpg`, join(ROOT, folder, sub, file));
      });
    }
  }
  ls('portrsits').forEach((file, i) => {
    map.set(`/art/portraits/${i + 1}.jpg`, join(ROOT, 'portrsits', file));
  });
  return map;
}

/* --- подготовка файла к загрузке ------------------------------
   HEIC браузеры не открывают, и Sanity его не принимает — переводим
   в JPEG. Заодно ограничиваем длинную сторону. */
function prepare(src, tmp) {
  const out = join(tmp, basename(src).replace(/\.[^.]+$/, '') + '.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90',
                        '-Z', String(MAX_EDGE), src, '--out', out], { stdio: 'ignore' });
  return out;
}

/* --- поехали --------------------------------------------------- */
const sources = buildSourceMap();
const shots = galleryItems.flatMap((w) => w.shots.map((s) => s.src));
const missing = shots.filter((s) => !sources.has(s));

console.log(`работ: ${galleryItems.length}, снимков: ${shots.length}`);
console.log(`оригиналы найдены: ${shots.length - missing.length} из ${shots.length}`);
if (missing.length) {
  console.error('НЕ НАЙДЕНЫ оригиналы:', missing.join(', '));
  process.exit(1);
}

if (DRY) {
  for (const w of galleryItems) {
    console.log(`  ${w.kind.padEnd(8)} ${w.title.padEnd(28)} ${w.shots.length} кадр(ов)`);
    for (const s of w.shots) {
      const src = sources.get(s.src);
      const dim = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', src])
        .toString().match(/\d+/g).slice(-2).join('x');
      console.log(`      ${s.src.padEnd(26)} ← ${src.replace(ROOT, '')} (${dim})`);
    }
  }
  console.log('\nпроверка без записи — ничего не отправлено');
  process.exit(0);
}

const token = env('SANITY_WRITE_TOKEN');
if (!token) {
  console.error('Нет SANITY_WRITE_TOKEN. Положите его в .env — см. шапку файла.');
  process.exit(1);
}

const client = createClient({
  projectId: 'jfxrdzrs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const tmp = mkdtempSync(join(tmpdir(), 'cs-migrate-'));
try {
  const tx = client.transaction();

  for (const [n, w] of galleryItems.entries()) {
    const uploaded = [];
    for (const shot of w.shots) {
      const file = prepare(sources.get(shot.src), tmp);
      const asset = await client.assets.upload('image', readFileSync(file), {
        filename: basename(file),
      });
      uploaded.push({
        _type: 'image',
        _key: shot.src.replace(/\W/g, ''),
        asset: { _type: 'reference', _ref: asset._id },
        alt: shot.alt,
      });
      process.stdout.write(`  ${w.title}: ${uploaded.length}/${w.shots.length}\r`);
    }
    tx.createOrReplace({
      _id: `work-${w.id}`,
      _type: 'work',
      kind: w.kind,
      title: w.title,
      ...(w.year ? { year: w.year } : {}),
      ...(w.note ? { note: w.note } : {}),
      order: (n + 1) * 10,
      shots: uploaded,
    });
    console.log(`  ${w.title.padEnd(28)} ${uploaded.length} кадр(ов) загружено`);
  }

  tx.createOrReplace({
    _id: 'settings',
    _type: 'settings',
    dollsOpen: ORDERS.dolls.open,
    dollsWindow: ORDERS.dolls.window,
    dollsNote: ORDERS.dolls.note,
    portraitsOpen: ORDERS.portraits.open,
    portraitsWindow: ORDERS.portraits.window,
    portraitsNote: ORDERS.portraits.note,
    squidsOpen: ORDERS.squids.open,
  });

  await tx.commit();
  console.log('\nготово');
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
