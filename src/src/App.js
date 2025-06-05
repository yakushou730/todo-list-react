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
      <div style={{ marginBottom: 16 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="新增待辦事項"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>新增</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        {Object.values(FILTERS).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? 'bold' : 'normal', marginRight: 8 }}
          >
            {f}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              style={{ marginRight: 8 }}
            />
            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEditSave(todo.id)}
                  style={{ marginRight: 8 }}
                />
                <button onClick={() => handleEditSave(todo.id)}>儲存</button>
                <button onClick={() => setEditId(null)} style={{ marginLeft: 4 }}>取消</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 1 }}>{todo.text}</span>
                <button onClick={() => handleEdit(todo.id)} style={{ marginLeft: 8 }}>編輯</button>
                <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: 4 }}>刪除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
