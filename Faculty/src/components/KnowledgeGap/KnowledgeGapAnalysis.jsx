import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { getQuizData, getCourses } from '../../services/mockApi';
import QuizList from './QuizList';

const KnowledgeGapAnalysis = () => {
  const navigate = useNavigate();
  const { setLoading, showNotification } = useApp();
  const [quizData, setQuizData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    course: '',
    dateRange: '30'
  });

  useEffect(() => {
    loadQuizData();
    loadCourses();
  }, []);

  useEffect(() => {
    loadQuizData();
  }, [filters]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const response = await getQuizData(filters);
      if (response.success) {
        setQuizData(response.data);
      }
    } catch (error) {
      showNotification('Lỗi khi tải dữ liệu quiz', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleQuizClick = (quizId) => {
    navigate(`/knowledge-gap/quiz/${quizId}`);
  };

  const handleExportReport = () => {
    // In real app, this would generate and download Excel/PDF report
    showNotification('Chức năng xuất báo cáo đang được phát triển', 'info');
  };

  if (!quizData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="knowledge-gap-analysis">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Xác định lỗ hổng kiến thức</h1>
        <button
          className="btn btn-primary"
          onClick={handleExportReport}
        >
          📊 Xuất báo cáo
        </button>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards mb-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }}>
              📝
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#262626' }}>
              {quizData.overview.totalQuizzes}
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Tổng số bài quiz
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }}>
              📊
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#262626' }}>
              {quizData.overview.averageScore.toFixed(1)}
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Điểm trung bình
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }}>
              ✅
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#262626' }}>
              {quizData.overview.completionRate}%
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Tỷ lệ hoàn thành
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex gap-2 align-items-center">
            <div style={{ minWidth: '200px' }}>
              <select
                className="form-select"
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
              >
                <option value="">Tất cả môn học</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            
            <div style={{ minWidth: '150px' }}>
              <select
                className="form-select"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">3 tháng qua</option>
              </select>
            </div>
            
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ course: '', dateRange: '30' })}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <QuizList
        quizzes={quizData.quizzes}
        onQuizClick={handleQuizClick}
      />
    </div>
  );
};

export default KnowledgeGapAnalysis;
