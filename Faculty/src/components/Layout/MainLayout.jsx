import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../contexts/AppContext';

const MainLayout = () => {
  const { loading, error } = useApp();

  return (
    <div className="main-layout">
      <Sidebar />
      
      <div className="content-area">
        <Header />
        
        <main className="main-content">
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          )}
          
          {error && (
            <div className="card" style={{ borderColor: '#ff4d4f', backgroundColor: '#fff2f0' }}>
              <div className="card-body">
                <div style={{ color: '#cf1322', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            </div>
          )}
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
