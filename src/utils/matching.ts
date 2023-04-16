import type { User } from "@prisma/client";

export const allPossiblePairs = <T>(elements: T[]) =>
  elements.flatMap((v, i) =>
    elements.slice(i + 1).flatMap(
      (w) =>
        [
          [v, w],
          [w, v],
        ] as const
    )
  );

export const allPossiblePairsExcept = <T>(
  elements: T[],
  excludedPairs: [T, T][]
) =>
  allPossiblePairs(elements).filter(
    ([a, b]) => !excludedPairs.some(([c, d]) => a === c && b === d)
  );

export const generateMatches = <T>(
  elements: T[],
  excludedPairs: [T, T][],
  options = { deterministic: false }
) => {
  // throw if the elements are not unique
  if (new Set(elements).size !== elements.length) {
    throw new Error("Elements must be unique");
  }

  // throw if the excluded pairs are not unique
  if (new Set(excludedPairs).size !== excludedPairs.length) {
    throw new Error("Excluded pairs must be unique");
  }

  if (!canGenerateMatches(elements, excludedPairs)) {
    throw new Error("Not enough elements to generate matches");
  }

  const pairs = allPossiblePairsExcept(elements, excludedPairs);

  if (pairs.length < 2)
    throw new Error("Not enough elements to generate matches");

  const matches = new Map<T, T>();
  const matchedElements = new Set<T>();

  if (!options.deterministic) {
    pairs.sort(() => Math.random() - 0.5);
  }

  for (const [a, b] of pairs) {
    if (!matches.has(a) && !matchedElements.has(b)) {
      matches.set(a, b);
      matchedElements.add(b);
    }
  }

  return Array.from(matches).sort();
};

// Efficiently check if there are enough elements to generate matches
// TODO: implement this
const canGenerateMatches = <T>(elements: T[], excludedPairs: [T, T][]) => {
  return true;
};
