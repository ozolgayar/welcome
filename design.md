# Design System — ГЕРОФАРМ Welcome Course

**Версия:** 1.0  
**Дата:** 2026  
**Назначение:** Welcome-курс для новых сотрудников ГЕРОФАРМ

---

## 1. Принципы дизайна

### 1.1 Основная идея
Курс передаёт дух компании через визуальный язык, основанный на фирменной айдентике ГЕРОФАРМ 2025: яркие градиенты, полупрозрачные стеклянные объёмы, мягкая фольга и сатин. Баланс между праздничностью (welcome) и спокойствием (читаемость длинного текста).

### 1.2 Ключевые принципы

**Воздух и пространство**  
Не заполняем экран до краёв. Контент центрируется в контейнерах с комфортной шириной для чтения (max 80ch для текста). Между блоками — достаточно воздуха для пауз и осмысления.

**Температурный баланс**  
Тёплые (оранжевый, красный) и холодные (фиолетовый, синий) цвета всегда присутствуют вместе. Монохромные блоки разрушают температурный баланс.

**Консистентность материалов**  
Если элемент — стеклянный, он стеклянный везде. Если маскот — сатин и фольга, он не превращается в пластик от сцены к сцене.

**Минимализм декора**  
Welcome — не конфетти. На экране не больше 2–3 декоративных элементов одновременно. Они дополняют, а не спорят с контентом.

**Доступность**  
Контраст текста на фоне не ниже WCAG AA (4.5:1 для основного текста, 3:1 для крупных заголовков). Кнопки имеют видимый focus state. Анимации не создают вестибулярного дискомфорта (без быстрых вспышек и тряски).

---

## 2. Цветовая палитра

### 2.1 Основные цвета бренда

```css
:root {
  /* Основная палитра */
  --color-passion:        #FF4729;  /* Страсть (тёплый красный) */
  --color-energy:         #FFA329;  /* Энергия (тёплый оранжевый) */
  --color-innovation:     #B44AFF;  /* Инновация (яркий фиолетовый) */
  --color-responsibility: #107DFF;  /* Ответственность (королевский синий) */
  --color-trust:          #005DE5;  /* Доверие (глубокий синий) */
  --color-sunlight:       #F9D816;  /* Солнечный свет (плоский жёлтый) */
  
  /* Нейтральные */
  --color-white:          #FFFFFF;
  --color-black:          #000000;
  --color-gray-50:        #F9FAFB;
  --color-gray-100:       #F3F4F6;
  --color-gray-200:       #E5E7EB;
  --color-gray-300:       #D1D5DB;
  --color-gray-600:       #4B5563;
  --color-gray-800:       #1F2937;
  --color-gray-900:       #111827;
}
```

### 2.2 Градиенты

**Радиальный фиолетовый (обложка, hero, завершение модуля):**
```css
background: radial-gradient(
  circle at 50% 50%,
  #B44AFF 0%,
  #8A38CC 50%,
  #5A1A8C 100%
);
```

**Линейный горизонтальный (полная палитра):**
```css
background: linear-gradient(
  90deg,
  #FFA329 0%,
  #FF4729 22%,
  #B44AFF 52%,
  #107DFF 78%,
  #005DE5 100%
);
```

**Фон контента (приглушённый фиолетовый):**
```css
background: linear-gradient(
  180deg,
  #EDE9F5 0%,
  #F9F7FC 100%
);
```

### 2.3 Применение цвета

- **Фон курса:** светло-серый (`--color-gray-50`) или приглушённый фиолетовый градиент
- **Карточки:** белые с тенью или полупрозрачные с backdrop blur
- **Текст основной:** `--color-gray-900`
- **Текст второстепенный:** `--color-gray-600`
- **Акценты (кнопки, ссылки):** `--color-passion` или `--color-innovation`
- **Состояние hover:** затемнение на 10% (filter: brightness(0.9))
- **Состояние focus:** обводка 3px solid с цветом акцента, offset 2px

---

## 3. Типографика

### 3.1 Шрифты

**Заголовки:** TT Commons Pro Expanded  
- Bold (700) для H1  
- Demibold (600) для H2  
- Regular (400) для H3–H6  

