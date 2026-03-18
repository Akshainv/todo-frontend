import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTodos } from '../context/TaskContext';
import TaskModal from './TaskModal';
import './Header.css';

export default function Header({ onMenuClick }) {
  const { searchQuery, setSearchQuery } = useTodos();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value && location.pathname !== '/tasks') {
      navigate('/tasks');
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-toggle" onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>
      </div>
      
      <div className="header__search-container">
        <div className="header__search">
          <span className="header__search-icon">🔍</span>
          <input
            type="text"
            className="header__search-input"
            placeholder="Search for to-dos..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </header>
  );
}
