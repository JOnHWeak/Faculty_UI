import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getFAQs, deleteFAQ, getCourses } from '../../services/mockApi';
import FAQList from './FAQList';
import FAQForm from './FAQForm';

const FAQManagement = () => {
  const { setLoading, showNotification } = useApp();
  const [faqs, setFaqs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [filters, setFilters] = useState({
    course: '',
    search: '',
    tags: []
  });

  useEffect(() => {
    loadFAQs();
    loadCourses();
  }, []);

  useEffect(() => {
    loadFAQs();
  }, [filters]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const response = await getFAQs(filters);
      setFaqs(response.data);
    } catch (error) {
      showNotification('Lỗi khi tải danh sách FAQ', 'error');
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

  const handleCreateFAQ = () => {
    setEditingFAQ(null);
    setShowForm(true);
  };

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq);
    setShowForm(true);
  };

  const handleDeleteFAQ = async (faqId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa FAQ này?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteFAQ(faqId);
      showNotification('Xóa FAQ thành công', 'success');
      loadFAQs();
    } catch (error) {
      showNotification('Lỗi khi xóa FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFAQ(null);
    loadFAQs();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFAQ(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="faq-management">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Quản lý FAQ</h1>
        <button className="btn btn-primary" onClick={handleCreateFAQ}>
          ➕ Thêm FAQ mới
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex gap-2 align-items-center">
            <div style={{ minWidth: '200px' }}>
              <select
                className="form-select"
                value={filters.course}
                onChange={(e) => handleFilterChange({ course: e.target.value })}
              >
                <option value="">Tất cả môn học</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Tìm kiếm câu hỏi, câu trả lời hoặc tags..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </div>
            
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ course: '', search: '', tags: [] })}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <FAQList
        faqs={faqs}
        onEdit={handleEditFAQ}
        onDelete={handleDeleteFAQ}
      />

      {/* FAQ Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <FAQForm
              faq={editingFAQ}
              courses={courses}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
