

const grid = {
  containLabel: true,
  left: 24,
  right: 30,
};

const xAxis = {
  axisLabel: {
    textStyle: {
      color: '#353535',
    },
  },
  axisTick: {
    show: false,
  },
  splitLine: {
    show: false,
  },
  axisLine: {
    lineStyle: {
      color: '#d4d4d4',
    },
  },
  nameTextStyle: {
    color: '#353535',
  },
};

const yAxis = {
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
    padding: [0, 0, 0, 30],
  },
};

export const getCurveBaseOption = () => ({
  grid: { ...grid },
  xAxis: { ...xAxis },
  yAxis: { ...yAxis },
});

export const getPartsOption = (partName) => {
  return {
    grid: { ...grid },
    xAxis: { ...xAxis },
    yAxis: { ...yAxis },
  }[partName];
};
