import { FunctionComponent, useMemo, useRef, useState } from "react";
import { ClassRoom as IClassRoom } from "../types";
import {
  YieldValue,
  calculateClassTubesGenerator,
} from "../modules/classTubeCalculator";
import { twMerge } from "tailwind-merge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateClassRoomBody, updateClassRoom } from "../modules/classRoomAPI";
import { Button } from "./atoms/Button";

// Sources: Spring Pastel from https://www.heavy.ai/blog/12-color-palettes-for-telling-better-stories-with-your-data
const chartColor = [
  "#fd7f6f",
  "#7eb0d5",
  "#b2e061",
  "#bd7ebe",
  "#ffb55a",
  "#ffee65",
  "#beb9db",
  "#fdcce5",
  "#8bd3c7",
];

interface ClassRoomProps {
  classRoom: IClassRoom;
  onConfirmDelete: (id: number) => void;
}

export const ClassRoom: FunctionComponent<ClassRoomProps> = ({
  classRoom,
  onConfirmDelete,
}) => {
  const [calculateResult, setCalculateResult] = useState<YieldValue | null>(
    null
  );
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const toPrint = useMemo(() => {
    if (!calculateResult) {
      return null;
    }

    return calculateResult.metadata.unitTubes.map((tubes) => {
      const lengthGap = classRoom.fluorescentTubes - tubes.length;
      if (lengthGap > 0) {
        return new Array(lengthGap).fill(0).concat(tubes);
      }
      return tubes;
    });
  }, [calculateResult, classRoom.fluorescentTubes]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation<
    IClassRoom,
    Error,
    { id: number; body: UpdateClassRoomBody }
  >({
    mutationFn: updateClassRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      setLoadingSimulation(true);
      setTimeout(() => {
        setLoadingSimulation(false);
        setCalculateResult(null);
      }, 500);
    },
  });

  const prepareSimulation = () => {
    setLoadingSimulation(true);
    setTimeout(() => {
      setLoadingSimulation(false);
      getSimulation();
      // A small delay to let the DOM render and make the screen scrollable,
      // so we can scroll to the simulation result
      setTimeout(() => {
        elementRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }, 500);
  };

  const getSimulation = () => {
    const iteration = calculateClassTubesGenerator(
      classRoom.tubeUnits,
      classRoom.fluorescentTubes
    );

    function iterateResult() {
      const nextIteration = iteration.next();
      const nextResult = nextIteration.value;
      setCalculateResult(nextResult);
      if (!nextIteration.done) {
        setTimeout(() => {
          window.requestAnimationFrame(iterateResult);
        }, 100);
      } else {
        saveSimulationResult(nextResult);
      }
    }
    window.requestAnimationFrame(iterateResult);
  };

  const saveSimulationResult = (result: YieldValue) => {
    mutate({
      id: classRoom.id,
      body: {
        class_room: {
          isSimulated: true,
          brokenTubes: result.metadata.brokenTubes,
          cost: result.metadata.cost,
        },
      },
    });
  };

  const onClickDelete = () => {
    onConfirmDelete(classRoom.id);
  };

  return (
    <div
      className={twMerge(
        "w-full p-2 rounded min-h-56 flex flex-col items-center justify-start border border-1 shadow transition-all bg-white dark:bg-slate-950",
        toPrint && "col-span-5",
        loadingSimulation && "w-0 opacity-0"
      )}
      ref={elementRef}
    >
      <div className="border-b-2 border-gray-400 w-full relative">
        <div className="text-center font-bold pb-2">{classRoom.name}</div>
        <div className="absolute top-0 right-0">
          <button
            type="button"
            className="inline-flex justify-center rounded-md px-1 py-1 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClickDelete}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6 text-gray-400 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="m-2 p-2 grid grid-cols-2 gap-2">
        <div>Tube Units</div>
        <div className="text-right">{classRoom.tubeUnits}</div>
        <div>Tubes per Unit</div>
        <div className="text-right">{classRoom.fluorescentTubes}</div>
        {classRoom.isSimulated && (
          <>
            <div>Broken Tubes</div>
            <div className="text-right">{classRoom.brokenTubes}</div>
            <div>Cost</div>
            <div className="text-right">{classRoom.cost}</div>
          </>
        )}
        {!classRoom.isSimulated && !toPrint && (
          <>
            <div>Simulate Tube</div>
            <div className="text-right">
              <Button
                variant="primary"
                type="button"
                onClick={prepareSimulation}
              >
                Run
              </Button>
            </div>
          </>
        )}
      </div>
      {calculateResult && toPrint && (
        <>
          <div className="w-full">
            <div className="text-left flex gap-1">
              {toPrint.map((tubes, index) => (
                <div
                  className="border-2 flex items-end h-[200px] flex-auto"
                  key={index}
                >
                  {tubes.map((tube, index) => (
                    <div
                      key={index}
                      style={{
                        height: tube,
                        backgroundColor: chartColor[index % chartColor.length],
                      }}
                      className="border flex-auto transition-[height] duration-100 ease-linear"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="m-2 p-2 grid grid-cols-2 gap-2">
            <div>Hours remaining</div>
            <div className="text-right">
              {calculateResult.metadata.hoursRemaining}
            </div>
            <div>Broken Tubes</div>
            <div className="text-right">
              {calculateResult.metadata.brokenTubes}
            </div>
            <div>Cost</div>
            <div className="text-right">${calculateResult.metadata.cost}</div>
          </div>
        </>
      )}
    </div>
  );
};
