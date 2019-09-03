
import { showNoData, hiddenNoData, darkShowNoData } from '../constants/echartsNoData';
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

const gradient = (stratColor, endColor) => {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
      offset: 0, color: stratColor, // 0% 处的颜色
    }, {
      offset: 1, color: endColor, // 100% 处的颜色
    }],
  }
}

const barRadius = {
  itemStyle: {
    barBorderRadius: [5, 5, 0, 0],
  },
};

const chartsLoading = (charts, loading, theme) => {
  const lightColor = {
    maskColor: 'rgba(255, 255, 255, 0.8)',
    color: '#199475',
  };
  const darkColor = {
    color: '#00baff',
    textColor: '#fff',
    maskColor: 'rgba(22, 24, 88, 0.5)',
  };

  return loading ? charts.showLoading('default', theme === 'dark' ? darkColor : lightColor) : charts.hideLoading();
};

const chartsNodata = (hasNoData, theme) => {
  if (!hasNoData) {
    return theme === 'dark' && darkShowNoData || showNoData;
  }
  return hiddenNoData;
};

const themeConfig = { // 主题切换用于图表
  'dark': 'darkTheme',
  'light': 'lightTheme',
};


export { Gradient1, Gradient2, gradient, barRadius, chartsLoading, themeConfig, chartsNodata };




