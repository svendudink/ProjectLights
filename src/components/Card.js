import React from "react";
import Draggable from "react-draggable";

export default function Card({ currentTask, tasks, addTask }) {
  return (
    <Draggable grid={[10, 10]} axis="y" bounds="parent">
      <div className="card" key={currentTask.id}>
        <div className="heading">
          <h3>{currentTask.name && currentTask.name}</h3>
          <img
            onClick={() => {
              const newTaskList = tasks.filter((item) => {
                if (item.id != currentTask.id) {
                  return item;
                }
              });
              addTask(newTaskList);
            }}
            src="https://toppng.com/uploads/preview/recycling-bin-vector-delete-icon-png-black-11563002079w1isxqyyiv.png"
            style={{ height: "20px", width: "20px" }}
          />
        </div>
        <p>{currentTask.description}</p>
      </div>
    </Draggable>
  );
}
