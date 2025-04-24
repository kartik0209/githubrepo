import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@mui/material';
import { formatDate } from '../utils/formatters';


const ContributorChart = () => {
  const { contributors, selectedMetric } = useSelector((state) => state.details);

  const options = useMemo(() => {
    if (!contributors?.length) return null;

    let minW = Infinity, maxW = 0;
    contributors.forEach((c) =>
      c.weeks.forEach((w) => {
        minW = Math.min(minW, w.w);
        maxW = Math.max(maxW, w.w);
      })
    );

   
    const timeline = [];
    for (let w = minW; w <= maxW; w += 604800) {
      timeline.push(w * 1000);
    }


    const series = contributors.map((c) => {
     
      const weekMap = Object.fromEntries(c.weeks.map((w) => [w.w, w]));
      const data = timeline.map((ts) => {
        const wSec = ts / 1000;
        const wk = weekMap[wSec] || { a: 0, d: 0 };
        const y =
          selectedMetric === 'additions' ? wk.a :
          selectedMetric === 'deletions' ? wk.d :
          wk.a + wk.d;
        return [ts, y];
      });
      return {
        name: c.author.login,
        data,
      };
    });

    return {
      chart: { type: 'line', height: 300 },
      title: { text: null },
      xAxis: {
        type: 'datetime',
        title: { text: 'Week Start' },
        labels: {
          formatter() {
            return formatDate(this.value / 1000);
          },
        },
      },
      yAxis: {
        title: {
          text:
            selectedMetric === 'additions'
              ? 'Additions'
              : selectedMetric === 'deletions'
              ? 'Deletions'
              : 'Changes',
        },
        allowDecimals: false,
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemMarginTop: 5,
        itemMarginBottom: 5,
      },
      series,
      tooltip: {
        shared: true,
        headerFormat: '<b>{point.key:%Y-%m-%d}</b><br/>',
      },
      credits: { enabled: false },
    };
  }, [contributors, selectedMetric]);

  if (!options) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No contributor data</Typography>
      </Paper>
    );
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default React.memo(ContributorChart);
