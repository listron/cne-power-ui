import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapResourceData from './MapResourceData';
import echarts from 'echarts';
import styles from './homepageParts.scss';
import axios from 'axios';
import { message } from 'antd';

class CenterMap extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    const worldBox = document.getElementById('homeWorldMap');
    const countryBox = document.getElementById('homeCountryMap');
    worldBox && this.setWorldMap(worldBox);
    countryBox && this.setCountryMap(countryBox, 'china');
  }

  setWorldMap = (worldBox) => {
    const worldChart = echarts.init(worldBox);
    axios.get('/mapJson/world.json').then(response=>{
      const { data } = response;
      echarts.registerMap('world', data);
      console.log(response);
      worldChart.setOption({
        series:[{
          name: 'countries',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [[12,22],[21,168],[112,9]],
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
      worldChart.on('click',(params,a,b,c)=>{console.log(params,a,b,c)})
    }).catch(error=>{
      console.log(error); 
      message.error('加载世界地图失败，请重试');
    })
    // const worldChart = echarts.init(worldBox);
  }

  setCountryMap = (countryBox, mapName) => {
    const countryChart = echarts.init(countryBox);
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
    const resourceArr = [
      {src: '/img/ico_wind.png', value: 5.84, unit: 'm/s', name: '风资源'},
      {src: null, value: 4000, unit: 'MW', name: '风电功率'},
      {src: '/img/ico_pv.png', value: 433, unit: 'W/㎡', name: '光资源'},
      {src: null, value: 2000, unit: 'MW', name: '光伏功率'},
    ]
    return (
      <div className={styles.centerMap}>
        <div className={styles.topData}>
          {resourceArr.map(e=><MapResourceData key={e.name} detail={e} />)}
        </div>
        <div className={styles.countryMap} id="homeCountryMap"></div>
        <div className={styles.static}>
          <span>{"国内"}</span>
          <span>{"45个"}</span>
          <span>{"45个"}</span>
          <span>{"光伏图标"}</span>
          <span>{"12个"}</span>
          <span>{"风机图"}</span>
        </div>
        <div className={styles.worldMap} id="homeWorldMap"></div>
      </div>
    )
  }
}

export default CenterMap;
