/**
 * Simulate how many tubes are broken and how much it costs to replace them
 * based on the number of units and tubes per unit
 * @param unit the number of tube units
 * @param tubePerUnit the number of tubes in a unit
 * @returns
 */

export function calculateClassTubes(unit: number = 0, tubePerUnit: number = 0) {
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
      tubes.push({
        id: tubeIndex,
        expired: expiredTubes[tubeIndex],
      });
    }
    return tubes;
  };

  // Counting how many tubes are broken and how much it costs to replace
  let cost = 0;
  let brokenTubes = 0;

  // Looping through each unit and tube to count the broken tubes and the cost
  // Since we need to replace all tubes in a unit if there are more than {replaceLimit} broken tubes,
  // we can just count the {replaceLimit} lowest expired tube in a unit and ignore the rest
  for (let unitIndex = 0; unitIndex < unit; unitIndex++) {
    let hoursRemaining = hours;
    // Let's run the simulation of the tubes of each unit
    while (hoursRemaining > 0) {
      const tubes = createTubes();
      for (let tubeIndex = 0; tubeIndex < tubePerUnit; tubeIndex++) {
        const tube = tubes[tubeIndex];

        if (hoursRemaining < tube.expired) {
          hoursRemaining = 0;
          break;
        }

        hoursRemaining -= tube.expired;
        brokenTubes++;

        if (tubeIndex === replaceLimit - 1) {
          cost += replaceCost * tubePerUnit;
          break;
        } else {
          tubes[tubeIndex + 1].expired -= tube.expired;
        }

        if (hoursRemaining <= 0) {
          break;
        }
      }
    }
  }
  return {
    brokenTubes,
    cost,
  };
}
