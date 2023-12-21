import React from "react";
import "./index.css";
import { ClassRoom as IClassRoom } from "./types";
import { ClassRoom } from "./components/ClassRoom";
import { ClassRoomForm } from "./components/ClassRoomForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./components/atoms/Skeleton";

function App() {
  const { data, isLoading } = useQuery<IClassRoom[]>({
    queryKey: ["classrooms"],
    queryFn: () => {
      return fetch("/api/class_rooms").then((res) => res.json());
    },
  });

  return (
    <div className="mx-auto dark:bg-gray-950">
      <header className="p-4 border-b-2 dark:bg-inside-orange border-gray-400 shadow">
        <h1 className="mt-2 text-4xl font-colaba text-inside-orange dark:text-white">
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
                <ClassRoom key={classRoom.id} classRoom={classRoom} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
