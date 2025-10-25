import { AUTO_GAP_COUNT } from '@/html/stringCode/constant';

export const createLineSeries = () => {
  const jsCode = `
  
  function createLineSeries() {
    series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Price Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'price',
        valueXField: 'time',
        highValueYField: 'high',
        lowValueYField: 'low',
        locationX: 0,
        autoGapCount: ${AUTO_GAP_COUNT},
        connect: false,
        stroke: am5.color(0x1862dd)
      })
    );

    series.bullets.push(function (root, series, dataItem) {
      if (dataItem.dataContext.showBullet) {
        if (_.last(series.dataItems)?.uid !== dataItem?.uid) {
          dataItem.dataContext.showBullet = false;
          return;
        }

        const container = am5.Container.new(root, {
          trustBounds: true,
          isMeasured: false,
        });

        const flickCircle = container.children.push(
          am5.Circle.new(root, {
            radius: 8,
            fill: am5.color(0x0f62fe),
            isMeasured: false,
            opacity: 0
          })
        );

        const intervalId = setInterval(() => {
          flickCircle
            .animate({
              key: 'radius',
              from: 8,
              to: 11,
              duration: duration(chart, 700),
              easing: am5.ease.out(am5.ease.linear),
              loops: 1
            })
            .waitForStop()
            .then(() => {
              flickCircle.animate({
                key: 'radius',
                from: 11,
                to: 8,
                duration: duration(chart, 700),
                easing: am5.ease.out(am5.ease.linear),
                loops: 1
              });
              flickCircle.animate({
                key: 'opacity',
                from: 0.2,
                to: 0,
                duration: duration(chart, 700),
                easing: am5.ease.out(am5.ease.linear),
                loops: 1
              });
            });
          flickCircle.animate({
            key: 'opacity',
            from: 0,
            to: 0.25,
            duration: duration(chart, 700),
            easing: am5.ease.out(am5.ease.linear),
            loops: 1
          });
        }, 1800);

        container.addDisposer(new am5.Disposer(() => clearInterval(intervalId)));

        container.children.push(
          am5.Circle.new(root, {
            radius: 6,
            fill: am5.color(0x0f62fe),
            isMeasured: false
          })
        );

        container.children.push(
          am5.Circle.new(root, {
            radius: 2,
            fill: am5.color(0xffffff),
            isMeasured: false
          })
        );

        return am5.Bullet.new(root, {
          sprite: container,
          locationX: undefined,
          dynamic: false
        });
      }
    });

    series.strokes.template.setAll({ strokeWidth: 2 });

    series.setAll({ isMeasured: false });
    
    series.fills.template.setAll({
      fillOpacity: 1,
      visible: !!isLineChartTypeArea,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          {
            color: am5.color(0x298bee),
            opacity: 0.19,
          },
          {
            color: am5.color(0x298bee),
            opacity: 0,
          },
        ],
        rotation: 90,
      }),
    });

    return series;
  }

  `;

  return jsCode;
}