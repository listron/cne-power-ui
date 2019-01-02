import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapResourceData from './MapResourceData';
import echarts from 'echarts';
import styles from './homepageParts.scss';
import axios from 'axios';
import { dataFormat } from '../../utils/utilFunc';
import { message } from 'antd';
import { windSvgPath, pvSvgPath } from '../../constants/svg/svgFont';

class CenterMap extends Component{
  static propTypes = {
    mapStation: PropTypes.array,
    singleStation: PropTypes.object,
    realTimeInfo: PropTypes.object,
    getMapStation: PropTypes.func,
    getSingleStation: PropTypes.func,
    changeHomepageStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      countriesInfo: [],
      showStationInfo: false,
      starArr: [],
      mapCountInfo: {}, // 选中国家风电统计{name: '中国', wind: 21, pv: 11}
    }
  }

  componentWillReceiveProps(nextProps){
    const { mapStation } = nextProps;
    const preStations = this.props.mapStation;
    if(mapStation.length > 0 && preStations.length === 0){ // 第一次得到电站数据
      this.setStars(); // 开始渲染星图。
      let countriesInfo = []; // 国家信息
      mapStation.forEach(station=>{ // 存储为[{国家，位置}...]结构，一个国家只保存一个坐标即可
        const tmpName = station.country?station.country:'';
        let hasCountry = countriesInfo.some(country => country && country.countryName === tmpName);
        if(!hasCountry){
          countriesInfo.push({
            countryName: tmpName,
            position: [station.longitude, station.latitude]
          })
        }
      });
      axios.get('/mapJson/world.json').then(response => {
        echarts.registerMap('world', response.data);
        const activeInfo = countriesInfo.find(e=>e.countryName === 'China') || countriesInfo[0] || {}; // 默认中国，或者第一个国家
        this.setWorldMap(countriesInfo, activeInfo);
      }).catch(error=>{
        console.log(error); 
        // message.error('加载世界地图失败，请重试');
      });
      this.setState({ countriesInfo });
      this.setCountryMap(mapStation, 'China');
    }
  }

  componentWillUnmount(){
    this.clocker && clearTimeout(this.clocker);
  }

  onCountryChange = (param) => { // 切换国家
    const { countriesInfo } = this.state;
    const { mapStation } = this.props;
    if(param.seriesName === 'active'){ // 已选中国家点击无效
      return
    }else if(param.seriesName === 'inactive'){
      const activePosition = param.value;
      const activeInfo = countriesInfo.find(e=>{
        return e.position[0] === activePosition[0] && e.position[1] === activePosition[1];
      })
      activeInfo && this.setWorldMap(countriesInfo, activeInfo); // 切换世界激活项
      activeInfo && this.setCountryMap(mapStation, activeInfo.countryName); // 切换国家
    }
  }

  setWorldMap = (countriesInfo, activeInfo) => { // 国家数组 + 当前激活的国家
    const worldBox = document.getElementById('homeWorldMap');
    const worldChart = echarts.init(worldBox);
    worldChart.on('click',this.onCountryChange);
    const activeName = activeInfo.countryName || '';
    const activeData = activeInfo.position || [];
    const inactiveData = countriesInfo.filter(e=>e.countryName !== activeName).map(e=>e.position);
    worldChart.setOption({
      color: ['#48cf49', '#a6e8ff'],
      series:[{
        // name: 'active',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [activeData],
        symbolSize: 15,
        animation: false,
      },{
        // name: 'inactive',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: inactiveData,
        symbolSize: 12,
        animation: false,
      }],
      geo: {
        silent:true,
        map: 'world',
        roam: false,
        zoom: 1.2,
        itemStyle: {
          normal: {
            areaColor: '#1866a8',
            borderColor: '#076399',
            opacity: 0.5
          },
        }
      }
    });
  }

  setCountryMap = (mapStation, mapName) => { // 国家内各电站位置设定。
    const countryStation = mapStation.filter(e=>e.country && e.country === mapName);
    const pvStationData = countryStation.filter(e=>e.stationType === 1).map(e => {
      if (e.longitude > -178 && e.longitude < -154 && e.latitude > 18 && e.latitude < 28) { // 更变夏威夷光伏电站坐标
        e.longitude += 20;
        e.latitude += 20;
      }
      return [e.longitude, e.latitude];
    });
    const windStationData = countryStation.filter(e=>e.stationType === 0).map(e=>[e.longitude, e.latitude]);
    this.setState({
      mapCountInfo: {
        name: countryStation[0] && countryStation[0].countryChineseName,
        wind: windStationData.length,
        pv: pvStationData.length,},
    });
    axios.get(`/mapJson/${mapName}.json`).then(response=>{
      const countryBox = document.getElementById('homeCountryMap');
      const countryChart = echarts.init(countryBox);
      countryChart.clear();
      const { data } = response;
      echarts.registerMap(mapName, data, {
        Alaska: {
          left: -140,
          top: 48,
          width: 20,
        }, 
        Hawaii: {
          left: -135,
          top: 33,
          width: 10
        },
      });
      countryChart.setOption({
        series:[{
          name: 'wind',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: windStationData, 
          symbol: `path://${windSvgPath}`,
          symbolRotate: 180,
          symbolSize: [15,18],
          itemStyle: {
            color: '#fff',
          },
          emphasis: {
            itemStyle: {
              color: '#fff35f',
              opacity: 1,
            }
          }
        },{
          name: 'pv',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: pvStationData,
          symbol: `path://${pvSvgPath}`,
          symbolRotate: 180,
          symbolSize: [25,16],
          itemStyle: {
            color: '#fff',
          },
          emphasis: {
            itemStyle: {
              color: '#fff35f',
              opacity: 1,
            }
          }
        }],
        geo: {
          silent:true,
          map: mapName,
          roam: false,
          layoutCenter: ['50%', '55%'],
          layoutSize: 830,
          itemStyle: {
            normal: {
              areaColor: '#1866a8',
              borderColor: '#076399',
              opacity: 0.5
            },
          }
        }
      });
      countryChart.on('mouseover',(param)=>{
        const checkedPosition = param.value;
        const checkedStation = mapStation.find(e=>e.longitude === checkedPosition[0] && e.latitude === checkedPosition[1]);
        this.setState({ showStationInfo: true });
        this.props.getSingleStation(checkedStation);
      });
      countryChart.on('mouseout',()=>{
        this.props.changeHomepageStore({ singleStation: {} });
        this.setState({ showStationInfo: false });
      });
    }).catch(error=>{
      console.log(error); 
      message.error('加载国家地图失败，请重试');
    })
  }

  setStars = () => {
    let tmpArr = [];
    tmpArr.length = 10;
    tmpArr.fill(0);
    let starArr = tmpArr.map(e=>[Math.random() * 980, Math.random()*360])
    this.setState({ starArr });
    this.clocker = setTimeout(this.setStars,5*60*1000);
  }

  render(){
    const { mapStation, singleStation, realTimeInfo } = this.props;
    const { showStationInfo, starArr, mapCountInfo } = this.state;
    const windStations = mapStation.filter(e=>e.stationType === 0);
    const pvStations = mapStation.filter(e=>e.stationType === 1);
    const windResource = windStations.length > 0 ? [
      {
        src: '/img/ico_wind.png', value: dataFormat(realTimeInfo.windReourse), unit: 'm/s', name: '风资源'
      }, {
        src: null, value: dataFormat(realTimeInfo.windStationPower), unit: 'MW', name: '风电功率'
      }
    ] : [];
    const pvResource = pvStations.length > 0?[
      {
        src: '/img/ico_pv.png', value: dataFormat(realTimeInfo.pvResource), unit: 'W/㎡', name: '光资源'
      }, {
        src: null, value: dataFormat(realTimeInfo.pvStationPower), unit: 'MW', name: '光伏功率'
      }
    ]:[];
    const resourceArr = [...windResource, ...pvResource];
    const singleInfo = [
      {name: '实时功率', value: dataFormat(singleStation.stationPower), unit: 'MW'},
      {name: '装机容量', value: dataFormat(singleStation.stationCapacity), unit: 'MW'},
      {name: '日累计发电量', value: dataFormat(singleStation.dayPower), unit: '万kWh'},
      {name: '月累计发电量', value: dataFormat(singleStation.monthPower), unit: '万kWh'},
      {name: '年累计发电量', value: dataFormat(singleStation.yearPower), unit: '万kWh'},
    ]
    const singleStatus = singleStation.stationStatus || {};
    let mapCountryName = mapCountInfo.name || '--';
    if(mapCountryName === '中国'){
      mapCountryName = '国内';
    }
    const homeContentDom = document.querySelector('#homepageContent');
    const countrySize = {
      width: homeContentDom ? homeContentDom.offsetWidth : 0,
      height: homeContentDom ? homeContentDom.offsetHeight: 0,
    }
    return (
      <div className={styles.centerMap}>
        <div className={styles.topData}>
          {resourceArr.map(e=><MapResourceData key={e.name} detail={e} />)}
        </div>
        {showStationInfo && <section className={styles.singleStation}>
          <h3 className={styles.title}>
            <span className={styles.titleLeft} >
              <img src={`/img/ico_${singleStation.stationType === 1?'pv':'wind'}.png`} />
              <span className={styles.name}>{singleStation.stationName || '--'}</span>
              <span className={styles.arrow}></span>
            </span>
            <span className={styles.status}>{singleStatus.statusName || '--'}</span>
          </h3>
          <div className={styles.content}>
            {singleInfo.map((e, i)=>(
              <div className={styles.info} key={e.name}>
                <span className={styles.value}>{e.value}</span>
                <span className={styles.text}>{e.name}{i>1?'':` ${e.unit}`}</span>
                {i > 1 && <span className={styles.text}>{e.unit}</span>}
              </div>
            ))}
          </div>
        </section>}
        <div className={styles.countryMap} id="homeCountryMap" style={{ ...countrySize }}></div>
        <div className={styles.bottomData}>
          <div className={styles.worldMap} id="homeWorldMap"></div>
          <div className={styles.static}>
            <span>{mapCountryName}</span>
            {mapCountInfo.pv > 0 && <span className={styles.count} >{mapCountInfo.pv}个</span>}
            {mapCountInfo.pv > 0 && <img src="/img/ico_pv.png" />}
            {mapCountInfo.wind > 0 && <span className={styles.count}>{mapCountInfo.wind}个</span>}
            {mapCountInfo.wind > 0 && <img src="/img/ico_wind.png" />}
          </div>
        </div>
        <div className={styles.starBox}>
          {starArr.map(e=>(<div key={e[0]} 
            className={styles.star}
            style={{
              left: e[0],
              top: e[1]
            }}
          ></div>))}
        </div>
      </div>
    )
  }
}

export default CenterMap;
