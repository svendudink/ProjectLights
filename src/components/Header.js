export default function Header({ handleSubmit }) {
  return (
    <div className="header">
      <button onClick={handleSubmit} className="addButton">
        Add Task
      </button>
      <p>Planning</p>
      <p>In Progress</p>
      <p>Done</p>
    </div>
  );
}
