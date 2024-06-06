import useAppStore from "@/store/appStore";
import { memo } from "react";

function Task() {
  const { selectedTask } = useAppStore();
  if (!selectedTask) {
    return (
      <div className="border rounded-lg p-3 m-3">
        <p>Vyberte úlohu</p>
      </div>
    );
  }
  return (
    <div className="border rounded-lg p-3 m-3">
      <h1 className="font-bold">Popís úlohy:</h1>
      <p>{selectedTask.text}</p>
    </div>
  );
}
export default memo(Task);
