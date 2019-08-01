export const darkTheme = () => { // 数据规范展示
  const contrastColor = '#00baff';
  const fontColor = '#009CFF';
  const backgroundColor = '#000d34';
  const contrastfontColor = '#fff';
  var axisCommon = function () {
    return {
      axisLine: {
        lineStyle: {
          color: contrastColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: contrastColor,
        },
      },
      axisLabel: {
        textStyle: {
          color: contrastColor,
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(77, 95, 226, 0.6)',
        },
      },
      splitArea: {
        areaStyle: {
          color: contrastColor,
        },
      },
    };
  };

  var colorPalette = [
    '#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53',
    '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42',
  ];
  var theme = {
    color: colorPalette,
    // backgroundColor: backgroundColor,
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: contrastColor,
        },
        crossStyle: {
          color: contrastColor,
        },
      },
      trigger: 'axis',
      show: true,
      backgroundColor: backgroundColor,
      textStyle: {
        fontSize: 12,
        fontColor: contrastfontColor,
      },
      extraCssText: 'box-shadow: 0 0 3px rgba(255,255,255,0.4)',
      confine: true, //将 tooltip 框限制在图表的区域内。
    },
    legend: {
      textStyle: {
        color: contrastColor,
      },
    },
    textStyle: {
      color: contrastColor,
    },
    title: {
      textStyle: {
        color: fontColor,
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    toolbox: {
      iconStyle: {
        normal: {
          borderColor: contrastColor,
        },
      },
    },
    map: {
      label: {
        normal: {
          textStyle: {
            color: contrastColor,
          },
        },
        emphasis: {
          textStyle: {
            color: contrastColor,
          },
        },
      },
      itemStyle: {
        normal: {
          borderColor: '#0065c6',
          areaColor: '#161858',
        },
        emphasis: {
          areaColor: '#001568',
        },
      },
    },
    dataZoom: {
      textStyle: {
        color: contrastColor,
      },
    },
    visualMap: {
      textStyle: {
        color: contrastColor,
      },
    },
    timeline: {
      lineStyle: {
        color: contrastColor,
      },
      itemStyle: {
        normal: {
          color: colorPalette[1],
        },
      },
      label: {
        normal: {
          textStyle: {
            color: contrastColor,
          },
        },
      },
      controlStyle: {
        normal: {
          color: contrastColor,
          borderColor: contrastColor,
        },
      },
    },
    timeAxis: axisCommon(),
    logAxis: axisCommon(),
    valueAxis: axisCommon(),
    categoryAxis: axisCommon(),
    line: {
      symbol: 'circle',
    },
    graph: {
      color: colorPalette,
    },
    gauge: {
      title: {
        textStyle: {
          color: contrastColor,
        },
      },
    },
    candlestick: {
      itemStyle: {
        normal: {
          color: '#FD1050',
          color0: '#0CF49B',
          borderColor: '#FD1050',
          borderColor0: '#0CF49B',
        },
      },
    },
  };

  theme.categoryAxis.splitLine.show = false;
  return theme;
};

export const lightTheme = () => { // 数据规范展示
  const contrastColor = '#666';
  const fontColor = '#000';
  const backgroundColor = '#fff';
  const lineColor = '#dfdfdf';
  var axisCommon = function () {
    return {
      axisLine: {
        lineStyle: {
          color: lineColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: lineColor,
        },
      },
      axisLabel: {
        textStyle: {
          color: contrastColor,
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#f1f1f1',
        },
      },
      splitArea: {
        areaStyle: {
          color: contrastColor,
        },
      },
    };
  };

  var colorPalette = [
    '#c12e34', '#e6b600', '#0098d9', '#2b821d',
    '#005eaa', '#339ca8', '#cda819', '#32a487',
  ];
  var theme = {
    color: colorPalette,
    backgroundColor: backgroundColor,
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: contrastColor,
        },
        crossStyle: {
          color: contrastColor,
        },
      },
      trigger: 'axis',
      show: true,
      backgroundColor: backgroundColor,
      textStyle: {
        fontSize: 12,
        color: fontColor,
      },
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.50)',
      extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      confine: true, //将 tooltip 框限制在图表的区域内。
    },
    legend: {
      textStyle: {
        color: contrastColor,
      },
    },
    textStyle: {
      color: contrastColor,
    },
    title: {
      textStyle: {
        color: fontColor,
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    map: {
      label: {
        normal: {
          textStyle: {
            color: '#c12e34',
          },
        },
        emphasis: {
          textStyle: {
            color: '#c12e34',
          },
        },
      },
      itemStyle: {
        normal: {
          borderColor: '#eee',
          areaColor: '#ddd',
        },
        emphasis: {
          areaColor: '#e6b600',
        },
      },
    },
    toolbox: {
      iconStyle: {
        normal: {
          borderColor: contrastColor,
        },
      },
    },
    dataZoom: {
      textStyle: {
        color: contrastColor,
      },
    },
    visualMap: {
      textStyle: {
        color: contrastColor,
      },
    },
    timeline: {
      lineStyle: {
        color: contrastColor,
      },
      itemStyle: {
        normal: {
          color: colorPalette[1],
        },
      },
      label: {
        normal: {
          textStyle: {
            color: contrastColor,
          },
        },
      },
      controlStyle: {
        normal: {
          color: contrastColor,
          borderColor: contrastColor,
        },
      },
    },
    timeAxis: axisCommon(),
    logAxis: axisCommon(),
    valueAxis: axisCommon(),
    categoryAxis: axisCommon(),
    line: {
      symbol: 'circle',
    },
    graph: {
      color: colorPalette,
    },
    gauge: {
      title: {
        textStyle: {
          color: contrastColor,
        },
      },
    },
    candlestick: {
      itemStyle: {
        normal: {
          color: '#FD1050',
          color0: '#0CF49B',
          borderColor: '#FD1050',
          borderColor0: '#0CF49B',
        },
      },
    },
  };

  theme.categoryAxis.splitLine.show = false;
  return theme;
};



