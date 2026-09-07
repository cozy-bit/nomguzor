#!/usr/bin/env python3
"""
Nomguzor — DOCX Parser Script
==============================
Парсер официального государственного реестра таджикских имён
из документа Word (.docx) в формат JSON (src/data/names.json).

Использование:
    python scripts/parse_docx.py
"""

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Optional, Any


def format_title_case(text: str) -> str:
    """
    Преобразует строку в Title Case с корректным регистром таджикских букв (Ғ, Ӣ, Қ, Ӯ, Ҳ, Ҷ).
    Корректно обрабатывает дефисы (напр. Гул-Баҳор) и пробелы.
    """
    cleaned = text.strip()
    if not cleaned:
        return ""

    tokens = re.split(r"([ \-])", cleaned)
    formatted = []
    for token in tokens:
        if token in (" ", "-"):
            formatted.append(token)
        elif token:
            formatted.append(token.capitalize())
    return "".join(formatted)


def slugify(text: str) -> str:
    """Генерация URL-friendly латинского slug."""
    text = text.lower().strip()
    # Удаление апострофов и кавычек
    text = re.sub(r"['`’ʻʼ\"]", "", text)
    # Замена спецсимволов и пробелов на дефис
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "name"


def find_default_input_file() -> str:
    """Поиск файла .docx в текущей папке или папке scripts/."""
    candidates = [
        os.path.join("scripts", "Замима ба № 98 от 26.02.2026 (1).docx"),
        "Замима ба № 98 от 26.02.2026 (1).docx",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c

    # Поиск по шаблону
    for root in ["scripts", "."]:
        if os.path.exists(root):
            for fname in os.listdir(root):
                if fname.endswith(".docx") and "98" in fname:
                    return os.path.join(root, fname)

    return os.path.join("scripts", "Замима ба № 98 от 26.02.2026 (1).docx")


def parse_docx_registry(file_path: str) -> List[Dict[str, Any]]:
    """Парсинг официального реестра имён из docx."""
    try:
        from docx import Document
    except ImportError:
        print("Ошибка: Библиотека 'python-docx' не установлена.")
        print("Выполните: pip install python-docx")
        sys.exit(1)

    if not os.path.exists(file_path):
        print(f"Ошибка: Файл '{file_path}' не найден.")
        sys.exit(1)

    doc = Document(file_path)
    items: List[Dict[str, Any]] = []
    seen_slugs: Dict[str, int] = {}
    counter = 1

    current_gender = "female"

    for t_idx, table in enumerate(doc.tables):
        if t_idx == 0:
            current_gender = "female"
        else:
            current_gender = "male"

        for row in table.rows:
            # Получение уникальных ячеек (устранение дублирования при объединении ячеек)
            unique_cells = []
            for c in row.cells:
                if c._tc not in [uc._tc for uc in unique_cells]:
                    unique_cells.append(c)

            texts = [c.text.strip().replace("\n", " ") for c in unique_cells]
            row_str = " ".join(texts)

            # Проверка заголовков разделов
            if "НОМҲОИ ДУХТАРОНА" in row_str:
                current_gender = "female"
                continue
            if "НОМҲОИ ПИСАРОНА" in row_str:
                current_gender = "male"
                continue

            # Пропуск строк-шапок таблицы
            if "Тоҷикӣ" in texts or "Т/Р" in texts or "Овонавишти" in texts:
                continue

            # Пропуск одиночных разделителей по алфавиту (напр. 'А', 'Б')
            non_empty = [t for t in texts if t]
            if len(non_empty) <= 1 and (not non_empty or len(non_empty[0]) <= 2):
                continue

            # Извлечение таджикского написания и латинской транслитерации
            tajik_raw = ""
            latin_raw = ""

            if len(texts) >= 4:
                # Стандартный формат строки: ['', 'ТАДЖИКСКОЕ_ИМЯ', 'КИРИЛЛИЦА', 'ЛАТИНИЦА']
                tajik_raw = texts[1]
                latin_raw = texts[3]
            elif len(texts) == 3:
                tajik_raw = texts[1]
                latin_raw = texts[2]
            else:
                for t in non_empty:
                    if re.search(r"[а-яёғӣқӯҳҷА-ЯЁҒӢҚӮҲҶ]", t):
                        if not tajik_raw:
                            tajik_raw = t
                    elif re.search(r"[a-zA-Z]", t):
                        if not latin_raw:
                            latin_raw = t

            # Проверка на строку-заголовок, если попалась
            if tajik_raw in ("Тоҷикӣ", "Овонавишти кириллӣ", "Овонавишти лотинӣ"):
                continue

            tajik_name = format_title_case(tajik_raw)
            translit = format_title_case(latin_raw)

            if not tajik_name:
                continue

            # Генерация уникального slug
            base_slug = slugify(latin_raw if latin_raw else tajik_raw)
            if not base_slug:
                base_slug = f"name-{counter}"

            if base_slug not in seen_slugs:
                slug = base_slug
                seen_slugs[base_slug] = 1
            else:
                seen_slugs[base_slug] += 1
                slug = f"{base_slug}-{seen_slugs[base_slug]}"

            first_letter = tajik_name[0].upper()

            item = {
                "id": str(counter),
                "slug": slug,
                "name": tajik_name,
                "gender": current_gender,
                "meaning": "",
                "origin": "Тоҷикӣ",
                "inRegistry": True,
                "firstLetter": first_letter,
                "translit": translit,
            }

            items.append(item)
            counter += 1

    return items


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser(
        description="Парсер официального реестра таджикских имён из DOCX в JSON"
    )
    parser.add_argument(
        "--input", "-i",
        default=None,
        help="Путь к файлу .docx (по умолчанию автопоиск файла реестра)",
    )
    parser.add_argument(
        "--output", "-o",
        default="src/data/names.json",
        help="Путь к выходному JSON файлу (по умолчанию: src/data/names.json)",
    )

    args = parser.parse_args()
    input_file = args.input or find_default_input_file()

    print(f"Парсинг реестра из: {input_file}")
    items = parse_docx_registry(input_file)

    output_path = args.output
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    total = len(items)
    males = sum(1 for i in items if i["gender"] == "male")
    females = sum(1 for i in items if i["gender"] == "female")

    print(f"Успешно обработано: {total} имён (Мужские: {males}, Женские: {females})")
    print(f"Файл сохранён: {output_path}")


if __name__ == "__main__":
    main()
