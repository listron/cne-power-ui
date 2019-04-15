
// 故障图表-发电机前驱温度
export const PreTemperatureOptions = (flag) => {
  var base = +new Date(1968, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var date = [];

  for (var i = 1; i < 100; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  }
  /**
   * series判断显示不一样的颜色，每条数据判断和一个参数对比
   * 然后返回每条数据itemStyle : {
          normal : {
            color:'yellow',
          }
        },
   * */
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    legend: {
      show: true,
      left: '10%',
      top: '60%',
      width: '80%',
      itemWidth: 14,
      itemHeight: 6,
      x: 'center',
      y: 'bottom',
      padding: [100, 0],
      textStyle: {
        color: "#666",
        fontSize: 12,
      },
      selected: flag
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed"
        }
      },
      boundaryGap: [0, '100%']
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      start: 0,
      end: 10,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    series: [
      {
        name:'邮件营销',
        type:'line',
        symbol: "none",
        stack: '总量',
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'联盟广告',
        type:'line',
        symbol: "none",
        stack: '总量',
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'视频广告',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[150, 232, 201, 154, 190, 330, 410]
      },
      {
        name:'直接访问',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[320, 332, 301, 334, 390, 330, 320]
      },
      {
        name:'搜索引擎',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };
};

// 故障图表-发电机后驱温度
export const AfterTemperatureOptions = () => {
  var base = +new Date(1968, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var date = [];

  for (var i = 1; i < 100; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  }
  /**
   * series判断显示不一样的颜色，每条数据判断和一个参数对比
   * 然后返回每条数据itemStyle : {
          normal : {
            color:'yellow',
          }
        },
   * */
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed"
        }
      },
      boundaryGap: [0, '100%']
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      start: 0,
      end: 10,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    series: [
      {
        name:'邮件营销',
        type:'line',
        symbol: "none",
        stack: '总量',
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'联盟广告',
        type:'line',
        symbol: "none",
        stack: '总量',
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'视频广告',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[150, 232, 201, 154, 190, 330, 410]
      },
      {
        name:'直接访问',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[320, 332, 301, 334, 390, 330, 320]
      },
      {
        name:'搜索引擎',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };
};

// 故障图表-发电机后驱温度
export const diffTemperatureOptions = () => {
  var base = +new Date(1968, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var date = [];

  for (var i = 1; i < 100; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  }
  /**
   * series判断显示不一样的颜色，每条数据判断和一个参数对比
   * 然后返回每条数据itemStyle : {
          normal : {
            color:'yellow',
          }
        },
   * */
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed"
        }
      },
      boundaryGap: [0, '100%']
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      start: 0,
      end: 10,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    series: [
      {
        name:'邮件营销',
        type:'line',
        symbol: "none",
        stack: '总量',
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'联盟广告',
        type:'line',
        symbol: "none",
        stack: '总量',
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'视频广告',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[150, 232, 201, 154, 190, 330, 410]
      },
      {
        name:'直接访问',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[320, 332, 301, 334, 390, 330, 320]
      },
      {
        name:'搜索引擎',
        symbol: "none",
        type:'line',
        stack: '总量',
        data:[820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };
};

// 故障图表-发电机后驱温度
export const singleTemperatureOptions = () => {
  var base = +new Date(1968, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var date = [];

  for (var i = 1; i < 100; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  }
  /**
   * series判断显示不一样的颜色，每条数据判断和一个参数对比
   * 然后返回每条数据itemStyle : {
          normal : {
            color:'yellow',
          }
        },
   * */
  return {
    title: {
      text: "82M101M39M2",
      left: "46%",
      textStyle: {
        color: "#666666",
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      splitLine: {
        show: false,
      },
      boundaryGap: [0, '100%']
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      start: 0,
      end: 10,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    series: [
      {
        name:'邮件营销',
        type:'line',
        symbol: "none",
        stack: '总量',
        itemStyle : {
          normal : {
            color:'cyan',
          }
        },
        data:[120, 132, 101, 134, 90, 230, 210]
      },
    ]
  };
};
