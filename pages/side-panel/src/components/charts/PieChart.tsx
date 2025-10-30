import React, { useState } from 'react';

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSlice[];
  title: string;
  size?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, size = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: size }}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate pie slices
  let currentAngle = -90; // Start from top
  const slices = data.map((slice, index) => {
    const percentage = (slice.value / total) * 100;
    const angle = (slice.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Calculate path for pie slice
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
    
    currentAngle = endAngle;
    
    return {
      ...slice,
      path,
      percentage,
      midAngle: (startAngle + endAngle) / 2,
    };
  });

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      
      <div className="flex items-center gap-6">
        {/* SVG Pie Chart */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="flex-shrink-0"
        >
          {slices.map((slice, index) => {
            const isHovered = hoveredIndex === index;
            const scale = isHovered ? 1.05 : 1;
            
            return (
              <g
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  cursor: 'pointer',
                  transformOrigin: `${centerX}px ${centerY}px`,
                  transform: `scale(${scale})`,
                  transition: 'transform 0.2s',
                }}
              >
                <path
                  d={slice.path}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="2"
                  opacity={isHovered ? 1 : 0.9}
                />
                
                {/* Percentage label (only for slices > 5%) */}
                {slice.percentage > 5 && (
                  <text
                    x={centerX + (radius * 0.6) * Math.cos((slice.midAngle * Math.PI) / 180)}
                    y={centerY + (radius * 0.6) * Math.sin((slice.midAngle * Math.PI) / 180)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {Math.round(slice.percentage)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {slices.map((slice, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                hoveredIndex !== null && hoveredIndex !== index ? 'opacity-50' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {slice.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(slice.percentage)}% ({slice.value.toFixed(0)} min)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
