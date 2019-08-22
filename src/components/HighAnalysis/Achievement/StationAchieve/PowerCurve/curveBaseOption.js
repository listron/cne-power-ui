

const grid = {
  containLabel: true,
  left: 24,
  right: 30,
};

const xAxis = {
  axisLabel: {
    textStyle: {
      color: '#666666',
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
      color: '#dfdfdf',
    },
  },
  nameTextStyle: {
    color: '#666666',
  },
};

const yAxis = {
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
