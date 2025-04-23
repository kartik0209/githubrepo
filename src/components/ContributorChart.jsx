import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Format a timestamp into a human-readable week start date
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} - Formatted date string
 */
const formatWeekStart = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

/**
 * Component for displaying contributor activity chart
 */
const ContributorChart = () => {
  const { contributors, selectedMetric } = useSelector((state) => state.details);
  
  // Generate chart options based on the selected metric and data
  const options = useMemo(() => {
    if (!contributors || contributors.length === 0) {
      return null;
    }

    // Generate a color palette for different contributors
    const colorPalette = [
      '#2196F3', '#4CAF50', '#F44336', '#FF9800', '#9C27B0', 
      '#3F51B5', '#00BCD4', '#009688', '#FFC107', '#795548',
      '#607D8B', '#E91E63', '#673AB7', '#CDDC39', '#03A9F4'
    ];

    // Find earliest and latest weeks across all contributors
    let earliestWeek = Infinity;
    let latestWeek = 0;
    
    contributors.forEach(contributor => {
      const weeks = contributor.weeks || [];
      weeks.forEach(week => {
        earliestWeek = Math.min(earliestWeek, week.w);
        latestWeek = Math.max(latestWeek, week.w);
      });
    });

    // Build a complete timeline of weeks
    const timeline = [];
    for (let week = earliestWeek; week <= latestWeek; week += 604800) { // 604800 seconds in a week
      timeline.push(week);
    }

    // Create series data for each contributor
    const series = contributors.map((contributor, index) => {
      // Create a map of week timestamps to data for faster lookup
      const weekMap = {};
      (contributor.weeks || []).forEach(week => {
        weekMap[week.w] = week;
      });

      // Generate data points for each week in the timeline
      const data = timeline.map(weekTimestamp => {
        const week = weekMap[weekTimestamp] || { a: 0, d: 0, c: 0 };
        let value;
        
        switch(selectedMetric) {
          case 'additions':
            value = week.a;
            break;
          case 'deletions':
            value = week.d;
            break;
          default: // 'changes'
            value = week.a + week.d;
        }
        
        return {
          x: weekTimestamp * 1000, // Convert to milliseconds
          y: value,
          additions: week.a,
          deletions: week.d,
          commits: week.c
        };
      });

      // Return series object for this contributor
      return {
        name: contributor.author?.login || `Contributor ${index + 1}`,
        data: data,
        color: colorPalette[index % colorPalette.length],
        visible: index < 5 // Only show first 5 contributors initially
      };
    });

    return {
      chart: {
        type: 'line',
        zoomType: 'x',
        height: 400
      },
      title: {
        text: `Weekly ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} by Contributor`,
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
          let tooltip = `<b>${this.series.name} - ${formatWeekStart(this.point.x)}</b><br/>`;
          
          if (selectedMetric === 'changes') {
            tooltip += `Additions: ${this.point.additions.toLocaleString()}<br/>`;
            tooltip += `Deletions: ${this.point.deletions.toLocaleString()}<br/>`;
            tooltip += `Total Changes: ${(this.point.additions + this.point.deletions).toLocaleString()}`;
          } else if (selectedMetric === 'additions') {
            tooltip += `Additions: ${this.point.additions.toLocaleString()}`;
          } else {
            tooltip += `Deletions: ${this.point.deletions.toLocaleString()}`;
          }
          
          tooltip += `<br/>Commits: ${this.point.commits.toLocaleString()}`;
          
          return tooltip;
        }
      },
      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        maxHeight: 80,
        itemStyle: {
          fontSize: '10px'
        }
      },
      series: series,
      plotOptions: {
        line: {
          marker: {
            radius: 2
          }
        }
      },
      credits: {
        enabled: false
      }
    };
  }, [contributors, selectedMetric]);

  if (!options) {
    return (
      <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No contributor data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Paper>
  );
};

export default ContributorChart;