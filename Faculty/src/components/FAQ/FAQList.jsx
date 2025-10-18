import React from 'react';
import FAQItem from './FAQItem';

const FAQList = ({ faqs, onEdit, onDelete }) => {
  if (faqs.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div style={{ padding: '40px', color: '#8c8c8c' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3>Chưa có FAQ nào</h3>
            <p>Hãy thêm FAQ đầu tiên để bắt đầu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-list">
      {faqs.map(faq => (
        <FAQItem
          key={faq.id}
          faq={faq}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FAQList;
