


export const getBaseGrid = () => ({
  containLabel: true,
  left: 24,
  right: 52,
});

export const getBaseXAxis = (dataAxis) => ({
  data: dataAxis,
  axisLabel: {
    textStyle: {
      color: '#666666',
    },
  },
  axisTick: {
    show: false,
  },
  axisLine: {
    lineStyle: {
      color: '#dfdfdf',
    },
  },
});

export const getBaseYAxis = (name) => ({
  axisLine: {
    lineStyle: {
      color: '#dfdfdf',
    },
  },
  splitLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    textStyle: {
      color: '#666666',
    },
  },
  nameTextStyle: {
    color: '#666666',
    padding: [0, -20, 0, 0],
  },
  name,
});
