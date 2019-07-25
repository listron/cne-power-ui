const Gradient1 = {
  type: 'linear',
  x: 0,
  y: 1,
  x2: 0,
  y2: 0,
  colorStops: [{
    offset: 0, color: '#00baff', // 0% 处的颜色
  }, {
    offset: 1, color: '#5beda9', // 100% 处的颜色
  }],
};

const Gradient2 = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [{
    offset: 0, color: '#f95071', // 0% 处的颜色
  }, {
    offset: 1, color: '#f47a37', // 100% 处的颜色
  }],
};

const barRadius = {
  itemStyle: {
    barBorderRadius: [5, 5, 0, 0],
  },
};

export { Gradient1, Gradient2, barRadius };


