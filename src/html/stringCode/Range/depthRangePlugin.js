export const depthRangePlugin = () => {
  const jsCode = `
    class DepthRangePlugin {
      constructor({ root, seriesBid, seriesAsk, enableLiquidityRange }) {
        const xAxis = seriesBid.get('xAxis');
        const yAxis = seriesBid.get('yAxis');
        this.seriesBid = seriesBid;
        this.seriesAsk = seriesAsk;
        this.root = root;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.enableLiquidityRange = enableLiquidityRange;

        const rangeMidPoint = xAxis.makeDataItem({
          value: 0,
        });

        xAxis.createAxisRange(rangeMidPoint);

        rangeMidPoint.get('grid').setAll({
          strokeWidth: 1,
          stroke: am5.color(0xdbe0e8),
          strokeOpacity: 1,
          strokeDasharray: [0],
        });

        const bidTooltip = am5.Tooltip.new(root, {
          labelHTML:
          '<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));pointer-events:none;font-size:12px;row-gap: 2px;">' +
            '<div>Range</div>' +
            '<div style="text-align:right;color: #0FB100">-{range}%</div>' +
            '<div>Price</div>' +
            '<div style="text-align:right">{price}</div>' +
            '<div>Amount</div>' +
            '<div style="text-align:right">{amount}</div>' +
          '</div>',
          getFillFromSprite: false,
          pointerOrientation: 'right'
        });

        seriesBid.set('tooltip', bidTooltip);

        bidTooltip.get('background').setAll({
          fill: am5.color(0xffffff),
          fillOpacity: 0.9,
        });

        if (enableLiquidityRange) {
          bidTooltip.adapters.add('bounds', (bounds) => {
            if (bounds) {
              bounds.top = 0;
              bounds.bottom = 9999;
            }
            return bounds;
          });
        }

        const askTooltip = am5.Tooltip.new(root, {
          labelHTML:
          '<div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));pointer-events:none;font-size:12px;row-gap: 2px;">' +
            '<div>Range</div>' +
            '<div style="text-align:right;color: #F70E0E">+{range}%</div>' +
            '<div>Price</div>' +
            '<div style="text-align:right">{price}</div>' +
            '<div>Amount</div>' +
            '<div style="text-align:right">{amount}</div>' +
          '</div>',
          getFillFromSprite: false,
          pointerOrientation: 'left'
        });

        seriesAsk.set('tooltip', askTooltip);

        askTooltip.get('background').setAll({
          fill: am5.color(0xffffff),
          fillOpacity: 0.9,
        });

        if (enableLiquidityRange) {
          askTooltip.adapters.add('bounds', (bounds) => {
            if (bounds) {
              bounds.top = 0;
              bounds.bottom = 9999;
            }
            return bounds;
          });
        }

        if (enableLiquidityRange) {
          const rangeBid = xAxis.makeDataItem({
            value: 0,
            endValue: 0,
          });
          const rangeAsk = xAxis.makeDataItem({
            value: 0,
            endValue: 0,
          });
          xAxis.createAxisRange(rangeBid);
          xAxis.createAxisRange(rangeAsk);

          const rangeBidContainer = xAxis.makeDataItem({
            value: 0,
            endValue: 0,
          });

          const rangeAskContainer = xAxis.makeDataItem({
            value: 0,
            endValue: 0,
          });

          xAxis.createAxisRange(rangeBidContainer);

          xAxis.createAxisRange(rangeAskContainer);

          rangeBid.get('axisFill').setAll({
            fill: am5.color(0x000000),
            fillOpacity: 0.05,
            visible: true,
          });

          rangeAsk.get('axisFill').setAll({
            fill: am5.color(0x000000),
            fillOpacity: 0.05,
            visible: true,
          });

          rangeBidContainer.get('axisFill').setAll({
            fill: am5.color(0xffffff),
            fillOpacity: 0,
            visible: true,
          });

          rangeAskContainer.get('axisFill').setAll({
            fill: am5.color(0xffffff),
            fillOpacity: 0,
            visible: true,
          });

          let hover = '';
          rangeBidContainer.get('axisFill').events.on('pointerover', (e) => {
            hover = 'bid';
          });
          rangeAskContainer.get('axisFill').events.on('pointerover', (e) => {
            hover = 'ask';
          });

          bidTooltip.events.on('dataitemchanged', (event) => {
            if (hover !== 'bid') return;

            if (event.newDataItem) {
              const index = seriesBid.dataItems.findIndex(
                (item) => item.dataContext.price === event.newDataItem.dataContext.price
              );
              const otherIndex = Math.min(seriesBid.dataItems.length - 1 - index, seriesAsk.dataItems.length - 1);

              if (otherIndex < 0) return; // happen when depth only has one side (only bids without asks)

              seriesAsk.showDataItemTooltip(seriesAsk.dataItems[otherIndex]);

              rangeBid.setAll({
                value: _.first(seriesBid.dataItems).dataContext.price,
                endValue: seriesBid.dataItems[index].dataContext.price,
              });
              rangeAsk.setAll({
                value: seriesAsk.dataItems[otherIndex].dataContext.price,
                endValue: _.last(seriesAsk.dataItems).dataContext.price,
              });

              if (!askTooltip.get('visible')) {
                askTooltip.adapters.add('visible', () => true);
                askTooltip.adapters.add('opacity', () => 1);
              }
            } 
            else {
              askTooltip.adapters.remove('visible');
              askTooltip.adapters.remove('opacity');
            }
          });

          askTooltip.events.on('dataitemchanged', (event) => {
            if (hover !== 'ask') return;

            if (event.newDataItem) {
              const index = seriesAsk.dataItems.findIndex(
                (item) => item.dataContext.price === event.newDataItem.dataContext.price
              );
              const otherIndex = Math.max(seriesBid.dataItems.length - 1 - index, 0);

              if (otherIndex < 0) return; // happen when depth only has one side (only asks without bids)

              seriesBid.showDataItemTooltip(seriesBid.dataItems[otherIndex]);

              rangeAsk.setAll({
                value: seriesAsk.dataItems[index].dataContext.price,
                endValue: _.last(seriesAsk.dataItems).dataContext.price,
              });

              rangeBid.setAll({
                value: _.first(seriesBid.dataItems).dataContext.price,
                endValue: seriesBid.dataItems[otherIndex].dataContext.price,
              });

              if (!bidTooltip.get('visible')) {
                bidTooltip.adapters.add('visible', () => true);
                bidTooltip.adapters.add('opacity', () => 1);
              }
            } 
            else {
              bidTooltip.adapters.remove('visible');
              bidTooltip.adapters.remove('opacity');
            }
          });

          this.rangeBidContainer = rangeBidContainer;
          this.rangeAskContainer = rangeAskContainer;
        }

        this.rangeMidPoint = rangeMidPoint;
      }

      update({ data, midPoint }) {
        const rangeBidContainer = this.rangeBidContainer;
        const rangeAskContainer = this.rangeAskContainer;
        const rangeMidPoint = this.rangeMidPoint;

        const firstPrice = _.first(data.bid)?.price || _.first(data.ask)?.price || 0;

        if (this.enableLiquidityRange) {
          rangeBidContainer.setAll({
            value: firstPrice,
            endValue: midPoint,
          });

          rangeAskContainer.setAll({
            value: midPoint,
            endValue: 2 * midPoint - firstPrice,
          });
        }

        rangeMidPoint.setAll({ value: midPoint });
      }
    }
  `;

  return jsCode;
}
