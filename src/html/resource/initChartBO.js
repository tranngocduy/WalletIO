import { isIOS } from '@/utils/app';
import { dayjs } from '@/utils/timeTz';
import { insertPositionToSeries } from '@/html/stringCode/Bullet/insertPositionToSeries';
import { removePositionToSeries } from '@/html/stringCode/Bullet/removePositionToSeries';
import { createSeriesForPosition } from '@/html/stringCode/Bullet/createSeriesForPosition';
import { duration, updateHistoryRange, updateSocketOldData, updateDateSelectionMax, switchChartLine, getIntervalMs, getSelectionFitExpiration, getStartDateForPercent, getShowSymbolSeriesIsActive } from '@/html/stringCode/business';

import { createLineSeries } from '@/html/stringCode/Line/createLineSeries';
import { createLineSubscription } from '@/html/stringCode/Line/createLineSubscription';

import { createCandlestick } from '@/html/stringCode/Candles/createCandlestick';
import { createCandleSubscription } from '@/html/stringCode/Candles/createCandleSubscription';

import { createBarsSeries } from '@/html/stringCode/Bars/createBarsSeries';
import { createBarsSubscription } from '@/html/stringCode/Bars/createBarsSubscription';

const BASE_INTERVAL = 100;
const MIN_DATE_GLOBAL = dayjs('2020-01-01', 'YYYY-MM-DD').startOf('second').valueOf();

