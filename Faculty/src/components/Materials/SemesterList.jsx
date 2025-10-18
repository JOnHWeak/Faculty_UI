import React from 'react';
import CourseCard from './CourseCard';

const SemesterList = ({ semester, onDeleteMaterial }) => {
  if (!semester || !semester.courses) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div style={{ padding: '40px', color: '#8c8c8c' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3>Không có dữ liệu kỳ học</h3>
            <p>Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="semester-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: '#1890ff', marginBottom: 0 }}>
          📅 {semester.name}
        </h2>
        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
          {semester.courses.length} môn học
        </div>
      </div>

      {semester.courses.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <div style={{ padding: '40px', color: '#8c8c8c' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <h3>Chưa có môn học nào</h3>
              <p>Hãy thêm môn học đầu tiên cho kỳ học này</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="courses-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {semester.courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              semesterId={semester.id}
              onDeleteMaterial={onDeleteMaterial}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SemesterList;
