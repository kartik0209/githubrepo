import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@mui/material';

const formatDate = (ts) =>
  new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ContributorChart = () => {
  const { contributors, selectedMetric } = useSelector((s) => s.details);

  const options = useMemo(() => {
    if (!contributors.length) return null;

    // find global min/max week
    let minW = Infinity,
      maxW = 0;
    contributors.forEach((c) =>
      c.weeks.forEach((w) => {
        minW = Math.min(minW, w.w);
        maxW = Math.max(maxW, w.w);
      })
    );
    const timeline = [];
    for (let w = minW; w <= maxW; w += 604_800)
      timeline.push(w * 1000);

    const series = contributors.map((c, i) => {
      const weekMap = Object.fromEntries(c.weeks.map((w) => [w.w, w]));
      return {
        name: c.author.login,
        data: timeline.map((ts) => {
          const d = weekMap[ts / 1000] || { a: 0, d: 0 };
          const y =
            selectedMetric === 'additions'
              ? d.a
              : selectedMetric === 'deletions'
              ? d.d
              : d.a + d.d;
          return [ts, y];
        }),
      };
    });

    return {
      chart: { type: 'line', height: 300 },
      title: { text: null },
      xAxis: { type: 'datetime', labels: { formatter() { return formatDate(this.value / 1000); } } },
      yAxis: { title: { text: 'Count' } },
      series,
      tooltip: {
        shared: true,
        formatter() {
          const date = formatDate(this.x / 1000);
          let s = `<b>${date}</b><br/>`;
          this.points.forEach((pt) => {
            s += `${pt.series.name}: <b>${pt.y}</b><br/>`;
          });
          return s;
        },
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

export default ContributorChart;
