import { CHART_ANIMATION_DURATION } from '@/html/stringCode/constant';

export const createCandlestick = () => {
  const jsCode = `
    function createCandlestick() {
      series = chart.series.push(
        am5xy.CandlestickSeries.new(root, {
          name: 'Series',
          xAxis: xAxis,
          yAxis: yAxis,
          openValueYField: 'open',
          highValueYField: 'high',
          lowValueYField: 'low',
          valueYField: 'close',
          valueXField: 'time',
          interpolationDuration: ${CHART_ANIMATION_DURATION},
          ease: am5.ease.linear,
          locationX: 0,
        })
      );
      
      series.columns.template.set('themeTags', []);

      return series;
    }
  `;

  return jsCode;
}
