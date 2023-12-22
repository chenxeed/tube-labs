import { calculateClassTubes } from "../classTubeCalculator";

// Mock Math.random() to return a fixed value for test predictability
beforeEach(() => {
  let counter = 0;
  const randValue = [0.3, 0.2, 0.8];
  jest.spyOn(global.Math, "random").mockImplementation(() => {
    const result = randValue.at(counter) as number;
    counter = counter + 1 === randValue.length ? 0 : counter + 1;
    return result;
  });
});

afterEach(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

describe("classTubeCalculator", () => {
  test("should return the cost and broken tubes of default scenario", () => {
    const result = calculateClassTubes(4, 4);
    expect(result.metadata.brokenTubes).toEqual(168);
    expect(result.metadata.cost).toEqual(2352);
    expect(result.metadata.hoursRemaining).toEqual(0);
  });

  test("should return 0 cost if the tubes are lower than replace limit", () => {
    const result = calculateClassTubes(4, 1);
    expect(result.metadata.brokenTubes).toEqual(4);
    expect(result.metadata.cost).toEqual(0);
    expect(result.metadata.hoursRemaining).toEqual(0);
  });

  test("should throw error if no unit or tubes provided", () => {
    expect(() => calculateClassTubes(0, 1)).toThrowError();
    expect(() => calculateClassTubes(1, 0)).toThrowError();
    expect(() => calculateClassTubes(0, 0)).toThrowError();
  });
});
