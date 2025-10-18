import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { updateOutcome, addOutcome, deleteOutcome } from '../../services/mockApi';

const OutcomeEditor = ({ courseId, outcomes, onUpdate }) => {
  const { setLoading, showNotification } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOutcomeText, setNewOutcomeText] = useState('');

  const handleEdit = (outcome) => {
    setEditingId(outcome.id);
    setEditText(outcome.text);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      showNotification('Nội dung mục tiêu không được để trống', 'warning');
      return;
    }

    try {
      setLoading(true);
      await updateOutcome(courseId, editingId, { text: editText });
      showNotification('Cập nhật mục tiêu thành công', 'success');
      setEditingId(null);
      setEditText('');
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi cập nhật mục tiêu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleToggleComplete = async (outcome) => {
    try {
      setLoading(true);
      await updateOutcome(courseId, outcome.id, { completed: !outcome.completed });
      showNotification(
        outcome.completed ? 'Đã đánh dấu chưa hoàn thành' : 'Đã đánh dấu hoàn thành',
        'success'
      );
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOutcome = async () => {
    if (!newOutcomeText.trim()) {
      showNotification('Nội dung mục tiêu không được để trống', 'warning');
      return;
    }

    try {
      setLoading(true);
      await addOutcome(courseId, { text: newOutcomeText });
      showNotification('Thêm mục tiêu mới thành công', 'success');
      setShowAddForm(false);
      setNewOutcomeText('');
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi thêm mục tiêu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutcome = async (outcomeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteOutcome(courseId, outcomeId);
      showNotification('Xóa mục tiêu thành công', 'success');
      onUpdate();
    } catch (error) {
      showNotification('Lỗi khi xóa mục tiêu', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outcome-editor">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Mục tiêu học tập (Learning Outcomes)</h4>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Thêm mục tiêu
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card mb-3" style={{ borderColor: '#1890ff' }}>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Mục tiêu học tập mới:</label>
              <textarea
                className="form-textarea"
                value={newOutcomeText}
                onChange={(e) => setNewOutcomeText(e.target.value)}
                placeholder="Nhập mục tiêu học tập..."
                rows={3}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewOutcomeText('');
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddOutcome}
              >
                Thêm mục tiêu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outcomes List */}
      {outcomes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h3>Chưa có mục tiêu học tập</h3>
          <p>Hãy thêm mục tiêu học tập đầu tiên cho môn học này</p>
        </div>
      ) : (
        <div className="outcomes-list">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.id}
              className="card mb-2"
              style={{
                borderColor: outcome.completed ? '#52c41a' : '#d9d9d9',
                backgroundColor: outcome.completed ? '#f6ffed' : 'white'
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  {/* Checkbox */}
                  <div style={{ paddingTop: '2px' }}>
                    <input
                      type="checkbox"
                      checked={outcome.completed}
                      onChange={() => handleToggleComplete(outcome)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span style={{
                        backgroundColor: '#f0f0f0',
                        color: '#595959',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        LO{index + 1}
                      </span>
                      {outcome.completed && (
                        <span style={{
                          backgroundColor: '#f6ffed',
                          color: '#389e0d',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          ✅ Hoàn thành
                        </span>
                      )}
                    </div>

                    {editingId === outcome.id ? (
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
                          textDecoration: outcome.completed ? 'line-through' : 'none',
                          color: outcome.completed ? '#8c8c8c' : '#262626'
                        }}
                      >
                        {outcome.text}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {editingId !== outcome.id && (
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(outcome)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteOutcome(outcome.id)}
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
      {outcomes.length > 0 && (
        <div className="card mt-3" style={{ backgroundColor: '#fafafa' }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Tổng quan:</strong> {outcomes.length} mục tiêu
              </div>
              <div className="d-flex gap-4">
                <div>
                  <span style={{ color: '#52c41a', fontWeight: '600' }}>
                    {outcomes.filter(o => o.completed).length}
                  </span> đã hoàn thành
                </div>
                <div>
                  <span style={{ color: '#faad14', fontWeight: '600' }}>
                    {outcomes.filter(o => !o.completed).length}
                  </span> chưa hoàn thành
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutcomeEditor;
