import moment from "moment"

const themeColor = "#dfdfdf";

// 故障图表-发电机前驱温度
export const PreTemperatureOptions = (data, name) => {
  // 处理设备名称
  function itemFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.deviceName);
    });
    return newArr;
  }
  // 处理线条的value
  function valueFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.value);
    });
    return newArr;
  }
  // 处理data
  function dataFunc (arr) {
    let newArr = [];
    arr.map(cur => {
      let obj = {}; // 保存对象
      obj.name = cur.deviceName;
      obj.type = "line";
      obj.symbol = "none";
      obj.itemStyle = {
        normal : {
          color: cur.deviceName === name ? '#91d2d3' : themeColor,
        }
      };
      obj.stack = cur.deviceFullcode;
      obj.data = valueFunc(cur.dataList);
      newArr.push(obj);
    });
    return newArr;
  }
  //处理时间
  function dateFunc(arr) {
    let newArr = [];
    arr[0].dataList && arr[0].dataList.map(cur => {
      newArr.push(moment(cur.timeStamp).format("YYYY-MM-DD HH:mm:ss"))
    });
    return newArr;
  }
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    legend: {
      top: "250px",
      width: '80%',
      itemWidth: 14,
      itemHeight: 6,
      x: 'center',
      y: 'bottom',
      // textStyle: {
      //   color: "red",
      //   fontSize: 12,
      // },
      data: itemFunc(data)
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
      data: dateFunc(data),
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
    series: dataFunc(data)
  };
};

// 故障图表-发电机后驱温度
export const AfterTemperatureOptions = (data, name) => {
  // 处理设备名称
  function itemFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.deviceName);
    });
    return newArr;
  }
  // 处理线条的value
  function valueFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.value);
    });
    return newArr;
  }
  // 处理data
  function dataFunc (arr) {
    let newArr = [];
    arr.map(cur => {
      let obj = {}; // 保存对象
      obj.name = cur.deviceName;
      obj.type = "line";
      obj.symbol = "none";
      obj.itemStyle = {
        normal : {
          color: cur.deviceName === name ? '#199475' : themeColor,
        }
      };
      obj.stack = cur.deviceFullcode;
      obj.data = valueFunc(cur.dataList);
      newArr.push(obj);
    });
    return newArr;
  }
  //处理时间
  function dateFunc(arr) {
    let newArr = [];
    arr[0].dataList && arr[0].dataList.map(cur => {
      newArr.push(moment(cur.timeStamp).format("YYYY-MM-DD HH:mm:ss"))
    });
    return newArr;
  }
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    legend: {
      top: "250px",
      width: '80%',
      itemWidth: 14,
      itemHeight: 6,
      x: 'center',
      y: 'bottom',
      // textStyle: {
      //   color: "red",
      //   fontSize: 12,
      // },
      data: itemFunc(data)
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
      data: dateFunc(data),
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
    series: dataFunc(data)
  };
};

// 故障图表-温度差
export const diffTemperatureOptions = (data, name) => {
  // 处理设备名称
  function itemFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.deviceName);
    });
    return newArr;
  }
  // 处理线条的value
  function valueFunc(arr) {
    let newArr = [];
    arr.map(cur => {
      newArr.push(cur.value);
    });
    return newArr;
  }
  // 处理data
  function dataFunc (arr) {
    let newArr = [];
    arr.map(cur => {
      let obj = {}; // 保存对象
      obj.name = cur.deviceName;
      obj.type = "line";
      obj.symbol = "none";
      obj.itemStyle = {
        normal : {
          color: cur.deviceName === name ? '#dc9c64' : themeColor,
        }
      };
      obj.stack = cur.deviceFullcode;
      obj.data = valueFunc(cur.dataList);
      newArr.push(obj);
    });
    return newArr;
  }
  //处理时间
  function dateFunc(arr) {
    let newArr = [];
    arr[0].dataList && arr[0].dataList.map(cur => {
      newArr.push(moment(cur.timeStamp).format("YYYY-MM-DD HH:mm:ss"))
    });
    return newArr;
  }
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    legend: {
      top: "250px",
      width: '80%',
      itemWidth: 14,
      itemHeight: 6,
      x: 'center',
      y: 'bottom',
      // textStyle: {
      //   color: "red",
      //   fontSize: 12,
      // },
      data: itemFunc(data)
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
      data: dateFunc(data),
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
    series: dataFunc(data)
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
export const allFansOptions = (data, name) => {
  const { cfResidual, cfStd } = data;
  // 处理xAxis
  function xAxisFunc(arr) {
    let newArr = []; //保存value
    arr.map(cur => {
      newArr.push(cur.mean);
    });
    return newArr;
  }

  // 处理yAxis
  function yAxisFunc(arr) {
    let newArr = []; //保存value
    arr.map(cur => {
      newArr.push(cur.std);
    });
    return newArr;
  }
  return {
    title: {
      text: name,
      left: "46%",
      textStyle: {
        color: "#666666",
        fontSize: 12
      }
    },
    color: ["#3E97D1"],
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
        // data : xAxisFunc(cfStd),
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
        barWidth: '30',
        data: cfResidual
      },
      {
        name:'直接访问',
        type:'line',
        itemStyle : {
          normal : {
            color: '#a42b2c',
          }
        },
        lineStyle: {
          type: "dashed"
        },
        symbol: 'none',  //取消折点圆圈
        data: xAxisFunc(cfStd)
      }
    ]
  };
};
