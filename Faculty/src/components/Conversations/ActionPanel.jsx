import React, { useState } from 'react';

const ActionPanel = ({ 
  conversation, 
  facultyMembers, 
  onStatusUpdate, 
  onAssignment, 
  onMarkAsRead, 
  onResolve, 
  onShowReplyForm 
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [resolveReason, setResolveReason] = useState('');

  const handleAssign = () => {
    if (selectedFaculty) {
      onAssignment(selectedFaculty);
      setShowAssignModal(false);
      setSelectedFaculty('');
    }
  };

  const handleResolve = () => {
    if (resolveReason.trim()) {
      onResolve(resolveReason);
      setShowResolveModal(false);
      setResolveReason('');
    }
  };

  const canMarkAsRead = conversation.status === 'Mới';
  const canAssign = conversation.status !== 'Đã giải quyết';
  const canResolve = conversation.status !== 'Đã giải quyết';
  const canReply = conversation.status !== 'Đã giải quyết';

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h4 className="card-title">Thao tác</h4>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-2">
          {/* Mark as Read */}
          {canMarkAsRead && (
            <button
              className="btn btn-primary w-100"
              onClick={onMarkAsRead}
            >
              ✓ Xác nhận đã đọc
            </button>
          )}

          {/* Assign */}
          {canAssign && (
            <button
              className="btn btn-secondary w-100"
              onClick={() => setShowAssignModal(true)}
            >
              👥 Phân công xử lý
            </button>
          )}

          {/* Reply */}
          {canReply && (
            <button
              className="btn btn-success w-100"
              onClick={onShowReplyForm}
            >
              💬 Trả lời công khai
            </button>
          )}

          {/* Edit AI Response */}
          <button
            className="btn btn-secondary w-100"
            onClick={() => alert('Chức năng chỉnh sửa câu trả lời AI sẽ được phát triển')}
          >
            ✏️ Chỉnh sửa câu trả lời AI
          </button>

          {/* Escalate */}
          <button
            className="btn"
            style={{ backgroundColor: '#faad14', color: 'white' }}
            onClick={() => alert('Chức năng báo cáo leo thang sẽ được phát triển')}
          >
            ⚠️ Báo cáo leo thang
          </button>

          {/* Resolve */}
          {canResolve && (
            <button
              className="btn btn-success w-100"
              onClick={() => setShowResolveModal(true)}
            >
              ✅ Đánh dấu đã giải quyết
            </button>
          )}
        </div>

        {/* Current Assignment */}
        {conversation.assignedTo && (
          <div style={{ 
            marginTop: '16px',
            padding: '8px',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <strong>Đã phân công cho:</strong> {conversation.assignedTo}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
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
            width: '400px',
            maxWidth: '90vw'
          }}>
            <div className="card-header">
              <h4 className="card-title">Phân công xử lý</h4>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Chọn giảng viên:</label>
                <select
                  className="form-select"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="">Chọn giảng viên</option>
                  {facultyMembers.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedFaculty('');
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAssign}
                disabled={!selectedFaculty}
              >
                Phân công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
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
            width: '500px',
            maxWidth: '90vw'
          }}>
            <div className="card-header">
              <h4 className="card-title">Đánh dấu đã giải quyết</h4>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Lý do giải quyết:</label>
                <textarea
                  className="form-textarea"
                  value={resolveReason}
                  onChange={(e) => setResolveReason(e.target.value)}
                  placeholder="Nhập lý do tại sao vấn đề đã được giải quyết..."
                  rows={4}
                />
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowResolveModal(false);
                  setResolveReason('');
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-success"
                onClick={handleResolve}
                disabled={!resolveReason.trim()}
              >
                Đánh dấu đã giải quyết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
