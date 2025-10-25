import { BASE_INTERVAL, CHART_ANIMATION_DURATION } from '@/html/stringCode/constant';

export const createLineSubscription = () => {
  const jsCode = `

  function reassignBullet(lastDataItem, newDataItem) {
    if (lastDataItem.bullets?.length > 0) {
      newDataItem.bullets = [];
      newDataItem.bullets[0] = lastDataItem.bullets[0];
      newDataItem.dataContext.showBullet = true;
      newDataItem.bullets[0].get('sprite').dataItem = newDataItem;

      lastDataItem.dataContext.showBullet = false;
      lastDataItem.bullets = [];
    }
  }

  function insertUpdateChart(data) {
    const bisectLeft = d3.bisector((d) => d.dataContext.time).left;
    const filteredData = data;
    if (filteredData.length > 0) {
      _.forEach(filteredData, (item) => {
        const insertIndex = bisectLeft(series.dataItems, item.time);
        if (insertIndex < series.dataItems.length && series.dataItems[insertIndex]?.dataContext.time !== item.time) {
          series.data.insertIndex(insertIndex, { time: item.time, price: item.price, open: item.open, close: item.close, high: item.high, low: item.low });
        }
      });
    }
  }

  function createLineSubscription(params) {
    const data = JSON.parse(params);

    const lastDataItem = _.last(series.dataItems);

    if (!lastDataItem) series.data.push({ ...data, showBullet: true });

    else if (data.time >= lastDataItem.dataContext.time) {
      if (!lastDataItem.dataContext.showBullet) data.showBullet = true;

      series.data.push(data);

      const newDataItem = _.last(series.dataItems);
    
      if (newDataItem.uid === lastDataItem.uid) return;

      reassignBullet(lastDataItem, newDataItem);
      
      const easing = am5.ease.linear;

      newDataItem.animate({
        from: lastDataItem.dataContext?.price,
        to: data.price,
        duration: duration(chart, ${CHART_ANIMATION_DURATION}),
        key: 'valueYWorking',
        easing
      });

      const changeLocationX = Math.floor(newDataItem.dataContext.time / ${BASE_INTERVAL}) - Math.floor(lastDataItem.dataContext.time / ${BASE_INTERVAL});

      newDataItem.animate({
        from: -changeLocationX,
        to: 0,
        duration: duration(chart, ${CHART_ANIMATION_DURATION}),
        key: 'locationX',
        easing
      });

      rangeLastPrice.animate({
        from: lastDataItem.dataContext?.price,
        to: data.price,
        duration: duration(chart, ${CHART_ANIMATION_DURATION}),
        key: 'value',
      });

      rangeLastPrice.get('label').setAll({
        text: data.price,
      });
    } 

    else {
      const bisect = d3.bisector((item) => item.dataContext.time);
      const insertIndex = bisect.left(series.dataItems, data.time);
      if (series.dataItems[insertIndex].dataContext.time === data.time) {
        series.data.setIndex(insertIndex, { ...data, showBullet: series.dataItems[insertIndex].dataContext.showBullet });
      }
      else {
        series.data.insertIndex(insertIndex, data);
      }
    }
  }

  `;

  return jsCode;
}
