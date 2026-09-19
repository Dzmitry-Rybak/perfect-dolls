/**
 * Первое заполнение новых документов: «Главная» и «Страницы разделов».
 *
 * Ничего не загружает: снимки уже лежат в Sanity — скрипт только
 * ссылается на те же файлы, что и работы в архиве, вместе с точкой
 * обрезки, которую на них отметили. Поэтому он быстрый и его нельзя
 * запустить «второй раз не тем» — новых файлов не появится.
 *
 * Запускать можно повторно: поля заполняются только пустые
 * (setIfMissing), уже выбранное Маргаритой не трогается. Нужно
 * начать заново — сотрите поле в админке и запустите ещё раз.
 *
 *   node scripts/seed-home.mjs --dry     показать, что будет выбрано
 *   node scripts/seed-home.mjs           записать
 *
 * Токен читается из .env строкой SANITY_WRITE_TOKEN=...
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@sanity/client';

const DRY = process.argv.includes('--dry');
const ROOT = new URL('..', import.meta.url).pathname;

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

const token = env('SANITY_WRITE_TOKEN');
if (!token && !DRY) {
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

/* Работы в том же порядке, в каком их показывает сайт. */
const works = await client.fetch(`*[_type == "work"] | order(order asc, _createdAt desc){
  "id": _id, kind, title, "shot": shots[0]{ alt, asset, hotspot, crop }
}`);

const of = (kind) => works.filter((w) => w.kind === kind);

/** Картинка из первого кадра работы — вместе с точкой обрезки. */
const pictureOf = (work) => work && {
  _type: 'image',
  asset: { _type: 'reference', _ref: work.shot.asset._ref },
  ...(work.shot.hotspot ? { hotspot: work.shot.hotspot } : {}),
  ...(work.shot.crop ? { crop: work.shot.crop } : {}),
  alt: work.shot.alt,
};

/* Карточка раздела на главной: первая работа, при наведении — вторая.
   Ровно то, что до сих пор лежало в src/data/nav.js картинками из
   сборки, только теперь этот выбор можно поменять в админке. */
const cardOf = (kind) => {
  const [first, second] = of(kind);
  if (!first) return null;
  const card = { _type: 'homeCard', photo: pictureOf(first) };
  if (second) card.photoHover = pictureOf(second);
  return card;
};

/* Три работы на страницу раздела — те же три, что показывались
   и раньше: первые по полю «Порядок в галерее». */
const picksOf = (kind) =>
  of(kind).slice(0, 3).map((w) => ({
    _type: 'reference', _ref: w.id, _key: w.id.replace(/\W/g, ''),
  }));

/* Главное изображение — «пока любая кукла». Берём ту, где в кадре
   одна кукла целиком: рамка наверху узкая и высокая, пара в ней
   ужалась бы до двух половин. Нет такой — первая по порядку. */
const HERO_TITLE = 'Jalea';
const hero = of('doll').find((w) => w.title === HERO_TITLE) ?? of('doll')[0];

console.log(`работ в архиве: ${works.length}`);
console.log(`главное изображение: ${hero ? `${hero.title} (кукла)` : 'НЕ НАЙДЕНО'}`);
for (const [kind, title] of [['squid', 'Squids'], ['doll', 'Dolls'], ['portrait', 'Portraits']]) {
  const [a, b] = of(kind);
  console.log(`  ${title.padEnd(10)} карточка: ${a?.title ?? '—'}${b ? ` → ${b.title}` : ''}`);
  console.log(`  ${''.padEnd(10)} страница: ${of(kind).slice(0, 3).map((w) => w.title).join(', ') || '—'}`);
}

if (!hero) {
  console.error('В архиве нет ни одной куклы — сначала запустите migrate-to-sanity.mjs');
  process.exit(1);
}

if (DRY) {
  console.log('\nпроверка без записи — ничего не отправлено');
  process.exit(0);
}

await client.transaction()
  .createIfNotExists({ _id: 'home', _type: 'home' })
  .createIfNotExists({ _id: 'pages', _type: 'pages' })
  .patch('home', (p) => p.setIfMissing({
    heroPhoto: pictureOf(hero),
    squidsCard: cardOf('squid'),
    dollsCard: cardOf('doll'),
    portraitsCard: cardOf('portrait'),
  }))
  .patch('pages', (p) => p.setIfMissing({
    squidPicks: picksOf('squid'),
    dollPicks: picksOf('doll'),
    portraitPicks: picksOf('portrait'),
  }))
  .commit();

console.log('\nготово — «Главная» и «Страницы разделов» заполнены');
