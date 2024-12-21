import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    tagNames: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagNames = form.tagNames.split(",").map((tag) => tag.trim());
      await axios.post("http://localhost:5000/tasks", {
        title: form.title,
        description: form.description,
        category_id: form.categoryId,
        tag_names: tagNames,
      });
      alert("Task added!");
      setForm({ title: "", description: "", categoryId: "", tagNames: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
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
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;