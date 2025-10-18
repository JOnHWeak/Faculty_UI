import React, { useState } from 'react';

const MessageThread = ({ messages, onUpdateMessage }) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleStartEdit = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleSaveEdit = async (messageId) => {
    if (onUpdateMessage && editContent.trim()) {
      try {
        await onUpdateMessage(messageId, editContent.trim());
        setEditingMessageId(null);
        setEditContent('');
      } catch (error) {
        console.error('Error updating message:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (role) => {
    const baseStyle = {
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '12px',
      maxWidth: '80%'
    };

    switch (role) {
      case 'student':
        return {
          ...baseStyle,
          backgroundColor: '#f0f0f0',
          alignSelf: 'flex-start',
          marginRight: 'auto'
        };
      case 'ai':
        return {
          ...baseStyle,
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          alignSelf: 'flex-end',
          marginLeft: 'auto'
        };
      case 'faculty':
        return {
          ...baseStyle,
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          alignSelf: 'flex-end',
          marginLeft: 'auto'
        };
      default:
        return baseStyle;
    }
  };

  const getSourceBadge = (sourceLabel, role) => {
    let badgeStyle = {
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: '8px',
      fontWeight: '500',
      marginBottom: '4px',
      display: 'inline-block'
    };

    switch (role) {
      case 'student':
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: '#fff2e8',
          color: '#d46b08'
        };
        break;
      case 'ai':
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: '#e6f7ff',
          color: '#0958d9'
        };
        break;
      case 'faculty':
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: '#f6ffed',
          color: '#389e0d'
        };
        break;
      default:
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: '#f5f5f5',
          color: '#595959'
        };
    }

    return (
      <div style={badgeStyle}>
        {sourceLabel}

      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Luồng hội thoại</h3>
      </div>
      <div className="card-body">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '8px',
          minHeight: '400px',
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '16px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                ...getMessageStyle(message.author.role)
              }}
            >
              {/* Source Badge */}
              {getSourceBadge(message.sourceLabel, message.author.role)}
              
              {/* Author Info & Edit Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#262626',
                }}>
                  {message.author.name}
                </div>
                {message.author.role === 'ai' && editingMessageId !== message.id && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    style={{ fontSize: '11px', padding: '1px 5px' }}
                    onClick={() => handleStartEdit(message)}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                )}
              </div>

              {/* Message Content or Editor */}
              {editingMessageId === message.id ? (
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    style={{ resize: 'vertical', fontSize: '14px' }}
                  />
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleSaveEdit(message.id)}
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#262626',
                  marginBottom: '8px'
                }}>
                  {message.content}
                </div>
              )}
              
              {/* Timestamp */}
              <div style={{ 
                fontSize: '11px',
                color: '#8c8c8c',
                textAlign: 'right'
              }}>
                {formatDate(message.timestamp)}
              </div>
              

            </div>
          ))}
        </div>
        
        {/* Message Count */}
        <div style={{ 
          borderTop: '1px solid #f0f0f0',
          paddingTop: '12px',
          fontSize: '12px',
          color: '#8c8c8c',
          textAlign: 'center'
        }}>
          Tổng cộng {messages.length} tin nhắn
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
