import moment from "moment"

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
export const singleTemperatureOptions = (data ,name) => {
  // 处理时间
  function dateFunc(arr) {
    let date = []; //
    arr.map(cur => {
      date.push(moment(cur.predictionDate).format("YYYY-MM-DD HH:mm"));
    });
    return date;
  }
  // 处理数据
  function dataFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.value);
    });
    return newArr;
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
      text: name,
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
      data: dateFunc(data),
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
        name: name,
        type:'line',
        symbol: "none",
        stack: '总量',
        itemStyle : {
          normal : {
            color: "#3E97D1",
          }
        },
        data: dataFunc(data)
      },
    ]
  };
};

// 故障图表-相似性热图
export const heatTemperatureOptions = (data, name) => {
  // 处理data
  function dataFunc(arr) {
    let newArr = []; //保存value
    arr.map(cur => {
      newArr.push([cur.deviceName1, cur.deviceName2, cur.value]);
    });
    console.log(newArr, "[[[[[");
    return newArr;
  }
  return {
    tooltip: {
      position: 'top'
    },
    title: {
      text: name,
      left: "46%",
      textStyle: {
        color: "#666666",
        fontSize: 12
      }
    },
    animation: false,
    grid: {
      height: '80%',
      y: '10%'
    },
    xAxis: {
      type: 'category',
      splitArea: {
        show: true
      },
      axisLabel:{
        rotate: 90
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
    },
    yAxis: {
      type: 'category',
      splitArea: {
        show: true
      },
      axisTick:{
        lineStyle:{ color: themeColor}    // 刻度的颜色
      },
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'vertical',
      top: "5%",
      right: "5%"
    },
    series: [{
      name: 'Punch Card',
      type: 'heatmap',
      data: dataFunc(data),
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
