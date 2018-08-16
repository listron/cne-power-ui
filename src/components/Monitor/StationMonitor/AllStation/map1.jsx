
import React, { Component } from 'react';
// import { baseURL, apiPath } from '../../constants/apiURL';
import axios from 'axios';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';
import { Progress } from 'antd';
import styles from './WindStation/windstation.scss';

class Interval extends Component {
    static propTypes = {
        allMonitorStation:PropTypes.object,
        testId:PropTypes.string,
        stationDataList:PropTypes.array,
      }
    constructor(props) {
        super(props)
        this.state = {
            barData: []
        }
    }
    componentWillMount() {
        // axios.get(`${baseURL}${apiPath.home.homePath}`).then((data)=>{
        // /axios.get(`/mock/base/start/bar`).then((data) => {
        //     this.setState({
        //         barData: data.data.barData
        //     })
        // }).catch(error => {
        //     console.log(error);
        // })
    }
    componentDidMount() {
        // console.log('bmap did mount')
        // console.log('------')
        const { testId } = this.props
        const testChart = echarts.init(document.getElementById(testId));
        // console.log('------')

        // console.log(testChart)

        this.setMapChart(testChart);  

    }
    componentWillUnmount(){
        // console.log('bmap is unmount')
    }
    setMapChart = (testChart) => {   
        const coordinate = [
            [121.15, 31.89],
            [109.781327, 39.608266],
            [120.38, 37.35],         
        ];

        const option = {
            bmap: {
                center: [116.46, 39.92],
                zoom: 5,
                roam: true,
                mapStyle: {
                    styleJson: [{
                        'featureType': 'water',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'land',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#f3f3f3'
                        }
                    }, {
                        'featureType': 'railway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'highway',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#fdfdfd'
                        }
                    }, {
                        'featureType': 'highway',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'geometry',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'geometry.fill',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'poi',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'green',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'subway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'manmade',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'local',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'boundary',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'building',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'label',
                        'elementType': 'labels.text.fill',
                        'stylers': {
                            'color': '#999999'
                        }
                    }]
                }
            },
              tooltip: {
        trigger: 'item',
        formatter: `<div className={styles.stationCard}>
        <div className={styles.stationCardTitle}>圣经山</div>
        <div className={styles.stationCardProgress}>
          <Progress percent={50} showInfo={false} />
        </div>
        <div className={styles.stationCardValue}>
          <div className={styles.stationMark}>7.42MW</div>
          <div>48MW</div>
        </div>
        <div className={styles.stationCardWindSpeed}>4.69m/s</div>
        <div className={styles.stationCardEquipmentNum}>
          <div>24台</div>
          <div className={styles.stationWarning}>⚠10</div>
        </div>
      </div>`
    },
    legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        background:'#fff',
        data: ['正常','未接入','未联网','告警','断开'],
        textStyle: {
            color: '#fff',
        }
    },
            // 类型是：scatter散点
            series: [{
                 type: 'scatter',
                //  symbol:'image://https://cn.bing.com/images/search?view=detailV2&ccid=TO%2fnCIZ9&id=BCEB571CBDF3229BEC4FA45003EE0E8EE373744D&thid=OIP.TO_nCIZ9T4ahUzCoiklVrgHaGW&mediaurl=http%3a%2f%2fwww.met-online.com%2fzh%2frotor_computation.gif&exph=103&expw=120&q=%E9%A3%8E%E5%8A%9B+gif&simid=607998592277220286&selectedIndex=11&ajaxhist=0',
                 name:'电站状态',
                // symbol:'image//../../../../../theme/img/wind-normal.png',
                coordinateSystem: 'bmap',
                data: coordinate,
                symbolSize: 12,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        borderColor: '#199475',
                        borderWidth: 5
                    }
                }
            }]
        };
        testChart.setOption(option)
    }
   
    render() {
        const { barData } = this.state;
        const { testId,stationDataList } = this.props;
        // console.log(testId)
        return (
            <div>
                <div id={testId} style={{ width: "1210px", height: "620px" }} ></div>
            </div>
        )
    }
}

export default Interval

   // console.log(testChart)
         
//多个覆盖信息框
        // var sContent =
        // "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" + 
        // "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" + 
        // "</div>";
        // var map = new BMap.Map("bmapTest");
        // // coordinate里都是标点的坐标
        // const coordinateData = [
        //     [121.15, 31.89],
        //     [109.781327, 39.608266],
        //     [120.38, 37.35],
            
        // ];
       
        // coordinateData.forEach((item,index)=>{
        //     var point= new BMap.Point(item[0], item[1]);
        //     var marker = new BMap.Marker(point);
        //     var infoWindow = new BMap.InfoWindow(sContent); 
        //     map.centerAndZoom(new BMap.Marker(116.46, 39.92), 5);
        //     map.addOverlay(marker);
        //     marker.addEventListener("click", function(){          
        //         this.openInfoWindow(infoWindow)
        //     })
            
        // })
       

        // coordinate.forEach((item,index)=>{
        //     var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));
        // })
          // mapStyle里的styleJson是指对一些特定地形设置样式

  // var sContent =
        // "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" + 
        // "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" + 
        // "</div>";
        // coordinate里都是标点的坐标
      
       //多个覆盖信息框

//    const map = new BMap.Map("bmapTest");
// 	map.centerAndZoom(new BMap.Point(116.417854,39.921988), 6);
//     map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
//     map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
// 	var data_info = [
//                     //   [116.417854,39.921988,"地址：北京市东城区王府井大街88号乐天银泰百货八层"],
// 					//   [116.406605,39.921585,"地址：北京市东城区东华门大街"],
//                     //   [116.412222,39.912345,"地址：北京市东城区正义路甲5号"]
//                     [121.15, 31.89,''],
//                     [109.781327, 39.608266],
//                     [120.38, 37.35],
// 					];
// 	var opts = {
// 				width : 250,     // 信息窗口宽度
// 				height: 80,     // 信息窗口高度
// 				// title : "信息窗口" , // 信息窗口标题
// 				enableMessage:true//设置允许信息窗发送短息
// 			   };
// 	for(var i=0;i<data_info.length;i++){
//         var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
//         var sContent =
//         "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" + 
//         "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" + 
//         "</div>";
// 		var content = sContent;
// 		map.addOverlay(marker);               // 将标注添加到地图中
// 		addClickHandler(content,marker);
// 	}
// 	function addClickHandler(content,marker){
// 		marker.addEventListener("click",function(e){
// 			openInfo(content,e)}
// 		);
// 	}
// 	function openInfo(content,e){
// 		var p = e.target;
// 		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
// 		var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
// 		map.openInfoWindow(infoWindow,point); //开启信息窗口
// 	}