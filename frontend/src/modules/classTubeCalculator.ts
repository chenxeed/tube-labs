export interface YieldValue {
  type: "INIT" | "CONTINUE" | "FINISH";
  metadata: {
    hoursRemaining: number;
    unitTubes: number[][];
    brokenTubes: number;
    cost: number;
  };
}

/**
 * Simulate how many tubes are broken and how much it costs to replace them
 * based on the number of units and tubes per unit
 * @param unit the number of tube units
 * @param tubePerUnit the number of tubes in a unit
 * @returns
 */
export function* calculateClassTubesGenerator(
  unit: number = 0,
  tubePerUnit: number = 0
): Generator<YieldValue> {
  if (unit <= 0) {
    throw new Error("calculateClassTubes: Invalid input unit");
  }
  if (tubePerUnit <= 0) {
    throw new Error("calculateClassTubes: Invalid input tubePerUnit");
  }

  // Static Variables Setup

  // The classroom is used 15 hours a day, 5 times a week, 9 months a year. Since months are not defined, assume 9 months here equals to 36 weeks.
  const hours = 15 * 5 * 36;

  // The limit of broken tubes in a unit before we replace all tubes in that unit
  const replaceLimit = 2;
  const replaceCost = 7;

  // Utility Functions

  // Each units contains the number of fluorescent tubes with random timer when it'll broke
  const rand = () => Math.floor(Math.random() * 100) + 100;
  const createTubes = () => {
    const tubes = [];
    // Presort the expired tubes time so we can easily get the lowest expired tubes
    const expiredTubes = [];
    for (let tubeIndex = 0; tubeIndex < tubePerUnit; tubeIndex++) {
      expiredTubes.push(rand());
    }
    expiredTubes.sort((a, b) => a - b);

    for (let tubeIndex = 0; tubeIndex < tubePerUnit; tubeIndex++) {
      tubes.push(expiredTubes[tubeIndex]);
    }
    return tubes;
  };

  // Counting how many tubes are broken and how much it costs to replace
  let cost = 0;
  let brokenTubes = 0;

  let hoursRemaining = hours;
  const unitTubes: number[][] = [];
  for (let unitIndex = 0; unitIndex < unit; unitIndex++) {
    unitTubes.push(createTubes());
  }

  yield {
    type: "INIT",
    metadata: {
      hoursRemaining,
      unitTubes: [...unitTubes],
      brokenTubes,
      cost,
    },
  };

  while (hoursRemaining > 0) {
    // get the current remaining hours of all tube of each units
    const firstTubeHours = unitTubes.map((tubes) => tubes[0]);

    const soonToExpireTube = firstTubeHours.reduce<{
      hour: number;
      idx: number[];
    }>(
      (val, tubeHour, idx) => {
        if (tubeHour < val.hour) {
          val.hour = tubeHour;
          val.idx = [idx];
        } else if (tubeHour === val.hour) {
          val.idx.push(idx);
        }
        return val;
      },
      { hour: Infinity, idx: [] }
    );

    // The remaining hours is not enough to expire the next tube, then we use what's left
    // of the hours to get the final expired time of all tubes
    if (hoursRemaining < soonToExpireTube.hour) {
      soonToExpireTube.hour = hoursRemaining;
      soonToExpireTube.idx = [];
    }

    // Lower all the tubes' expired time by the lowest expired tube
    unitTubes.forEach((tubes, idx) => {
      unitTubes[idx] = tubes.map((tube) => tube - soonToExpireTube.hour);
    });
    hoursRemaining -= soonToExpireTube.hour;

    // Remove the one that is expired
    // eslint-disable-next-line no-loop-func
    soonToExpireTube.idx.forEach((idx) => {
      unitTubes[idx].shift();
      // If it's the limit of the tube, replace all tubes in that unit
      if (tubePerUnit - unitTubes[idx].length === replaceLimit) {
        cost += replaceCost * tubePerUnit;
        unitTubes[idx] = createTubes();
      }
    });
    brokenTubes += soonToExpireTube.idx.length;

    if (hoursRemaining > 0) {
      yield {
        type: "CONTINUE",
        metadata: {
          hoursRemaining,
          unitTubes: [...unitTubes],
          brokenTubes,
          cost,
        },
      };
    }
  }

  return {
    type: "FINISH",
    metadata: {
      hoursRemaining,
      unitTubes: [...unitTubes],
      brokenTubes,
      cost,
    },
  };
}

export function calculateClassTubes(unit: number = 0, tubePerUnit: number = 0) {
  const generator = calculateClassTubesGenerator(unit, tubePerUnit);
  let result: IteratorResult<YieldValue> = generator.next();
  while (!result.done) {
    result = generator.next();
  }
  return result.value;
}
