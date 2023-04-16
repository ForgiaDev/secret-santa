import {
  allPossiblePairs,
  allPossiblePairsExcept,
  generateMatches,
} from "./matching";

describe("allPossiblePairs", () => {
  it("should return all possible pairs", () => {
    const pairs = allPossiblePairs([1, 2, 3]).sort();

    expect(pairs).toEqual([
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 2],
    ]);
  });

  it("should return an empty array if there are less than 2 elements", () => {
    expect(allPossiblePairs([1])).toEqual([]);
  });

  it("should return an empty array if there are no elements", () => {
    expect(allPossiblePairs([])).toEqual([]);
  });
});

describe("allPossiblePairsExcept", () => {
  it("should return all possible pairs except the excluded pairs", () => {
    const pairs = allPossiblePairsExcept(
      [1, 2, 3],
      [
        [1, 2],
        [3, 2],
      ]
    ).sort();

    expect(pairs).toEqual([
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 1],
    ]);
  });

  it("should return an empty array if there are less than 2 elements", () => {
    expect(allPossiblePairsExcept([1], [[1, 2]])).toEqual([]);
  });

  it("should return an empty array if there are no elements", () => {
    expect(allPossiblePairsExcept([], [[1, 2]])).toEqual([]);
  });
});

describe("generateMatches", () => {
  it("should return a map of matches", () => {
    const matches = generateMatches(
      [1, 2, 3, 4],
      [
        [1, 2],
        [3, 2],
      ],
      { deterministic: true }
    );

    expect(matches).toEqual([
      [1, 3],
      [2, 1],
      [3, 4],
      [4, 2],
    ]);
  });

  it("should throw an error if there are less than 2 elements", () => {
    expect(() => generateMatches([1], [[1, 2]])).toThrowError(
      "Not enough elements to generate matches"
    );
  });

  it("should throw an error if there are no elements", () => {
    expect(() => generateMatches([], [[1, 2]])).toThrowError(
      "Not enough elements to generate matches"
    );
  });

  it("should work with 1000 elements", () => {
    const elements = Array.from({ length: 1000 }, (_, i) => i);
    const toExclude: [number, number][] = [
      [0, 1],
      [2, 3],
      [4, 5],
    ];

    const matches = generateMatches(elements, toExclude);

    // Check that all elements are matched
    expect(matches.length).toBe(elements.length);

    // Check that no element is matched with itself
    expect(matches.every(([a, b]) => a !== b)).toBe(true);

    // Check that no element is matched with another element more than once
    expect(
      matches.every(
        ([a, b]) => matches.filter(([c, d]) => a === c || b === d).length === 1
      )
    ).toBe(true);

    // Check the first elements of the pairs are unique and total up to 1000
    expect(new Set(matches.map(([a]) => a)).size).toBe(elements.length);

    // Check the second elements of the pairs are unique and total up to 1000
    expect(new Set(matches.map(([, b]) => b)).size).toBe(elements.length);

    // Check that the excluded pairs are not matched
    expect(
      matches.every(([a, b]) => !toExclude.some(([c, d]) => a === c && b === d))
    ).toBe(true);
  });

  it("should work with 1000 elements and 1000 excluded pairs", () => {
    const elements = Array.from({ length: 1000 }, (_, i) => i);
    const toExclude: [number, number][] = Array.from(
      { length: 1000 },
      (_, i) => [i, i + 1 < elements.length ? i + 1 : 0]
    );

    const matches = generateMatches(elements, toExclude);

    // Check that all elements are matched
    expect(matches.length).toBe(elements.length);

    // Check that no element is matched with itself
    expect(matches.every(([a, b]) => a !== b)).toBe(true);

    // Check that no element is matched with another element more than once
    expect(
      matches.every(
        ([a, b]) => matches.filter(([c, d]) => a === c || b === d).length === 1
      )
    ).toBe(true);

    // Check the first elements of the pairs are unique and total up to 1000
    expect(new Set(matches.map(([a]) => a)).size).toBe(elements.length);

    // Check the second elements of the pairs are unique and total up to 1000
    expect(new Set(matches.map(([, b]) => b)).size).toBe(elements.length);

    // Check that the excluded pairs are not matched
    expect(
      matches.every(([a, b]) => !toExclude.some(([c, d]) => a === c && b === d))
    ).toBe(true);
  });

  it("should return a deterministic result", () => {
    const elements = Array.from({ length: 100 }, (_, i) => i);
    const toExclude: [number, number][] = [
      [0, 1],
      [2, 3],
      [4, 5],
    ];

    const matches1 = generateMatches(elements, toExclude, {
      deterministic: true,
    });
    const matches2 = generateMatches(elements, toExclude, {
      deterministic: true,
    });

    expect(matches1).toEqual(matches2);

    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);

    const matches3 = generateMatches(elements, toExclude, {
      deterministic: false,
    });

    expect(matches1).not.toEqual(matches3);

    const matches4 = generateMatches(elements, toExclude, {
      deterministic: false,
    });

    expect(matches3).toEqual(matches4);

    jest.spyOn(global.Math, "random").mockReturnValue(0.987654321);

    const matches5 = generateMatches(elements, toExclude, {
      deterministic: false,
    });

    expect(matches3).not.toEqual(matches5);
  });

  it("should work with 2000 elements", () => {
    const elements = Array.from({ length: 2000 }, (_, i) => i);

    const matches = generateMatches(elements, []);

    // Check that all elements are matched
    expect(matches.length).toBe(elements.length);

    // Check that no element is matched with itself
    expect(matches.every(([a, b]) => a !== b)).toBe(true);
  });

  it("should tell you if it's impossible to generate matches", () => {
    //TODO
  });
});
