export function toSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export function hyphenateISBN(isbn: string): string {
  // Remove any non-digit characters
  const digits = isbn.replace(/[^0-9Xx]/g, '');

  if (digits.length === 13) {
    // ISBN-13 format: E.g., 9780306406157 → 978-0-306-40615-7
    return `${digits.slice(0, 3)}-${digits[3]}-${digits.slice(4, 7)}-${digits.slice(7, 12)}-${digits[12]}`;
  } else if (digits.length === 10) {
    // ISBN-10 format: E.g., 0306406152 → 0-306-40615-2
    return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 9)}-${digits[9]}`;
  } else {
    // Invalid length
    return isbn;
  }
}
