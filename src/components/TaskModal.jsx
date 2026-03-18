import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './TaskModal.css';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskModal({ isOpen, onClose, onSubmit, todo, isReadOnly = false }) {
  const isEdit = !!todo && !isReadOnly;
  const isView = isReadOnly;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setStatus(todo.status);
      } else {
        setTitle('');
        setDescription('');
        setStatus('pending');
      }
      setErrors({});
      setSubmitting(false);
      if (!isReadOnly) {
        setTimeout(() => titleRef.current?.focus(), 100);
      }
    }
  }, [isOpen, todo, isReadOnly]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!validate()) return;

    setSubmitting(true);
    
    try {
      await onSubmit({
        ...(todo && { _id: todo._id }),
        title: title.trim(),
        description: description.trim(),
        status,
      });
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">
            {isReadOnly ? 'View To-Do' : isEdit ? 'Edit To-Do' : 'Create New To-Do'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="todo-title">
              Title {!isReadOnly && <span className="modal__required">*</span>}
            </label>
            <input
              id="todo-title"
              ref={titleRef}
              type="text"
              className={`modal__input ${errors.title ? 'modal__input--error' : ''}`}
              placeholder="Enter to-do title..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
              maxLength={100}
              disabled={isReadOnly}
            />
            {errors.title && <span className="modal__error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="todo-description">
              Description {!isReadOnly && <span className="modal__optional">(optional)</span>}
            </label>
            <textarea
              id="todo-description"
              className="modal__textarea"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
              disabled={isReadOnly}
            />
          </div>

          {/* Status (only in edit or view mode) */}
          {(isEdit || isView) && (
            <div className="modal__field">
              <label className="modal__label" htmlFor="todo-status">Status</label>
              <div className="modal__status-group">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`modal__status-btn modal__status-btn--${opt.value} ${status === opt.value ? 'modal__status-btn--active' : ''}`}
                    onClick={() => !isReadOnly && setStatus(opt.value)}
                    disabled={isReadOnly}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal__actions">
            {isReadOnly ? (
              <button type="button" className="modal__submit-btn" onClick={onClose}>
                Close
              </button>
            ) : (
              <>
                <button type="button" className="modal__cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="modal__submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoadingSpinner size="18px" color="white" />
                      <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{isEdit ? 'Save Changes' : 'Create To-Do'}</span>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
