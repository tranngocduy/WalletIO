import { createDonut3D } from '@/html/stringCode/Donut3D/createDonut3D';

export const rankStaking = params => {
  const data = JSON.stringify(params);

  const jsCode = `
    ${createDonut3D()}

    function _rankStaking() {
      const Donut3D = _createDonut3D();
      const dataByIndex = _.keyBy(${data}, 'index');
 
      var salesData = [
        {
            label: 'Group Staking',
            color: '#0F62FE',
            outerColor: 'url(#group_staking_outer)',
            innerColor: 'url(#group_staking_inner)',
            value: dataByIndex?.[0]?.total,
            hide: true,
        },
        {
            label: 'Small Group Staking',
            color: '#FDCC4C',
            outerColor: 'url(#small_group_staking_outer)',
            innerColor: 'url(#small_group_staking_inner)',
            value: dataByIndex?.[1]?.total,
        },
      ];
      var salesData2 = [
        {
            label: 'Group Staking',
            color: '#0F62FE',
            outerColor: 'url(#group_staking_outer)',
            innerColor: 'url(#group_staking_inner)',
            value: dataByIndex?.[0]?.total,
        },
        {
            label: 'Small Group Staking',
            color: '#FDCC4C',
            outerColor: 'url(#small_group_staking_outer)',
            innerColor: 'url(#small_group_staking_inner)',
            value: dataByIndex?.[1]?.total,
            hide: true,
        },
      ];

      var svg = d3
        .select('#donut-chart-staking')
        .append('svg')
        .style('--delay', '0s')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0px')
        .style('left', '0px')
        .attr('viewBox', '0 0 300 300');
      var svg2 = d3
        .select('#donut-chart-staking')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0px')
        .style('left', '0px')
        .attr('viewBox', '0 0 300 300');

      svg.append('g').attr('id', 'donutChartStakingPie');
      svg2.append('g').attr('id', 'donutChartStakingPie2');

      // ellipse 130 100 -> ellipse 100
      Donut3D.draw('donutChartStakingPie', salesData, 150, 150, 120, 85, 16, 0.68);
      Donut3D.draw('donutChartStakingPie2', salesData2, 150, 150, 140, 99, 16, 0.55);

      window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: 'initComplete' }));
    }

    setTimeout(function() { _rankStaking(); }, 350);

  `;

  return jsCode;
}
