import * as d3 from 'd3';

interface LineChartProps {
  data?: Array<{date: string, value: number}>;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export function LineChart({ 
  data = [
    { date: '2024-01', value: 25 },
    { date: '2024-02', value: 30 },
    { date: '2024-03', value: 28 },
    { date: '2024-04', value: 35 },
    { date: '2024-05', value: 32 },
    { date: '2024-06', value: 40 },
    { date: '2024-07', value: 38 },
    { date: '2024-08', value: 45 },
    { date: '2024-09', value: 42 },
    { date: '2024-10', value: 48 }
  ],
  width = 600,
  height = 350,
  xLabel = "Time Period",
  yLabel = "Performance"
}: LineChartProps) {
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Parse dates and prepare data
  const parseDate = d3.timeParse('%Y-%m');
  const processedData = data.map(d => ({
    date: parseDate(d.date)!,
    value: d.value
  }));

  // Create scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(processedData, d => d.date) as [Date, Date])
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(processedData, d => d.value) as [number, number])
    .range([chartHeight, 0])
    .nice();

  // Create line generator
  const line = d3.line<{date: Date, value: number}>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX);

  const pathData = line(processedData) || '';

  return (
    <div className="my-8">
      <svg width={width} height={height} style={{ border: '1px solid var(--color-border)' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={3}
          />
          
          {/* Data points */}
          {processedData.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.date)}
              cy={yScale(d.value)}
              r={5}
              fill="var(--color-primary-500)"
              stroke="var(--color-secondary-500)"
              strokeWidth={2}
            />
          ))}
          
          {/* X-axis */}
          <g transform={`translate(0,${chartHeight})`}>
            <line x1={0} x2={chartWidth} stroke="var(--color-text)" strokeWidth={1} />
            {xScale.ticks().map((tick, i) => (
              <g key={i}>
                <line
                  x1={xScale(tick)}
                  x2={xScale(tick)}
                  y1={0}
                  y2={5}
                  stroke="var(--color-text)"
                />
                <text
                  x={xScale(tick)}
                  y={20}
                  textAnchor="middle"
                  fontSize={12}
                  fill="var(--color-text)"
                >
                  {d3.timeFormat('%b')(tick)}
                </text>
              </g>
            ))}
            <text
              x={chartWidth / 2}
              y={45}
              textAnchor="middle"
              fontSize={14}
              fill="var(--color-text)"
              fontWeight="bold"
            >
              {xLabel}
            </text>
          </g>
          
          {/* Y-axis */}
          <g>
            <line y1={0} y2={chartHeight} stroke="var(--color-text)" strokeWidth={1} />
            {yScale.ticks().map((tick, i) => (
              <g key={i}>
                <line
                  x1={-5}
                  x2={0}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="var(--color-text)"
                />
                <text
                  x={-10}
                  y={yScale(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="var(--color-text)"
                >
                  {tick}
                </text>
              </g>
            ))}
            <text
              x={-35}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize={14}
              fill="var(--color-text)"
              fontWeight="bold"
              transform={`rotate(-90, -35, ${chartHeight / 2})`}
            >
              {yLabel}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}