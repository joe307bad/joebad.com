import { Chart } from './Chart';
import { ChartEnhancer } from './ChartEnhancer';

interface EnhancedChartProps {
  data?: Array<{name: string, value: number}>;
  width?: number;
  height?: number;
}

export function EnhancedChart(props: EnhancedChartProps) {
  return (
    <ChartEnhancer chartType="bar" data={props.data} width={props.width} height={props.height}>
      <Chart {...props} />
    </ChartEnhancer>
  );
}