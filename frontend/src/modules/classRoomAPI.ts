import { ClassRoom } from "../types";

export type CreateClassRoom = Omit<ClassRoom, "id">;
export type CreateClassRoomBody = {
  class_room: CreateClassRoom;
};

export const getClassRooms = () => {
  return fetch("/api/class_rooms").then((res) => res.json());
};

export const createClassRoom = async (classRoom: CreateClassRoomBody) => {
  return fetch("/api/class_rooms", {
    method: "POST",
    body: JSON.stringify(classRoom),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export type UpdateClassRoom = Partial<ClassRoom>;
export type UpdateClassRoomBody = {
  class_room: UpdateClassRoom;
};

export const updateClassRoom = async ({
  id,
  body,
}: {
  id: ClassRoom["id"];
  body: UpdateClassRoomBody;
}) => {
  return fetch(`/api/class_rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteClassRoom = async (id: ClassRoom["id"]) => {
  return fetch(`/api/class_rooms/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
