import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getAnalytics } from '../../services/mockApi';
import QuestionStats from './QuestionStats';
import TopicChart from './TopicChart';
import TrendChart from './TrendChart';

const QuestionAnalytics = () => {
  const { setLoading, showNotification } = useApp();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics({ dateRange: parseInt(dateRange) });
      if (response.success) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      showNotification('Lỗi khi tải dữ liệu thống kê', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  if (!analyticsData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="question-analytics">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Thống kê câu hỏi và mối quan tâm</h1>
        
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0">Khoảng thời gian:</label>
          <select
            className="form-select"
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">3 tháng qua</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards mb-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }}>
              📊
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#262626' }}>
              {analyticsData.overview.totalQuestions.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Tổng số câu hỏi tuần này
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }}>
              🏆
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
              {analyticsData.overview.topCourse}
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Môn học được hỏi nhiều nhất
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }}>
              🔥
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
              {analyticsData.overview.topTopic}
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Chủ đề phổ biến nhất
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }}>
              😊
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#262626' }}>
              {analyticsData.overview.satisfaction}%
            </div>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Tỷ lệ hài lòng
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row mb-4" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* Course Stats Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top 5 môn học được hỏi nhiều nhất</h3>
          </div>
          <div className="card-body">
            <QuestionStats data={analyticsData.courseStats} />
          </div>
        </div>

        {/* Topic Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Phân bố chủ đề câu hỏi</h3>
          </div>
          <div className="card-body">
            <TopicChart data={analyticsData.topicDistribution} />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Xu hướng số câu hỏi theo thời gian</h3>
        </div>
        <div className="card-body">
          <TrendChart data={analyticsData.trendData} />
        </div>
      </div>

      {/* Recent Questions Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Câu hỏi gần đây</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Sinh viên</th>
                <th>Nội dung câu hỏi</th>
                <th>Môn học</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.recentQuestions.map(question => (
                <tr key={question.id}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{question.student}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {question.content}
                    </div>
                  </td>
                  <td>
                    <span className="status-badge" style={{ 
                      backgroundColor: '#e6f7ff', 
                      color: '#0958d9' 
                    }}>
                      {question.course}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {new Date(question.timestamp).toLocaleDateString('vi-VN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnalytics;
