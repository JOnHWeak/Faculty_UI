import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { updateMaterial } from '../../services/mockApi';

const EditMaterialForm = ({ material, onSuccess, onCancel }) => {
  const { setLoading, showNotification } = useApp();
  const [learningObjectives, setLearningObjectives] = useState('');
  const [commonChallenges, setCommonChallenges] = useState('');

  useEffect(() => {
    if (material) {
      setLearningObjectives(material.learningObjectives || '');
      setCommonChallenges(material.commonChallenges || '');
    }
  }, [material]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await updateMaterial(material.id, {
        learningObjectives,
        commonChallenges,
      });

      if (response.success) {
        showNotification('Cập nhật tài liệu thành công', 'success');
        onSuccess();
      } else {
        throw new Error(response.message || 'Cập nhật tài liệu thất bại');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!material) return null;

  return (
    <div className="edit-form">
      <div className="card-header">
        <h3 className="card-title">Chỉnh sửa tài liệu</h3>
        <p style={{color: '#8c8c8c'}}>{material.fileName}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Mục tiêu học tập</label>
            <textarea
              className="form-input"
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              placeholder="Nhập mục tiêu học tập cho tài liệu này..."
              rows="4"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thách thức thường gặp</label>
            <textarea
              className="form-input"
              value={commonChallenges}
              onChange={(e) => setCommonChallenges(e.target.value)}
              placeholder="Nhập các thách thức thường gặp khi học tài liệu này..."
              rows="4"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMaterialForm;

