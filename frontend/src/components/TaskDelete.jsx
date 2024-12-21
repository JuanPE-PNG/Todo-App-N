import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskDelete = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTaskId) {
      alert("Please select a task to delete.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/tasks/${selectedTaskId}`);
      alert("Task deleted!");
      fetchTasks();
      setSelectedTaskId("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Delete Task</h2>
      <div className="mb-3">
        <select
          onChange={(e) => setSelectedTaskId(e.target.value)}
          value={selectedTaskId}
          className="form-select"
        >
          <option value="">Select a task to delete</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>
      <button
        className="btn btn-danger"
        onClick={handleDelete}
        disabled={!selectedTaskId}
      >
        Delete Task
      </button>
    </div>
  );
};

export default TaskDelete;
