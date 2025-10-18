import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { getFlaggedConversations, getCourses } from '../../services/mockApi';

const FlaggedConversations = () => {
  const navigate = useNavigate();
  const { setLoading, showNotification } = useApp();
  const [conversations, setConversations] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
  });

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    loadConversations();
  }, [filters]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await getFlaggedConversations(filters);
      setConversations(response.data);
    } catch (error) {
      showNotification('Lỗi khi tải danh sách hội thoại', 'error');
    } finally {
      setLoading(false);
    }
  };



  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleRowClick = (conversationId) => {
    navigate(`/conversations/${conversationId}`);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Mới': { class: 'status-new', icon: '🆕' },
      'Đang xử lý': { class: 'status-processing', icon: '⏳' },
      'Đã giải quyết': { class: 'status-resolved', icon: '✅' }
    };
    
    const config = statusConfig[status] || statusConfig['Mới'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {status}
      </span>
    );
  };



  const getConfidenceColor = (confidence) => {
    if (confidence < 30) return '#ff4d4f';
    if (confidence < 70) return '#faad14';
    return '#52c41a';
  };

  return (
    <div className="flagged-conversations">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Hội thoại gắn cờ</h1>
        <div className="d-flex align-items-center gap-2">
          <span className="badge" style={{ backgroundColor: '#ff4d4f', color: 'white', padding: '4px 8px' }}>
            {conversations.filter(c => c.status === 'Mới').length} cờ mới
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex gap-2 align-items-center">
            <div style={{ minWidth: '150px' }}>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Mới">Mới</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã giải quyết">Đã giải quyết</option>
              </select>
            </div>
            
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ status: '' })}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Conversations Table */}
      {conversations.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <div style={{ padding: '40px', color: '#8c8c8c' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚩</div>
              <h3>Không có hội thoại nào được gắn cờ</h3>
              <p>Tất cả hội thoại đều đang hoạt động bình thường</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sinh viên</th>
                <th>Nội dung</th>
                <th>Lý do gắn cờ</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map(conversation => (
                <tr
                  key={conversation.id}
                  onClick={() => handleRowClick(conversation.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <strong style={{ color: '#1890ff' }}>
                      {conversation.id}
                    </strong>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={conversation.student.avatar}
                        alt={conversation.student.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <span>{conversation.student.name}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conversation.excerpt}
                    </div>
                  </td>
                  <td>{conversation.flagReason}</td>
                  <td>{getStatusBadge(conversation.status)}</td>
                  <td style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {formatDate(conversation.flaggedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FlaggedConversations;
