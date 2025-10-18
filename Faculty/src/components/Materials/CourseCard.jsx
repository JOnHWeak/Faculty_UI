import React, { useState } from 'react';
import MaterialList from './MaterialList';

const CourseCard = ({ course, semesterId, onDeleteMaterial, onEditMaterial }) => {
  const [expanded, setExpanded] = useState(false);

  const formatFileSize = (sizeStr) => {
    return sizeStr;
  };

  const getTotalSize = () => {
    if (!course.materials || course.materials.length === 0) return '0 MB';
    
    // Simple calculation - in real app would properly parse and sum sizes
    const totalMB = course.materials.length * 3.2; // Average size
    return `${totalMB.toFixed(1)} MB`;
  };

  const getLatestUpload = () => {
    if (!course.materials || course.materials.length === 0) return null;
    
    const latest = course.materials.reduce((latest, material) => {
      return new Date(material.uploadedAt) > new Date(latest.uploadedAt) ? material : latest;
    });
    
    return new Date(latest.uploadedAt).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="card">
      <div className="card-header" style={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="card-title mb-1" style={{ color: '#1890ff' }}>
              {course.name}
            </h4>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Mã môn: {course.code}
            </div>
          </div>
          <div className="text-right">
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {course.materials?.length || 0} tài liệu
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {expanded ? '▼' : '▶'} {expanded ? 'Thu gọn' : 'Xem chi tiết'}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="card-body" style={{ padding: 0 }}>
          {/* Course Stats */}
          <div style={{ 
            padding: '16px 20px', 
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-4">
                <div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Tổng dung lượng</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{getTotalSize()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Cập nhật gần nhất</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {getLatestUpload() || 'Chưa có'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Materials List */}
          <MaterialList
            materials={course.materials || []}
            semesterId={semesterId}
            courseId={course.id}
            onDeleteMaterial={onDeleteMaterial}
            onEditMaterial={onEditMaterial}
          />
        </div>
      )}

      {!expanded && course.materials && course.materials.length > 0 && (
        <div className="card-footer" style={{ fontSize: '12px', color: '#8c8c8c' }}>
          <div className="d-flex justify-content-between">
            <span>Tổng: {getTotalSize()}</span>
            <span>Cập nhật: {getLatestUpload()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
