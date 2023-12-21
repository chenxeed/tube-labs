import "./index.css";
import { ClassRoom as IClassRoom } from "./types";
import { ClassRoom } from "./components/ClassRoom";
import { ClassRoomForm } from "./components/ClassRoomForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./components/atoms/Skeleton";
import { useMemo, useState } from "react";
import { ClassRoomDelete } from "./components/ClassRoomDelete";

function App() {
  const { data, isLoading } = useQuery<IClassRoom[]>({
    queryKey: ["classrooms"],
    queryFn: () => {
      return fetch("/api/class_rooms").then((res) => res.json());
    },
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const classToDelete = useMemo(() => {
    if (data?.length && deleteId) {
      return data.find((classRoom) => classRoom.id === deleteId);
    }
  }, [deleteId, data]);

  return (
    <div className="mx-auto dark:bg-gray-950">
      <header className="p-4 border-b-2 dark:bg-primary border-gray-400 shadow">
        <h1 className="mt-2 text-4xl font-colaba text-primary dark:text-white">
          [ INSIDE ] University
        </h1>
      </header>
      <div className="container mx-auto">
        <div className="mt-4 bg-slate-50 dark:bg-slate-500 dark:text-slate-50">
          <h2 className="text-center text-2xl font-bold">Register New Class</h2>
          <div className="mt-4 flex justify-center">
            <ClassRoomForm />
          </div>
        </div>
        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-600 dark:text-slate-50">
          <h2 className="text-center text-2xl font-bold">Classes</h2>
          {isLoading && (
            <div className="mt-4">
              <Skeleton width="100%" height="300px"></Skeleton>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 align-middle">
            {data &&
              data.map((classRoom) => (
                <ClassRoom
                  key={classRoom.id}
                  classRoom={classRoom}
                  onConfirmDelete={(id) => setDeleteId(id)}
                />
              ))}
          </div>
        </div>
      </div>
      {classToDelete && (
        <ClassRoomDelete
          classRoom={classToDelete}
          onClose={() => {
            setDeleteId(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
