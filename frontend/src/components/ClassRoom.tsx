import React, { FunctionComponent, useMemo } from "react";
import { ClassRoom as IClassRoom } from "../types";
import { calculateClassTubes } from "../modules/classTubeCalculator";

export const ClassRoom: FunctionComponent<{ classRoom: IClassRoom }> = ({
  classRoom,
}) => {
  const yearReview = useMemo(() => {
    const result = calculateClassTubes(
      classRoom.tubeUnits,
      classRoom.fluorescentTubes
    );
    return {
      brokenTubes: result.brokenTubes,
      cost: `$${result.cost}`,
    };
  }, [classRoom.tubeUnits, classRoom.fluorescentTubes]);

  return (
    <div className="p-2 rounded h-50 flex flex-col items-center justify-center border border-1 shadow">
      <div className="border-b-2 border-gray-400 w-full">
        <div className="text-center font-bold pb-2">{classRoom.name}</div>
      </div>
      <div className="m-2 p-2 grid grid-cols-2 gap-2">
        <div>Tube Units</div>
        <div className="text-right">{classRoom.tubeUnits}</div>
        <div>Tubes per Unit</div>
        <div className="text-right">{classRoom.fluorescentTubes}</div>
        <div>Broken Tubes</div>
        <div className="text-right">{yearReview.brokenTubes}</div>
        <div>Cost</div>
        <div className="text-right">{yearReview.cost}</div>
      </div>
    </div>
  );
};
