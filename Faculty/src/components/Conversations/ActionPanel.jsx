import React, { useState } from 'react';

const ActionPanel = ({
  conversation,
  onMarkAsRead,
  onResolve
}) => {
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveReason, setResolveReason] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');



  const handleResolve = () => {
    if (resolveReason.trim()) {
      onResolve(resolveReason);
      setShowResolveModal(false);
      setResolveReason('');
    }
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      // TODO: Implement report functionality
      console.log('Báo cáo cuộc hội thoại:', reportReason);
      setShowReportModal(false);
      setReportReason('');
      alert('Báo cáo đã được gửi thành công!');
    }
  };

  const canMarkAsRead = conversation.status === 'Mới';
  const canResolve = conversation.status !== 'Đã giải quyết';

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h4 className="card-title">Thao tác</h4>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-2">
          {/* Mark as Read
          {canMarkAsRead && (
            <button
              className="btn btn-primary w-100"
              onClick={onMarkAsRead}
            >
              ✓ Xác nhận đã đọc
            </button>
          )} */}



          {/* Resolve */}
          {canResolve && (
            <button
              className="btn btn-success w-100"
              onClick={() => setShowResolveModal(true)}
            >
              ✅ Đánh dấu đã giải quyết
            </button>
          )}

          {/* Report Conversation */}
          <button
            className="btn btn-danger w-100"
            onClick={() => setShowReportModal(true)}
          >
            ⚠️ Báo cáo cuộc hội thoại
          </button>
        </div>


      </div>



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

      {/* Report Modal */}
      {showReportModal && (
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
              <h4 className="card-title">Báo cáo cuộc trò chuyện cho Admin</h4>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Lý do báo cáo:</label>
                <textarea
                  className="form-textarea"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Nhập lý do báo cáo cuộc hội thoại này..."
                  rows={4}
                />
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReport}
                disabled={!reportReason.trim()}
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
