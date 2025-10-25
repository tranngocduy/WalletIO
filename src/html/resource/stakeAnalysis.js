import { isIOS } from '@/utils/app';
import { updateHistoryRange, createTooltipStatistics } from '@/html/stringCode/business';

export const stakeAnalysis = () => {

  const html =
    '<div style="display: flex; flex-direction: column; font-size: 12px; line-height: 16px;">' +
    '<div style="display: flex; justify-content: space-between; align-items: baseline; flex-direction: row; column-gap: 8px; line-height: 16px; min-width: 110px;">' +
    '<div>' + 'Date' + ':</div>' +
    '<div>{valueX.formatDate("dd-MM-YYYY")}</div>' +
    '</div>' +
    '<div style="display: flex; justify-content: space-between; align-items: baseline; flex-direction: row; column-gap: 8px; line-height: 16px; min-width: 110px;">' +
    '<div>' + 'Total' + ':</div>' +
    '<div style="color: #1862DD;">{amount} USDT</div>' +
    '</div>' +
    '</div>';

  const jsCode = `
  ${updateHistoryRange()}

  ${createTooltipStatistics()}

  function _initChart(data = []) {
    root = am5.Root.new('chartDiv', { useSafeResolution: ${!isIOS} });
  
    chart = root.container.children.push(am5xy.XYChart.new(root, { panX: true, panY: false, pinchZoomX: false, pinchZoomY: false, paddingLeft: 0 }));
  
    chart.zoomOutButton.set('forceHidden', true);

    dateAxis = am5xy.DateAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), baseInterval: { timeUnit: 'day', count: 1 }, groupData: false, tooltip: am5.Tooltip.new(root, { visible: false, forceHidden: true }), maxZoomCount: 60, minZoomCount: 7, minDeviation: 0, maxDeviation: 0 });

    xAxis = chart.xAxes.push(dateAxis);
  
    xAxis.get('dateFormats')['day'] = 'dd-MM';

    xAxis.get('dateFormats')['week'] = 'dd-MM';

    xAxis.get('dateFormats')['month'] = 'dd-MM';

    xAxis.get('periodChangeDateFormats')['day'] = 'dd-MM';

    xAxis.get('periodChangeDateFormats')['week'] = 'dd-MM';

    xAxis.get('periodChangeDateFormats')['month'] = 'dd-MM';
  
    xAxis.get('renderer').labels.template.setAll({ fill: am5.color(0x021d76), fontSize: 10, paddingTop: 20, fontWeight: 500 });

    xAxis.get('renderer').grid.template.setAll({ visible: false });
  
    yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 40 }), min: 0, extraMax: 0.15, numberFormat: '#a' }));

    yAxis.set('min', 0);

    yAxis.get('renderer').labels.template.setAll({ fill: am5.color(0x021d76), fontSize: 10, paddingRight: 12 });

    yAxis.get('renderer').grid.template.setAll({ visible: true, stroke: am5.color(0xbde3ff), strokeOpacity: 1, strokeWidth: 0.66 });
  
    series = chart.series.push(
      am5xy.LineSeries.new(chart.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'date',
        valueYField: 'amount',
        stroke: am5.color(0x1862dd)
      })
    );
  
    var cursor = chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none', xAxis: xAxis }));
  
    cursor.lineY.setAll({ visible: false });
  
    cursor.lineX.setAll({ strokeWidth: 0.84, stroke: am5.color(0x1862dd), strokeDasharray: [2], visible: true, animationDuration: 0 });
  
    var tooltip = _createChartTooltipStatistics({ root, series, chart, html: '${html}' });

    series.set('tooltip', tooltip);
  
    series.strokes.template.setAll({ strokeWidth: 2 });
  
    series.fills.template.setAll({
      fillOpacity: 1,
      visible: true,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [{ color: am5.color(0x298bee), opacity: 0.19 }, { color: am5.color(0x298bee), opacity: 0 }],
        rotation: 100
      })
    });

    chart.appear(400);

    window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initChartComplete' }));
  }

  function _loadDataSeries(data, supportLoadMore) {
    var extraMinDay = 2;
    var extraMaxDay = 2;
    var minDaysShow = 7;

    var max = _.last(data).date + moment.duration(extraMaxDay, 'day').valueOf();
    var min = Math.min(_.first(data).date - moment.duration(extraMinDay, 'day').valueOf(), max - moment.duration(minDaysShow, 'day').valueOf());

    var scale = d3.scaleLinear([min, max], [0, 1]);
    
    if (!supportLoadMore || data.length < 1) {
      chart.events.off('panended', _handleSelection);

      var start = scale(max - moment.duration(minDaysShow, 'day').valueOf());
      var end = scale(max);

      series.data.setAll(data);
      xAxis.set('start', start);
      xAxis.set('end', end);
      xAxis.set('min', min);
      xAxis.setPrivate('min', min);
      xAxis.set('max', max);
      xAxis.setPrivate('max', max);
    } 
    
    else if (!!supportLoadMore) {
      chart.events.on('panended', _handleSelection);

      var savedSelectionMin = (xAxis.getPrivate('selectionMin') || (max - moment.duration(minDaysShow, 'day').valueOf()));
      var savedSelectionMax = (xAxis.getPrivate('selectionMax') || max);

      series.data.setAll(data);
      xAxis.set('min', min);
      xAxis.setPrivate('min', min);
      xAxis.set('max', max);
      xAxis.setPrivate('max', max);
      xAxis.set('start', scale(savedSelectionMin));
      xAxis.set('end', scale(savedSelectionMax));
    }
  }
  
  setTimeout(function() { 
    _initChart(); 
  }, 350);
  
  `;

  return jsCode;
}
