import { useState, useEffect } from 'react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/tasks`;
const columns = ['To Do', 'In Progress', 'Review', 'Done'];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsCreating(true);
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          status: 'To Do',
          assignee: 'Unassigned'
        })
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleMoveTask = async (task, direction) => {
    const currentIndex = columns.indexOf(task.status);
    let newIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < columns.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex === currentIndex) return;

    const newStatus = columns[newIndex];

    try {
      // Optimistic UI update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update task", err);
      fetchTasks(); // Revert on failure
    }
  };

  return (
    <div className="glass-panel kanban-board">
      <div className="board-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Project SyncSpace</span>
        <form onSubmit={handleCreateTask} className="create-task-form">
          <input 
            type="text" 
            placeholder="New Task Title..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="chat-input"
            style={{ width: '200px', marginRight: '0.5rem', padding: '0.5rem 1rem' }}
          />
          <button type="submit" className="action-btn primary" disabled={isCreating || !newTaskTitle.trim()}>
            {isCreating ? 'Adding...' : '+ Add Task'}
          </button>
        </form>
      </div>
      <div className="columns-container">
        {columns.map((col, colIndex) => (
          <div key={col} className="column">
            <div className="column-title">{col} <span style={{fontSize:'0.8rem', opacity:0.6}}>({tasks.filter(t => t.status === col).length})</span></div>
            {tasks.filter(t => t.status === col).map(task => (
              <div key={task.id} className="task-card">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-desc">{task.description}</div>}
                <div className="task-footer">
                  <span className="task-assignee">{task.assignee || 'Unassigned'}</span>
                  <span>#{task.id}</span>
                </div>
                <div className="task-actions" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    className="icon-btn" 
                    onClick={() => handleMoveTask(task, 'prev')}
                    disabled={colIndex === 0}
                    style={{ opacity: colIndex === 0 ? 0 : 1 }}
                  >
                    ←
                  </button>
                  <button 
                    className="icon-btn" 
                    onClick={() => handleMoveTask(task, 'next')}
                    disabled={colIndex === columns.length - 1}
                    style={{ opacity: colIndex === columns.length - 1 ? 0 : 1 }}
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
