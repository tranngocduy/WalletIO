import { isIOS } from '@/utils/app';
import { BASE_INTERVAL } from '@/html/stringCode/constant';
import { duration } from '@/html/stringCode/business';
import { createSeriesForPosition } from '@/html/stringCode/Bullet/createSeriesForPosition';

export const initHistoryBO = params => {
  const dataLine = JSON.stringify(params.dataLine);
  const dataTrade = JSON.stringify(params.dataTrade);

  const jsCode = `
  ${duration()}

  ${createSeriesForPosition()}

  function _initChart(dataLine, dataTrade, expireAt) {
    const root = am5.Root.new("chartDiv", { useSafeResolution: ${!isIOS} });

    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

    const chart = root.container.children.push(am5xy.XYChart.new(root,
      { marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }
    ));

    chart.zoomOutButton.set('forceHidden', true);

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none' }));

    cursor.lineX.setAll({ strokeWidth: 1, stroke: am5.color(0x00b6f9), strokeDasharray: [], visible: false });
  
    cursor.lineY.setAll({ strokeWidth: 1, stroke: am5.color(0x00b6f9), strokeDasharray: [], visible: false });

    const xRenderer = am5xy.AxisRendererX.new(root, {});

    const maxDate = Math.max(expireAt + 8000, dataTrade[dataTrade.length -1].time);
  
    const dateAxis = am5xy.DateAxis.new(root, { baseInterval: { timeUnit: 'millisecond', count: ${BASE_INTERVAL} }, renderer: xRenderer, visible: false, max: maxDate });
  
    const xAxis = chart.xAxes.push(dateAxis);
  
    const yAxisRenderer = am5xy.AxisRendererY.new(root, { pan: 'zoom', centerX: 100, inside: true });

    yAxisRenderer.labels.template.setAll({ fill: am5.color(0x5c5c5c), fontSize: 10, paddingRight: 32 });
  
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: yAxisRenderer, maxDeviation: 0.2, minDeviation: 0.2 }));
  
    yAxisRenderer.grid.template.setAll({ stroke: am5.color(0x8696ac), strokeWidth: 1, strokeDasharray: [5] });

    xRenderer.grid.template.setAll({ stroke: am5.color(0x8696ac), strokeWidth: 1, strokeDasharray: [5] });
  
    const series = chart.series.push(
      am5xy.LineSeries.new(root, { name: 'Series', xAxis: xAxis, yAxis: yAxis, valueYField: 'price', valueXField: 'time', locationX: 0, stroke: am5.color(0x53a2f1) })
    );

    series.strokes.template.setAll({ strokeWidth: 2 });
  
    series.fills.template.setAll({
      fillOpacity: 1,
      visible: true,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0x298bee), opacity: 0.29 },
          { color: am5.color(0x298bee), opacity: 0.05 },
        ],
        rotation: 90
      }),
    });
  
    const rangeExpiration = xAxis.makeDataItem({ value: expireAt });

    xAxis.createAxisRange(rangeExpiration);
  
    rangeExpiration.get('grid').setAll({ strokeWidth: 2, stroke: am5.color(0xf0c34a), strokeOpacity: 1, strokeDasharray: [0] });
  
    series.bullets.push(function (root, _, dataItem) {
      if (dataItem.dataContext.close) {
        const container = am5.Container.new(root, {});

        container.children.push(am5.Circle.new(root, { radius: 6, layer: 3, fill: am5.color(0xf0c34a) }));

        container.children.push(
          am5.Graphics.new(root, {
            stroke: am5.color(0x485a84),
            strokeWidth: 2,
            layer: 3,
            draw: (display) => {
              display.moveTo(0, 0);
              display.lineTo(0, 6);
              display.moveTo(4, 0);
              display.lineTo(4, 6);
            },
            x: -2,
            y: -3
          })
        );

        const seriesPosition = _createSeriesForPosition(chart, xAxis, yAxis);

        chart.series.push(seriesPosition);

        seriesPosition.data.setAll(
          dataTrade.map((item) => ({
            price: item.open,
            time: item.time,
            invest: item.invest,
            expireAt: item.expireAt,
            type: item.type,
            start: true,
          }))
        );

        seriesPosition.animate({
          key: 'opacity',
          from: 0,
          to: 1,
          duration: 100,
        });

        window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initComplete' }));

        return am5.Bullet.new(root, { sprite: container, locationX: undefined });
      }
    })

    series.data.setAll(dataLine);

    chart.appear(400, 0);
  }

  setTimeout(function () {
    var dataLine = ${dataLine};
    var dataTrade = ${dataTrade};
    var expireAt = ${params.expireAt};
    _initChart(dataLine, dataTrade, expireAt);
  }, 350);
  
  `;

  return jsCode;
}
