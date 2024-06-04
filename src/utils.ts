import { Shift } from "./types";

/**
 * Trim the string.
 * @param {str} str
 * @returns {string}
 */
export function trim(str: string): string {
  str = str || "";
  return str.replace(/^\s*|\s*$/g, "").replace(/\s+/g, " ");
}

/**
 * Find the character in the string.
 * @param {string} str
 * @param {string} toFind
 * @returns {boolean}
 */
export function find(str: string, toFind: string): boolean {
  for (let i = 0; i < str.length; i++) if (str[i] === toFind) return true;
  return false;
}

/**
 * Check if the character is a number digit.
 * @param {string} a
 * @returns {boolean}
 */
export function isDigit(a: string): boolean {
  const str = "0123456789";
  return find(str, a);
}

/**
 * Check if the character is a punctuation.
 * @param {string} a
 * @returns {boolean}
 */
export function isPunct(a: string): boolean {
  const str = ',.><?/+=-_}{[]*&^%$#@!~`"\\|:;()';
  return find(str, a);
}

/**
 * Check if the character is a vowel (a, e/è/é, i, o, u, ě/ê, ô, ā/ī/ū/ō).
 * @param {string} a
 * @returns {boolean}
 */
export function isVowel(a: string): boolean {
  const str = "AaEeÈèÉéIiOoUuÊêĚěĔĕṚṛXxôâāīūō";
  return find(str, a);
}

/**
 * Check if the character is a consonant.
 * @param {string} a
 * @returns {boolean}
 */
export function isConsonant(a: string): boolean {
  const str = "BCDfGHJKLMNPRSTVWYZbcdfghjklmnpqrstvwxyzḌḍṆṇṢṣṬṭŊŋÑñɲ"; //QXqx are special chars, add engma & enye
  return find(str, a);
}

/**
 * Check if the character is a special character (bikonsonan/cakra-pengkal/layar-cecak-wignyan/panjingan).
 * @param {string} a
 * @returns {boolean}
 */
export function isSpecial(a: string): boolean {
  const str = "GgHhRrYyñ"; //untuk bikonsonan th, dh, ng (nga dan cecak), ny, -r- (cakra), -y- (pengkal), jñ (ꦘ)
  return find(str, a);
}

/**
 * Check if the character is a cakra.
 * @param {string} a
 * @returns {boolean}
 */
export function isHR(a: string): boolean {
  const str = "HhRrŊŋ"; // for layar dan wignyan //1.3 dan cecak ([[:en:w:Engma]])
  return find(str, a);
}

/**
 * Check if the character is a panjingan.
 * @param {string} a
 * @returns {boolean}
 */
export function isLW(a: string): boolean {
  const str = "LlWw"; //untuk panjingan ("ng" dapat diikuti "g", "r"/cakra, "y"/pengkal, dan "w" atau "l"/panjingan)
  return find(str, a);
}

/**
 * Check if the character is a anuswara.
 * @param {string} a
 * @returns {boolean}
 */
export function isCJ(a: string): boolean {
  const str = "CcJj"; //untuk anuswara -nj- dan -nc-
  return find(str, a);
}

/**
 * Format the Shift data.
 * @param {unknown} data
 * @returns {Shift}
 */
export function formatShift(data: unknown): Shift {
  return data as Shift;
}

/**
 * Remove invisible characters from a string.
 * @param {string} str
 * @returns {string}
 */
export function removeInvisibleChars(str: string): string {
  return str.replace(/[\s\u00A0\u2000-\u200F\u2028-\u202F]/g, "");
}
