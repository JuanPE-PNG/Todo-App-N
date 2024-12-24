import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://backend-202950146573.us-central1.run.app";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <div className="row">
        {tasks.map((task) => (
          <div className="col-md-4 mb-4" key={task.id}>
            <div className="card shadow">
              <div className="card-body">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p><strong>Category:</strong> {task.category || "None"}</p>
                <p>
                  <strong>Tags:</strong> {Array.isArray(task.tags) && task.tags.length > 0 ? task.tags.join(", ") : "No tags"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
