import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;
    const res = await axios.post('http://localhost:3000/tasks', { text });
    setTasks([...tasks, res.data]);
    setText('');
  };

  const toggleTask = async (id, completed) => {
    const res = await axios.put(`http://localhost:3000/tasks/${id}`, { completed: !completed });
    setTasks(tasks.map(task => task._id === id ? res.data : task));
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">My To-Do List</h1>
      <div className="input-group">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <span
              onClick={() => toggleTask(task._id, task.completed)}
              className={task.completed ? 'completed' : ''}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;