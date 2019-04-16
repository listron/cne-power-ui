
const themeColor = "#dfdfdf";

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
      top: "250px",
      width: '100%',
      itemWidth: 14,
      itemHeight: 6,
      x: 'center',
      y: 'bottom',
      // textStyle: {
      //   color: "red",
      //   fontSize: 12,
      // },
      data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    grid: {
      height: '140px',
    },
    xAxis: {
      type: 'category',
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
      boundaryGap: false,
      data: date,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
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
      end: 100,
    }, {
      start: 0,
      end: 10,
      top: "220px",
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
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
      boundaryGap: false,
      data: date,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
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

// 故障图表-温度差
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
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
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

// 故障图表-单机自适应模块的检测结果
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
    grid: {
      borderColor: themeColor,
      borderWidth: 1,
      show: true
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
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
      data: date,
    },
    yAxis: {
      type: 'value',
      name: '（。）',
      axisLine:{
        lineStyle:{
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
      splitLine: {
        show: false,
        color: themeColor
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

// 故障图表-相似性热图
export const heatTemperatureOptions = () => {
  var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a','10a','11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'];
  var days = ['Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

  var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];

  data = data.map(function (item) {
    return [item[1], item[0], item[2] || '-'];
  });
  return {
    tooltip: {
      position: 'top'
    },
    animation: false,
    grid: {
      height: '80%',
      y: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'vertical',
      top: "5%",
      right: "5%"
    },
    series: [{
      name: 'Punch Card',
      type: 'heatmap',
      data: data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
};

// 故障图表-严重程度及识别（所有风机）
export const allFansOptions = () => {
  return {
    color: ['#3398DB'],
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      borderColor: themeColor,
      borderWidth: 1,
      show: true,
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        axisLine:{
          lineStyle:{
            width: 0, //这里是为了突出显示加上的
          }
        },
        data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true,
          lineStyle:{ color: themeColor}    // 刻度的颜色
        }
      }
    ],
    yAxis : [
      {
        type : 'value',
        axisLine:{
          lineStyle:{
            width: 0, //这里是为了突出显示加上的
          }
        },
          splitLine: {
          show: false,
          color: themeColor
        },
        axisTick: {
          lineStyle:{ color: themeColor}    // 刻度的颜色
        }
      }
    ],
    series : [
      {
        name:'直接访问',
        type:'bar',
        barWidth: '60%',
        data:[10, 52, 200, 334, 390, 330, 220]
      },
      {
        name:'直接访问',
        type:'line',
        barWidth: '60%',
        itemStyle : {
          normal : {
            color:'yellow',
          }
        },
        lineStyle: {
          type: "dashed"
        },
        data:[5, 14, 20, 104, 230, 110, 20]
      }
    ]
  };
};
