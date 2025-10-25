export const insertPositionToSeries = () => {
  const jsCode = `

    function _insertPositionToSeries(params) {
      const data = JSON.parse(params);

      const bisectLeft = d3.bisector((d) => d.dataContext.time).left;
      const insertIndex = bisectLeft(seriesPosition.dataItems, data.time);

      const item = {
        price: data.open,
        time: data.time,
        invest: data.invest,
        expireAt: data.expireAt,
        duration: data.duration,
        type: data.type,
        start: true,
        profitRate: data.profitRate,
        symbol: data.symbol,
        id: data.id
      };

      seriesPosition.data.insertIndex(insertIndex, item);
    }
  `;

  return jsCode;
};
