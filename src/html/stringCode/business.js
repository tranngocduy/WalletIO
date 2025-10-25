export const getIntervalMs = () => {
  const jsCode = `
    function getIntervalMs(chartInterval) {
      if (!!chartInterval.value) {
        const [, value, unit] = chartInterval.value.match(/^(\d+)(\w+)$/);
        const interval = moment.duration(value, unit).valueOf();
        return interval;
      }
      else {
        const { count: value, timeUnit: unit } = chartInterval;
        const interval = moment.duration(value, unit).valueOf();
        return interval;
      }
    }
  `;
  return jsCode;
}

export const duration = () => {
  const jsCode = `
    function duration(chart, ms) {
      if (chart.get('userData')?.disableAnimation) return 0;
      return ms;
    }
  `;
  return jsCode;
}

export const updateHistoryRange = () => {
  const jsCode = `
    function _handleSelection() {
      const start = dateAxis.get('start');
      const selectionMin = Math.max(dateAxis.getPrivate('selectionMin'));
      const selectionMax = Math.min(dateAxis.getPrivate('selectionMax'));

      window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'handleSelection', data: { dateMin: selectionMin, dateMax: selectionMax, pan: (start < 0) ? 'left' : 'right' } }));
    }
    
    function _handleOnRangeLoading(dateMax) {
      const selectionMin = dateAxis.getPrivate('selectionMin');
      const newestTime = series.dataItems?.[0]?.dataContext?.time;

      rangeLoading.get('axisFill').setAll({ visible: true });
      rangeLoading.setAll({ value: Math.min(selectionMin, newestTime), endValue: Math.min(dateMax, newestTime) });
    }

    function _handleOffRangeLoading() {
      rangeLoading.get('axisFill').setAll({  visible: false });
    }

    function _handleAdjustSeries(lastPrice, lastTime, isMobileSize) {
      if (!isMobileSize) {
        const adjustSeries = chart.get('_adjustSeries');
        if (!!adjustSeries) chart.series.removeValue(adjustSeries);
        return;
      }

      if (!chart.get('_adjustSeries')) {
        const newAdjustSeries = am5xy.LineSeries.new(chart.root, {
          name: 'Series misc',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'price',
          valueXField: 'time',
          locationX: 0
        });

        chart.set('_adjustSeries', newAdjustSeries);

        chart.series.push(newAdjustSeries);

        newAdjustSeries.strokes.template.setAll({ strokeWidth: 0, strokeOpacity: 0 });
      }

      const maxChart = yAxis.getPrivate('max') || 0;

      const minChart = yAxis.getPrivate('min') || 0;

      const max = yAxis.getPrivate('selectionMax') || 0;

      const min = yAxis.getPrivate('selectionMin') || 0;

      const maxSelectionTime = xAxis.getPrivate('selectionMax') || 0;

      const adjustSeries = chart.get('_adjustSeries');

      if ((min === minChart) && (max === maxChart)) return;

      if (lastTime > maxSelectionTime) return;

      if ((lastPrice > 0) && (max > 0)) {
        adjustSeries.data.setAll([
          {
            price: lastPrice - 0.5 * (max - lastPrice),
            time: lastTime
          },
          {
            price: lastPrice + 0.2 * (lastPrice - min),
            time: lastTime
          }
        ]);
      }
    }
  `;

  return jsCode;
};

export const createTooltipStatistics = () => {
  const jsCode = `
    function _createTooltip({ root, html, tooltipSettings }) {
      var tooltip = am5.Tooltip.new(root, {
        autoTextColor: false,
        getFillFromSprite: false,
        animationDuration: 0,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 12,
        paddingLeft: 12,
        reverseChildren: true,
        layer: 100,
        labelHTML: html,
        maskContent: false,
        ...tooltipSettings,
      });

      tooltip.get('background').setAll({
        fill: am5.color(0xffffff),
        stroke: undefined,
        strokeWidth: 0,
        fillOpacity: 1,
        cornerRadiusBL: 4,
        cornerRadiusBR: 4,
        cornerRadiusTL: 4,
        cornerRadiusTR: 4,
      });

      tooltip.label.setAll({
        fill: am5.color(0x000000),
        fontSize: 12,
      });

      return tooltip;
    }

    const _createTooltipBullet = ({ root, tooltip }) => {
      const tooltipBullet = am5.Container.new(root, { x: tooltip ? -1000 : undefined, layer: 100 });
    
      tooltipBullet.children.push(
        am5.Circle.new(root, {
          fill: am5.color(0xffffff),
          strokeWidth: 0,
          radius: 6,
          stroke: undefined,
        })
      );
      tooltipBullet.children.push(
        am5.Circle.new(root, {
          fill: am5.color(0x2f96f0),
          strokeWidth: 0,
          radius: 4,
          stroke: undefined,
        })
      );

      return tooltipBullet;
    };
  
    function _createChartTooltipStatistics({ root, html, showBullet = true, tooltipSettings = {}, chart, series }) {
      const tooltip = _createTooltip({ root, html, tooltipSettings });

      if (!!showBullet) {
        const tooltipBullet = _createTooltipBullet({ root, tooltip });

        chart.plotContainer.children.push(tooltipBullet);

        series.bullets.push((root, series) => {
          if (series.data.length > 1) return null;

          const bulletTooltip = _createTooltipBullet({ root, tooltip });

          return am5.Bullet.new(root, { sprite: bulletTooltip, locationX: 0.5, locationY: 0.5 });
        });
      }
      return tooltip;
    }
  `;

  return jsCode;
}

