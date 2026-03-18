import { useState } from 'react';
import './TaskCard.css';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskCard({ todo, onEdit, onDelete, onStatusChange, style }) {
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(), 300);
  };

  const createdDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`task-card fade-in ${deleting ? 'task-card--deleting' : ''}`}
      style={style}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="task-card__top">
        <h3 className="task-card__title">{todo.title}</h3>
        <div className={`task-card__actions ${showActions ? 'task-card__actions--visible' : ''}`}>
          <button className="task-card__action-btn task-card__action-btn--edit" onClick={onEdit} title="Edit to-do">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="task-card__action-btn task-card__action-btn--delete" onClick={handleDelete} title="Delete to-do">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {todo.description && (
        <p className="task-card__desc">{todo.description}</p>
      )}

      <div className="task-card__footer">
        <span className="task-card__date">{createdDate}</span>
        <select
          className={`task-card__status task-card__status--${todo.status}`}
          value={todo.status}
          onChange={(e) => onStatusChange(todo._id, e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
