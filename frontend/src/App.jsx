import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskEdit from "./components/TaskEdit";
import TaskDelete from "./components/TaskDelete";

const App = () => {
  return (
    <Router>
      <div className="container mt-5">
        <nav className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to="/">View Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add">Add Task</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/edit">Edit Task</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/delete">Delete Task</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/add" element={<TaskForm />} />
          <Route path="/edit" element={<TaskEdit />} />
          <Route path="/delete" element={<TaskDelete />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
