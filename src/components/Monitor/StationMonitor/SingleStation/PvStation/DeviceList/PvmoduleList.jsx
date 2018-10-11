

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import classnames from 'classnames';
import {Row, Col} from 'antd';

class PvmoduleList extends Component {
  static propTypes = {
    pvmoduleList: PropTypes.array,
    match: PropTypes.object,
    getPvmoduleList: PropTypes.func,
  }

  constructor(props){
    super(props);
  }
  componentDidMount(){
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps){
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if( nextStation !== stationCode ){
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
  }

  getData = (stationCode) => {
    this.props.getPvmoduleList({stationCode});
    this.timeOutId = setTimeout(()=>{
      this.getData(stationCode);
    }, 10000);
  }
  compareName = (a,b) => {
    if(a['deviceName'] && b['deviceName']){
      return a['deviceName'].localeCompare(b['deviceName']);
    }
  }
  render(){
    const { pvmoduleList } = this.props;
    const pvmoduleListSet = new Set(pvmoduleList);
    const tmpPvmoduleList = [...pvmoduleListSet];
    let tmpNBList = new Array();
    for(let i=0;i<16;i++){
      tmpNBList.push(i);
    }
    return (
      <div className={styles.pvmodule}>
        <div className={styles.pvmoduleList} >
          {(tmpPvmoduleList&&tmpPvmoduleList.length>0) ? tmpPvmoduleList.sort(this.compareName).map((item,index)=>{
            
            return (
              <div key={index} className={styles.pvmoduleItem} >
                <div className={styles.deviceName} ><i className="iconfont icon-nb" ></i>{item.deviceName}</div>
                {item.electricityList && tmpNBList.map((e,i)=>{
                  let num;
                  let obj = item.electricityList[i];
                  if(obj){
                    for(let key in obj){
                      if(key.indexOf('pointValue') === 0){
                        num = obj[key];
                      }
                    }
                    return (<span className={classnames({
                      normalValue: !!num,
                      // stopValue: obj.pointStatus === 200,
                      // breakValue: obj.pointStatus === 300,
                      // noValue: obj.pointStatus === 900,
                      commonStyle: true,
                    })} key={i} >{num || ''}</span>);
                  }else{
                    return (<span className={classnames({
                      commonStyle: true,
                    })}  key={i} >{num || ''}</span>)
                  }
                })}
              </div>
            );
          }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>}
        </div>
      </div>
    )
  }
}

export default PvmoduleList;
