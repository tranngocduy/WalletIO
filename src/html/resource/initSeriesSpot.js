import { createCandlestick } from '@/html/stringCode/Candles/createCandlestick';
import { createCandleSubscription } from '@/html/stringCode/Candles/createCandleSubscription';

export const initSeriesSpot = () => {
  const jsCode = `
  ${createCandlestick()}
  ${createCandleSubscription()}

  const interval = chartConfigView.interval;

  function _initSeries(params) {

    const max = dateAxis.get('max') || Date.now();

    const min = dateAxis.get('min');

    const duration = moment.duration(interval.count, interval.timeUnit).asMilliseconds() * 15;

    const scaleDate = d3.scaleLinear([min, max], [0, 1]);

    dateAxis.setAll({
      baseInterval: {
        timeUnit: interval.timeUnit,
        count: interval.count
      },
      start: scaleDate(max - duration),
      end: scaleDate(max + (20 * duration) / 100),
    });

    series = createCandlestick();

    stockChart.set('stockSeries', series);

    series.data.setAll([]);

    _createPointSubscription = createCandleSubscription;

    window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initSeriesComplete' }));
  }

  setTimeout(function() { _initSeries(); }, 350);

  `;

  return jsCode;
}
