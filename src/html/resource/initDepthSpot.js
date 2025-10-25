import { isIOS } from '@/utils/app';
import { depthRangePlugin } from '@/html/stringCode/Range/depthRangePlugin';

export const initDepthSpot = () => {
  const jsCode = `
  ${depthRangePlugin()}

  function setDepthData(params) {
    const data = JSON.parse(params);

    seriesBid.data.setAll(data.bid);
    seriesAsk.data.setAll(data.ask);
    xAxis = seriesBid.get('xAxis');

    const firstPrice = (_.first(data.bid)?.price || _.first(data.ask)?.price) || 0;
    const lastBid = (_.last(data.bid)?.price || _.first(data.ask)?.price) || 0;
    const firstAsk = (_.first(data.ask)?.price || _.last(data.bid)?.price) || 0;

    const midPoint = (lastBid + firstAsk) / 2;

    depthRangePlugin.update({
      data,
      midPoint,
    });

    xAxis.setAll({
      strictMinMaxSelection: true,
      min: firstPrice,
      max: 2 * midPoint - firstPrice,

      maxPrecision: 3,
      minZoomCount: 40
    });
  }

  function _initChart() {
    root = am5.Root.new('chartDiv', { useSafeResolution: ${!isIOS} });

    root.setThemes([am5themes_Dark.new(root)]);
    
    chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        wheelZoomPositionX: 0.5,
        pinchZoomX: false,
        pinchZoomY: false,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 8,
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 100,
    });
    xRenderer.labels.template.setAll({
      fill: am5.color(0x808690),
      fontSize: 12,
    });
    xRenderer.grid.template.setAll({
      strokeOpacity: 0,
    });
    
    const priceAxis = am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      name: 'Main X Axis',
      tooltip: am5.Tooltip.new(root, {
        animationDuration: 0,
        autoTextColor: false,
      }),
    });

    const xAxis = chart.xAxes.push(priceAxis);
    xAxis.get('tooltip').label.setAll({
      fill: am5.color(0x9fa3ab),
    });
    xAxis.get('tooltip').get('background').setAll({
      visible: false,
    });

    const yAxisRenderer = am5xy.AxisRendererY.new(root, {
      inside: true,
      opposite: true,
    });
    yAxisRenderer.grid.template.setAll({
      strokeOpacity: 0,
    });
    yAxisRenderer.labels.template.setAll({
      fill: am5.color(0x808690),
      fontSize: 12,
    });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yAxisRenderer,
        name: 'Main Y Axis',
        tooltip: am5.Tooltip.new(root, {
          animationDuration: 0,
          autoTextColor: false,
        }),
      })
    );
    yAxis.get('tooltip').label.setAll({
      fill: am5.color(0x9fa3ab),
    });
    yAxis.get('tooltip').get('background').setAll({
      visible: false,
    });

    seriesBid = am5xy.StepLineSeries.new(chart.root, {
      name: 'Series Bid',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'amount',
      valueXField: 'price',
      locationX: 0.5,
      stroke: am5.color(0x2ebd85),
    });

    seriesBid.strokes.template.setAll({
      strokeWidth: 1,
    });
    seriesBid.fills.template.setAll({
      fillOpacity: 1,
      visible: true,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          {
            color: am5.color(0x2ebd85),
            opacity: 0.19,
          },
          {
            color: am5.color(0x2ebd85),
            opacity: 0.19,
          },
        ],
        rotation: 90,
      }),
    });
    chart.series.push(seriesBid);

    seriesAsk = am5xy.StepLineSeries.new(chart.root, {
      name: 'Series Ask',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'amount',
      valueXField: 'price',
      locationX: 0.5,
      stroke: am5.color(0xf1465d),
    });
    seriesAsk.strokes.template.setAll({
      strokeWidth: 1,
    });
    seriesAsk.fills.template.setAll({
      fillOpacity: 1,
      visible: true,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          {
            color: am5.color(0xf1465d),
            opacity: 0.19,
          },
          {
            color: am5.color(0xf1465d),
            opacity: 0.19,
          },
        ],
        rotation: 90,
      }),
    });
    chart.series.push(seriesAsk);

    // Config cursor
    const cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        layer: 0,
        snapToSeries: [seriesBid, seriesAsk],
        snapToSeriesBy: 'x',
        xAxis: xAxis,
        yAxis: yAxis,
      })
    );
    cursor.lineX.setAll({
      strokeWidth: 1,
      stroke: am5.color(0x9fa3ab),
      strokeDasharray: [2],
      visible: true,
    });
    cursor.lineY.setAll({
      strokeWidth: 1,
      stroke: am5.color(0x9fa3ab),
      strokeDasharray: [2],
      visible: false,
    });

    depthRangePlugin = new DepthRangePlugin({
      root,
      chart,
      seriesBid,
      seriesAsk,
    });

    window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initChartComplete' }));
  }

  setTimeout(function() { _initChart(); }, 350);

  `;

  return jsCode;
};

