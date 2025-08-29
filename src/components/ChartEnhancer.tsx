'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ChartEnhancerProps {
  children: React.ReactNode;
  chartType?: 'bar' | 'scatter' | 'line';
  data?: any[];
  width?: number;
  height?: number;
}

export function ChartEnhancer({ 
  children, 
  chartType = 'bar', 
  data = [], 
  width = 400, 
  height = 300 
}: ChartEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{x: number, y: number, content: string} | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const d3Svg = d3.select(svg);

    // Add zoom and pan behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        const { transform } = event;
        const chartGroup = d3Svg.select('g');
        if (!chartGroup.empty()) {
          chartGroup.attr('transform', 
            chartGroup.attr('transform')?.replace(/scale\([^)]*\)/g, '') + ` scale(${transform.k})`
          );
        }
      });

    d3Svg.call(zoom as any);

    // Add interactivity based on chart type
    if (chartType === 'bar') {
      addBarInteractivity(d3Svg, data);
    } else if (chartType === 'scatter') {
      addScatterInteractivity(d3Svg, data);
    }

    return () => {
      d3Svg.on('.zoom', null);
      d3Svg.selectAll('*').on('mouseover', null).on('mouseout', null).on('click', null);
    };
  }, [chartType, data]);

  const addBarInteractivity = (svg: any, chartData: any[]) => {
    svg.selectAll('rect[data-name]')
      .style('cursor', 'pointer')
      .on('mouseover', function(event: MouseEvent) {
        const rect = event.target as SVGRectElement;
        
        d3.select(rect)
          .transition()
          .duration(100)
          .style('opacity', '0.8');

        // Read data from data attributes
        const name = rect.getAttribute('data-name') || 'Unknown';
        const value = rect.getAttribute('data-value') || 'Unknown';

        setTooltip({
          x: event.clientX,
          y: event.clientY,
          content: `${name}: ${value}`
        });
      })
      .on('mouseout', function(event: MouseEvent) {
        const rect = event.target as SVGRectElement;
        
        d3.select(rect)
          .transition()
          .duration(100)
          .style('opacity', '1');

        setTooltip(null);
      });
  };

  const addScatterInteractivity = (svg: any, chartData: any[]) => {
    svg.selectAll('circle[data-x]')
      .style('cursor', 'pointer')
      .on('mouseover', function(event: MouseEvent) {
        const circle = event.target as SVGCircleElement;
        
        d3.select(circle)
          .transition()
          .duration(100)
          .attr('r', 8);

        // Read data from data attributes
        const x = circle.getAttribute('data-x') || '0';
        const y = circle.getAttribute('data-y') || '0';
        const label = circle.getAttribute('data-label') || 'Point';

        setTooltip({
          x: event.clientX,
          y: event.clientY,
          content: `${label}: (${x}, ${y})`
        });
      })
      .on('mouseout', function(event: MouseEvent) {
        const circle = event.target as SVGCircleElement;
        
        d3.select(circle)
          .transition()
          .duration(100)
          .attr('r', 6);

        setTooltip(null);
      });
  };

  return (
    <div className="relative" ref={containerRef}>
      {children}
      
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-sm rounded shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)'
          }}
        >
          {tooltip.content}
        </div>
      )}
      
      {/* Interactive hint */}
      <div className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        💡 Hover for details, scroll to zoom, drag to pan
      </div>
    </div>
  );
}