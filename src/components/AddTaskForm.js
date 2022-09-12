import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddTaskForm({ setAddItem, addItem, tasks, setTasks }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [option, setOption] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let newTask = {
      id: uuidv4(),
      name: name,
      description: description,
      timeline: option,
    };
    setTasks([...tasks, newTask]);
    setAddItem(!addItem);
  };
  return (
    <div className="addForm">
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          name="timeline"
          id="timeline"
          onChange={(e) => {
            setOption(e.target.value);
          }}
        >
          <option value=""></option>
          <option value="planning">Planning</option>
          <option value="inprogress">In-Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
