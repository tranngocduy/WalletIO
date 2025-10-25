import { CHART_ANIMATION_DURATION } from '@/html/stringCode/constant';

export const createCandleSubscription = () => {
  const jsCode = `

    function insertUpdateChart(data) {
      const bisectLeft = d3.bisector((d) => d.dataContext.time).left;
      const filteredData = [...data];
      if (filteredData.length > 0) {
        forEach(filteredData, (item) => {
          const insertIndex = bisectLeft(series.dataItems, item.time);
          if (insertIndex < series.dataItems.length && series.dataItems[insertIndex]?.dataContext.time !== item.time) {
            series.data.insertIndex(insertIndex, { 
              time: item.time,
              price: item.price,
              open: item.open,
              close: item.close,
              high: item.high,
              low: item.low,
            });
          }
        });
      }
    }

    function createCandleSubscription(params) {
      const data = JSON.parse(params);

      const lastDataItem = _.last(series.dataItems);
      const lastPrice = lastDataItem?.dataContext?.price;
      const lastHigh = lastDataItem?.dataContext?.high;
      const lastLow = lastDataItem?.dataContext?.low;

      if (!lastDataItem) {
        series.data.push({ ...data, showBullet: true });
      }
      else if (data.time >= lastDataItem.dataContext.time) {
        if (!lastDataItem.dataContext.showBullet) data.showBullet = true;

        if (data.time === lastDataItem.dataContext.time) {
          series.data.setIndex(series.data.length - 1, data);
        } else {
          series.data.push(data);
        }

        const newDataItem = _.last(series.dataItems);

        newDataItem.animate({
          from: lastPrice,
          to: data.price,
          duration: duration(chart, ${CHART_ANIMATION_DURATION}),
          key: 'valueYWorking',
          ease: am5.ease.linear,
        });
        newDataItem.animate({
          from: lastLow,
          to: data.low,
          duration: duration(chart, ${CHART_ANIMATION_DURATION}),
          key: 'lowValueYWorking',
          ease: am5.ease.linear,
        });
        newDataItem.animate({
          from: lastHigh,
          to: data.high,
          duration: duration(chart, ${CHART_ANIMATION_DURATION}),
          key: 'highValueYWorking',
          ease: am5.ease.linear,
        });
        rangeLastPrice.animate({
          from: lastPrice,
          to: data.price,
          duration: duration(chart, ${CHART_ANIMATION_DURATION}),
          key: 'value',
          ease: am5.ease.linear,
        });
        rangeLastPrice.get('label').setAll({
          text: data.price,
        });
      }
      else {
        const bisect = d3.bisector((item) => item.dataContext.time);
        const insertIndex = bisect.left(series.dataItems, data.time);
        if (series.dataItems[insertIndex].dataContext.time === data.time) {
          series.data.setIndex(insertIndex, {
            ...data,
            showBullet: series.dataItems[insertIndex].dataContext.showBullet, // the case the old data override latest price
          });
        } else {
          series.data.insertIndex(insertIndex, data);
        }
      }
    }

  `;

  return jsCode;
};
