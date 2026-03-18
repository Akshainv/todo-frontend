import './Profile.css';

export default function Profile() {
  return (
    <div className="profile-page">
      <h1 className="page-title">Project Details</h1>
      
      <div className="profile-content">
        <div className="profile-card user-info">
          <div className="profile-header">
            <div className="profile-avatar">👨‍💻</div>
            <div className="profile-name">
              <h2>MERN Developer</h2>
              <p>Technical Assignment Submission</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Project Title:</span>
              <span className="value">Todo List Application</span>
            </div>
            <div className="detail-item">
              <span className="label">Tech Stack:</span>
              <span className="value">React, Express, Node, MongoDB</span>
            </div>
            <div className="detail-item">
              <span className="label">Deadline:</span>
              <span className="value">24 Hours</span>
            </div>
          </div>
        </div>

        <div className="profile-card project-overview">
          <h3>Requirements Fulfilled</h3>
          <ul className="requirements-list">
            <li>✅ <strong>Create To-Do</strong>: Title (mandatory) & Description (optional).</li>
            <li>✅ <strong>Edit / Update To-Do</strong>: Update title, desc, and status (Pending, In-Progress, Completed).</li>
            <li>✅ <strong>Delete To-Do</strong>: Remove to-dos from the list.</li>
            <li>✅ <strong>Pagination</strong>: Implemented for listing to-dos.</li>
            <li>✅ <strong>Visual Feedback</strong>: Loading indicators and status badges.</li>
            <li>✅ <strong>Responsive Design</strong>: Dashboard layout matching "todo-list" theme.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
