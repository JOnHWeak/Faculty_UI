import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  getConversationDetail, 
  updateConversationStatus, 
  assignConversation, 
  addConversationReply,
  getFacultyMembers 
} from '../../services/mockApi';
import MessageThread from './MessageThread';
import ActionPanel from './ActionPanel';

const ConversationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading, showNotification } = useApp();
  const [conversation, setConversation] = useState(null);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadConversationDetail();
    loadFacultyMembers();
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

  const loadFacultyMembers = async () => {
    try {
      const response = await getFacultyMembers();
      setFacultyMembers(response.data);
    } catch (error) {
      console.error('Error loading faculty members:', error);
    }
  };

  const handleStatusUpdate = async (newStatus, reason) => {
    try {
      setLoading(true);
      const auditEntry = {
        action: `Cập nhật trạng thái thành "${newStatus}"`,
        user: "Current User",
        details: reason || `Trạng thái được thay đổi thành ${newStatus}`
      };
      
      const response = await updateConversationStatus(id, newStatus, auditEntry);
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

  const handleAssignment = async (facultyId) => {
    try {
      setLoading(true);
      const faculty = facultyMembers.find(f => f.id === facultyId);
      const auditEntry = {
        action: "Phân công xử lý",
        user: "Current User",
        details: `Phân công cho ${faculty?.name || 'Unknown'}`
      };
      
      const response = await assignConversation(id, facultyId, auditEntry);
      if (response.success) {
        setConversation(response.data);
        showNotification(`Đã phân công cho ${faculty?.name}`, 'success');
      }
    } catch (error) {
      showNotification('Lỗi khi phân công', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      showNotification('Vui lòng nhập nội dung trả lời', 'warning');
      return;
    }

    try {
      setLoading(true);
      const replyData = {
        author: "Current User",
        content: replyContent
      };
      
      const auditEntry = {
        action: "Trả lời công khai",
        user: "Current User",
        details: "Đã gửi trả lời công khai cho sinh viên"
      };
      
      const response = await addConversationReply(id, replyData, auditEntry);
      if (response.success) {
        setConversation(response.data);
        setReplyContent('');
        setShowReplyForm(false);
        showNotification('Đã gửi trả lời thành công', 'success');
      }
    } catch (error) {
      showNotification('Lỗi khi gửi trả lời', 'error');
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
          <span className={`status-badge ${
            conversation.priority === 'Cao' ? 'priority-high' :
            conversation.priority === 'Trung bình' ? 'priority-medium' :
            'priority-low'
          }`}>
            {conversation.priority}
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
                  <strong>Môn học:</strong> {conversation.course}
                </div>
                <div>
                  <strong>Lý do gắn cờ:</strong> {conversation.flagReason}
                </div>
                <div>
                  <strong>Độ tin cậy AI:</strong> 
                  <span style={{ 
                    color: conversation.aiConfidence < 30 ? '#ff4d4f' : 
                           conversation.aiConfidence < 70 ? '#faad14' : '#52c41a',
                    fontWeight: '600',
                    marginLeft: '4px'
                  }}>
                    {conversation.aiConfidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <MessageThread messages={conversation.messages} />

          {/* Reply Form */}
          {showReplyForm && (
            <div className="card mt-3">
              <div className="card-header">
                <h4 className="card-title">Trả lời công khai</h4>
              </div>
              <div className="card-body">
                <textarea
                  className="form-textarea"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn..."
                  rows={4}
                />
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleReply}
                  >
                    Gửi trả lời
                  </button>
                </div>
              </div>
            </div>
          )}
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

          {/* Metadata */}
          <div className="card mb-3">
            <div className="card-header">
              <h4 className="card-title">Metadata</h4>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Roadmap Node:</strong>
                <div style={{ fontSize: '14px', color: '#595959' }}>
                  {conversation.metadata.roadmapNode}
                </div>
              </div>
              <div className="mb-2">
                <strong>AI Model:</strong>
                <div style={{ fontSize: '14px', color: '#595959' }}>
                  {conversation.metadata.aiModel}
                </div>
              </div>
              <div>
                <strong>Sources:</strong>
                <div style={{ fontSize: '14px', color: '#595959' }}>
                  {conversation.metadata.sources.map((source, index) => (
                    <div key={index}>• {source}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <ActionPanel
            conversation={conversation}
            facultyMembers={facultyMembers}
            onStatusUpdate={handleStatusUpdate}
            onAssignment={handleAssignment}
            onMarkAsRead={handleMarkAsRead}
            onResolve={handleResolve}
            onShowReplyForm={() => setShowReplyForm(true)}
          />

          {/* Audit Trail */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Lịch sử thao tác</h4>
            </div>
            <div className="card-body">
              {conversation.auditTrail.length === 0 ? (
                <div style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                  Chưa có thao tác nào
                </div>
              ) : (
                <div>
                  {conversation.auditTrail.map((entry, index) => (
                    <div key={index} className="mb-2" style={{ 
                      paddingBottom: '8px',
                      borderBottom: index < conversation.auditTrail.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>
                        {entry.action}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        {entry.user} • {formatDate(entry.timestamp)}
                      </div>
                      {entry.details && (
                        <div style={{ fontSize: '12px', color: '#595959', marginTop: '2px' }}>
                          {entry.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;
