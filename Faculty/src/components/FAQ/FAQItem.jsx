import React, { useState } from 'react';

const FAQItem = ({ faq, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div style={{ flex: 1 }}>
            <h5 className="card-title mb-1" style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}>
              {faq.question}
              <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                {expanded ? '▼' : '▶'}
              </span>
            </h5>
            
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="status-badge" style={{ 
                backgroundColor: '#e6f7ff', 
                color: '#0958d9',
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {faq.course}
              </span>
              
              <div className="d-flex gap-1">
                {faq.tags.map(tag => (
                  <span key={tag} style={{
                    backgroundColor: '#f6ffed',
                    color: '#389e0d',
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    border: '1px solid #b7eb8f'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onEdit(faq)}
              title="Chỉnh sửa"
            >
              ✏️
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(faq.id)}
              title="Xóa"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="mb-2">
          <p className="mb-1" style={{ color: '#595959' }}>
            {expanded ? faq.answer : truncateText(faq.answer)}
          </p>
          
          {!expanded && faq.answer.length > 150 && (
            <button
              className="btn btn-sm"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1890ff', 
                padding: '0',
                textDecoration: 'underline'
              }}
              onClick={() => setExpanded(true)}
            >
              Xem thêm
            </button>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center text-muted" 
             style={{ fontSize: '12px' }}>
          <div className="d-flex align-items-center gap-3">
            <span>👁️ Đã sử dụng: {faq.usageCount} lần</span>
            <span>👤 Cập nhật bởi: {faq.updatedBy}</span>
          </div>
          <span>🕒 {formatDate(faq.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
