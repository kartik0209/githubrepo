// src/components/CommitChart.jsx
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@mui/material';
import { formatDate } from '../utils/formatters';

const CommitChart = () => {
  const { commitActivity } = useSelector((s) => s.details);

  const options = useMemo(() => {
    if (!commitActivity?.length) return null;
    
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
      yAxis: { title: { text: 'Commits' }, allowDecimals: false },
      series: [
        {
          name: 'Commits',
          data: commitActivity.map((w) => [w.week * 1000, w.total]),
        },
      ],
      tooltip: {
        pointFormatter() {
          return `<b>${this.y}</b> commits`;
        },
      },
      credits: { enabled: false },
    };
  }, [commitActivity]);

  if (!options) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No commit data</Typography>
      </Paper>
    );
  }
  
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default React.memo(CommitChart);