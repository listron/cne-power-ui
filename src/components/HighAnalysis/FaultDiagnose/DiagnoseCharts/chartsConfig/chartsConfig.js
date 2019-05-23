import moment from "moment"
import { showNoData, hiddenNoData } from "../../../../../constants/echartsNoData.js";

const themeColor = "#dfdfdf";

// 故障图表-发电机前驱温度
export const PreTemperatureOptions = (data, name, paramsStart, paramsEnd, beforeTimeData) => {
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
      newArr.push(Number(cur.value).toFixed(2));
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
      obj.z = cur.deviceName === name ? 1 : 0; // 控制显示前后顺序
      obj.stack = cur.deviceFullcode;
      obj.data = valueFunc(cur.dataList);
      newArr.push(obj);
    });
    return newArr;
  }

  // 处理显示没有数据还是有数据
  function showNoDataFunc() {
    let styles; // 变量
    const arr = dataFunc(data);
    if (!arr || arr.length === 0) {
      styles = showNoData;
    }
    if (arr.length !== 0) {
      for(let i = 0; i < arr.length; i++ ) {
        if (arr[i].data.length !== 0){
          styles = hiddenNoData;
          return false
        }else {
          styles = showNoData;
        }
      }
    }
    return styles;
  }
  return {
    graphic: showNoDataFunc(),
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
      data: beforeTimeData,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '℃',
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
      // startValue: moment(time).subtract('days',7).format('YYYY-MM-DD HH:mm:ss'),
      // endValue: `2019-05-01 00:00:00`,
      start: paramsStart,
      end: paramsEnd,
      moveOnMouseMove: false,
      realtime: false, // 控制拖动连续触发
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
export const AfterTemperatureOptions = (data, name, paramsStart, paramsEnd, afterTimeData) => {
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
      newArr.push(Number(cur.value).toFixed(2));
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
      obj.z = cur.deviceName === name ? 1 : 0; // 控制显示前后顺序
      obj.stack = cur.deviceFullcode;
      obj.data = valueFunc(cur.dataList);
      newArr.push(obj);
    });
    return newArr;
  }

  // 处理显示没有数据还是有数据
  function showNoDataFunc() {
    let styles; // 变量
    const arr = dataFunc(data);
    if (!arr || arr.length === 0) {
      styles = showNoData;
    }
    if (arr.length !== 0) {
      for(let i = 0; i < arr.length; i++ ) {
        if (arr[i].data.length !== 0){
          styles = hiddenNoData;
          return false
        }else {
          styles = showNoData;
        }
      }
    }
    return styles;
  }
  return {
    graphic: showNoDataFunc(),
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
      data: afterTimeData,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '℃',
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
      // startValue: moment(time).subtract('days',7).format('YYYY-MM-DD HH:mm:ss'),
      // endValue: `2019-05-01 00:00:00`,
      start: paramsStart,
      end: paramsEnd,
      moveOnMouseMove: false,
      realtime: false, // 控制拖动连续触发
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
export const diffTemperatureOptions = (data, name, paramsStart, paramsEnd, diffTimeData) => {
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
      newArr.push(Number(cur.value).toFixed(2));
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
      obj.z = cur.deviceName === name ? 1 : 0; // 控制显示前后顺序
      obj.stack = cur.deviceFullcode;
      obj.data = valueFunc(cur.dataList);
      newArr.push(obj);
    });
    return newArr;
  }

  // 处理显示没有数据还是有数据
  function showNoDataFunc() {
    let styles; // 变量
    const arr = dataFunc(data);
    if (!arr || arr.length === 0) {
      styles = showNoData;
    }
    if (arr.length !== 0) {
      for(let i = 0; i < arr.length; i++ ) {
        if (arr[i].data.length !== 0){
          styles = hiddenNoData;
          return false
        }else {
          styles = showNoData;
        }
      }
    }
    return styles;
  }
  return {
    graphic: showNoDataFunc(),
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
      data: diffTimeData,
      splitLine: {
        show: true,
      }
    },
    yAxis: {
      type: 'value',
      name: '℃',
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
      // startValue: moment(time).subtract('days',7).format('YYYY-MM-DD HH:mm:ss'),
      // endValue: `2019-05-01 00:00:00`,
      start: paramsStart,
      end: paramsEnd,
      moveOnMouseMove: false,
      realtime: false, // 控制拖动连续触发
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
      newArr.push(Number(cur.value).toFixed(2));
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
    graphic: !data || data.length === 0 ? showNoData : hiddenNoData,
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
      newArr.push([cur.deviceName1, cur.deviceName2, Number(cur.value).toFixed(2)]);
    });
    return newArr;
  }
  return {
    graphic: !data || data.length === 0 ? showNoData : hiddenNoData,
    tooltip: {
      position: 'top',
      // formatter: (params) => {
      //   console.log(params, "formatter");
      // }
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
      right: "5%",
      precision: 1 //设置小数精度，默认0没有小数
    },
    series: [{
      type: 'heatmap',
      data: dataFunc(data),
      tooltip:{
        formatter: (params) => {
          return `<div>
            <span>${params.value[0]}:${params.value[1]}</span><br />${params.marker}<span>${params.value[2]}</span>
          </div>`;
        }
      },
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
  const { cfResidual: { residual }, cfStd1, cfStd2, cfStd3 } = data;
  //将科学计数法转换为小数
  function toNonExponential(num) {
    if (!num) {
      return num;
    }
    const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  }
  function arrFunc(list) {
    const newArr = [];
    for(let i = 0; i < list.length; i++) {
      newArr.push(toNonExponential(list[i].stdY));
    }
    return newArr;
  }
  // 处理x轴坐标
  function cfResidualXFunc() {
    return residual && residual.map(cur => {
      return Number(cur.residualX).toFixed(2);
    });
  }
  // 处理y轴坐标
  function cfResidualYFunc() {
    return residual && residual.map(cur => {
      return toNonExponential(cur.residualY);
    });
  }
  // 处理曲线
  function  lineFunc() {
    let newArr = [];
    // 因为最多三条
    if (cfStd1 && cfStd1.length > 0) {
      let obj = {};
      obj.name = "line";
      obj.type = "line";
      obj.itemStyle = {
        normal : {
          color: "#a42b2c",
        }
      };
      obj.smooth = true;
      obj.symbol = "none";
      obj.lineStyle = {
        type: "dashed"
      };
      obj.data = arrFunc(cfStd1);
      newArr.push(obj);
    }
    if (cfStd2 && cfStd2.length > 0) {
      let obj = {};
      obj.name = "line";
      obj.type = "line";
      obj.itemStyle = {
        normal : {
          color: "#F8E71C",
        }
      };
      obj.smooth = true;
      obj.symbol = "none";
      obj.lineStyle = {
        type: "dashed"
      };
      obj.data = arrFunc(cfStd2);
      newArr.push(obj);
    }
    if (cfStd3 && cfStd3.length > 0) {
      let obj = {};
      obj.name = "line";
      obj.type = "line";
      obj.itemStyle = {
        normal : {
          color: "#E08031",
        }
      };
      obj.smooth = true;
      obj.symbol = "none";
      obj.lineStyle = {
        type: "dashed"
      };
      obj.data = arrFunc(cfStd3);
      newArr.push(obj);
    }
    return newArr;
  }
  return {
    graphic: (residual.length === 0 && cfStd1.length === 0 && cfStd2.length === 0 && cfStd3.length === 0) ? showNoData : hiddenNoData,
    title: {
      text: name,
      left: "46%",
      textStyle: {
        color: "#666666",
        fontSize: 12
      }
    },
    color: ["#3E97D1"],
    grid: {
      bottom: '3%',
      borderColor: themeColor,
      borderWidth: 1,
      show: true,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: cfResidualXFunc(),
      axisLine: {
        lineStyle: {
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick: {
        lineStyle: {color: themeColor}    // 刻度的颜色
      },
      axisLabel:{
        formatter: function (value) {
          return '{values|' + value + '}';
        },
        rich:{
          values:{
            display: 'block',
            // transform:'100%',
            marginLeft: "100%"
          }
        },
        interval:0,
        // align:'right',
      }
    },
    yAxis: {
      type: 'value',
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
    },
    series: [{
      data: cfResidualYFunc(),
      type: 'bar',
      barWidth: "100%",
      // barWidth:10,
    }, ...lineFunc()]
  };
};
