import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@mui/material';
import { formatDate } from '../utils/formatters';


const CommitChart = () => {
  const { contributors, selectedMetric } = useSelector((s) => s.details);

  const options = useMemo(() => {
    if (!contributors?.length) return null;

    // Determine global week range
    let minW = Infinity, maxW = 0;
    contributors.forEach((c) =>
      c.weeks.forEach((w) => {
        minW = Math.min(minW, w.w);
        maxW = Math.max(maxW, w.w);
      })
    );

    // Build weekly timeline (one week = 604800 seconds)
    const timeline = [];
    for (let w = minW; w <= maxW; w += 604_800) {
      timeline.push(w * 1000);
    }

    // Aggregate data per week
    const data = timeline.map((ts) => {
      const weekSec = ts / 1000;
      let sumAdd = 0, sumDel = 0;
      contributors.forEach((c) => {
        const wk = c.weeks.find((w) => w.w === weekSec);
        if (wk) {
          sumAdd += wk.a;
          sumDel += wk.d;
        }
      });
      const y =
        selectedMetric === 'additions' ? sumAdd :
        selectedMetric === 'deletions'  ? sumDel :
        sumAdd + sumDel;
      return [ts, y];
    });

    const seriesName =
      selectedMetric === 'additions' ? 'Additions' :
      selectedMetric === 'deletions' ? 'Deletions' :
      'Changes';

    return {
      chart: { type: 'column', height: 300 },
      title: { text: null },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter() {
            return formatDate(this.value / 1000);
          },
        },
      },
      yAxis: { title: { text: seriesName }, allowDecimals: false },
      series: [{ name: seriesName, data }],
      tooltip: {
        headerFormat: '<b>{point.key:%Y-%m-%d}</b><br/>',
        pointFormatter() {
          return `<b>${this.y}</b> ${seriesName.toLowerCase()}`;
        },
        shared: true,
      },
      credits: { enabled: false },
    };
  }, [contributors, selectedMetric]);

  if (!options) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No data available</Typography>
      </Paper>
    );
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default React.memo(CommitChart);
