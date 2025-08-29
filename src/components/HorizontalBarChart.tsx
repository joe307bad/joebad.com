import * as d3 from 'd3';

interface HorizontalBarChartProps {
  data?: Array<{name: string, value: number}>;
  width?: number;
  height?: number;
  xLabel?: string;
}

export function HorizontalBarChart({ 
  data = [
    { name: 'LeBron James', value: 85 },
    { name: 'Stephen Curry', value: 92 },
    { name: 'Kevin Durant', value: 88 },
    { name: 'Giannis Antetokounmpo', value: 90 },
    { name: 'Luka Dončić', value: 87 },
    { name: 'Nikola Jokić', value: 89 },
    { name: 'Jayson Tatum', value: 84 }
  ],
  width = 600,
  height = 400,
  xLabel = "Player Rating"
}: HorizontalBarChartProps) {
  const margin = { top: 20, right: 20, bottom: 50, left: 120 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Sort data by value descending for better ranking display
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.value) || 0])
    .range([0, chartWidth])
    .nice();

  const yScale = d3.scaleBand()
    .domain(sortedData.map(d => d.name))
    .range([0, chartHeight])
    .padding(0.1);

  return (
    <div className="my-8">
      <svg width={width} height={height} style={{ border: '1px solid var(--color-border)' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Bars */}
          {sortedData.map((d, i) => (
            <g key={i}>
              <rect
                x={0}
                y={yScale(d.name)}
                width={xScale(d.value)}
                height={yScale.bandwidth()}
                fill="var(--color-primary-500)"
                stroke="var(--color-secondary-500)"
                strokeWidth={1}
              />
              {/* Value labels on bars */}
              <text
                x={xScale(d.value) - 5}
                y={yScale(d.name)! + yScale.bandwidth() / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fill="var(--color-text)"
                fontWeight="bold"
              >
                {d.value}
              </text>
            </g>
          ))}
          
          {/* Y-axis (player names) */}
          <g>
            <line y1={0} y2={chartHeight} stroke="var(--color-text)" strokeWidth={1} />
            {sortedData.map((d, i) => (
              <g key={i}>
                <line
                  x1={-5}
                  x2={0}
                  y1={yScale(d.name)! + yScale.bandwidth() / 2}
                  y2={yScale(d.name)! + yScale.bandwidth() / 2}
                  stroke="var(--color-text)"
                />
                <text
                  x={-10}
                  y={yScale(d.name)! + yScale.bandwidth() / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="var(--color-text)"
                >
                  {d.name}
                </text>
              </g>
            ))}
          </g>
          
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
                  {tick}
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
        </g>
      </svg>
    </div>
  );
}