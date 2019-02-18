
export function getOption(chartsData){
  let title = '各设备测点历史数据趋势图';
  if(!chartsData.xAxis || !chartsData.yList || chartsData.xAxis.length === 0 || chartsData.yList.length === 0 ){
      return;
  }
  let grids = gridSort(chartsData);
  let gridArr = gridCreat(grids);
  let legendArr = legendCreat(chartsData);
  let xAxisArr = xAxisCreat(grids,chartsData);
  let names = [];
  let seriesArr = [];
  grids.forEach((ele,index)=>{
      let nameSet = new Set();
      chartsData.yList.forEach(m=>{
          let chartsSeries = {};
          if(m.unit == ele){
              chartsSeries.name = m.name;
              chartsSeries.data = m.yAxis;
              chartsSeries.xAxisIndex = index;
              chartsSeries.yAxisIndex = index;
              chartsSeries.type = 'line';
              chartsSeries.smooth = true;
              if(m.name.indexOf('-')>=0){
                  m.unit?nameSet.add(m.name.split('-')[1] + '\n(' + m.unit + ')' ):nameSet.add(m.name.split('-')[1])
              }else{
                  m.unit?nameSet.add(m.name + '\n(' + m.unit + ')'):nameSet.add(m.name)
              }
              seriesArr.push(chartsSeries)
          }
      })
      let innerNameArr = Array.from(nameSet);
      let innerNameText = '';
      if(innerNameArr.length > 0){
          innerNameText = innerNameArr.join('\n');
      }
      names.push(innerNameText);
  })
  let yAxisArr = yAxisCreat(grids,names);
  let dataZoomArr = grids.map((ele,i)=>{
      return i
  })
  var option = {
      title: {
          text: title,
          top: 5,
          left: '40%',
          textStyle:{
              color: '#fff',
              fontSize: 20,
          },
      },
      tooltip : {
          trigger: 'axis',
      },
      axisPointer: {
          link: {xAxisIndex: 'all'},
          type: 'line',
          label: {
              backgroundColor: '#6a7985'
          }
      },
      legend: {
          textStyle:{
              fontSize: '14px',
              color: '#fff'
          },
          top: 35,
          data:legendArr
      },
      grid: gridArr,
      xAxis : xAxisArr,
      yAxis:yAxisArr,
      dataZoom:[{
              type: 'slider',
              width: '80%',
              left: "10%",
              start: 0,
              end: 100,
              filterMode: 'empty',
              xAxisIndex: dataZoomArr,
          },{
              type: 'inside',
              orient:'horizontal',
              filterMode: 'empty',
              xAxisIndex: dataZoomArr,
              width: '100%',
      }],
      series : seriesArr
  };
  return option;
}


function gridSort(data){  //根据数据单位生成分区数组，返回单位集合数组
  if(data.length === 0){ return };
  let gridSet = new Set();
  data.yList.forEach(e=>{
      gridSet.add(e.unit); 
  })
  return Array.from(gridSet)
}

function gridCreat(gridArr){//根据区数定义各分区高度及左右定位，返回grid数组
  let grids = gridArr.map((e,i)=>{
      return {
          top:(10 + i*80/gridArr.length) + '%',
          height: 80/gridArr.length+'%',
          left: 80,
          right: 20,
      }
  })
  return grids;
}

function xAxisCreat(gridArr,data){ //根据单位集合数组及传入数据，生成x轴组
  let xAxisArr = gridArr.map((e,i)=>{
      let showLine = false
      if(i === gridArr.length - 1){
          showLine = true;
      }
      return {
          type : 'category',
          gridIndex: i,
          axisLine: {
              show: false,
              lineStyle: {
                  color: '#fff'
              },
          },
          axisTick: { 
              show: false 
          },
          axisLabel: { 
              show: showLine ,
              lineStyle: { color: '#fff' }
          },
          splitLine: { 
              show: false, 
              lineStyle: { color: '#fff' } 
          },
          data: data.xAxis,
      }
  })
  return xAxisArr
}
function yAxisCreat(gridArr,names){    //根据单位集合数组，及传入的数据，拆分出传入数据的name，生成y轴，y轴name
  let yAxisArr = gridArr.map((e,i)=>{    
      return {
          type : 'value',
          gridIndex: i,
          axisLine: {
              show: true,
              lineStyle: {
                  color: '#fff'
              },
          },
          axisTick: { 
              show: false 
          },
          splitLine:{
              show: false,
          },
          name: names[i],
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: {
              color: '#fff'
          }
      }
  })
  return yAxisArr
}
function legendCreat(data){
  let legendArr = data.yList.map(ele=>{
      return ele.name
  })
  return legendArr
}



