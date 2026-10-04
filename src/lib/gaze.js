/**
 * Куда сейчас смотрит курсор — один источник на все глаза сразу.
 *
 * Глаз-пуговица встречается на странице два десятка раз: в списках,
 * в подвале, в блоке заказа. Если каждый заведёт свой слушатель и
 * будет сам мерить своё положение на каждом движении мыши, страница
 * начнёт заикаться — особенно на телефоне, где это ещё и греет
 * батарею впустую.
 *
 * Поэтому слушатель один. Он собирает подписчиков, а пересчёт делает
 * раз на кадр: между кадрами всё равно ничего не покажется, а событий
 * мышь присылает в разы больше.
 *
 * Прямоугольники глаз кешируются — иначе каждый вызывал бы перерасчёт
 * вёрстки, и двадцать глаз на каждое движение мыши дали бы двадцать
 * перерасчётов. Кеш сбрасывается при прокрутке и смене размера окна,
 * то есть ровно тогда, когда он и правда устарел.
 */

const eyes = new Set();
let pointer = null;     // { x, y } в координатах окна
let frame = 0;
let listening = false;

function measure() {
  for (const eye of eyes) eye.rect = null;
}

function tick() {
  frame = 0;
  if (!pointer) return;
  for (const eye of eyes) {
    if (!eye.rect) eye.rect = eye.el.getBoundingClientRect();
    const { rect } = eye;
    if (!rect.width) continue;
    const dx = pointer.x - (rect.left + rect.width / 2);
    const dy = pointer.y - (rect.top + rect.height / 2);
    /* Направление важно, расстояние — нет: глаз на другом конце
       страницы должен смотреть в ту же сторону так же уверенно,
       как соседний. Поэтому вектор нормируем, а не масштабируем. */
    const len = Math.hypot(dx, dy) || 1;
    eye.aim(dx / len, dy / len);
  }
}

function onMove(e) {
  pointer = { x: e.clientX, y: e.clientY };
  if (!frame) frame = requestAnimationFrame(tick);
}

/**
 * Подписать глаз. `aim(x, y)` получает единичный вектор на курсор.
 * Возвращает отписку.
 */
export function watchPointer(el, aim) {
  const eye = { el, aim, rect: null };
  eyes.add(eye);

  if (!listening) {
    listening = true;
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
  }

  return () => {
    eyes.delete(eye);
    if (eyes.size) return;
    listening = false;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', measure);
    window.removeEventListener('resize', measure);
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
  };
}