**Основной текст:** TT Commons Pro  
- Bold (700) для выделения  
- Demibold (600) для подзаголовков  
- Regular (400) для основного текста  

**Запасной стек:**
```css
font-family: "TT Commons Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", 
             Roboto, "Helvetica Neue", Arial, sans-serif;
```

### 3.2 Типографическая шкала

Используется модульная шкала с base 16px, ratio 1.25 (мажорная терция).

```css
:root {
  --font-size-xs:   0.64rem;   /* 10px */
  --font-size-sm:   0.8rem;    /* 13px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg:   1.25rem;   /* 20px */
  --font-size-xl:   1.563rem;  /* 25px */
  --font-size-2xl:  1.953rem;  /* 31px */
  --font-size-3xl:  2.441rem;  /* 39px */
  --font-size-4xl:  3.052rem;  /* 49px */
  --font-size-5xl:  3.815rem;  /* 61px */
  
  --line-height-tight:  1.2;
  --line-height-normal: 1.5;
  --line-height-loose:  1.8;
}
```

### 3.3 Применение

| Элемент | Размер | Начертание | Line-height | Применение |
|---------|--------|------------|-------------|------------|
| **H1** | `clamp(2.5rem, 5cqw, 3.815rem)` | Expanded Bold | 1.1 | Заголовок обложки |
| **H2** | `clamp(1.75rem, 3.5cqw, 2.441rem)` | Expanded Demibold | 1.2 | Начало раздела |
| **H3** | `var(--font-size-xl)` | Demibold | 1.3 | Подзаголовок блока |
| **Body L** | `var(--font-size-lg)` | Regular | 1.6 | Лид, важный текст |
| **Body** | `var(--font-size-base)` | Regular | 1.5 | Основной текст |
| **Body S** | `var(--font-size-sm)` | Regular | 1.4 | Подписи, вспомогательный текст |
| **Button** | `var(--font-size-base)` | Demibold | 1 | Кнопки |
| **Caption** | `var(--font-size-xs)` | Regular | 1.3 | Метки, мелкий текст |

**Правило `clamp()`:**  
На обложке и hero-блоках заголовки используют `clamp(min, preferred, max)` для плавного масштабирования без брейкпоинтов. Внутри контейнеров с `container-type: inline-size` используются `cqw` (container query width units).

---

## 4. Сетка и отступы

### 4.1 Базовая единица пространства

```css
:root {
  --space-unit: 8px;
  --space-1: calc(var(--space-unit) * 1);   /* 8px */
  --space-2: calc(var(--space-unit) * 2);   /* 16px */
  --space-3: calc(var(--space-unit) * 3);   /* 24px */
  --space-4: calc(var(--space-unit) * 4);   /* 32px */
  --space-5: calc(var(--space-unit) * 5);   /* 40px */
  --space-6: calc(var(--space-unit) * 6);   /* 48px */
  --space-8: calc(var(--space-unit) * 8);   /* 64px */
  --space-10: calc(var(--space-unit) * 10); /* 80px */
  --space-12: calc(var(--space-unit) * 12); /* 96px */
  --space-16: calc(var(--space-unit) * 16); /* 128px */
}
```

### 4.2 Сетка контейнеров

**Максимальные ширины:**
```css
:root {
  --container-xs:  480px;   /* Узкая колонка (манифест, цитаты) */
  --container-sm:  640px;   /* Читаемый текст */
  --container-md:  768px;   /* Основной контент */
  --container-lg:  1024px;  /* Карточки модулей */
  --container-xl:  1200px;  /* Обложка, широкие блоки */
  --container-2xl: 1440px;  /* Полная ширина на больших экранах */
}
```

**Внешние отступы контейнеров:**
```css
.container {
  margin-inline: auto;
  padding-inline: var(--space-3); /* 24px на мобильных */
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-4); /* 32px на планшетах */
  }
}

@media (min-width: 1024px) {
  .container {
    padding-inline: var(--space-6); /* 48px на десктопах */
  }
}
```

### 4.3 Вертикальные отступы между блоками

