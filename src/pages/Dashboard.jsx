import { useTodos } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TaskModal from '../components/TaskModal';
import Skeleton from '../components/Skeleton';
import './Dashboard.css';

export default function Dashboard() {
  const { stats, latestTodos, setFilterStatus, addTodo, isFetching, isAdding } = useTodos();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddTask = async (data) => {
    await addTodo(data);
    setModalOpen(false);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCardClick = (type) => {
    const filterMap = {
      'total': 'all',
      'pending': 'pending',
      'inprogress': 'in-progress',
      'completed': 'completed'
    };
    setFilterStatus(filterMap[type]);
    navigate('/tasks');
  };

  const cards = [
    { title: 'Total To-Dos', value: stats.total, icon: '📊', color: '#6366f1', type: 'total' },
    { title: 'Pending', value: stats.pending, icon: '📋', color: '#fbbf24', type: 'pending' },
    { title: 'In Progress', value: stats.inProgress, icon: '🔄', color: '#3b82f6', type: 'inprogress' },
    { title: 'Completed', value: stats.completed, icon: '✅', color: '#10b981', type: 'completed' },
  ];

  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        {cards.map((card) => (
          <div 
            key={card.title} 
            className={`stat-card stat-card--${card.type}`}
            onClick={() => handleCardClick(card.type)}
            role="button"
            tabIndex={0}
          >
            <div className="stat-card__icon" style={{ backgroundColor: `${card.color}10`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{card.value}</span>
              <span className="stat-card__label">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-tasks-card">
          <div className="card-header">
            <h3>Latest Added To-Dos</h3>
            <button className="btn-view-all" onClick={() => navigate('/tasks')}>View All</button>
          </div>
          <div className="tasks-history-list">
            {isFetching && latestTodos.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="history-item">
                  <Skeleton circle width="8px" height="8px" />
                  <div className="history-info">
                    <Skeleton width="60%" height="16px" />
                    <Skeleton width="40%" height="12px" />
                  </div>
                  <Skeleton width="60px" height="24px" />
                </div>
              ))
            ) : latestTodos.length > 0 ? (
              latestTodos.map((todo) => (
                <div key={todo._id} className="history-item">
                  <div className={`status-indicator status-${todo.status}`}></div>
                  <div className="history-info">
                    <span className="history-title">{todo.title}</span>
                    <span className="history-date">{new Date(todo.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`status-badge status-${todo.status}`}>{todo.status}</span>
                </div>
              ))
            ) : (
              <div className="no-tasks-container">
                <p className="no-tasks-text">No to-dos found. Start by adding one!</p>
                <button className="btn-add-todo-inline" onClick={() => setModalOpen(true)}>
                  <span className="icon">+</span> Add To-Do
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="completion-rate-card">
          <div className="card-header">
            <h3>Completion Rate</h3>
          </div>
          <div className="completion-summary">
            <div className="completion-circle">
              <span className="completion-value">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
              <span className="completion-label">Finished</span>
            </div>
            <div className="stats-list">
              <div className="stat-item">
                <span className="dot status-completed"></span>
                <span className="label">Fullfillment: <strong>{stats.completed} / {stats.total}</strong></span>
              </div>
              <div className="stat-item">
                <span className="dot status-pending"></span>
                <span className="label">Attention Needed: <strong>{stats.pending + stats.inProgress}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
