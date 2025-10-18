import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { createFAQ, updateFAQ } from '../../services/mockApi';

const FAQForm = ({ faq, courses, onSuccess, onCancel }) => {
  const { setLoading, showNotification } = useApp();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    course: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        course: faq.course,
        tags: [...faq.tags]
      });
    }
  }, [faq]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Câu hỏi không được để trống';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Câu trả lời không được để trống';
    }
    
    if (!formData.course) {
      newErrors.course = 'Vui lòng chọn môn học';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Vui lòng thêm ít nhất một tag';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (faq) {
        await updateFAQ(faq.id, formData);
        showNotification('Cập nhật FAQ thành công', 'success');
      } else {
        await createFAQ(formData);
        showNotification('Tạo FAQ mới thành công', 'success');
      }
      
      onSuccess();
    } catch (error) {
      showNotification('Lỗi khi lưu FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
      if (errors.tags) {
        setErrors({ ...errors, tags: null });
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="faq-form">
      <div className="card-header">
        <h3 className="card-title">
          {faq ? 'Chỉnh sửa FAQ' : 'Thêm FAQ mới'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Câu hỏi *</label>
            <input
              type="text"
              className={`form-input ${errors.question ? 'error' : ''}`}
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="Nhập câu hỏi..."
            />
            {errors.question && (
              <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                {errors.question}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Câu trả lời *</label>
            <textarea
              className={`form-textarea ${errors.answer ? 'error' : ''}`}
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              placeholder="Nhập câu trả lời chi tiết..."
              rows={6}
            />
            {errors.answer && (
              <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                {errors.answer}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Môn học *</label>
            <select
              className={`form-select ${errors.course ? 'error' : ''}`}
              value={formData.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
            >
              <option value="">Chọn môn học</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            {errors.course && (
              <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                {errors.course}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Tags *</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Nhập tag và nhấn Enter"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Thêm
              </button>
            </div>
            
            <div className="d-flex gap-1 flex-wrap">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#f6ffed',
                    color: '#389e0d',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid #b7eb8f'
                  }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#389e0d',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: '14px'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            {errors.tags && (
              <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                {errors.tags}
              </div>
            )}
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
            {faq ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: #ff4d4f;
        }
      `}</style>
    </div>
  );
};

export default FAQForm;
