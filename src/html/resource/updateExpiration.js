export const updateExpiration = () => {
  const jsCode = `
    const MAX_DEVIATION = 0.013;
  
    async function _animateZoom(zoomAnimation) {
      chart.setAll({ panX: false, pinchZoomX: false, wheelY: 'none' });

      const startAnimation = dateAxis.animate({
        key: 'start',
        from: zoomAnimation.start.from,
        to: zoomAnimation.start.to,
        duration: 600,
      });
  
      const endAnimation = dateAxis.animate({
        key: 'end',
        from: zoomAnimation.end.from,
        to: zoomAnimation.end.to + MAX_DEVIATION * (zoomAnimation.end.to - zoomAnimation.start.to),
        duration: 600
      });

      await Promise.all([startAnimation.waitForStop(), endAnimation.waitForStop()]);

      chart.setAll({ panX: true, pinchZoomX: true, wheelY: 'zoomX' });
    }

    function _updateExpiration(symbol, duration, expireAt) {
      const purchaseEndAt = expireAt - duration;

      const item = { symbol: symbol, duration: duration, expireAt: expireAt };

      seriesPosition.setAll({ _view: item });

      rangePurchaseEnd.animate({
        key: 'value',
        to: purchaseEndAt,
        duration: rangePurchaseEnd.get('value') ? 600 : 0,
      });

      rangePurchaseEnd.animate({
        key: 'endValue',
        to: expireAt,
        duration: rangePurchaseEnd.get('endValue') ? 600 : 0,
      });

      rangeExpiration.animate({
        key: 'value',
        to: expireAt,
        duration: rangeExpiration.get('value') ? 600 : 0,
      });

      rangePurchaseEnd.get('axisFill').setAll({
        fill: am5.color(0xffbc00),
        visible: true,
        fillOpacity: 0.18,
      });

      rangePurchaseEnd.get('axisFill').animate({
        key: 'fillOpacity',
        to: 0.18,
        from: 0,
      });

      rangePurchaseEnd.get('grid').setAll({
        strokeOpacity: 0,
      });

      rangePurchaseEnd.setAll({
        visible: true
      });

      if (expireAt && purchaseEndAt) {
        const selectionMin = dateAxis.getPrivate('selectionMin');
        const selectionMax = dateAxis.getPrivate('selectionMax');
        const min = dateAxis.get('min');
        const max = dateAxis.get('max');

        const dateRange = _getSelectionFitExpiration(expireAt, chartConfigView, Date.now());

        if (!!max && (max > expireAt)) {
          const startZoom = _getStartDateForPercent(chartConfigView.type, dateRange);
          const scale = d3.scaleLinear([min, max], [0, 1]);

          _animateZoom({
            start: {
              from: scale(selectionMin),
              to: scale(startZoom)
            },
            end: {
              from: scale(selectionMax),
              to: scale(expireAt)
            }
          })
          .then(function() {
            const scaleNew = d3.scaleLinear([min, expireAt], [0, 1]);

            dateAxis.setAll({ max: expireAt });
            dateAxis.setAll({ start: scaleNew(startZoom), end: scaleNew(expireAt) + MAX_DEVIATION * (scaleNew(expireAt) - scaleNew(startZoom)) });
            dateAxis.setPrivate('max', expireAt);
          });
        }
        else {
          const startZoom = _getStartDateForPercent(chartConfigView.type, dateRange);
          const scale = d3.scaleLinear([min, expireAt], [0, 1]);

          dateAxis.setAll({ max: expireAt });
          dateAxis.setPrivate('max', expireAt);

          if (!!isViewHistory) {
            dateAxis.setAll({ start: scale(selectionMin), end: scale(selectionMax) });
          }
          else { 
            _animateZoom({
              start: {
                from: scale(selectionMin),
                to: scale(startZoom),
              },
              end: {
                from: scale(selectionMax),
                to: scale(expireAt),
              }
            });
          }
        }
      }
    }

  `;

  return jsCode;
}
