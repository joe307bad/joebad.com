import * as d3 from 'd3';

interface ChartProps {
  data?: Array<{name: string, value: number}>;
  width?: number;
  height?: number;
}

export function Chart({ 
  data = [
    { name: 'A', value: 30 },
    { name: 'B', value: 80 },
    { name: 'C', value: 45 },
    { name: 'D', value: 60 },
    { name: 'E', value: 20 }
  ],
  width = 400,
  height = 300
}: ChartProps) {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, chartWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 0])
    .range([chartHeight, 0]);

  return (
    <div className="my-8">
      <svg width={width} height={height} style={{ border: '1px solid var(--color-border)' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Bars */}
          {data.map((d, i) => (
            <rect
              key={i}
              x={xScale(d.name)}
              y={yScale(d.value)}
              width={xScale.bandwidth()}
              height={chartHeight - yScale(d.value)}
              fill="var(--color-primary-500)"
              stroke="var(--color-secondary-500)"
              strokeWidth={1}
            />
          ))}
          
          {/* X-axis */}
          <g transform={`translate(0,${chartHeight})`}>
            <line x1={0} x2={chartWidth} stroke="var(--color-text)" strokeWidth={1} />
            {data.map((d, i) => (
              <g key={i}>
                <line
                  x1={xScale(d.name)! + xScale.bandwidth() / 2}
                  x2={xScale(d.name)! + xScale.bandwidth() / 2}
                  y1={0}
                  y2={5}
                  stroke="var(--color-text)"
                />
                <text
                  x={xScale(d.name)! + xScale.bandwidth() / 2}
                  y={20}
                  textAnchor="middle"
                  fontSize={12}
                  fill="var(--color-text)"
                >
                  {d.name}
                </text>
              </g>
            ))}
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
          </g>
        </g>
      </svg>
    </div>
  );
}