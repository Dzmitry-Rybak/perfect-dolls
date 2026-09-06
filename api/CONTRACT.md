# Контракт API

Фронтенд ждёт именно эти эндпоинты. Каждый соответствует функции
из `src/lib/api.js` — при подключении бэкенда меняются только тела
функций, сигнатуры остаются.

Базовый путь: `/api`. Формат: JSON, UTF-8.

---

## Каталог

### `GET /api/dolls`
Соответствует `getDolls({ category })`.

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `category` | string | `all` | `all` · `doll` · `arttoy` · `clothing` |

**200** — массив кукол:

```json
[{
  "id": 1,
  "slug": "mothwing",
  "name": "Мотылёк",
  "category": "doll",
  "price": 240,
  "status": "available",
  "height": 32,
  "year": 2026,
  "materials": ["хлопок", "винтажные пуговицы"],
  "tagline": "Ночная гостья с пыльцой на плечах",
  "story": "Сшита в две бессонные ночи…",
  "tags": ["мотылёк", "ночь"],
  "accent": "#C9BFD6"
}]
```

`status` — одно из `available` · `preorder` · `sold`.
`height` может быть `null` (для одежды).
`accent` — HEX, используется как акцентный цвет карточки.

### `GET /api/dolls/:slug`
Соответствует `getDoll(slug)`. **200** — один объект куклы, **404** — если нет.

### `GET /api/dolls?featured=true&limit=4`
Соответствует `getFeatured(limit)`. Работы для главной, без проданных.

### `GET /api/categories`
Соответствует `getCategories()`.

```json
[{ "id": "all", "label": "Все" }]
```

---

## Конструктор

### `GET /api/constructor/parts`
Соответствует `getConstructorParts()`.

```json
{
  "basePrice": 180,
  "layers": [{ "id": "body", "label": "Тело", "hint": "основа и оттенок ткани" }],
  "parts": {
    "body": [{ "id": "body-linen", "name": "Небелёный лён", "priceDelta": 0, "color": "#D8C9B4" }]
  }
}
```

Порядок `layers` = порядок отрисовки слоёв снизу вверх. Менять его на
бэкенде нельзя, не поправив `DollCanvas.jsx`: `id` деталей захардкожены
в SVG-компонентах.

### `POST /api/builds`
Соответствует `submitBuild(config)`.

**Тело:**

```json
{
  "body": "body-linen",
  "hair": "hair-bob",
  "eyes": "eyes-pearl",
  "mouth": "mouth-stitch",
  "outfit": "outfit-pinafore",
  "accessory": "acc-none"
}
```

**201:**

```json
{ "id": "build_m1x2y3", "status": "received", "config": { } }
```

Цену считать на сервере заново, а не брать с клиента.

---

## Контент

### `GET /api/gallery`
Соответствует `getGallery()`. `span` — размер плитки: `sm` · `wide` · `tall`.

```json
[{ "id": "g1", "title": "Пуговичная Луна", "year": 2025,
   "note": "Уехала в Гент", "accent": "#E8C46A", "span": "tall" }]
```

### `GET /api/faq`
Соответствует `getFaq()`.

```json
[{ "q": "Сколько ждать куклу на заказ?", "a": "От четырёх до восьми недель…" }]
```

---

## Ошибки

Единый формат, фронт уже умеет его показывать:

```json
{ "error": { "code": "NOT_FOUND", "message": "Кукла не найдена" } }
```

Коды: `400` валидация · `404` нет объекта · `409` уже продано · `500` прочее.
