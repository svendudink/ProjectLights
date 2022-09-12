import React from "react";
import Card from "./Card";

export default function LightList({ tasks, addTask }) {
  return (
    <>
      {tasks
        .filter((item) => item.timeline === "planning")
        .map((e) => (
          <Card currentTask={e} tasks={tasks} addTask={addTask} />
        ))}
    </>
  );
}
