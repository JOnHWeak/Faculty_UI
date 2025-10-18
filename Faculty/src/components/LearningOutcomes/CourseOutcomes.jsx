import React, { useState } from 'react';
import OutcomeEditor from './OutcomeEditor';
import ChallengeEditor from './ChallengeEditor';

const CourseOutcomes = ({ course, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('outcomes');

  const completedOutcomes = course.outcomes.filter(o => o.completed).length;
  const completionRate = Math.round((completedOutcomes / course.outcomes.length) * 100) || 0;

  return (
    <div className="course-outcomes">
      {/* Course Header */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 style={{ color: '#1890ff', marginBottom: '4px' }}>
                {course.courseName}
              </h2>
              <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                Mã môn: {course.courseId}
              </div>
            </div>
            
            <div className="d-flex gap-4">
              <div className="text-center">
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#52c41a' }}>
                  {completedOutcomes}/{course.outcomes.length}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Mục tiêu hoàn thành
                </div>
              </div>
              
              <div className="text-center">
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#faad14' }}>
                  {course.challenges.length}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Thách thức
                </div>
              </div>
              
              <div className="text-center">
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: completionRate >= 70 ? '#52c41a' : completionRate >= 50 ? '#faad14' : '#ff4d4f'
                }}>
                  {completionRate}%
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Tỷ lệ hoàn thành
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Tiến độ hoàn thành mục tiêu</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{completionRate}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${completionRate}%`,
                  height: '100%',
                  backgroundColor: completionRate >= 70 ? '#52c41a' : completionRate >= 50 ? '#faad14' : '#ff4d4f',
                  transition: 'width 0.3s'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header" style={{ padding: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
            <button
              className={`tab-button ${activeTab === 'outcomes' ? 'active' : ''}`}
              onClick={() => setActiveTab('outcomes')}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                background: activeTab === 'outcomes' ? '#1890ff' : 'transparent',
                color: activeTab === 'outcomes' ? 'white' : '#595959',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🎯 Mục tiêu học tập ({course.outcomes.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                background: activeTab === 'challenges' ? '#1890ff' : 'transparent',
                color: activeTab === 'challenges' ? 'white' : '#595959',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              ⚠️ Thách thức thường gặp ({course.challenges.length})
            </button>
          </div>
        </div>

        <div className="card-body">
          {activeTab === 'outcomes' ? (
            <OutcomeEditor
              courseId={course.courseId}
              outcomes={course.outcomes}
              onUpdate={onUpdate}
            />
          ) : (
            <ChallengeEditor
              courseId={course.courseId}
              challenges={course.challenges}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseOutcomes;
