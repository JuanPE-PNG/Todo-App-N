import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://backend-202950146573.us-central1.run.app";


const TaskEdit = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    tagNames: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskSelect = (taskId) => {
    const task = tasks.find((t) => t.id === parseInt(taskId, 10));
    setSelectedTask(task);
    setForm({
      title: task.title,
      description: task.description,
      categoryId: task.category_id || "",
      tagNames: task.tags ? task.tags.join(", ") : "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagNames = form.tagNames.split(",").map((tag) => tag.trim());
      await axios.put(`${BASE_URL}/categories/${selectedTask.id}`, {
        title: form.title,
        description: form.description,
        category_id: form.categoryId,
        tag_names: tagNames,
      });
      alert("Task updated!");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <div className="mb-3">
        <select
          onChange={(e) => handleTaskSelect(e.target.value)}
          className="form-select"
        >
          <option value="">Select a task to edit</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      {selectedTask && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleFormChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleFormChange}
              required
              className="form-control"
            ></textarea>
          </div>
          <div className="mb-3">
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleFormChange}
              required
              className="form-select"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="tagNames"
              placeholder="Tags (comma-separated)"
              value={form.tagNames}
              onChange={handleFormChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success">Update Task</button>
        </form>
      )}
    </div>
  );
};

export default TaskEdit;
