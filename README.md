# Nomguzor (Номгузор) — Каталог таджикских имён

**Nomguzor** — современный веб-сервис и интерактивный справочник таджикских национальных имён. Проект помогает родителям осознанно выбирать красивые, благозвучные и традиционные имена для детей с подробным толкованием значений, этимологией и проверкой на соответствие официальному государственному реестру.

---

## 🌟 Основные возможности

- 🔍 **Умный нечёткий поиск (Fuzzy Search)**: поиск по имени, значению и корням слов на базе `Fuse.js`.
- 🚻 **Фильтрация по полу**: удобное переключение между категориями (Все / Мардона / Занона).
- 📜 **Официальный реестр**: маркировка имён, одобренных Комитетом по языку и терминологии и ЗАГС (САҲШ).
- ❤️ **Избранное (Favorites)**: сохранение понравившихся имён в локальное хранилище браузера (`localStorage` через Zustand с middleware `persist`).
- ⚡ **SSG (Static Site Generation)**: мгновенная предгенерация детальных страниц для каждого имени (`/name/[slug]`).
- 🎨 **Современный адаптивный UI**: стек Tailwind CSS v4, градиенты, чистая типографика и плавные микровзаимодействия.

---

## 🛠 Технологический стек

- **Фреймворк**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Стилизация**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`, `postcss`)
- **Состояние**: [Zustand](https://github.com/pmndrs/zustand) с сохранением состояния (`persist`)
- **Поиск**: [Fuse.js](https://fusejs.io/)
- **Иконки**: [Lucide React](https://lucide.dev/)
- **Утилиты**: `clsx`, `tailwind-merge`
- **Инструменты парсинга**: Python 3 (`scripts/parse_docx.py`)

---

## 📁 Структура проекта

```text
nomguzor/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Корневой лейаут (SEO Nomguzor, Header, Footer)
│   │   ├── page.tsx                  # Главная страница (поиск, фильтры, список)
│   │   ├── globals.css               # Стили с директивой @import "tailwindcss";
│   │   ├── favorites/
│   │   │   └── page.tsx              # Страница сохраненных имен
│   │   └── name/
│   │       └── [slug]/
│   │           ├── page.tsx          # Детальная страница имени (SSG)
│   │           └── FavoriteDetailButton.tsx # Интерактивная кнопка лайка
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Навбар с логотипом и счетчиком избранного
│   │   │   └── Footer.tsx            # Футер с копирайтом
│   │   ├── names/
│   │   │   ├── NameCard.tsx          # Карточка имени (значение, бейджи, лайк)
│   │   │   ├── NameList.tsx          # Сетка/список имен с пустыми состояниями
│   │   │   ├── NameSearch.tsx        # Поисковая строка с очисткой
│   │   │   └── GenderFilter.tsx      # Переключатель: Все / Мужские / Женские
│   │   └── ui/
│   │       ├── Button.tsx            # Базовые кнопки с вариантами
│   │       ├── Badge.tsx             # Бейджи для пола и реестра
│   │       └── Input.tsx             # Поле ввода с иконками
│   ├── data/
│   │   └── names.placeholder.json   # Тестовые данные (Рустам, Сиёвуш, Анора, Нигина)
│   ├── store/
│   │   └── useFavoritesStore.ts      # Zustand стор для избранного с persist (localStorage)
│   ├── types/
│   │   └── name.ts                   # Интерфейс NameItem
│   └── lib/
│       ├── utils.ts                  # Утилита cn (clsx + twMerge)
│       └── search.ts                 # Конфигурация Fuse.js
├── scripts/
│   └── parse_docx.py                 # Скрипт парсинга реестра names.docx в JSON
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Быстрый старт

### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/cozy-bit/nomguzor.git
cd nomguzor
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### 3. Сборка для продакшена

```bash
npm run build
npm run start
```

---

## 📄 Скрипт парсинга реестра имён

Для преобразования официального реестра из формата `.docx` в структурированный `JSON`:

```bash
pip install python-docx
python scripts/parse_docx.py --input names.docx --output src/data/names.json
```

---

## 📝 Лицензия

MIT License. Создано с уважением к таджикскому языку и национальным традициям.
