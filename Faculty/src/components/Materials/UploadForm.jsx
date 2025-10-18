import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { uploadMaterial } from '../../services/mockApi';

const UploadForm = ({ semester, onSuccess, onCancel }) => {
  const { setLoading, showNotification } = useApp();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [learningObjectives, setLearningObjectives] = useState('');
  const [commonChallenges, setCommonChallenges] = useState('');

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      showNotification('Chỉ chấp nhận file PDF', 'warning');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      showNotification('Vui lòng chọn môn học', 'warning');
      return;
    }
    
    if (!selectedFile) {
      showNotification('Vui lòng chọn file PDF', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await uploadMaterial({
        semesterId: semester.id,
        courseId: selectedCourse,
        file: selectedFile,
        learningObjectives: learningObjectives,
        commonChallenges: commonChallenges
      });
      
      if (response.success) {
        showNotification('Tải lên tài liệu thành công', 'success');
        onSuccess();
      }
    } catch (error) {
      showNotification('Lỗi khi tải lên tài liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-form">
      <div className="card-header">
        <h3 className="card-title">Tải lên tài liệu</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Kỳ học</label>
            <input
              type="text"
              className="form-input"
              value={semester.name}
              disabled
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Môn học *</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Chọn môn học</option>
              {semester.courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Mục tiêu học tập</label>
            <textarea
              className="form-input"
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              placeholder="Nhập mục tiêu học tập cho tài liệu này..."
              rows="3"
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
              rows="3"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tài liệu PDF *</label>
            
            {/* Drag & Drop Area */}
            <div
              className={`upload-area ${dragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: `2px dashed ${dragOver ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: dragOver ? '#f0f8ff' : '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {formatFileSize(selectedFile.size)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    Chọn file khác
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📤</div>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    Kéo thả file PDF vào đây
                  </div>
                  <div style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '12px' }}>
                    hoặc click để chọn file
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    Chỉ chấp nhận file PDF, tối đa 50MB
                  </div>
                </div>
              )}
            </div>

            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Upload Progress */}
          {selectedFile && (
            <div className="form-group">
              <div style={{ 
                padding: '12px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                <div className="d-flex align-items-center gap-2">
                  <span>✅</span>
                  <span>File đã sẵn sàng để tải lên</span>
                </div>
              </div>
            </div>
          )}
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
            disabled={!selectedCourse || !selectedFile}
          >
            📤 Tải lên
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
