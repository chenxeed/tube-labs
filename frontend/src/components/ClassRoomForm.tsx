import { FunctionComponent, useMemo } from "react";
import { Formik } from "formik";
import { ClassRoom } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

type CreateClassRoom = Omit<ClassRoom, "id">;
type CreateClassRoomBody = {
  class_room: CreateClassRoom;
};

const createClassRoom = async (classRoom: CreateClassRoomBody) => {
  return fetch("/api/class_rooms", {
    method: "POST",
    body: JSON.stringify(classRoom),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<ClassRoom>);
};

export const ClassRoomForm: FunctionComponent<{
  classRoom?: CreateClassRoom;
}> = (props) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation<
    ClassRoom,
    Error,
    CreateClassRoomBody
  >({
    mutationFn: createClassRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    tubeUnits: Yup.number().min(1, "Too Short!").required("Required"),
    fluorescentTubes: Yup.number().min(2, "Too Short!").required("Required"),
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

  const onSubmit = (values: CreateClassRoom) => {
    mutate({
      class_room: values,
    });
  };

  return (
    <div className="w-full max-w-xs">
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
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
              {errors.name && (
                <p className="text-red-500 text-xs italic">{errors.name}</p>
              )}
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
                    min="1"
                    value={values.tubeUnits}
                    onChange={handleChange}
                  />
                  {errors.tubeUnits && (
                    <p className="text-red-500 text-xs italic">
                      {errors.tubeUnits}
                    </p>
                  )}
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
                    min="2"
                    value={values.fluorescentTubes}
                    onChange={handleChange}
                  />
                  {errors.fluorescentTubes && (
                    <p className="text-red-500 text-xs italic">
                      {errors.fluorescentTubes}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
