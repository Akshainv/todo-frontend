import TaskColumn from './TaskColumn';
import './TaskBoard.css';

const COLUMNS = [
  { status: 'pending', label: 'Pending', color: 'pending' },
  { status: 'in-progress', label: 'In Progress', color: 'inprogress' },
  { status: 'completed', label: 'Completed', color: 'completed' },
];

export default function TaskBoard({ todos, onEditTodo, onDeleteTodo, onStatusChange, loading }) {
  if (loading) {
    return (
      <div className="taskboard__loading">
        <div className="loading-spinner" />
        <p>Loading to-dos...</p>
      </div>
    );
  }

  return (
    <div className="taskboard">
      {COLUMNS.map((col) => {
        const columnTodos = todos.filter((t) => t.status === col.status);
        return (
          <TaskColumn
            key={col.status}
            status={col.status}
            label={col.label}
            color={col.color}
            todos={columnTodos}
            onEditTodo={onEditTodo}
            onDeleteTodo={onDeleteTodo}
            onStatusChange={onStatusChange}
          />
        );
      })}
    </div>
  );
}
