import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';
import { formatWeekStart } from '../utils/dateUtils';

/**
 * Component for displaying the total commit activity chart
 */
const CommitChart = () => {
  const { codeFrequency, selectedMetric } = useSelector((state) => state.details);
  
  // Generate chart options based on the selected metric and data
  const options = useMemo(() => {
    if (!codeFrequency || codeFrequency.length === 0) {
      return null;
    }

    // Extract the data based on selected metric
    const seriesData = codeFrequency.map((week) => {
      const timestamp = week[0];
      const additions = week[1];
      const deletions = Math.abs(week[2]); // Convert to positive value
      
      let value;
      if (selectedMetric === 'additions') {
        value = additions;
      } else if (selectedMetric === 'deletions') {
        value = deletions;
      } else {
        // For 'changes', combine additions and deletions
        value = additions + deletions;
      }
      
      return {
        x: timestamp * 1000, // Convert to milliseconds
        y: value,
        additions,
        deletions
      };
    });

    return {
      chart: {
        type: 'area',
        zoomType: 'x',
        height: 300,
      },
      title: {
        text: `Weekly ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`,
        style: { fontSize: '16px' }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        },
        labels: {
          formatter: function() {
            return formatWeekStart(this.value);
          }
        }
      },
      yAxis: {
        title: {
          text: 'Count'
        },
        min: 0
      },
      tooltip: {
        formatter: function() {
          let tooltip = `<b>${formatWeekStart(this.point.x)}</b><br/>`;
          
          if (selectedMetric === 'changes') {
            tooltip += `Additions: ${this.point.additions.toLocaleString()}<br/>`;
            tooltip += `Deletions: ${this.point.deletions.toLocaleString()}<br/>`;
            tooltip += `Total Changes: ${(this.point.additions + this.point.deletions).toLocaleString()}`;
          } else if (selectedMetric === 'additions') {
            tooltip += `Additions: ${this.point.additions.toLocaleString()}`;
          } else {
            tooltip += `Deletions: ${this.point.deletions.toLocaleString()}`;
          }
          
          return tooltip;
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
        data: seriesData,
        color: selectedMetric === 'additions' ? '#4CAF50' : 
               selectedMetric === 'deletions' ? '#F44336' : '#2196F3'
      }],
      plotOptions: {
        area: {
          fillOpacity: 0.3,
          marker: {
            radius: 2
          }
        }
      },
      credits: {
        enabled: false
      }
    };
  }, [codeFrequency, selectedMetric]);

  if (!options) {
    return (
      <Paper elevation={1} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="body1">No data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Paper>
  );
};

export default CommitChart;