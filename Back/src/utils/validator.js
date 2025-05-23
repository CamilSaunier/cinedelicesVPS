/**
 * Vérifie si une valeur sous forme de chaîne représente un entier positif.
 * @param {string} value - La valeur à vérifier.
 * @returns {boolean} True si la valeur est un entier positif, false sinon.
 */
export function isPositiveInteger(value) {
  // Vérifie si la valeur est une chaîne de caractères et si elle ne contient que des chiffres
  return /^\d+$/.test(value);
}
