



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
  },
  yAxis: {
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
    },
  },
});
