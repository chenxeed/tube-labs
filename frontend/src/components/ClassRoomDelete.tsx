import { FunctionComponent, useEffect, useState } from "react";
import { ClassRoom } from "../types";
import { Modal } from "./atoms/Modal";
import { Button } from "./atoms/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassRoom } from "../modules/classRoomAPI";

interface ClassRoomDeleteProps {
  classRoom: ClassRoom;
  onClose: () => void;
}
export const ClassRoomDelete: FunctionComponent<ClassRoomDeleteProps> = ({
  classRoom,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation<Response, Error, number>({
    mutationFn: deleteClassRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      onCloseModal();
    },
  });
  const [openDelete, setOpenDelete] = useState(false);

  const onConfirmDelete = () => {
    mutate(classRoom.id);
  };

  const onCloseModal = () => {
    setOpenDelete(false);
    // Wait for animation to finishx`
    setTimeout(() => {
      onClose();
    }, 500);
  };

  useEffect(() => {
    setOpenDelete(true);
  }, []);

  return (
    <>
      <Modal open={openDelete} onClose={onCloseModal}>
        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <p className="mb-4 text-gray-500 dark:text-gray-300">
            Are you sure you want to delete {classRoom.name}?
          </p>
          <div className="flex justify-center items-center space-x-4">
            {isPending && <div>Deleting, please wait...</div>}
            {!isPending && (
              <>
                <Button variant="secondary" onClick={onCloseModal}>
                  No
                </Button>
                <Button variant="danger" onClick={() => onConfirmDelete()}>
                  I'm sure
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