export const initChartBO = (initConfig, isArea) => {
  const jsCode = `
  isViewHistory = false;

  timeoutDateSelection = null;

  isWithinTradingHours = false;

  isLineChartTypeArea = ${isArea};

  chartConfigView = ${initConfig};

  ${duration()}

  ${getIntervalMs()}

  ${switchChartLine()}

  ${updateHistoryRange()}

  ${updateSocketOldData()}

  ${updateDateSelectionMax()}

  ${createSeriesForPosition()}

  ${insertPositionToSeries()}

  ${removePositionToSeries()}

  ${getStartDateForPercent()}

  ${getSelectionFitExpiration()}

  ${getShowSymbolSeriesIsActive()}

  ${createLineSeries()}

  ${createLineSubscription()}

  ${createCandlestick()}

  ${createCandleSubscription()}

  ${createBarsSeries()}

  ${createBarsSubscription()}

  function _initChart() {
    root = am5.Root.new('chartDiv', { useSafeResolution: ${!isIOS} });

    const fontHash = '"14px / 21px "HarmonyOS Sans""HarmonyOS Sans"normalautoautonormal14px100%normalweight style small-capsautoautoautonormalnormalnormalnormalnormalnormalnormalnormal400"';
    root._updateComputedStyles = () => {
      if (root._fontHash !== fontHash) {
        root._fontHash = fontHash;
        return true;
      }
      return false;
    };
    root.setThemes([am5themes_Animated.new(root)]);

    const innerRunDirties = root._runDirties;
    root._runDirties = () => {
      try {
        innerRunDirties.call(root);
      } catch (err) {
        console.error('@Something went wrong with amrchart', err);
      }
    };

    stockChart = root.container.children.push(
      am5stock.StockChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
        pinchZoomY: false,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        stockPositiveColor: am5.color(0x06b542),
        stockNegativeColor: am5.color(0xf7003b),
      })
    );
    
    chart = stockChart.panels.push(
      am5stock.StockPanel.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
        pinchZoomY: false,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      })
    );

    chart.zoomOutButton.set('forceHidden', true);
    chart.panelControls.set('forceHidden', true);

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none', layer: 0 }));
    cursor.lineX.setAll({ strokeWidth: 1, stroke: am5.color(0x0f62fe),  strokeDasharray: [], visible: true });
    cursor.lineY.setAll({ strokeWidth: 1, stroke: am5.color(0x0f62fe),  strokeDasharray: [], visible: true });

    var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 150 });
    xRenderer.labels.template.setAll({ fill: am5.color(0xbcbcbc), fontSize: 12 });

    dateAxis = am5xy.DateAxis.new(root, { 
      maxDeviation: 0.013,
      baseInterval: {
        timeUnit: 'millisecond',
        count: ${BASE_INTERVAL},
      },
      renderer: xRenderer,
      min: ${MIN_DATE_GLOBAL},
      name: 'Main X Axis'
    });

    xAxis = chart.xAxes.push(dateAxis);

    var yAxisRenderer = am5xy.AxisRendererY.new(root, { 
      pan: 'zoom',
      centerX: 100,
      inside: true,
      opposite: true,
      minGridDistance: 140
    });

    yAxisRenderer.labels.template.setAll({ 
      fill: am5.color(0xa9b5c6), 
      fontSize: 12, 
      paddingRight: 32 
    });

    yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: yAxisRenderer,
      minZoomCount: 400,
      extraMax: 0.15,
      extraMin: 0.15,
      name: 'Main Y Axis',
      tooltip: am5.Tooltip.new(root, {
        dx: 100,
        autoTextColor: false,
        getFillFromSprite: false,
        animationDuration: 0,
        paddingTop: 2,
        reverseChildren: true,
        paddingBottom: 2,
        layer: 0
      })
    }));

    yAxis._formatText = (text) => text; // skip format text
  
    const tooltip = yAxis.get('tooltip');
    tooltip.label.setAll({
      fill: am5.color(0xffffff),
      fontSize: 11,
      isMeasured: false,
      dx: -40,
      height: 20,
      dy: -9
    });

    tooltip.get('background').setAll({
      fill: am5.color(0x0f62fe),
      stroke: undefined,
      strokeWidth: 0,
      visible: false
    });
    
    tooltip.children
      .push(
        am5.Rectangle.new(root, {
          fill: am5.color(0x0f62fe),
          strokeWidth: 0,
          width: 52,
          height: 14,
          stroke: undefined,
          position: 'absolute',
          x: -32,
          y: -8
        })
      ).toBack();

    tooltip.children
      .push(
        am5.Triangle.new(root, {
          fill: am5.color(0x2f96f0),
          strokeWidth: 0,
          width: 14,
          height: 6,
          rotation: -90,
          stroke: undefined,
          position: 'absolute',
          y: -1,
          x: -35,
        })
      ).toBack();

    yAxisRenderer.grid.template.setAll({
      stroke: am5.color(0xe7effa),
      strokeOpacity: 1,
      strokeWidth: 0.5,
      strokeDasharray: [5]
    });

    xRenderer.grid.template.setAll({
      stroke: am5.color(0xe7effa),
      strokeOpacity: 1,
      strokeWidth: 0.5,
      strokeDasharray: [5]
    });

    rangeExpiration = xAxis.makeDataItem({
      value: 0
    });
    xAxis.createAxisRange(rangeExpiration);
    rangeExpiration.get('grid').setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffcc00),
      strokeOpacity: 1,
      strokeDasharray: [0]
    });
    xRenderer.grid.template.setup = () => {
      rangeExpiration.get('grid').toFront();
    };
    
    rangePurchaseEnd = xAxis.makeDataItem({
      value: 0,
    });
    xAxis.createAxisRange(rangePurchaseEnd);
    rangePurchaseEnd.get('axisFill').setAll({});

    rangeLastPrice = yAxis.makeDataItem({
      value: 0,
    });
    yAxis.createAxisRange(rangeLastPrice);
    rangeLastPrice.get('grid').setAll({
      strokeWidth: 1,
      stroke: am5.color(0x0f62fe),
      strokeOpacity: 1,
      dx: -100 - 36,
      strokeDasharray: [0]
    });
    rangeLastPrice.get('label').setAll({
      fill: am5.color(0x0f62fe),
      text: 0,
      fontSize: 14,
      paddingRight: 24,
      paddingLeft: 24,
      dx: -36,
      textAlign: 'center',
      width: 100,
      height: 22,
      isMeasured: false, // set false to disable text measure, good for perf but required to set width and height manually
      background: am5.RoundedRectangle.new(root, {
        isMeasured: false,
        fill: am5.color(0xffffff),
        fillOpacity: 0.5,
        stroke: am5.color(0x0f62fe),
        strokeWidth: 1,
        cornerRadiusBL: 20,
        cornerRadiusBR: 20,
        cornerRadiusTL: 20,
        cornerRadiusTR: 20
      })
    });
    rangeLastPrice.get('label').children.push(
      am5.Line.new(root, {
        strokeWidth: 1,
        stroke: am5.color(0x0f62fe),
        strokeOpacity: 1,
        position: 'absolute',
        x: 101,
        y: am5.p50,
        isMeasured: false,
        points: [
          { x: 0, y: 0 },
          { x: 36, y: 0 }
        ]
      })
    );

    rangeLoading = xAxis.makeDataItem({
      value: 0,
      endValue: 0,
    });
    xAxis.createAxisRange(rangeLoading);
    rangeLoading.get('axisFill').setAll({
      fillPattern: am5.LinePattern.new(root, {
        color: am5.color(0x298bee),
        rotation: 45,
        width: 1024,
        height: 1024,
        fillOpacity: 0.05,
        colorOpacity: 0.5,
        gap: 30,
      }),
      visible: false,
    });

    seriesPosition = am5xy.LineSeries.new(chart.root, {
      name: 'Series',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'price',
      valueXField: 'time',
      locationX: 0
    });

    seriesPosition.onPrivate('startIndex', (v, target) => {
      target.setPrivate('startIndex', 0);
    });

    seriesPosition.strokes.template.setAll({
      forceHidden: true
    });

    seriesPosition.bullets.push(function (root, series, dataItem) {
      const { start, onClickPosition, maxDecimal, symbol, expireAt } = dataItem.dataContext;

      const handleJumpView = () => { 
        window.ReactNativeWebView.postMessage(JSON.stringify({
          eventType: 'focusSession',
          data: dataItem.dataContext
        }));
      };

      if (!!start) {
        const startBullet = _createBulletStartOrder(root, chart, series, dataItem, handleJumpView, { maxDecimal });
        return startBullet;
      }
    });

    chart.series.push(seriesPosition);

    chart.events.on('panended', _handleSelection);

    xAxis.onPrivate('selectionMax', _updateDateSelectionMax);

    window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initChartComplete' }));
  }

  setTimeout(function() { _initChart(); }, 350);

  `;

  return jsCode;
}
