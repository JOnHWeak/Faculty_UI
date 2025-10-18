import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getMaterials, uploadMaterial, deleteMaterial, addCourse } from '../../services/mockApi';
import SemesterList from './SemesterList';
import UploadForm from './UploadForm';
import EditMaterialForm from './EditMaterialForm';

const MaterialsManagement = () => {
  const { setLoading, showNotification } = useApp();
  const [materialsData, setMaterialsData] = useState({ semesters: [] });
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newCourseData, setNewCourseData] = useState({ code: '', name: '' });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await getMaterials();
      if (response.success) {
        setMaterialsData(response.data);
        if (response.data.semesters.length > 0 && !selectedSemester) {
          setSelectedSemester(response.data.semesters[0].id);
        }
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách tài liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    loadMaterials();
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setEditingMaterial(null);
    loadMaterials();
  };

  const handleDeleteMaterial = async (semesterId, courseId, materialId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await deleteMaterial(semesterId, courseId, materialId);
      if (response.success) {
        showNotification('Xóa tài liệu thành công', 'success');
        loadMaterials();
      }
    } catch (error) {
      showNotification('Lỗi khi xóa tài liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseData.code || !newCourseData.name) {
      showNotification('Vui lòng nhập đầy đủ thông tin môn học', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await addCourse(selectedSemester, newCourseData);
      if (response.success) {
        showNotification('Thêm môn học thành công', 'success');
        setShowAddCourseForm(false);
        setNewCourseData({ code: '', name: '' });
        loadMaterials();
      }
    } catch (error) {
      showNotification('Lỗi khi thêm môn học', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedSemesterData = materialsData.semesters.find(s => s.id === selectedSemester);

  return (
    <div className="materials-management">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Quản lý tài liệu học tập</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddCourseForm(true)}
            disabled={!selectedSemester}
          >
            ➕ Thêm môn học
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowUploadForm(true)}
            disabled={!selectedSemester}
          >
            📤 Tải lên tài liệu
          </button>
        </div>
      </div>

      {/* Semester Selection */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0" style={{ minWidth: '100px' }}>
              Chọn kỳ học:
            </label>
            <select
              className="form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{ maxWidth: '300px' }}
            >
              <option value="">Chọn kỳ học</option>
              {materialsData.semesters.map(semester => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Semester Content */}
      {selectedSemesterData ? (
        <SemesterList
          semester={selectedSemesterData}
          onDeleteMaterial={handleDeleteMaterial}
          onEditMaterial={handleEditMaterial}
        />
      ) : (
        <div className="card">
          <div className="card-body text-center">
            <div style={{ padding: '40px', color: '#8c8c8c' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <h3>Chọn kỳ học để xem tài liệu</h3>
              <p>Vui lòng chọn kỳ học từ dropdown phía trên</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Modal */}
      {showUploadForm && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <UploadForm
              semester={selectedSemesterData}
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Material Form Modal */}
      {showEditForm && editingMaterial && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <EditMaterialForm
              material={editingMaterial}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setShowEditForm(false);
                setEditingMaterial(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Add Course Form Modal */}
      {showAddCourseForm && (
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
            width: '500px',
            maxWidth: '90vw'
          }}>
            <div className="card-header">
              <h3 className="card-title">Thêm môn học mới</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Mã môn học *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCourseData.code}
                  onChange={(e) => setNewCourseData({ ...newCourseData, code: e.target.value })}
                  placeholder="Ví dụ: IT3180"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tên môn học *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCourseData.name}
                  onChange={(e) => setNewCourseData({ ...newCourseData, name: e.target.value })}
                  placeholder="Ví dụ: Công nghệ phần mềm"
                />
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddCourseForm(false);
                  setNewCourseData({ code: '', name: '' });
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddCourse}
              >
                Thêm môn học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsManagement;
