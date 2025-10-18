import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Sidebar = () => {
  const { notifications } = useApp();

  const menuItems = [
    {
      path: '/faq',
      icon: '📋',
      label: 'Quản lý FAQ',
      badge: null
    },
    {
      path: '/conversations',
      icon: '🚩',
      label: 'Hội thoại gắn cờ',
      badge: notifications.flaggedCount > 0 ? notifications.flaggedCount : null
    },
    {
      path: '/materials',
      icon: '📚',
      label: 'Tài liệu học tập',
      badge: null
    },
    {
      path: '/analytics',
      icon: '📊',
      label: 'Thống kê câu hỏi',
      badge: null
    },
    {
      path: '/knowledge-gap',
      icon: '🎯',
      label: 'Lỗ hổng kiến thức',
      badge: null
    },
    {
      path: '/learning-outcomes',
      icon: '✅',
      label: 'Mục tiêu & Thách thức',
      badge: null
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Faculty Module</h2>
      </div>
      
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-menu-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge">{item.badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
