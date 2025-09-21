'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface WeeklyPrediction {
  week: number;
  sleeperTop10Hits: number;
  sleeperTop3Hits: number;
  mlTop10Hits: number;
  mlTop3Hits: number;
}

interface OverallStats {
  totalWeeks: number;
  totalAnalyzedPlayers: number;
  mlAccuracyTop10: number;
  sleeperAccuracyTop10: number;
}

interface ChartData {
  name: string;
  color: string;
  values: Array<{ x: number; y: number }>;
}

interface WeeklyPerformanceChartProps {}

export function WeeklyPerformanceChart({}: WeeklyPerformanceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from the API endpoint
    fetch('/02-fantasy-breakout-results.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        setOverallStats(jsonData.overallStats);

        const transformedData: ChartData[] = [
          {
            name: 'Top 10 Sleeper Hits',
            color: '#4a90e2',
            values: jsonData.weeklyPredictions.map((d: WeeklyPrediction) => ({
              x: d.week,
              y: d.sleeperTop10Hits
            }))
          },
          {
            name: 'Top 3 Sleeper Hits',
            color: '#ff6b6b',
            values: jsonData.weeklyPredictions.map((d: WeeklyPrediction) => ({
              x: d.week,
              y: d.sleeperTop3Hits
            }))
          },
          {
            name: 'ML Model Top 10 Hits',
            color: '#51cf66',
            values: jsonData.weeklyPredictions.map((d: WeeklyPrediction) => ({
              x: d.week,
              y: d.mlTop10Hits
            }))
          },
          {
            name: 'ML Model Top 3 Hits',
            color: '#ffa726',
            values: jsonData.weeklyPredictions.map((d: WeeklyPrediction) => ({
              x: d.week,
              y: d.mlTop3Hits
            }))
          }
        ];

        setChartData(transformedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading fantasy breakout data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !chartData.length || loading) return;

    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const allValues = chartData.flatMap(d => d.values);
    const weeks = [...new Set(allValues.map(d => d.x))].sort((a, b) => a - b);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(weeks) as [number, number])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, (d3.max(allValues, d => d.y) || 0) + 1])
      .range([chartHeight, 0]);

    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(allValues, d => d.y) || 0])
      .range([3, 8]);

    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Add gridlines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-chartHeight)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "var(--color-border)")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-chartWidth)
        .tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "var(--color-border)")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3);

    // Add axes
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
      .selectAll("text")
      .style("fill", "var(--color-text)");

    g.append("text")
      .attr("class", "axis-label")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 40)
      .style("text-anchor", "middle")
      .style("fill", "var(--color-text)")
      .text("Week");

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "var(--color-text)");

    g.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -chartHeight / 2)
      .style("text-anchor", "middle")
      .style("fill", "var(--color-text)")
      .text("Number of Hits");

    // Create tooltip div
    const tooltip = d3.select("body").selectAll(".fantasy-chart-tooltip").data([null]);
    const tooltipEnter = tooltip.enter().append("div")
      .attr("class", "fantasy-chart-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    const tooltipMerged = tooltipEnter.merge(tooltip);

    // Draw lines and dots
    chartData.forEach((lineData, i) => {
      // Draw line
      g.append("path")
        .datum(lineData.values)
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", lineData.color)
        .attr("fill", "none")
        .attr("stroke-width", 2);

      // Draw dots
      g.selectAll(`.dot-${i}`)
        .data(lineData.values)
        .enter().append("circle")
        .attr("class", `dot-${i}`)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", d => sizeScale(d.y))
        .attr("fill", lineData.color)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("r", sizeScale(d.y) + 2);
          tooltipMerged.transition()
            .duration(200)
            .style("opacity", .9);
          tooltipMerged.html(`${lineData.name}<br/>Week: ${d.x}<br/>Hits: ${d.y}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("r", sizeScale(d.y));
          tooltipMerged.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });


    // Cleanup function
    return () => {
      d3.select("body").selectAll(".fantasy-chart-tooltip").remove();
    };

  }, [chartData, loading]);

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Loading fantasy breakout data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Error loading data</h2>
        <p className="text-sm text-gray-600">
          Failed to load fantasy breakout data: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 w-full">
      <svg ref={svgRef} className="w-full h-auto" />

      {/* Legend below chart */}
      {chartData.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((lineData, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: lineData.color }}
              />
              <span className="text-sm text-(--color-text)">{lineData.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}