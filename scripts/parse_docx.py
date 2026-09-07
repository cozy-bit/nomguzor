#!/usr/bin/env python3
"""
Nomguzor — DOCX Parser Script
==============================
Заготовка скрипта для извлечения и парсинга реестра таджикских имён
из официального документа names.docx в структурированный JSON-формат (NameItem).

Использование:
    python scripts/parse_docx.py --input names.docx --output src/data/names.json

Требования:
    pip install python-docx
"""

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Optional, Any


# Таблица транслитерации таджикских букв для формирования slug
CYRILLIC_TO_LATIN = {
    "а": "a", "б": "b", "в": "v", "г": "g", "ғ": "gh", "д": "d", "е": "e",
    "ё": "yo", "ж": "zh", "з": "z", "и": "i", "ӣ": "i", "й": "y", "к": "k",
    "қ": "q", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r",
    "с": "s", "т": "t", "у": "u", "ӯ": "u", "ф": "f", "х": "kh", "ҳ": "h",
    "ч": "ch", "ҷ": "j", "ш": "sh", "ъ": "", "э": "e", "ю": "yu", "я": "ya",
}


def slugify(text: str) -> str:
    """Генерация URL-friendly slug из таджикского имени."""
    text = text.lower().strip()
    latin_chars = []
    for char in text:
        if char in CYRILLIC_TO_LATIN:
            latin_chars.append(CYRILLIC_TO_LATIN[char])
        elif char.isalnum():
            latin_chars.append(char)
        elif char in (" ", "-", "_"):
            latin_chars.append("-")
    slug = "".join(latin_chars)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "unnamed"


def parse_paragraph_or_table_row(text: str, index: int) -> Optional[Dict[str, Any]]:
    """
    Парсит отдельную запись имени.
    Формат реестра обычно содержит: Название имени, пол, происхождение, значение.
    """
    cleaned = text.strip()
    if not cleaned or len(cleaned) < 2:
        return None

    # Шаблон разбора для строки вида: "ИМЯ — значение..."
    parts = re.split(r"[-—–:]", cleaned, maxsplit=1)
    name = parts[0].strip()
    meaning = parts[1].strip() if len(parts) > 1 else ""

    # Определение пола (эвристика для шаблона или метаданных)
    gender = "male"
    if any(suffix in name.lower() for suffix in ["а", "я", "моҳ", "бону", "гул", "почо"]):
        gender = "female"

    first_letter = name[0].upper() if name else ""

    return {
        "id": str(index),
        "slug": slugify(name),
        "name": name,
        "gender": gender,
        "meaning": meaning or "Маълумот дар бораи маъно дар ҳоли такмил аст.",
        "origin": "Форсӣ-тоҷикӣ",
        "inRegistry": True,
        "firstLetter": first_letter,
    }


def parse_docx(file_path: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """Извлечение текстового содержимого из .docx документа."""
    try:
        from docx import Document
    except ImportError:
        print("Ошибка: Библиотека 'python-docx' не установлена.")
        print("Установите её командой: pip install python-docx")
        sys.exit(1)

    if not os.path.exists(file_path):
        print(f"Ошибка: Файл '{file_path}' не найден.")
        return []

    doc = Document(file_path)
    entries: List[Dict[str, Any]] = []
    counter = 1

    # Чтение таблиц (если реестр оформлен таблицей)
    for table in doc.tables:
        for row in table.rows:
            row_text = " — ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
            item = parse_paragraph_or_table_row(row_text, counter)
            if item:
                entries.append(item)
                counter += 1
                if limit and len(entries) >= limit:
                    return entries

    # Чтение обычных абзацев
    if not entries:
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            item = parse_paragraph_or_table_row(text, counter)
            if item:
                entries.append(item)
                counter += 1
                if limit and len(entries) >= limit:
                    break

    return entries


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Парсер официального реестра таджикских имен (.docx -> .json)"
    )
    parser.add_argument(
        "--input", "-i",
        default="names.docx",
        help="Путь к входному .docx файлу (по умолчанию: names.docx)",
    )
    parser.add_argument(
        "--output", "-o",
        default="src/data/names.json",
        help="Путь к выходному .json файлу (по умолчанию: src/data/names.json)",
    )
    parser.add_argument(
        "--limit", "-l",
        type=int,
        default=None,
        help="Ограничение количества записей для тестового прогона",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        default=True,
        help="Форматировать JSON с отступами",
    )

    args = parser.parse_args()

    print(f"Начало обработки: {args.input}")
    items = parse_docx(args.input, limit=args.limit)

    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    indent = 2 if args.pretty else None

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=indent)

    print(f"Успешно обработано {len(items)} записей.")
    print(f"Результат сохранён в: {args.output}")


if __name__ == "__main__":
    main()
