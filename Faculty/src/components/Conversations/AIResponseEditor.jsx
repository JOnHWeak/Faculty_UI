import React, { useState, useEffect } from 'react';

const AIResponseEditor = ({ 
  isOpen, 
  onClose, 
  aiMessage, 
  onSave 
}) => {
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (aiMessage) {
      setEditedContent(aiMessage.content);
    }
  }, [aiMessage]);

  const handleSave = async () => {
    if (!editedContent.trim()) {
      alert('Nội dung không được để trống');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(aiMessage.id, editedContent);
      onClose();
    } catch (error) {
      console.error('Error saving AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(aiMessage?.content || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '700px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">Chỉnh sửa câu trả lời AI</h4>
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleCancel}
            style={{ padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
          {aiMessage && (
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  AI
                </div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    Trợ lý AI
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {new Date(aiMessage.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">
                  <strong>Nội dung câu trả lời hiện tại:</strong>
                </label>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  maxHeight: '150px',
                  overflow: 'auto'
                }}>
                  {aiMessage.content}
                </div>
              </div>

              <div>
                <label className="form-label">
                  <strong>Chỉnh sửa nội dung:</strong>
                </label>
                <textarea
                  className="form-control"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Nhập nội dung câu trả lời đã chỉnh sửa..."
                  rows={8}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Số ký tự: {editedContent.length}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Hủy
          </button>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => setEditedContent(aiMessage?.content || '')}
              disabled={isLoading}
            >
              Khôi phục
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isLoading || !editedContent.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Đang lưu...
                </>
              ) : (
                '💾 Lưu thay đổi'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResponseEditor;
