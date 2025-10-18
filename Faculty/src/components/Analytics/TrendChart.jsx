import React from 'react';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
        <div>Không có dữ liệu</div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(item => item.count));
  const minCount = Math.min(...data.map(item => item.count));
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;

  const getX = (index) => {
    return padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
  };

  const getY = (count) => {
    const range = maxCount - minCount || 1;
    return chartHeight - padding - ((count - minCount) * (chartHeight - 2 * padding)) / range;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Create path for line chart
  const pathData = data.map((item, index) => {
    const x = getX(index);
    const y = getY(item.count);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create area path
  const areaData = [
    `M ${getX(0)} ${getY(data[0].count)}`,
    ...data.slice(1).map((item, index) => `L ${getX(index + 1)} ${getY(item.count)}`),
    `L ${getX(data.length - 1)} ${chartHeight - padding}`,
    `L ${getX(0)} ${chartHeight - padding}`,
    'Z'
  ].join(' ');

  return (
    <div className="trend-chart">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={chartWidth} height={chartHeight} style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const value = Math.round(minCount + (maxCount - minCount) * ratio);
            const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
            return (
              <g key={ratio}>
                <line
                  x1={padding - 5}
                  y1={y}
                  x2={padding}
                  y2={y}
                  stroke="#8c8c8c"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#8c8c8c"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaData}
            fill="rgba(24, 144, 255, 0.1)"
            stroke="none"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#1890ff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = getX(index);
            const y = getY(item.count);
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#1890ff"
                  stroke="white"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    // Show tooltip
                    const tooltip = document.getElementById(`tooltip-${index}`);
                    if (tooltip) tooltip.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    // Hide tooltip
                    const tooltip = document.getElementById(`tooltip-${index}`);
                    if (tooltip) tooltip.style.display = 'none';
                  }}
                />
                
                {/* Tooltip */}
                <g id={`tooltip-${index}`} style={{ display: 'none' }}>
                  <rect
                    x={x - 30}
                    y={y - 35}
                    width="60"
                    height="25"
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="4"
                  />
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="600"
                  >
                    {item.count} câu hỏi
                  </text>
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                  >
                    {formatDate(item.date)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = getX(index);
            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={chartHeight - padding}
                  x2={x}
                  y2={chartHeight - padding + 5}
                  stroke="#8c8c8c"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={chartHeight - padding + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#8c8c8c"
                >
                  {formatDate(item.date)}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#8c8c8c"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#8c8c8c"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Chart Info */}
      <div style={{ 
        borderTop: '1px solid #f0f0f0',
        paddingTop: '16px',
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        fontSize: '12px',
        color: '#8c8c8c'
      }}>
        <div>
          <span style={{ fontWeight: '600', color: '#52c41a' }}>Cao nhất: </span>
          {maxCount} câu hỏi
        </div>
        <div>
          <span style={{ fontWeight: '600', color: '#ff4d4f' }}>Thấp nhất: </span>
          {minCount} câu hỏi
        </div>
        <div>
          <span style={{ fontWeight: '600', color: '#1890ff' }}>Trung bình: </span>
          {Math.round(data.reduce((sum, item) => sum + item.count, 0) / data.length)} câu hỏi
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