```css
:root {
  --section-gap-mobile:  var(--space-8);  /* 64px */
  --section-gap-tablet:  var(--space-10); /* 80px */
  --section-gap-desktop: var(--space-12); /* 96px */
}

.section + .section {
  margin-block-start: var(--section-gap-mobile);
}

@media (min-width: 768px) {
  .section + .section {
    margin-block-start: var(--section-gap-tablet);
  }
}

@media (min-width: 1024px) {
  .section + .section {
    margin-block-start: var(--section-gap-desktop);
  }
}
```

### 4.4 Колоночная сетка

Используется CSS Grid с автоматическими колонками и gap.

```css
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
}

.grid--2col {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
}

.grid--3col {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
}
```

**Смысл `minmax(min(100%, 280px), 1fr)`:**  
На узких экранах карточка занимает всю ширину (100%), на широких — минимум 280px, затем растягивается пропорционально (1fr). Контент никогда не выпадет за пределы родителя.

---

## 5. Адаптивность и защита от «разъезжания»

### 5.1 Брейкпоинты

```css
:root {
  --breakpoint-sm: 640px;   /* Мобильный → планшет */
  --breakpoint-md: 768px;   /* Планшет вертикальный */
  --breakpoint-lg: 1024px;  /* Планшет горизонтальный → десктоп */
  --breakpoint-xl: 1280px;  /* Десктоп → широкий десктоп */
  --breakpoint-2xl: 1536px; /* Широкий десктоп */
}
```

Используются через `@media (min-width: ...)` (mobile-first).

### 5.2 Container Queries для компонентов

Для компонентов, которые могут встраиваться в разные контексты (карточки, обложка), используются **container queries** вместо media queries. Это позволяет компонентам адаптироваться к ширине родителя, а не окна браузера.

```css
.card {
  container-type: inline-size;
  container-name: card;
}

.card__title {
  font-size: 3cqw; /* 3% от ширины .card */
}

@container card (min-width: 400px) {
  .card__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

**Правило:** если компонент может быть вложен в сайдбар, модальное окно или сетку — используйте container queries. Если компонент всегда занимает всю ширину окна (header, footer, обложка) — media queries.

### 5.3 Защита от переполнения

**Текст:**
```css
* {
  overflow-wrap: break-word; /* Разрывает длинные слова */
  hyphens: auto;             /* Переносы (требует lang="ru" на <html>) */
}

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance; /* Балансирует длину строк в заголовках (Safari 17.5+, Chrome 114+) */
}

p {
  max-width: 80ch; /* Ограничивает строку для читаемости */
}
```

**Изображения и медиа:**
```css
img, video, iframe, svg {
  max-width: 100%;
  height: auto;
  display: block;
}
```

**Карточки и контейнеры:**
```css
.card {
  min-width: 0; /* Позволяет flex/grid-элементу сжиматься ниже min-content */
}
```

**Предотвращение горизонтального скролла:**
```css
body {
  overflow-x: hidden; /* Только если элементы осознанно выходят за край (например, декоративные дудлы) */
}

* {
  box-sizing: border-box; /* Padding и border не увеличивают ширину */
}
```

### 5.4 Защита от плашки СДО сверху

Если платформа СДО добавляет fixed-панель сверху, контент может уехать под неё. Защита:

```css
:root {
  --header-offset: 0px; /* Переменная устанавливается JS при обнаружении панели */
}

body {
  padding-block-start: var(--header-offset);
  scroll-padding-top: var(--header-offset); /* Для корректного якорного скролла */
}

