export const createSeriesForPosition = () => {
  const jsCode = `
  
    function _isInCurrentView(position, view) {
      return position.expireAt === view.expireAt && position.duration === view.duration;
    };

    function _updateVisibleLabelForCurrentView({ series, container, label, triangle, position }) {
      const _updateVisibleLabel = (view) => {
        const isInCurrentView = _isInCurrentView(position, view);
        label.setAll({
          visible: isInCurrentView,
        });
        triangle.setAll({
          visible: isInCurrentView,
        });
      };
      const onViewChange = (view) => {
        _updateVisibleLabel(view);
      };

      if (series.get('_view')) _updateVisibleLabel(series.get('_view'));

      const viewChangeDisposer = series.on('_view', onViewChange);
      container.addDisposer(viewChangeDisposer);
    };

    function _createBulletStartOrder (root, chart, series, dataItem, handleJumpView, { maxDecimal = 2 } = {}) {
      const { type, invest, expireAt } = dataItem.dataContext;
      
      const color = (type === 'sell') ? am5.color(0xd74343) : am5.color(0x32ac41);
      const colorArrow = (type === 'buy') ? am5.color(0x1e715e) : am5.color(0x882358);

      const container = am5.Container.new(root, { isMeasured: false });

      const investFormatted = (+invest).toFixed(maxDecimal);

      const label = container.children.push(
        am5.Label.new(root, {
          text: type === 'sell' ? '[#ffffff]$' + investFormatted + '[/]' : '[#ffffff]$' + investFormatted + '[/]',
          x: 0,
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 4,
          paddingRight: 4,
          centerX: am5.p50,
          y: type === 'sell' ? 8 : -24,
          fontSize: 12,
          background: am5.RoundedRectangle.new(root, {
            fill: color,
            cornerRadiusBL: 4,
            cornerRadiusBR: 4,
            cornerRadiusTL: 4,
            cornerRadiusTR: 4,
          }),
          cursorOverStyle: 'pointer',
          opacity: 0
        })
      );

      label.events.on('click', handleJumpView);

      const triangle = container.children.push(
        am5.Triangle.new(root, {
          fill: color,
          width: 5,
          height: 5,
          x: 0,
          centerX: am5.p50,
          rotation: type === 'sell' ? 0 : 180,
          y: type === 'sell' ? 6 : -6,
          opacity: 0
        })
      );

      const arrow = container.children.push(
        am5.Graphics.new(root, {
          stroke: colorArrow,
          strokeWidth: 2,
          draw: (display) => {
            if (type === 'buy') {
              display.moveTo(0, 2);
              display.lineTo(2.5, 0);
              display.lineTo(5, 2);
            } else {
              display.moveTo(0, 0);
              display.lineTo(2.5, 2);
              display.lineTo(5, 0);
            }
          },
          layer: 0,
          centerX: am5.p50,
          y: -1.5,
        })
      );

      const circleContainer = am5.Container.new(root, { cursorOverStyle: 'pointer' });

      const mainCircle = circleContainer.children.push(am5.Circle.new(root, { radius: 5, fill: color, opacity: 0 }));

      circleContainer.events.on('click', handleJumpView);

      const flickCircle = circleContainer.children.push(
        am5.Circle.new(root, {
          radius: 10,
          stroke: color,
          strokeWidth: 3,
        })
      );

      flickCircle
        .animate({
          key: 'radius',
          to: 28,
          duration: duration(chart, 200),
          easing: am5.ease.linear,
        })
        .waitForStop()
        .then(() => {
          mainCircle.animate({
            key: 'opacity',
            from: 0,
            to: 1,
            duration: duration(chart, 200),
          });
          label.animate({
            key: 'opacity',
            from: 0,
            to: 1,
            duration: duration(chart, 200),
          });
          triangle.animate({
            key: 'opacity',
            from: 0,
            to: 1,
            duration: duration(chart, 200),
          });
        });

      flickCircle.animate({
        key: 'opacity',
        to: 0,
        from: 0.3,
        duration: duration(chart, 200),
        easing: am5.ease.linear,
      });

      container.children.push(circleContainer);

      const bullet = am5.Bullet.new(root, { sprite: container, locationX: 0 });

      const _getXLocal = (value, series, container = series.bulletsContainer) => {
        const dateAxis = series.get('xAxis');
        const xAxisRenderer = dateAxis.get('renderer');
        const { x } = container.toLocal({
          y: 0,
          x: xAxisRenderer.positionToCoordinate(dateAxis.valueToPosition(value)),
        });
    
        return x;
      };

      const line = container.children.push(
        am5.Line.new(root, {
          position: 'absolute',
          x: 0,
          points: [],
          strokeWidth: 2,
          stroke: color,
          dx: 0,
        })
      );

      const endLine = container.children.push(
        am5.Graphics.new(root, {
          stroke: color,
          strokeWidth: 2,
          draw: (display) => {
            display.moveTo(0, 0);
            display.lineTo(0, 12);
          },
          layer: 0,
        })
      );
  
      container.adapters.add('x', (x, target) => {
        // valueX is the true value of the order in dateAxis
        const valueX = target.dataItem?.open?.valueX;
        if (!valueX) return x;
    
        const width = _getXLocal(expireAt, series, undefined, true) - _getXLocal(valueX, series);
        line.setAll({
          points: [
            { x: 0, y: 0 },
            { x: width, y: 0 },
          ],
        });
        endLine.setAll({
          dx: width,
          dy: -6,
        });
        container.setAll({
          width,
        });
        return x;
      });

      container.adapters.add('x', (x, target) => {
        const view = series.get('_view');
        if (view && _isInCurrentView(dataItem.dataContext, view)) {
          if (x < 0) label.setAll({ dx: -x + 40, dy: type === 'buy' ? 15 : -16 });
          else label.setAll({ dx: 0, dy: 0 });
        } else {
          label.setAll({ dx: 0, dy: 0 });
        }
    
        return x;
      });
  
      const ghostContainer = container.children.push(
        am5.Rectangle.new(root, {
          centerY: am5.p50,
          height: 29,
          width: am5.p100,
          fillOpacity: 0,
          cursorOverStyle: 'pointer',
          fill: color,
        })
      );

      ghostContainer.events.on('click', handleJumpView);

      _updateVisibleLabelForCurrentView({
        series,
        container,
        label,
        triangle,
        position: dataItem.dataContext,
      });
  
      label.toFront();

      bullet.setAll({ label, triangle, circleContainer, arrow });

      return bullet;
    }

    function _createSeriesForPosition(chart, xAxis, yAxis) {
      const seriesPosition = am5xy.LineSeries.new(chart.root,
        { name: 'Series', xAxis: xAxis, yAxis: yAxis, valueYField: 'price', valueXField: 'time', locationX: 0 }
      );

      seriesPosition.strokes.template.setAll({ forceHidden: true });

      seriesPosition.bullets.push(function (root, series, dataItem) {
        const { start } = dataItem.dataContext;

        if (start) return _createBulletStartOrder(root, chart, series, dataItem);
      });

      return seriesPosition;
    }

  `;

  return jsCode;
}

