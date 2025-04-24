
export const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  
  export const formatNumber = (num) => num.toLocaleString();
  