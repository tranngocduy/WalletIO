import { createDonut3D } from '@/html/stringCode/Donut3D/createDonut3D';

export const rankDetails = params => {
  const data = JSON.stringify(params);

  const jsCode = `
    ${createDonut3D()}

    function _rankDetails() {
      const Donut3D = _createDonut3D();
      const dataByLevel = _.keyBy(${data}, 'level');

      var salesData = [
        {
          label: 'Member',
          color: '#96D0FF',
          outerColor: 'url(#member_outer)',
          innerColor: 'url(#member_inner)',
          value: dataByLevel?.[0]?.total,
        },
        {
          label: 'Silver',
          color: '#F1F1F1',
          outerColor: 'url(#silver_outer)',
          innerColor: 'url(#silver_inner)',
          value: dataByLevel?.[1]?.total,
        },
        {
          label: 'Gold',
          color: '#E4CF9F',
          outerColor: 'url(#gold_outer)',
          innerColor: 'url(#gold_inner)',
          value: dataByLevel?.[2]?.total,
        },
        {
          label: 'Platinum',
          color: '#ABA591',
          outerColor: 'url(#platinum_outer)',
          innerColor: 'url(#platinum_inner)',
          value: dataByLevel?.[3]?.total,
        },
        {
          label: 'Sapphire',
          color: '#4B8AB7',
          outerColor: 'url(#sapphire_outer)',
          innerColor: 'url(#sapphire_inner)',
          value: dataByLevel?.[4]?.total,
        },
        {
          label: 'Emerald',
          color: '#108475',
          outerColor: 'url(#emerald_outer)',
          innerColor: 'url(#emerald_inner)',
          value: dataByLevel?.[5]?.total,
        },
        {
          label: 'Diamond',
          color: '#CCB0E3',
          outerColor: 'url(#diamond_outer)',
          innerColor: 'url(#diamond_inner)',
          value: dataByLevel?.[6]?.total,
        },
        {
          label: 'Polaris',
          color: '#4C1D93',
          outerColor: 'url(#polaris_outer)',
          innerColor: 'url(#polaris_inner)',
          value: dataByLevel?.[7]?.total,
        },
      ];
      // create order index
      const dataDesc = _.orderBy(salesData, 'value', 'desc');
      dataDesc[0].zIndex = 20;
      dataDesc[0].top = -15;
      dataDesc[0].h = 20;

      dataDesc[1].zIndex = 10;
      dataDesc[1].top = -6;
      dataDesc[1].h = 16;

      dataDesc[2].zIndex = 10;
      dataDesc[2].top = -6;
      dataDesc[2].h = 16;
      _swap(dataDesc, 0, 1);
      _swap(dataDesc, 0, 2);

      const svgs = dataDesc.map((item, index) => {
        const svg = d3
          .select('#donut-chart-team')
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .style('z-index', item.zIndex || 10 - index)
          .style('top', item.top + 'px')
          .style('position', 'absolute')
          .style('top', '0px')
          .style('left', '0px')
          .attr('viewBox', '0 0 300 300');
        svg.append('g').attr('id', 'donutTeam' + item.label);
        const newData = dataDesc.map((d, i) => {
          if (index === i)
            return {
              ...d,
              hide: false,
            };
          return {
            ...d,
            hide: true,
          };
        });

        Donut3D.draw('donutTeam' + item.label, newData, 150, 150, 130, 100, item.h || 10, 0.55);
        
        return svg;
      });

      window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initComplete' }));
    }

    setTimeout(function() { _rankDetails(); }, 350);

  `;

  return jsCode;
}
