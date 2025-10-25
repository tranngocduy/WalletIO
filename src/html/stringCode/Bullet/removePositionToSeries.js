export const removePositionToSeries = () => {
  const jsCode = `
    function _removePositionToSeries(params) {
      const items = JSON.parse(params);

      items.forEach(item => {
        seriesPosition.data.each((dataItem) => {
          if (dataItem?.id === item.id) seriesPosition.data.removeValue(dataItem);
        });
      });
    }
  `;

  return jsCode;
};
