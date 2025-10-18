import React from 'react';

const MessageThread = ({ messages }) => {
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

  const getSourceBadge = (sourceLabel, role, aiConfidence) => {
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
        {role === 'ai' && aiConfidence && (
          <span style={{ 
            marginLeft: '4px',
            color: aiConfidence < 30 ? '#ff4d4f' : 
                   aiConfidence < 70 ? '#faad14' : '#52c41a'
          }}>
            ({aiConfidence}%)
          </span>
        )}
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
              {getSourceBadge(message.sourceLabel, message.author.role, message.aiConfidence)}
              
              {/* Author Info */}
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '600',
                color: '#262626',
                marginBottom: '4px'
              }}>
                {message.author.name}
              </div>
              
              {/* Message Content */}
              <div style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#262626',
                marginBottom: '8px'
              }}>
                {message.content}
              </div>
              
              {/* Timestamp */}
              <div style={{ 
                fontSize: '11px',
                color: '#8c8c8c',
                textAlign: 'right'
              }}>
                {formatDate(message.timestamp)}
              </div>
              
              {/* AI Confidence Indicator for AI messages */}
              {message.author.role === 'ai' && message.aiConfidence && (
                <div style={{ 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    Độ tin cậy:
                  </span>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${message.aiConfidence}%`,
                        height: '100%',
                        backgroundColor: message.aiConfidence < 30 ? '#ff4d4f' : 
                                       message.aiConfidence < 70 ? '#faad14' : '#52c41a',
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                  <span style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    color: message.aiConfidence < 30 ? '#ff4d4f' : 
                           message.aiConfidence < 70 ? '#faad14' : '#52c41a'
                  }}>
                    {message.aiConfidence}%
                  </span>
                </div>
              )}
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
