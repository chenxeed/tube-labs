import { calculateClassTubes } from "../classTubeCalculator";

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
  test("should return the cost and broken tubes", () => {
    const result = calculateClassTubes(4, 4);
    expect(result.metadata.brokenTubes).toEqual(168);
    expect(result.metadata.cost).toEqual(2352);
    expect(result.metadata.hoursRemaining).toEqual(0);
  });
});
