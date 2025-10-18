import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Header = () => {
  const location = useLocation();
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = () => {
    const pathTitles = {
      '/faq': 'Quản lý FAQ',
      '/conversations': 'Hội thoại gắn cờ',
      '/materials': 'Tài liệu học tập',
      '/analytics': 'Thống kê câu hỏi',
      '/knowledge-gap': 'Lỗ hổng kiến thức',
      '/learning-outcomes': 'Mục tiêu & Thách thức'
    };

    // Handle dynamic routes
    if (location.pathname.startsWith('/conversations/')) {
      return 'Chi tiết hội thoại';
    }
    if (location.pathname.startsWith('/knowledge-gap/quiz/')) {
      return 'Chi tiết quiz';
    }

    return pathTitles[location.pathname] || 'Faculty Module';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Global search functionality - could be implemented later
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    // Logout functionality
    console.log('Logging out...');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="header-title">
        {getPageTitle()}
      </div>
      
      <div className="header-actions">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-box"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="user-menu" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="user-avatar">
            {user.avatar}
          </div>
          <span>{user.name}</span>
          <span style={{ marginLeft: '4px' }}>▼</span>
          
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '150px',
              zIndex: 1000
            }}>
              <div style={{
                padding: '8px 16px',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '12px',
                color: '#8c8c8c'
              }}>
                Đăng nhập với tư cách
              </div>
              <div style={{
                padding: '8px 16px',
                fontWeight: '500'
              }}>
                {user.name}
              </div>
              <div style={{
                borderTop: '1px solid #f0f0f0'
              }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
