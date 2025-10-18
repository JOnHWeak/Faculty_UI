import React from 'react';

const QuizList = ({ quizzes, onQuizClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#52c41a';
    if (score >= 6) return '#faad14';
    return '#ff4d4f';
  };

  const getCorrectRateColor = (rate) => {
    if (rate >= 70) return '#52c41a';
    if (rate >= 50) return '#faad14';
    return '#ff4d4f';
  };

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div style={{ padding: '40px', color: '#8c8c8c' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3>Chưa có quiz nào</h3>
            <p>Không tìm thấy quiz phù hợp với bộ lọc hiện tại</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Danh sách Quiz</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Tên Quiz</th>
                <th>Môn học</th>
                <th>Số SV làm</th>
                <th>Điểm TB</th>
                <th>Tỷ lệ đúng TB</th>
                <th>Ngày tạo</th>
                <th>Lỗ hổng</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => {
                const gapCount = quiz.questions?.filter(q => q.isGap).length || 0;
                
                return (
                  <tr
                    key={quiz.id}
                    onClick={() => onQuizClick(quiz.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: '500', color: '#1890ff' }}>
                        {quiz.name}
                      </div>
                    </td>
                    <td>
                      <span className="status-badge" style={{ 
                        backgroundColor: '#e6f7ff', 
                        color: '#0958d9' 
                      }}>
                        {quiz.course}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>
                        {quiz.studentCount}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontWeight: '600',
                        color: getScoreColor(quiz.averageScore)
                      }}>
                        {quiz.averageScore.toFixed(1)}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: '40px',
                            height: '8px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${quiz.averageCorrectRate}%`,
                              height: '100%',
                              backgroundColor: getCorrectRateColor(quiz.averageCorrectRate),
                              transition: 'width 0.3s'
                            }}
                          />
                        </div>
                        <span style={{ 
                          fontSize: '12px',
                          fontWeight: '600',
                          color: getCorrectRateColor(quiz.averageCorrectRate)
                        }}>
                          {quiz.averageCorrectRate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {formatDate(quiz.createdAt)}
                    </td>
                    <td>
                      {gapCount > 0 ? (
                        <div className="d-flex align-items-center gap-1">
                          <span style={{ 
                            backgroundColor: '#fff1f0',
                            color: '#cf1322',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            ⚠️ {gapCount} lỗ hổng
                          </span>
                        </div>
                      ) : (
                        <span style={{ 
                          backgroundColor: '#f6ffed',
                          color: '#389e0d',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          ✅ Tốt
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="card mt-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Tổng quan:</strong> {quizzes.length} quiz
            </div>
            <div className="d-flex gap-4">
              <div>
                <span style={{ color: '#ff4d4f', fontWeight: '600' }}>
                  {quizzes.reduce((sum, quiz) => 
                    sum + (quiz.questions?.filter(q => q.isGap).length || 0), 0
                  )} lỗ hổng
                </span> cần chú ý
              </div>
              <div>
                Điểm TB toàn bộ: <span style={{ fontWeight: '600' }}>
                  {(quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.length).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
