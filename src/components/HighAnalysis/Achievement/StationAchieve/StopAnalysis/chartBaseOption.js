


export const getBaseGrid = () => ({
  containLabel: true,
  left: 24,
  right: 52,
});

export const getBaseXAxis = (dataAxis) => ({
  data: dataAxis,
  axisLabel: {
    textStyle: {
      color: '#353535',
    },
  },
  axisTick: {
    show: false,
  },
  axisLine: {
    lineStyle: {
      color: '#d4d4d4',
    },
  },
});

export const getBaseYAxis = (name) => ({
  axisLine: {
    lineStyle: {
      color: '#d4d4d4',
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
      color: '#353535',
    },
  },
  nameTextStyle: {
    color: '#353535',
    padding: [0, -20, 0, 0],
  },
  name,
});
