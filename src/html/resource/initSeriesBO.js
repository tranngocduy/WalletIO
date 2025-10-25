const CHART_MAX_ZOOM_COUNT = 3600 * (1000 / 100);
const CHART_MIN_ZOOM_COUNT = 90 * (1000 / 100);

export const initSeriesBO = () => {
  const jsCode = `

  const seriesCreators = {
    line: { createSeries: createLineSeries, createSubscription: createLineSubscription },
    candles: { createSeries: createCandlestick, createSubscription: createCandleSubscription },
    bars: { createSeries: createBarsSeries, createSubscription: createBarsSubscription }
  }

  const chartType = ['line', 'area'].includes(chartConfigView.type) ? 'line' : chartConfigView.type;

  const interval = chartConfigView.interval;

  function _initSeries() {
    const max = dateAxis.get('max') || Date.now();
    const min = dateAxis.get('min');
    const dateRange = _getSelectionFitExpiration(max, chartConfigView, Date.now());
    const startDate = _getStartDateForPercent(chartConfigView.type, dateRange);
    const start = d3.scaleLinear([min, max], [0, 1])(startDate);

    dateAxis.setAll({
      baseInterval: {
        timeUnit: interval.timeUnit,
        count: interval.count,
      },
      minZoomCount: chartType === 'line' ? ${CHART_MIN_ZOOM_COUNT} : 20,
      maxZoomCount: chartType === 'line' ? ${CHART_MAX_ZOOM_COUNT} : 100,
      start,
      end: 1,
    });

    const { createSeries, createSubscription } = seriesCreators[chartType];

    const series = createSeries();

    stockChart.set('stockSeries', series);

    series.data.setAll([]);

    _createPointSubscription = createSubscription;

    window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initSeriesComplete' }));
  }

  setTimeout(function() { _initSeries(); }, 350);

  `;

  return jsCode;
}
