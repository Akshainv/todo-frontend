import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTodos } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import './Tasks.css';

const DeleteConfirm = ({ onConfirm, onCancel, closeToast }) => (
  <div className="delete-confirm-toast">
    <p>Are you sure you want to delete this to-do?</p>
    <div className="delete-confirm-actions">
      <button 
        className="btn-confirm" 
        onClick={() => {
          onConfirm();
          closeToast();
        }}
      >
        Yes, Delete
      </button>
      <button 
        className="btn-cancel" 
        onClick={() => {
          onCancel();
          closeToast();
        }}
      >
        Cancel
      </button>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 6;

export default function Tasks() {
  const { filteredTodos, deleteTodo, updateTodo, addTodo, isFetching, processingIds, filterStatus, setFilterStatus, stats, searchQuery, setSearchQuery } = useTodos();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const paginatedTodos = filteredTodos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredTodos.length);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filteredTodos.length]);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsViewOnly(false);
    setModalOpen(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsViewOnly(false);
    setModalOpen(true);
  };

  const handleViewTodo = (todo) => {
    setEditingTodo(todo);
    setIsViewOnly(true);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    toast.info(
      <DeleteConfirm 
        onConfirm={() => deleteTodo(id)} 
        onCancel={() => {}} 
        closeToast={() => toast.dismiss()} // Pass a function to dismiss the toast
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        icon: false
      }
    );
  };

  const handleSubmit = async (data) => {
    if (data._id) {
      await updateTodo(data._id, data);
    } else {
      await addTodo(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="tasks-page">
      <div className="tasks-controls">
        <div className="tasks-title-group">
          <h2 className="section-title">To-Do List</h2>
          <span className="task-count-pill">{filteredTodos.length} to-dos</span>
        </div>
        <button className="btn-add-task" onClick={handleAddTodo}>
          <span className="icon">+</span>
          <span className="btn-text">Add New To-Do</span>
        </button>
      </div>

      <div className="tasks-filters">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All To-Dos <span className="count">({stats.total})</span>
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending <span className="count">({stats.pending})</span>
        </button>
        <button
          className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('in-progress')}
        >
          In Progress <span className="count">({stats.inProgress})</span>
        </button>
        <button
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed <span className="count">({stats.completed})</span>
        </button>
      </div>

      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>To-Do</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && paginatedTodos.length === 0 ? (
              [...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="task-info">
                      <Skeleton width="70%" height="16px" />
                      <Skeleton width="40%" height="12px" />
                    </div>
                  </td>
                  <td><Skeleton width="100px" height="28px" /></td>
                  <td><Skeleton width="80px" height="16px" /></td>
                  <td>
                    <div className="task-actions">
                      <Skeleton width="34px" height="34px" />
                      <Skeleton width="34px" height="34px" />
                      <Skeleton width="34px" height="34px" />
                    </div>
                  </td>
                </tr>
              ))
            ) : paginatedTodos.length > 0 ? (
              paginatedTodos.map((todo) => (
                <tr key={todo._id}>
                  <td>
                    <div className="task-info">
                      <span className="task-title">{todo.title}</span>
                      <p className="task-desc">{todo.description || 'No description'}</p>
                    </div>
                  </td>
                  <td>
                    <div className="status-container">
                      <select
                        className={`status-select status-${todo.status}`}
                        value={todo.status}
                        onChange={(e) => updateTodo(todo._id, { status: e.target.value })}
                        disabled={processingIds.has(todo._id)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      {processingIds.has(todo._id) && (
                        <div className="status-spinner">
                          <LoadingSpinner size="14px" color="var(--color-primary)" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="task-date">{new Date(todo.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="task-actions">
                      <button 
                        className="action-btn edit" 
                        onClick={() => handleEditTodo(todo)} 
                        title="Edit To-Do"
                        disabled={processingIds.has(todo._id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDelete(todo._id)} 
                        title="Delete To-Do"
                        disabled={processingIds.has(todo._id)}
                      >
                        {processingIds.has(todo._id) ? (
                          <LoadingSpinner size="16px" color="var(--color-error)" />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-data-row"><td colSpan="4">No to-dos found matching your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tasks-footer">
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <p className="pagination-info">
          Showing <strong>{filteredTodos.length > 0 ? startIndex : 0}</strong> - <strong>{endIndex}</strong> of <strong>{filteredTodos.length}</strong> to-dos
        </p>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        todo={editingTodo}
        isReadOnly={isViewOnly}
      />
    </div>
  );
}
