import React from 'react';

const MaterialList = ({ materials, semesterId, courseId, onDeleteMaterial }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (material) => {
    // In real app, this would trigger actual download
    console.log('Downloading:', material.fileName);
    alert(`Tải xuống: ${material.fileName}`);
  };

  const handleView = (material) => {
    // In real app, this would open PDF viewer
    console.log('Viewing:', material.fileName);
    window.open(material.url, '_blank');
  };

  const handleDelete = (materialId) => {
    onDeleteMaterial(semesterId, courseId, materialId);
  };

  if (!materials || materials.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
        <div>Chưa có tài liệu nào</div>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>
          Hãy tải lên tài liệu đầu tiên cho môn học này
        </div>
      </div>
    );
  }

  return (
    <div className="material-list">
      <table className="table" style={{ margin: 0 }}>
        <thead>
          <tr>
            <th>Tên tài liệu</th>
            <th>Kích thước</th>
            <th>Người tải lên</th>
            <th>Ngày tải lên</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '16px' }}>📄</span>
                  <div>
                    <div style={{ fontWeight: '500' }}>{material.fileName}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      PDF Document
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ 
                  backgroundColor: '#f0f0f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {material.size}
                </span>
              </td>
              <td>
                <div style={{ fontSize: '14px' }}>{material.uploadedBy}</div>
              </td>
              <td>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {formatDate(material.uploadedAt)}
                </div>
              </td>
              <td>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleView(material)}
                    title="Xem tài liệu"
                  >
                    👁️
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleDownload(material)}
                    title="Tải xuống"
                  >
                    📥
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(material.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialList;
