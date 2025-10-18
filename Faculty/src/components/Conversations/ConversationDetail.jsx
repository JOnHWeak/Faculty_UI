import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  getConversationDetail,
  updateConversationStatus,
  updateAIResponse
} from '../../services/mockApi';
import MessageThread from './MessageThread';
import ActionPanel from './ActionPanel';
import AIResponseEditor from './AIResponseEditor';

const ConversationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading, showNotification } = useApp();
  const [conversation, setConversation] = useState(null);
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [selectedAIMessage, setSelectedAIMessage] = useState(null);


  useEffect(() => {
    loadConversationDetail();
  }, [id]);

  const loadConversationDetail = async () => {
    try {
      setLoading(true);
      const response = await getConversationDetail(id);
      if (response.success) {
        setConversation(response.data);
      } else {
        showNotification('Không tìm thấy hội thoại', 'error');
        navigate('/conversations');
      }
    } catch (error) {
      showNotification('Lỗi khi tải chi tiết hội thoại', 'error');
      navigate('/conversations');
    } finally {
      setLoading(false);
    }
  };



  const handleStatusUpdate = async (newStatus, reason) => {
    try {
      setLoading(true);
      const response = await updateConversationStatus(id, newStatus);
      if (response.success) {
        setConversation(response.data);
        showNotification(`Đã cập nhật trạng thái thành "${newStatus}"`, 'success');
      }
    } catch (error) {
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    } finally {
      setLoading(false);
    }
  };





  const handleMarkAsRead = async () => {
    await handleStatusUpdate('Đang xử lý', 'Đã đọc và đang xử lý');
  };

  const handleResolve = async (reason) => {
    await handleStatusUpdate('Đã giải quyết', reason);
  };

  const handleOpenAIEditor = () => {
    const aiMessage = conversation.messages.find(m => m.author === 'AI');
    if (aiMessage) {
      setSelectedAIMessage(aiMessage);
      setShowAIEditor(true);
    } else {
      showNotification('Không tìm thấy câu trả lời của AI để chỉnh sửa', 'warning');
    }
  };

  const handleSaveAIResponse = async (messageId, newContent) => {
    try {
      const response = await updateAIResponse(id, messageId, newContent);
      if (response.success) {
        setConversation(response.data);
        showNotification('Đã cập nhật câu trả lời của AI', 'success');
      } else {
        showNotification(response.message || 'Lỗi khi cập nhật câu trả lời của AI', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi cập nhật câu trả lời của AI', 'error');
    }
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

  if (!conversation) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="conversation-detail">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/conversations')}
          >
            ← Quay lại
          </button>
          <h1>Chi tiết hội thoại {conversation.id}</h1>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className={`status-badge ${
            conversation.status === 'Mới' ? 'status-new' :
            conversation.status === 'Đang xử lý' ? 'status-processing' :
            'status-resolved'
          }`}>
            {conversation.status}
          </span>

        </div>
      </div>

      <div className="d-flex gap-3">
        {/* Main Content */}
        <div style={{ flex: 2 }}>
          {/* Conversation Info */}
          <div className="card mb-3">
            <div className="card-header">
              <h3 className="card-title">Thông tin hội thoại</h3>
            </div>
            <div className="card-body">
              <div className="d-flex gap-4">
                <div>
                  <strong>Sinh viên:</strong> {conversation.student.name}
                </div>
                <div>
                  <strong>Lý do gắn cờ:</strong> {conversation.flagReason}
                </div>
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <MessageThread messages={conversation.messages} />


        </div>

        {/* Sidebar */}
        <div style={{ flex: 1 }}>
          {/* Student Info */}
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Thông tin sinh viên</h4>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={conversation.student.avatar}
                  alt={conversation.student.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>{conversation.student.name}</div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    ID: {conversation.student.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Tệp đính kèm</h4>
            </div>
            <div className="card-body">
              {conversation.metadata.sources && conversation.metadata.sources.length > 0 ? (
                <div>
                  {conversation.metadata.sources.map((source, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2 p-2"
                         style={{
                           backgroundColor: '#f8f9fa',
                           borderRadius: '6px',
                           border: '1px solid #e9ecef'
                         }}>
                      <div style={{ fontSize: '16px' }}>📄</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          {source.split('/').pop() || `Document ${index + 1}`}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          {source}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => window.open(source, '_blank')}
                        style={{ fontSize: '12px' }}
                      >
                        📥 Tải xuống
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#8c8c8c', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                  Không có tệp đính kèm
                </div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          <ActionPanel
            conversation={conversation}
            onMarkAsRead={handleMarkAsRead}
            onResolve={handleResolve}
            onEditAIResponse={handleOpenAIEditor}
          />


        </div>
      </div>

      {/* AI Response Editor */}
      <AIResponseEditor
        isOpen={showAIEditor}
        onClose={() => setShowAIEditor(false)}
        aiMessage={selectedAIMessage}
        onSave={handleSaveAIResponse}
      />
    </div>
  );
};

export default ConversationDetail;
