import TaskCard from './TaskCard';
import './TaskColumn.css';

export default function TaskColumn({ status, label, color, todos, onEditTodo, onDeleteTodo, onStatusChange }) {
  return (
    <div className={`task-column task-column--${color}`}>
      <div className="task-column__header">
        <div className="task-column__title-group">
          <span className={`task-column__dot task-column__dot--${color}`} />
          <h2 className="task-column__title">{label}</h2>
        </div>
        <span className="task-column__count">{todos.length}</span>
      </div>

      <div className="task-column__body">
        {todos.length === 0 ? (
          <div className="task-column__empty">
            <p>No to-dos yet</p>
          </div>
        ) : (
          todos.map((todo, index) => (
            <TaskCard
              key={todo._id}
              todo={todo}
              onEdit={() => onEditTodo(todo)}
              onDelete={() => onDeleteTodo(todo._id)}
              onStatusChange={onStatusChange}
              style={{ animationDelay: `${index * 60}ms` }}
            />
          ))
        )}
      </div>
    </div>
  );
}
