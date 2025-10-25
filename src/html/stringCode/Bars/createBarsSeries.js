import { CHART_ANIMATION_DURATION } from '@/html/stringCode/constant';

export const createBarsSeries = () => {
  const jsCode = `
    function createBarsSeries() {
      series = chart.series.push(
        am5xy.OHLCSeries.new(root, {
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

      series.columns.template.setAll({ strokeWidth: 8 });
            
      series.columns.template.setup = (target) => {
        target._draw = customDraw.bind(target);
      };

      return series;
    }

    function customDraw() {
      const display = this._display;

      display.moveTo(this.get('lowX1', 0), this.get('lowY1', 0));
      display.lineTo(this.get('highX1', 0), this.get('highY1', 0));

      const w = this.width();
      const h = this.height();

      const adjust = Math.max(0, this.get('strokeWidth', 1)) / 2;

      if (this.get('orientation') === 'vertical') {
        const lY = h;
        const hY = 0;
        display.moveTo(0, lY);
        display.lineTo(w / 2 + adjust, lY);

        display.moveTo(w / 2 - adjust, hY);
        display.lineTo(w, hY);
      } else {
        const lX = 0;
        const hX = w;

        display.moveTo(lX, 0);
        display.lineTo(lX, h / 2);

        display.moveTo(hX, h / 2);
        display.lineTo(hX, h);
      }
    }
  `;

  return jsCode;
}
