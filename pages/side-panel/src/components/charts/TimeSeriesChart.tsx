import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  title: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title,
  height = 200,
  color = '#6366f1',
  showGrid = true,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartWidth = 100; // percentage
  const barWidth = chartWidth / data.length;

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      
      <div className="relative" style={{ height }}>
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="border-t border-gray-200 dark:border-gray-700 w-full"
                style={{ opacity: 0.5 }}
              />
            ))}
          </div>
        )}

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * 100;
            
            return (
              <div
                key={index}
                className="flex-1 group relative"
                style={{ maxWidth: `${barWidth}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    <div className="font-semibold">{point.label}</div>
                    <div>{Math.round(point.value)} min</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: color,
                    minHeight: barHeight > 0 ? '4px' : '0',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between mt-2">
        {data.map((point, index) => (
          <div
            key={index}
            className="text-xs text-gray-600 dark:text-gray-400 text-center"
            style={{ width: `${barWidth}%` }}
          >
            {point.label.length > 3 ? point.label.substring(0, 3) : point.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSeriesChart;
