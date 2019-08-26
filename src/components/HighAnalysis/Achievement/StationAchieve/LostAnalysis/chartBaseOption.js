



export const getBaseOption = (dataAxis) => ({
  grid: {
    containLabel: true,
    left: 24,
    right: 52,
  },
  xAxis: {
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
  },
  yAxis: {
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
  },
});
