import * as d3 from 'd3';

interface ScatterPlotProps {
  data?: Array<{x: number, y: number, label?: string}>;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export function ScatterPlot({ 
  data = [
    { x: 10, y: 20, label: 'Player A' },
    { x: 15, y: 35, label: 'Player B' },
    { x: 25, y: 25, label: 'Player C' },
    { x: 30, y: 45, label: 'Player D' },
    { x: 35, y: 30, label: 'Player E' },
    { x: 40, y: 50, label: 'Player F' },
    { x: 45, y: 40, label: 'Player G' },
    { x: 50, y: 60, label: 'Player H' }
  ],
  width = 500,
  height = 350,
  xLabel = "X Axis",
  yLabel = "Y Axis"
}: ScatterPlotProps) {
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x) as [number, number])
    .range([0, chartWidth])
    .nice();

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y) as [number, number])
    .range([chartHeight, 0])
    .nice();

  return (
    <div className="my-8">
      <svg width={width} height={height} style={{ border: '1px solid var(--color-border)' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.x)}
              cy={yScale(d.y)}
              r={6}
              fill="var(--color-primary-500)"
              stroke="var(--color-secondary-500)"
              strokeWidth={2}
              opacity={0.8}
              data-x={d.x}
              data-y={d.y}
              data-label={d.label || `Point ${i + 1}`}
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