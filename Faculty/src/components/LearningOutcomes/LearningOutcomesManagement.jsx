import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getLearningOutcomes, syncCourseData } from '../../services/mockApi';
import CourseOutcomes from './CourseOutcomes';

const LearningOutcomesManagement = () => {
  const { setLoading, showNotification } = useApp();
  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    loadLearningOutcomes();
  }, []);

  const loadLearningOutcomes = async () => {
    try {
      setLoading(true);
      const response = await getLearningOutcomes();
      if (response.success) {
        setCoursesData(response.data);
        if (response.data.length > 0 && !selectedCourse) {
          setSelectedCourse(response.data[0].courseId);
        }
      }
    } catch (error) {
      showNotification('Lỗi khi tải dữ liệu mục tiêu học tập', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCourse = async (courseId) => {
    try {
      setLoading(true);
      const response = await syncCourseData(courseId);
      if (response.success) {
        showNotification('Đồng bộ dữ liệu thành công', 'success');
        loadLearningOutcomes();
      }
    } catch (error) {
      showNotification('Lỗi khi đồng bộ dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    loadLearningOutcomes();
  };

  const selectedCourseData = coursesData.find(course => course.courseId === selectedCourse);

  return (
    <div className="learning-outcomes-management">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Mục tiêu học tập & Thách thức</h1>
        
        {selectedCourseData && (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Trạng thái:</span>
              <span style={{
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: selectedCourseData.syncStatus === 'synced' ? '#f6ffed' : '#fff7e6',
                color: selectedCourseData.syncStatus === 'synced' ? '#389e0d' : '#d48806'
              }}>
                {selectedCourseData.syncStatus === 'synced' ? '✅ Đã đồng bộ' : '⏳ Chờ đồng bộ'}
              </span>
            </div>
            
            <button
              className="btn btn-primary"
              onClick={() => handleSyncCourse(selectedCourse)}
              disabled={selectedCourseData.syncStatus === 'synced'}
            >
              🔄 Đồng bộ với tài liệu
            </button>
          </div>
        )}
      </div>

      {/* Course Selection */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0" style={{ minWidth: '100px' }}>
              Chọn môn học:
            </label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ maxWidth: '400px' }}
            >
              <option value="">Chọn môn học</option>
              {coursesData.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
            
            {selectedCourseData && selectedCourseData.lastSync && (
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '16px' }}>
                Đồng bộ lần cuối: {new Date(selectedCourseData.lastSync).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      {selectedCourseData ? (
        <CourseOutcomes
          course={selectedCourseData}
          onUpdate={handleDataUpdate}
        />
      ) : (
        <div className="card">
          <div className="card-body text-center">
            <div style={{ padding: '40px', color: '#8c8c8c' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h3>Chọn môn học để quản lý</h3>
              <p>Vui lòng chọn môn học từ dropdown phía trên để xem và chỉnh sửa mục tiêu học tập cũng như thách thức</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Statistics */}
      {coursesData.length > 0 && (
        <div className="overview-cards mt-4" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
                📚
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>
                {coursesData.length}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Tổng số môn học
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }}>
                🎯
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>
                {coursesData.reduce((sum, course) => sum + course.outcomes.length, 0)}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Tổng mục tiêu học tập
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: '24px', color: '#faad14', marginBottom: '8px' }}>
                ⚠️
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>
                {coursesData.reduce((sum, course) => sum + course.challenges.length, 0)}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Tổng thách thức
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }}>
                ✅
              </div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>
                {Math.round(
                  (coursesData.reduce((sum, course) => 
                    sum + course.outcomes.filter(o => o.completed).length, 0
                  ) / coursesData.reduce((sum, course) => sum + course.outcomes.length, 0)) * 100
                ) || 0}%
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Tỷ lệ hoàn thành
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningOutcomesManagement;
