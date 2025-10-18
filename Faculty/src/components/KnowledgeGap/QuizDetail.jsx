import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { getQuizDetail } from '../../services/mockApi';
import QuestionAnalysis from './QuestionAnalysis';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading, showNotification } = useApp();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    loadQuizDetail();
  }, [id]);

  const loadQuizDetail = async () => {
    try {
      setLoading(true);
      const response = await getQuizDetail(id);
      if (response.success) {
        setQuiz(response.data);
      } else {
        showNotification('Không tìm thấy quiz', 'error');
        navigate('/knowledge-gap');
      }
    } catch (error) {
      showNotification('Lỗi khi tải chi tiết quiz', 'error');
      navigate('/knowledge-gap');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!quiz) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const gapQuestions = quiz.questions.filter(q => q.isGap);

  return (
    <div className="quiz-detail">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/knowledge-gap')}
          >
            ← Quay lại
          </button>
          <h1>{quiz.name}</h1>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <span className="status-badge" style={{ 
            backgroundColor: '#e6f7ff', 
            color: '#0958d9' 
          }}>
            {quiz.course}
          </span>
          {gapQuestions.length > 0 && (
            <span className="status-badge" style={{ 
              backgroundColor: '#fff1f0',
              color: '#cf1322'
            }}>
              ⚠️ {gapQuestions.length} lỗ hổng
            </span>
          )}
        </div>
      </div>

      {/* Quiz Overview */}
      <div className="overview-cards mb-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '4px' }}>
              👥
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {quiz.studentCount}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Sinh viên làm bài
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '24px', color: '#52c41a', marginBottom: '4px' }}>
              📊
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {quiz.averageScore.toFixed(1)}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Điểm trung bình
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '24px', color: '#faad14', marginBottom: '4px' }}>
              ✅
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {quiz.averageCorrectRate}%
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Tỷ lệ đúng TB
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '24px', color: '#722ed1', marginBottom: '4px' }}>
              📅
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {formatDate(quiz.createdAt)}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Ngày tạo
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3">
        {/* Main Content */}
        <div style={{ flex: 2 }}>
          {/* Score Distribution Chart */}
          <div className="card mb-3">
            <div className="card-header">
              <h3 className="card-title">Phân bố điểm số</h3>
            </div>
            <div className="card-body">
              <div style={{ 
                display: 'flex', 
                alignItems: 'end', 
                gap: '12px', 
                height: '200px',
                padding: '20px 0'
              }}>
                {quiz.scoreDistribution.map((item, index) => {
                  const maxCount = Math.max(...quiz.scoreDistribution.map(d => d.count));
                  const height = (item.count / maxCount) * 150;
                  const colors = ['#ff4d4f', '#faad14', '#52c41a', '#1890ff'];
                  
                  return (
                    <div key={item.range} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${height}px`,
                          backgroundColor: colors[index],
                          borderRadius: '4px 4px 0 0',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                          paddingBottom: '8px'
                        }}
                      >
                        {item.count}
                      </div>
                      <div style={{ 
                        marginTop: '8px', 
                        fontSize: '12px', 
                        fontWeight: '500' 
                      }}>
                        {item.range} điểm
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          <QuestionAnalysis questions={quiz.questions} />
        </div>

        {/* Sidebar */}
        <div style={{ flex: 1 }}>
          {/* Knowledge Gaps Alert */}
          {gapQuestions.length > 0 && (
            <div className="card mb-3" style={{ borderColor: '#ff4d4f' }}>
              <div className="card-header" style={{ backgroundColor: '#fff1f0' }}>
                <h4 className="card-title" style={{ color: '#cf1322' }}>
                  ⚠️ Lỗ hổng kiến thức
                </h4>
              </div>
              <div className="card-body">
                <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                  Phát hiện <strong>{gapQuestions.length}</strong> câu hỏi có tỷ lệ đúng dưới 50%:
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {gapQuestions.map((question, index) => (
                    <div key={question.id} style={{ 
                      padding: '8px',
                      backgroundColor: '#fff2f0',
                      border: '1px solid #ffccc7',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      fontSize: '12px'
                    }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        Câu {index + 1}: {question.correctRate}% đúng
                      </div>
                      <div style={{ color: '#8c8c8c' }}>
                        Chủ đề: {question.topic}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Students */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Sinh viên xuất sắc</h4>
            </div>
            <div className="card-body">
              {quiz.students.slice(0, 5).map((student, index) => (
                <div key={student.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                      {index + 1}. {student.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {student.correctCount}/{student.totalQuestions} đúng
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    color: student.score >= 8 ? '#52c41a' : 
                           student.score >= 6 ? '#faad14' : '#ff4d4f'
                  }}>
                    {student.score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
