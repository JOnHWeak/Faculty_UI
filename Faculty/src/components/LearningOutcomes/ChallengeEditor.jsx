import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { updateChallenge, addChallenge, deleteChallenge } from '../../services/mockApi';

const ChallengeEditor = ({ courseId, challenges, onUpdate }) => {
  const { setLoading, showNotification } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChallengeText, setNewChallengeText] = useState('');

  const handleEdit = (challenge) => {
    setEditingId(challenge.id);
    setEditText(challenge.text);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      showNotification('Nội dung thách thức không được để trống', 'warning');
      return;
    }

    try {
      setLoading(true);
      await updateChallenge(courseId, editingId, { text: editText });
      showNotification('Cập nhật thách thức thành công', 'success');
      setEditingId(null);
      setEditText('');
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi cập nhật thách thức', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleAddChallenge = async () => {
    if (!newChallengeText.trim()) {
      showNotification('Nội dung thách thức không được để trống', 'warning');
      return;
    }

    try {
      setLoading(true);
      await addChallenge(courseId, { text: newChallengeText });
      showNotification('Thêm thách thức mới thành công', 'success');
      setShowAddForm(false);
      setNewChallengeText('');
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi thêm thách thức', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thách thức này?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteChallenge(courseId, challengeId);
      showNotification('Xóa thách thức thành công', 'success');
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi xóa thách thức', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="challenge-editor">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Thách thức thường gặp (Common Challenges)</h4>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Thêm thách thức
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card mb-3" style={{ borderColor: '#faad14' }}>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Thách thức mới:</label>
              <textarea
                className="form-textarea"
                value={newChallengeText}
                onChange={(e) => setNewChallengeText(e.target.value)}
                placeholder="Nhập thách thức thường gặp..."
                rows={3}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewChallengeText('');
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddChallenge}
              >
                Thêm thách thức
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3>Chưa có thách thức nào</h3>
          <p>Hãy thêm thách thức thường gặp đầu tiên cho môn học này</p>
        </div>
      ) : (
        <div className="challenges-list">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="card mb-2"
              style={{
                borderColor: '#faad14',
                backgroundColor: '#fff7e6'
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  {/* Warning Icon */}
                  <div style={{ paddingTop: '2px', fontSize: '18px' }}>
                    ⚠️
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span style={{
                        backgroundColor: '#fff1b8',
                        color: '#d48806',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        CH{index + 1}
                      </span>
                      <span style={{
                        backgroundColor: '#fff7e6',
                        color: '#d48806',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        Thách thức
                      </span>
                    </div>

                    {editingId === challenge.id ? (
                      <div>
                        <textarea
                          className="form-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                        />
                        <div className="d-flex gap-2 mt-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={handleSaveEdit}
                          >
                            Lưu
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#262626'
                        }}
                      >
                        {challenge.text}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {editingId !== challenge.id && (
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(challenge)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {challenges.length > 0 && (
        <div className="card mt-3" style={{ backgroundColor: '#fafafa' }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Tổng quan:</strong> {challenges.length} thách thức được xác định
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Những thách thức này giúp giảng viên hiểu rõ khó khăn của sinh viên
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card mt-3" style={{ borderColor: '#52c41a', backgroundColor: '#f6ffed' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
            <div style={{ fontSize: '16px' }}>💡</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px', color: '#389e0d' }}>
                Gợi ý quản lý thách thức:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#595959' }}>
                <li>Ghi chú những khó khăn mà sinh viên thường gặp phải</li>
                <li>Cập nhật thường xuyên dựa trên feedback từ sinh viên</li>
                <li>Sử dụng thông tin này để cải thiện phương pháp giảng dạy</li>
                <li>Tạo tài liệu hỗ trợ cho những thách thức phổ biến</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeEditor;