export const getSelectionFitExpiration = () => {
  const jsCode = `
  
    function _getSelectionFitExpiration(expireAt, chartConfigView, now) {
      const minDuration = ['line', 'area'].includes(chartConfigView.type)
        ? 60000
        : moment.duration(chartConfigView.interval.count, chartConfigView.interval.timeUnit).asMilliseconds() * 10; // fit [N] candles

      const minStart = expireAt - now < minDuration ? expireAt - minDuration : now;
    
      return [minStart, expireAt];
    }

  `;

  return jsCode;
}

export const getStartDateForPercent = () => {
  const jsCode = `
  
    function _getStartDateForPercent(type, dateRange) {
      const percent = ['line', 'area'].includes(type) ? 0.4 : 0.75;
      const scale = d3.scaleLinear([percent, 1], dateRange);
      return scale(0);
    }

  `;

  return jsCode;
}

export const getShowSymbolSeriesIsActive = () => {
  const jsCode = `
    
  function _getShowSymbolSeriesIsActive(isActive, symbol) {

    if (!!isActive) {
      series.show();
      rangeLastPrice.show();
      rangeExpiration.show();
      rangePurchaseEnd.show();
    }

    else if (!isActive) {
      series.hide();
      rangeLastPrice.hide();
      rangeExpiration.hide();
      rangePurchaseEnd.hide();
    }

  }
  
  `;

  return jsCode;
}

export const updateSocketOldData = () => {
  const jsCode = `
    function _updateSocketOldData(params) {
      const oldData = !!params ? JSON.parse(params) : [];
      const seriesData = series.dataItems.map(element => ({ ...element.dataContext }));
      const seriesDataAll = ([...oldData, ...seriesData])?.sort((a, b) => (a.time - b.time));
      series.data.setAll([...seriesDataAll]);
    }

    function _insertSocketEmptyData(params) {
      const emptyData = !!params ? JSON.parse(params) : [];
      const seriesData = series.dataItems.map(element => ({ ...element.dataContext }));
      const seriesDataAll = ([...seriesData, ...emptyData])?.sort((a, b) => (a.time - b.time));
      series.data.setAll([...seriesDataAll]);
    }
  `;

  return jsCode;
}

export const updateDateSelectionMax = () => {
  const jsCode = `
  function _jumpToLastView() {
    isViewHistory = false;

    const duration = ['line', 'area'].includes(chartConfigView.type)
      ? 60000
      : moment
        .duration(chartConfigView.interval.count, chartConfigView.interval.timeUnit)
        .asMilliseconds() * 10; // fit [N] candles
    const min = dateAxis.get('min');
    const max = dateAxis.get('max') || Date.now();
    const scale = d3.scaleLinear([min, max], [0, 1]);
    const selectionMin = dateAxis.getPrivate('selectionMin');
    const selectionMax = dateAxis.getPrivate('selectionMax');

    _animateZoom({
      start: {
        from: scale(selectionMin),
        to: scale(max - duration),
      },
      end: {
        from: scale(selectionMax),
        to: scale(max + (20 * duration) / 100),
      }
    });
  }

  function _jumpToLastPrice() {
    const max = dateAxis.get('max') || Date.now();

    const min = dateAxis.get('min');

    const duration = moment.duration(interval.count, interval.timeUnit).asMilliseconds() * 15;

    dateAxis.zoomToDates(new Date(max + duration), new Date(max - duration), 600);
  }

  function _updateDateSelectionMax(value) {
    if (!!timeoutDateSelection) clearTimeout(timeoutDateSelection);

    timeoutDateSelection = setTimeout(function () {
      const DELTA = 5000;
      const max = xAxis.getPrivate('max') || 0;
      const maxSelectionTime = xAxis.getPrivate('selectionMax') || 0;
      isViewHistory = ((max - maxSelectionTime) > DELTA);

      window.ReactNativeWebView.postMessage(JSON.stringify({
        eventType: 'handleViewHistory',
        data: { isViewHistory: isViewHistory }
      }));
    }, 100);
  }
  `;

  return jsCode;
}

export const switchChartLine = () => {
  const jsCode = `
    function _switchChartLine(chartSubType) {
      if (!!series.isDisposed()) return;
      series.fills.template.setAll({ visible: chartSubType === 'area' });
    }
  `;

  return jsCode;
}
