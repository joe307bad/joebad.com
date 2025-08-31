import { ScatterPlot } from './ScatterPlot';
import { ChartEnhancer } from './ChartEnhancer';

interface EnhancedScatterPlotProps {
  data?: Array<{x: number, y: number, label?: string}>;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export function EnhancedScatterPlot(props: EnhancedScatterPlotProps) {
  return (
    <ChartEnhancer chartType="scatter" data={props.data} width={props.width} height={props.height}>
      <ScatterPlot {...props} />
    </ChartEnhancer>
  );
}