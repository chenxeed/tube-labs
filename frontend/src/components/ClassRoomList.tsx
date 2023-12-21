import { ClassRoom as IClassRoom } from "../types";
import { ClassRoom } from "./ClassRoom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./atoms/Skeleton";
import { useMemo, useState } from "react";
import { ClassRoomDelete } from "./ClassRoomDelete";
import { getClassRooms } from "../modules/classRoomAPI";

export const ClassRoomList = () => {
  // Variables

  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Custom Hooks
  const { data, isLoading } = useQuery<IClassRoom[]>({
    queryKey: ["classrooms"],
    queryFn: getClassRooms,
  });

  // Computed

  const classToDelete = useMemo(() => {
    if (data?.length && deleteId) {
      return data.find((classRoom) => classRoom.id === deleteId);
    }
  }, [deleteId, data]);

  return (
    <>
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
      {classToDelete && (
        <ClassRoomDelete
          classRoom={classToDelete}
          onClose={() => {
            setDeleteId(null);
          }}
        />
      )}
    </>
  );
};
