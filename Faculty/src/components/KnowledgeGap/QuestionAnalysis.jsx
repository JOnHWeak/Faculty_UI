import React from 'react';

const QuestionAnalysis = ({ questions }) => {
  const getCorrectRateColor = (rate) => {
    if (rate >= 70) return '#52c41a';
    if (rate >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const getCorrectRateLabel = (rate) => {
    if (rate >= 70) return 'Tốt';
    if (rate >= 50) return 'Trung bình';
    return 'Cần cải thiện';
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div style={{ padding: '40px', color: '#8c8c8c' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
            <h3>Không có câu hỏi nào</h3>
            <p>Quiz này chưa có câu hỏi để phân tích</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="question-analysis">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Phân tích từng câu hỏi</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th>Nội dung câu hỏi</th>
                <th style={{ width: '120px' }}>Chủ đề</th>
                <th style={{ width: '100px' }}>Tỷ lệ đúng</th>
                <th style={{ width: '120px' }}>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question.id} style={{
                  backgroundColor: question.isGap ? '#fff1f0' : 'transparent'
                }}>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    {index + 1}
                  </td>
                  <td>
                    <div style={{ 
                      maxWidth: '400px',
                      lineHeight: '1.4'
                    }}>
                      {question.content}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: '#f0f0f0',
                      color: '#595959',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {question.topic}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: '30px',
                          height: '6px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${question.correctRate}%`,
                            height: '100%',
                            backgroundColor: getCorrectRateColor(question.correctRate),
                            transition: 'width 0.3s'
                          }}
                        />
                      </div>
                      <span style={{ 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getCorrectRateColor(question.correctRate)
                      }}>
                        {question.correctRate}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      {question.isGap ? (
                        <span style={{
                          backgroundColor: '#fff1f0',
                          color: '#cf1322',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          ⚠️ Lỗ hổng
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: getCorrectRateColor(question.correctRate) === '#52c41a' ? '#f6ffed' :
                                         getCorrectRateColor(question.correctRate) === '#faad14' ? '#fff7e6' : '#f0f0f0',
                          color: getCorrectRateColor(question.correctRate),
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {getCorrectRateLabel(question.correctRate)}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="card mt-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Tổng quan câu hỏi:</strong> {questions.length} câu
            </div>
            <div className="d-flex gap-4">
              <div>
                <span style={{ color: '#52c41a', fontWeight: '600' }}>
                  {questions.filter(q => q.correctRate >= 70).length}
                </span> câu tốt
              </div>
              <div>
                <span style={{ color: '#faad14', fontWeight: '600' }}>
                  {questions.filter(q => q.correctRate >= 50 && q.correctRate < 70).length}
                </span> câu trung bình
              </div>
              <div>
                <span style={{ color: '#ff4d4f', fontWeight: '600' }}>
                  {questions.filter(q => q.correctRate < 50).length}
                </span> câu cần cải thiện
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Gap Recommendations */}
      {questions.some(q => q.isGap) && (
        <div className="card mt-3" style={{ borderColor: '#faad14' }}>
          <div className="card-header" style={{ backgroundColor: '#fff7e6' }}>
            <h4 className="card-title" style={{ color: '#d48806' }}>
              💡 Khuyến nghị cải thiện
            </h4>
          </div>
          <div className="card-body">
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>
              Dựa trên kết quả phân tích, đề xuất các biện pháp cải thiện:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Tăng cường giảng dạy</strong> cho các chủ đề có tỷ lệ đúng thấp
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Tạo thêm bài tập thực hành</strong> cho những kiến thức còn yếu
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Tổ chức buổi ôn tập</strong> tập trung vào các lỗ hổng kiến thức
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Cập nhật tài liệu học tập</strong> để làm rõ những điểm khó hiểu
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionAnalysis;
