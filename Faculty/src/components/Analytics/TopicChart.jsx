import React from 'react';

const TopicChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
        <div>Không có dữ liệu</div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="topic-chart">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Pie Chart */}
        <div style={{ flex: '0 0 200px' }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (item.value / total) * 360;
              const path = createPath(100, 100, 80, currentAngle, currentAngle + angle);
              currentAngle += angle;

              return (
                <g key={item.topic}>
                  <path
                    d={path}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                    style={{
                      cursor: 'pointer',
                      transition: 'opacity 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  />
                  {percentage > 5 && (
                    <text
                      x={polarToCartesian(100, 100, 50, currentAngle - angle/2).x}
                      y={polarToCartesian(100, 100, 50, currentAngle - angle/2).y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.topic} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: item.color,
                      borderRadius: '3px'
                    }}
                  />
                  <div style={{ flex: 1, fontSize: '14px' }}>
                    <div style={{ fontWeight: '500' }}>{item.topic}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {item.value} câu hỏi ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ 
        borderTop: '1px solid #f0f0f0',
        paddingTop: '16px',
        marginTop: '16px',
        fontSize: '12px',
        color: '#8c8c8c',
        textAlign: 'center'
      }}>
        Tổng cộng {total} câu hỏi được phân loại
      </div>
    </div>
  );
};

export default TopicChart;
