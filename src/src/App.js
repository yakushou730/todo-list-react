import React, { useState, useEffect } from 'react';
import './App.css';

const FILTERS = {
  ALL: '全部',
  ACTIVE: '未完成',
  COMPLETED: '已完成',
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const handleDelete = id => setTodos(todos.filter(t => t.id !== id));

  const handleToggle = id => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const handleEdit = id => {
    setEditId(id);
    setEditText(todos.find(t => t.id === id).text);
  };

  const handleEditSave = id => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(t => {
    if (filter === FILTERS.ALL) return true;
    if (filter === FILTERS.ACTIVE) return !t.completed;
    if (filter === FILTERS.COMPLETED) return t.completed;
    return true;
  });

  return (
    <div className="App">
      <h2>Todo List</h2>
      <div className="add-todo-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="新增待辦事項"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>新增</button>
      </div>
      <div className="filter-group">
        {Object.values(FILTERS).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'active' : ''}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  className="edit-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEditSave(todo.id)}
                />
                <button onClick={() => handleEditSave(todo.id)}>儲存</button>
                <button onClick={() => setEditId(null)}>取消</button>
              </>
            ) : (
              <>
                <span className={`todo-text${todo.completed ? ' todo-completed' : ''}`}>{todo.text}</span>
                <button onClick={() => handleEdit(todo.id)}>編輯</button>
                <button onClick={() => handleDelete(todo.id)}>刪除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