/* Если курс встраивается в iframe и управления нет, добавляем страховочный отступ */
@supports selector(:has(*)) {
  body:has(#lms-header) {
    padding-block-start: 64px; /* Предполагаемая высота панели СДО */
  }
}
```

**JS для автоматического определения:**
```js
// Определяем высоту чужой плашки и задаём переменную
const lmsHeader = document.querySelector('#lms-header, .platform-header, [data-lms-header]');
if (lmsHeader) {
  const height = lmsHeader.offsetHeight;
  document.documentElement.style.setProperty('--header-offset', `${height}px`);
}
```

### 5.5 Безопасная зона для важного контента

На мобильных экранах с вырезами (iPhone notch, Android punch-hole) используются `safe-area-inset-*`.

```css
body {
  padding-inline: max(var(--space-3), env(safe-area-inset-left));
  padding-inline-end: max(var(--space-3), env(safe-area-inset-right));
  padding-block-start: max(var(--header-offset), env(safe-area-inset-top));
  padding-block-end: max(var(--space-3), env(safe-area-inset-bottom));
}
```

---

## 6. Компоненты

### 6.1 Кнопки

**Первичная кнопка (CTA):**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: "TT Commons Pro", sans-serif;
  font-weight: 600;
  font-size: var(--font-size-base);
  line-height: 1;
  color: var(--color-white);
  background: var(--color-passion);
  border: none;
  border-radius: 999px; /* Полное скругление */
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary:hover {
  filter: brightness(0.9);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:focus-visible {
  outline: 3px solid var(--color-passion);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Вторичная кнопка (стеклянная):**
```css
.btn-secondary {
  /* Всё то же самое, но фон полупрозрачный */
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--color-white);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
}
```

**Размеры:**
```css
.btn--sm { padding: var(--space-1) var(--space-3); font-size: var(--font-size-sm); }
.btn--lg { padding: var(--space-3) var(--space-6); font-size: var(--font-size-lg); }
```

### 6.2 Карточки

**Базовая карточка:**
```css
.card {
  background: var(--color-white);
  border-radius: 24px;
  padding: var(--space-4);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  container-type: inline-size;
  min-width: 0;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-5);
  }
}
```

**Стеклянная карточка (для насыщенных фонов):**
```css
.card--glass {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 6.3 Обложка курса

**Структура:**
```html
<section class="cover" style="--aspect-ratio: 16/9;">
  <div class="cover__bg"></div>
  <div class="cover__content">
    <span class="cover__badge">Курс</span>
    <h1 class="cover__title">Добро пожаловать<br>в ГЕРОФАРМ</h1>
    <p class="cover__subtitle">Всё, что нужно знать в первые дни</p>
    <button class="btn-secondary btn--lg cover__cta">Начать курс</button>
  </div>
  <img src="/assets/mascot.png" alt="" class="cover__mascot" aria-hidden="true">
  <svg class="cover__doodle cover__doodle--brain" aria-hidden="true">...</svg>
  <svg class="cover__doodle cover__doodle--hand" aria-hidden="true">...</svg>
  <!-- остальные дудлы -->
</section>
```

**Стили:**
```css
.cover {
  position: relative;
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  aspect-ratio: var(--aspect-ratio, 16/9);
  border-radius: 24px;
  overflow: hidden;
  container-type: inline-size;
  container-name: cover;
}

.cover__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #FFA329 0%, #FF4729 22%, #B44AFF 52%, #107DFF 78%, #005DE5 100%);
  z-index: 0;
}

.cover__content {
  position: absolute;
  left: 5%;
  top: 17%;
  z-index: 3;
  color: var(--color-white);
  max-width: 50%;
}

.cover__badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--color-white);
  color: var(--color-gray-900);
  border-radius: 999px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-block-end: var(--space-2);
}

.cover__title {
  font-family: "TT Commons Pro Expanded", sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5cqw, 3.815rem);
  line-height: 1.1;
  margin-block-end: var(--space-2);
}

.cover__subtitle {
  font-size: clamp(1rem, 2cqw, 1.25rem);
  line-height: 1.4;
  margin-block-end: var(--space-4);
  opacity: 0.95;
}

.cover__mascot {
  position: absolute;
  left: 50%;
  top: 12%;
  width: 28%;
  height: auto;
  z-index: 2;
}

.cover__doodle {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.cover__doodle--brain { left: 30%; top: 8%; width: 10%; }
.cover__doodle--hand { left: 44%; top: 50%; width: 8%; }
.cover__doodle--heart { right: 12%; top: 33%; width: 7%; }
.cover__doodle--spiral { right: -6%; top: -8%; width: 20%; }

/* Мобильная версия: вертикальная компоновка */
@container cover (max-width: 700px) {
  .cover {
    aspect-ratio: 3/4;
  }
  
  .cover__bg {
    background: linear-gradient(180deg, #FFA329 0%, #FF4729 25%, #B44AFF 50%, #107DFF 75%, #005DE5 100%);
  }
  
  .cover__content {
    left: 50%;
    top: 55%;
    transform: translateX(-50%);
    max-width: 85%;
    text-align: center;
  }
  
  .cover__mascot {
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    width: 60%;
  }
  
  .cover__doodle--brain,
  .cover__doodle--hand,
  .cover__doodle--spiral {
    display: none; /* Прячем лишние дудлы */
  }
  
  .cover__doodle--heart {
    right: 5%;
    bottom: 10%;
    top: auto;
    width: 12%;
  }
}
```

### 6.4 Плашка с плавающей тенью (bento-стиль)

```css
.bento-card {
  background: var(--color-white);
  border-radius: 32px;
  padding: var(--space-6);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 20px 40px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
              box-shadow 0.4s ease;
}

.bento-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.12);
}
```

---

## 7. Декоративные элементы

### 7.1 Полупрозрачные стеклянные объекты

Используются на насыщенных градиентных фонах. Генерируются на чёрном фоне и вставляются с `mix-blend-mode: screen`.

```css
.glass-deco {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.7;
  z-index: 1;
}
```

**Типы элементов:**
- Тонкая изогнутая лента (спираль) с переливом оранжевый → фиолетовый → синий
- Капля с оранжевым свечением
- Линза с синим свечением
- Мелкие белые точки-частицы

**Правило:** не больше 2–3 объектов на экран. Они располагаются по диагонали от основного контента, не перекрывают текст.

### 7.2 Дудлы (белые линейные иконки)

SVG с белой обводкой (`stroke: #FFFFFF; fill: none; stroke-width: 3`). Используются на обложке и в качестве мелких акцентов.

```css
.doodle {
  position: absolute;
  pointer-events: none;
  opacity: 0.8;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}
```

**Библиотека дудлов:** мозг, рука, сердце, спираль, колба, чашка Петри.

### 7.3 Маскот

**Материалы:** тёплое белое сатиновое тело, оранжевая фольга (маска, шарф, плащ снаружи), фиолетовая подкладка плаща, синие ноги.

**Форматы:**
- Статичный PNG с прозрачным фоном
- Анимированный WebM + MOV (HEVC) с альфа-каналом (машет рукой, плащ развивается)

**Вставка анимированного:**
```html
<video autoplay muted playsinline loop class="mascot">
  <source src="/assets/mascot.mov" type='video/mp4; codecs="hvc1"'>
  <source src="/assets/mascot.webm" type="video/webm">
</video>
```

**Позиционирование:** справа или по центру, не перекрывает текст, размер 25–35% от высоты контейнера.

---

## 8. Анимации и переходы

### 8.1 Общие правила

- Все анимации должны уважать `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Переходы короткие (0.2–0.4s), плавные (ease, ease-out, cubic-bezier)
- Анимации не мешают взаимодействию: кнопка не двигается под пальцем
- Анимации при загрузке запускаются один раз, не мешают скроллу

### 8.2 Fade-in при загрузке

```css
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 8.3 Hover-эффекты

**Карточки:** лёгкий подъём + увеличение тени  
**Кнопки:** затемнение + масштабирование при клике  
**Ссылки:** подчёркивание появляется снизу вверх

```css
.link {
  position: relative;
  text-decoration: none;
  color: var(--color-passion);
}

.link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 8.4 Анимация маскота

При загрузке обложки маскот появляется с задержкой и машет один раз, затем остаётся статичным или зацикленное лёгкое «дыхание» (масштаб 1.0 → 1.02 → 1.0 за 3s).

```css
.mascot {
  animation: mascotAppear 0.8s ease-out 0.3s backwards;
}

@keyframes mascotAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

## 9. Доступность (A11y)

### 9.1 Контраст

- Основной текст на белом: серый не светлее `#4B5563` (контраст 7:1)
- Текст на цветном фоне: только белый или очень тёмный, контраст проверяется через WebAIM Contrast Checker
- Кнопки: фон и текст проверяются отдельно

### 9.2 Фокус

Все интерактивные элементы (кнопки, ссылки, поля ввода) имеют видимый `focus-visible`:

```css
*:focus-visible {
  outline: 3px solid var(--color-innovation);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 9.3 Семантика

- Заголовки идут по порядку (H1 → H2 → H3, без пропусков)
- Декоративные изображения имеют `alt=""` и `aria-hidden="true"`
- Интерактивные элементы имеют понятные имена (кнопка «Начать курс», а не «Далее»)
- Используются HTML5-теги: `<main>`, `<section>`, `<article>`, `<nav>`, `<aside>`

### 9.4 Читаемость

- Максимальная ширина строки текста: 80 символов (80ch)
- Минимальный размер кликабельной области: 44×44px (WCAG 2.2 AA)
- Интерлиньяж (line-height) основного текста: минимум 1.5

---

## 10. Технические требования

### 10.1 Поддержка браузеров

- Chrome 114+
- Firefox 115+
- Safari 17+
- Edge 114+

Graceful degradation для старых версий: работает без container queries и `text-wrap: balance`, но вёрстка не ломается.

### 10.2 Оптимизация

- Шрифты загружаются через `font-display: swap`
- Критический CSS встроен в `<head>`
- Изображения маскота и иконок в WebP + PNG fallback
- Видео маскота сжато до 2–3 МБ, формат WebM (VP9) + MOV (HEVC)
- SVG-дудлы минифицированы, без `<title>` и `<desc>` внутри (эти роли берёт на себя `aria-hidden="true"`)

### 10.3 Формат файлов

```
/public
  /assets
    /fonts
      TT-Commons-Pro-Expanded-Bold.woff2
      TT-Commons-Pro-Expanded-Demibold.woff2
      TT-Commons-Pro-Bold.woff2
      TT-Commons-Pro-Demibold.woff2
      TT-Commons-Pro-Regular.woff2
    /images
      mascot.png              (статичный маскот, прозрачный фон)
      mascot.webm             (анимированный маскот, WebM+alpha)
      mascot.mov              (анимированный маскот, HEVC+alpha)
      logo-25.svg             (логотип «25 ГЕРОФАРМ»)
      logo-knot.svg           (четырёхпетлевой узел, отдельно)
    /doodles
      doodle-brain.svg
      doodle-hand.svg
      doodle-heart.svg
      doodle-spiral.svg
      doodle-flask.svg
      doodle-petri.svg
    /glass-elements
      glass-ribbon.png        (лента с переливом, чёрный фон)
      glass-drop.png          (капля, чёрный фон)
      glass-lens.png          (линза, чёрный фон)
```

---

## 11. Чек-лист перед запуском

- [ ] Все интерактивные элементы имеют `focus-visible`
- [ ] Контраст текста проверен (WCAG AA минимум)
- [ ] Курс открывается на мобильном (375px ширина) без горизонтального скролла
- [ ] Курс работает при наличии плашки СДО высотой 60–80px сверху
- [ ] Шрифты загружены и применяются корректно
- [ ] Маскот на прозрачном фоне, без зелёного ореола
- [ ] Видео маскота зациклено без дёрганья на стыке
- [ ] Карточки не ломаются при длинных заголовках
- [ ] `lang="ru"` установлен на `<html>` для переносов
- [ ] `prefers-reduced-motion` отключает все анимации

---

## 12. Референсы и вдохновение

- **Материалы:** фирменный ролик к 25-летию ГЕРОФАРМ (фольга, сатин, стекло)
- **Палитра:** брендбук ГЕРОФАРМ Transformation Brand Identity ©2025
- **Вёрстка:** Notion (карточки), Linear (bento-сетка), Stripe (градиенты)
- **Типографика:** модульная шкала 1.25, TT Commons Pro

---

## Примечания

Этот документ — живой. При обнаружении новых кейсов (например, вложенность курса в сторонний LMS с неожиданной вёрсткой) добавляйте правила сюда, чтобы следующие экраны учитывали опыт предыдущих.

Cursor должен читать этот файл перед каждой генерацией компонента. Все переменные CSS, отступы, размеры шрифтов и цвета берутся отсюда, а не придумываются заново.
