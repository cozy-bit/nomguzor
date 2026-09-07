export type OfficialFormatStyle = "suffix" | "izofat";

/**
 * Forms the Tajik surname from the father's name with the -зод / -зода suffix:
 * - -зод for males, -зода for females
 * - If the father's name ends with long ӣ (or Ӣ), it converts to regular и (or И):
 *   Алӣ -> Ализод / Ализода
 *   Саъдӣ -> Саъдизод / Саъдизода
 * - Otherwise simply appends the suffix:
 *   Ҷамшед -> Ҷамшедзод / Ҷамшедзода
 *   Сафар -> Сафарзод / Сафарзода
 */
export function formatTajikSurname(
  fatherName: string,
  gender: "male" | "female"
): string {
  const trimmed = fatherName.trim();
  if (!trimmed) return "";
  const suffix = gender === "male" ? "зод" : "зода";

  let base = trimmed;
  if (base.endsWith("ӣ")) {
    base = base.slice(0, -1) + "и";
  } else if (base.endsWith("Ӣ")) {
    base = base.slice(0, -1) + "И";
  }

  return `${base}${suffix}`;
}

/**
 * Attaches the izofat connector (-и / -ии) to a Tajik first name:
 * 1. If ends with long ӣ (or Ӣ):
 *    ӣ is replaced with ии:
 *    Алӣ -> Алии
 *    Саъдӣ -> Саъдии
 * 2. If ends with regular и (or И):
 *    и -> ии
 * 3. If ends with vowels (а, о, ӯ, е) or consonants:
 *    Appends -и:
 *    Анора -> Анораи
 *    Барно -> Барнои
 *    Рустам -> Рустами
 *    Фарҳод -> Фарҳоди
 */
export function formatTajikIzofatName(childName: string): string {
  const trimmed = childName.trim();
  if (!trimmed) return "";

  if (trimmed.endsWith("ӣ")) {
    return trimmed.slice(0, -1) + "ии";
  }
  if (trimmed.endsWith("Ӣ")) {
    return trimmed.slice(0, -1) + "ИИ";
  }

  if (trimmed.endsWith("и")) {
    return trimmed + "и";
  }
  if (trimmed.endsWith("И")) {
    return trimmed + "И";
  }

  return `${trimmed}и`;
}

/**
 * Formats full Tajik name according to the official national naming conventions:
 *
 * 1. Suffix mode ("suffix" - Бо пасванд -зод / -зода):
 *    Format: {ChildName} {FatherName + зод/зода}
 *    NO izofat is attached to child's name!
 *    Examples:
 *    - Алӣ + Ҷамшед (male) -> Алӣ Ҷамшедзод
 *    - Рустам + Алӣ (male) -> Рустам Ализод
 *    - Анора + Алӣ (female) -> Анора Ализода
 *
 * 2. Izofat mode ("izofat" - Изофатӣ):
 *    Format: {ChildName + izofat} {FatherName}
 *    Examples:
 *    - Алӣ + Ҷамшед (male) -> Алии Ҷамшед
 *    - Анора + Ҷамшед (female) -> Анораи Ҷамшед
 */
export function formatTajikFullName(
  childName: string,
  fatherName: string,
  gender: "male" | "female",
  type: "suffix" | "izofat"
): string {
  const cn = childName.trim();
  const fn = fatherName.trim();
  if (!cn) return "";
  if (!fn) return cn;

  if (type === "suffix") {
    const surname = formatTajikSurname(fn, gender);
    return `${cn} ${surname}`;
  } else {
    const izofatChild = formatTajikIzofatName(cn);
    return `${izofatChild} ${fn}`;
  }
}

/**
 * Formats name for passport style:
 * - Suffix mode: {Surname} {ChildName} (e.g. Ҷамшедзод Алӣ, Ализод Рустам, Ализода Анора)
 * - Izofat mode: {FatherName} {ChildName} (e.g. Ҷамшед Алӣ, Алӣ Рустам)
 */
export function formatTajikPassportName(
  childName: string,
  fatherName: string,
  gender: "male" | "female",
  type: "suffix" | "izofat"
): string {
  const cn = childName.trim();
  const fn = fatherName.trim();
  if (!cn) return "";
  if (!fn) return cn;

  if (type === "suffix") {
    const surname = formatTajikSurname(fn, gender);
    return `${surname} ${cn}`;
  } else {
    return `${fn} ${cn}`;
  }
}
