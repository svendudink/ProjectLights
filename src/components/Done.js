import React from "react";
import Card from "./Card";

export default function Done({ tasks, addTask }) {
  return (
    <>
      {tasks
        .filter((item) => item.timeline === "done")
        .map((e) => (
          <Card currentTask={e} tasks={tasks} addTask={addTask} />
        ))}
    </>
  );
}
