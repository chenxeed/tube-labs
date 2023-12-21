import { FunctionComponent, useMemo } from "react";
import { Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import {
  CreateClassRoom,
  CreateClassRoomBody,
  createClassRoom,
} from "../modules/classRoomAPI";
import { Button } from "./atoms/Button";

const TUBE_MAX = 10;
const TUBE_MIN = 0;
const UNIT_MIN = 1;

export const ClassRoomForm: FunctionComponent<{
  classRoom?: CreateClassRoom;
}> = (props) => {
  // Custom Hooks

  const queryClient = useQueryClient();
  const { isPending, mutate, error } = useMutation<
    Response,
    Error,
    CreateClassRoomBody
  >({
    mutationFn: createClassRoom,
    onSuccess: (res) => {
      if (res.status < 400) {
        queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      }
    },
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short")
      .max(50, "Too Long")
      .required("Required"),
    tubeUnits: Yup.number()
      .min(UNIT_MIN, "Too less")
      .max(TUBE_MAX, "Too much")
      .required("Required"),
    fluorescentTubes: Yup.number()
      .min(TUBE_MIN, "Too less")
      .max(TUBE_MAX, "Too much")
      .required("Required"),
  });

  const initialValue = useMemo<CreateClassRoom>(() => {
    if (props.classRoom) {
      return {
        name: props.classRoom.name,
        tubeUnits: props.classRoom.tubeUnits,
        fluorescentTubes: props.classRoom.fluorescentTubes,
        brokenTubes: props.classRoom.brokenTubes,
        cost: props.classRoom.cost,
        isSimulated: props.classRoom.isSimulated,
      };
    } else {
      return {
        name: "",
        tubeUnits: 4,
        fluorescentTubes: 4,
        brokenTubes: 0,
        cost: 0,
        isSimulated: false,
      };
    }
  }, [props.classRoom]);

  // Event Listener

  const onSubmit = async (values: CreateClassRoom) => {
    mutate({
      class_room: values,
    });
  };

  return (
    <div className="w-full max-w-xs bg-white dark:bg-slate-800">
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <form
            className="bg-slate-50 dark:bg-slate-900 dark:text-slate-50 shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-slate-50 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Class Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-slate-50 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="name"
                type="text"
                placeholder="Username"
                value={values.name}
                onChange={handleChange}
              />
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            </div>
            <div className="mb-6">
              <div className="flex gap-2">
                <div>
                  <label
                    className="block text-gray-700 dark:text-slate-50 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Tube Units
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-slate-50 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="tubeUnits"
                    type="number"
                    min={UNIT_MIN}
                    max={TUBE_MAX}
                    value={values.tubeUnits}
                    onChange={handleChange}
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.tubeUnits}
                  </p>
                </div>
                <div>
                  <label
                    className="block text-gray-700 dark:text-slate-50 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Tube per Unit
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-slate-50 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    name="fluorescentTubes"
                    type="number"
                    min={TUBE_MIN}
                    max={TUBE_MAX}
                    value={values.fluorescentTubes}
                    onChange={handleChange}
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.fluorescentTubes}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
              {error && (
                <p className="text-red-500 text-xs italic">
                  Failed to save from the server: {`${error}`}
                </p>
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
