import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { id: 'tasks', label: 'My To-Dos', icon: '📋', path: '/tasks' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            📝
          </div>
          {!collapsed && <span className="sidebar__logo-text">todo-list</span>}
        </div>
        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
            title={collapsed ? item.label : undefined}
            onClick={() => {
              if (window.innerWidth <= 1024) {
                onToggle();
              }
            }}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
