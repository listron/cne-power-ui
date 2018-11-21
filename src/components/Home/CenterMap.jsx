import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapResourceData from './MapResourceData';
import echarts from 'echarts';
import styles from './homepageParts.scss';
import axios from 'axios';
import { message } from 'antd';

class CenterMap extends Component{
  static propTypes = {
    mapStation: PropTypes.array,
    singleStation: PropTypes.object,
    getMapStation: PropTypes.func,
    getSingleStation: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      worldChart: null,
      countriesInfo: [],
    }
  }

  componentDidMount(){ // 直接加载世界地图和中国地图
    axios.get('/mapJson/world.json').then(response => {
      const worldBox = document.getElementById('homeWorldMap');
      echarts.registerMap('world', response.data);
      const worldChart = echarts.init(worldBox);
      worldChart.on('click',this.onCountryChange)
      this.setState({
        worldChart,
      })
    }).catch(error=>{
      console.log(error); 
      message.error('加载世界地图失败，请重试');
    });
  }

  componentWillReceiveProps(nextProps){
    const { mapStation } = nextProps;
    const preStations = this.props.mapStation;
    const countryBox = document.getElementById('homeCountryMap');
    if(mapStation.length > 0 && preStations.length === 0){ // 第一次得到电站数据
      let countriesInfo = [];
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
      this.setState({ countriesInfo });
      const activeInfo = countriesInfo.find(e=>e.countryName === 'China') || countriesInfo[0] || {}; // 默认中国，或者第一个国家
      this.setWorldMap(countriesInfo, activeInfo);
      this.setCountryMap(countryBox, 'China');
    }
  }

  onCountryChange = (param) => { // 切换国家
    const { countriesInfo } = this.state;
    if(param.seriesName === 'active'){ // 已选中国家点击无效
      return
    }else if(param.seriesName === 'inactive'){
      const activePosition = param.value;
      const activeInfo = countriesInfo.find(e=>{
        return e.position[0] === activePosition[0] && e.position[1] === activePosition[1];
      })
      activeInfo && this.setWorldMap(countriesInfo, activeInfo); // 切换世界激活项
      activeInfo && this.setWorldMap(countriesInfo, activeInfo); // 切换国家
    }
  }

  setWorldMap = (countriesInfo, activeInfo) => { // 国家数组 + 当前激活的国家
    const { worldChart } = this.state;
    const activeName = activeInfo.countryName || '';
    const activeData = activeInfo.position || [];
    const inactiveData = countriesInfo.filter(e=>e.countryName !== activeName).map(e=>e.position);
    worldChart.setOption({
      series:[{
        name: 'active',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: [activeData],
        animation: false,
      },{
        name: 'inactive',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: inactiveData,
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

  setCountryMap = (countryBox, mapName) => {
    const countryChart = echarts.init(countryBox);
    const { mapStation } = this.props;
    const countryStation = mapStation.filter(e=>e.country && e.country === mapName);
    axios.get(`/mapJson/${mapName}.json`).then(response=>{
      const { data } = response;
      echarts.registerMap(mapName, data);
      countryChart.setOption({
        series:[{
          name: 'country',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [[12,22],[21,168],[112,9]],
        }],
        geo: {
          silent:true,
          map: mapName,
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
    }).catch(error=>{
      console.log(error); 
      message.error('加载国家地图失败，请重试');
    })
  }


  render(){
    const { mapStation } = this.props;
    const windStations = mapStation.filter(e=>e.stationType === 0);
    const pvStations = mapStation.filter(e=>e.stationType === 1);
    const windResource = windStations.length > 0?[
      { src: '/img/ico_wind.png', value: 5.84, unit: 'm/s', name: '风资源' },
      {src: null, value: 4000, unit: 'MW', name: '风电功率'}
    ]:[];
    const pvResource = pvStations.length > 0?[
      {src: '/img/ico_pv.png', value: 433, unit: 'W/㎡', name: '光资源'},
      {src: null, value: 2000, unit: 'MW', name: '光伏功率'},
    ]:[];
    const resourceArr = [...windResource, ...pvResource];
    return (
      <div className={styles.centerMap}>
        <div className={styles.topData}>
          {resourceArr.map(e=><MapResourceData key={e.name} detail={e} />)}
        </div>
        <div className={styles.countryMap} id="homeCountryMap"></div>
        <div className={styles.static}>
          <span>{"国内"}</span>
          {pvStations.length > 0 && <span className={styles.count}>{pvStations.length}个</span>}
          {pvStations.length > 0 && <img src="/img/ico_pv.png" />}
          {windStations.length > 0 && <span className={styles.count}>{windStations.length}个</span>}
          {windStations.length > 0 && <img src="/img/ico_wind.png" />}
        </div>
        <div className={styles.worldMap} id="homeWorldMap"></div>
      </div>
    )
  }
}

export default CenterMap;
