import moment from "moment"
import ecStat from "echarts-stat";
import echarts from "echarts";

const themeColor = "#dfdfdf";

// 故障图表-发电机前驱温度
export const PreTemperatureOptions = (data, name, paramsStart, paramsEnd) => {
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
      obj.z = cur.deviceName === name ? 1 : 0; // 控制显示前后顺序
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
export const AfterTemperatureOptions = (data, name, paramsStart, paramsEnd) => {
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
      obj.z = cur.deviceName === name ? 1 : 0; // 控制显示前后顺序
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
export const diffTemperatureOptions = (data, name, paramsStart, paramsEnd) => {
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
      obj.z = cur.deviceName === name ? 1 : 0; // 控制显示前后顺序
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
  if (!cfResidual || cfResidual.length === 0) {
    return {}; //返回空对象
  }
  // 使用统计扩展处理过后的数据
  const bins = ecStat.histogram(cfResidual);
  let interval = null;
  let min = Infinity;
  let max = -Infinity;
  const dataList = echarts.util.map(bins.data, function (item, index) {
    var x0 = bins.bins[index].x0;
    var x1 = bins.bins[index].x1;
    interval = x1 - x0;
    min = Math.min(min, x0);
    max = Math.max(max, x1);
    return [x0, x1, item[1]];
  });
  function renderItem(params, api) {
    var yValue = api.value(2);
    var start = api.coord([api.value(0), yValue]);
    var size = api.size([api.value(1) - api.value(0), yValue]);
    var style = api.style();

    return {
      type: 'rect',
      shape: {
        x: start[0] + 1,
        y: start[1],
        width: size[0] - 2,
        height: size[1]
      },
      style: style
    };
  }
  // 对数组就行排序取出最大值和最小值
  function sortFunc() {
    cfResidual.sort(function (a, b) {
      return Number(a) - Number(b);
    });
    return [cfResidual[0], cfResidual[cfResidual.length - 1]]
  }
  // 根据最大值和最小值计算出组距(最大值-最小值)/风机个数
  const distanceMax = Number(sortFunc()[1]); //最大值
  const distanceMin = Number(sortFunc()[0]); //最小值
  const distancePoor = distanceMax - distanceMin; // 计算最大值最小值的差
  const distanceNum = (distancePoor/cfResidual.length); //组距
  // 计算根据组距，计算最大值和最小值之间的x轴坐标点
  function distanceXFunc() {
    //可以相加的次数，取整数
    const num = Math.floor(distancePoor/distanceNum);
    let distanceX = []; //保存每次相加的值
    for (let i = 0; i < num; i++) {
      // 每次相加i次组距
      distanceX.push(distanceMin + (distanceNum*i));
    }
    return distanceX;
  }
  /** 根据计算出来的x轴坐标点计算出y轴
   *正态曲线公式https://baike.baidu.com/item/%E6%AD%A3%E6%80%81%E5%88%86%E5%B8%83%E6%9B%B2%E7%BA%BF/12726695
   * √(2π)≈2.507
   * cfStd params { std:标准差, mean:均值 }
   * */
  function distanceYFunc() {
    //x轴坐标
    const xData = distanceXFunc();
    let newArr = []; // 保存每次循环的数组
    cfStd.forEach(item => {
      let arr = []; // 保存每次循环出来的计算结果
      //公式左边的值
      const leftValue = 1/(Math.sqrt(2 * Math.PI) * item.std);
      xData.forEach(cur => {
        // 分子
        const molecular = Math.pow((cur - item.mean), 2);
        // 分母
        const denominator = 2 * Math.pow(item.mean,2);
        // 分子/分母
        const division = -(molecular/denominator);
        // 最后的计算结果
        const result = leftValue * Math.exp(division);
        // 保存计算结果
        arr.push(result);
      });
      newArr.push(arr); // 保存每次数组
    });
    return newArr;
  }
  // 处理data参数，可能有多条线
  function dataFunc() {
    const xShaft = distanceXFunc();
    const yShaft = distanceYFunc();
    let arr = []; //保存数据 xShaft是固定的
    // 格式化数组，x轴和y轴 [[x,y],[x,y]]的格式
    function arrFunc(num) {
      let allArr = []; // 保存总数据
      for(let i = 0; i < yShaft.length; i++) {
        let newArr = []; //保存数据
        for(let j = 0; j < yShaft[i].length; j++) {
          newArr.push([xShaft[j], yShaft[i][j]])
        }
        allArr.push(newArr);
      }
      // 返回当前下标的data
      return allArr[num];
    }
    /**
     * cfStd array[] 里面有多少条就代表多少条正态曲线
     * */
    for (let i = 0; i < cfStd.length; i++) {
      let obj = {};
      obj.name = `line${i}`;
      obj.type = "line";
      obj.itemStyle = {
        normal : {
          color: "#a42b2c",
        }
      };
      obj.yAxisIndex = i; // 在多个 y轴的时候有用
      obj.smooth = true;
      obj.symbol = "none";
      obj.lineStyle = {
        type: "dashed"
      };
      obj.data = arrFunc(i);
      arr.push(obj);
    }
    return arr;
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
    // tooltip : {
    //   trigger: 'axis',
    //   axisPointer : {            // 坐标轴指示器，坐标轴触发有效
    //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //   }
    // },
    grid: {
      bottom: '3%',
      borderColor: themeColor,
      borderWidth: 1,
      show: true,
      containLabel: true
    },
    xAxis: {
      min: min,
      max: max,
      interval: interval,
      boundaryGap: false, // 坐标轴两边留白策略
      axisLine: {
        lineStyle: {
          width: 0, //这里是为了突出显示加上的
        }
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {color: themeColor}    // 刻度的颜色
      }
    },
    yAxis: [{
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
    },{
      type: 'value',
      show: false,
      data: distanceXFunc()
    }],
    series : [{
      name: 'height',
      type: 'custom',
      renderItem: renderItem,
      label: {
        normal: {
          show: true,
          position: 'insideTop'
        }
      },
      encode: {
        x: [0, 1],
        y: 2,
        tooltip: 2,
        label: 2
      },
      data: dataList
    }, ...dataFunc()]
  };
};
