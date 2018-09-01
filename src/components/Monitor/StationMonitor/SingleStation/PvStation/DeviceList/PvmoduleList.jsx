

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import classnames from 'classnames';

class PvmoduleList extends Component {
  static propTypes = {
    pvmoduleList: PropTypes.array,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { pvmoduleList } = this.props;
    const pvmoduleListSet = new Set(pvmoduleList);
    const tmpPvmoduleList = [...pvmoduleListSet];
    console.log(tmpPvmoduleList);
    let tmpNBList = new Array();
    for(let i=0;i<16;i++){
      tmpNBList.push(i);
    }
    return (
      <div className={styles.pvmodule}>
        <div className={styles.pvmoduleList} >
          {tmpPvmoduleList && tmpPvmoduleList.map((item,index)=>{
            return (<div key={index} className={styles.pvmoduleItem} >
              <div><i className="iconfont icon-nb" ></i>{item.deviceCode}</div>
              {item.electricityList && tmpNBList.map((e,i)=>{
                let num;
                let obj = item.electricityList[i];
                if(obj){
                  for(let key in obj){
                    num = key.indexOf('NB') === 0 && obj[key];
                  }
                  return (<span className={classnames({
                    normalValue: obj.pointStatus === 100,
                    stopValue: obj.pointStatus === 200,
                    breakValue: obj.pointStatus === 300,
                    noValue: obj.pointStatus === 900,
                    commonStyle: true,
                  })} key={i} >{num}</span>)
                }else{
                  return (<span className={classnames({
                    commonStyle: true,
                  })}  key={i} >{num}</span>)
                }
                // return (<span className={classnames({
                //   normalValue: e.pointStatus === 100,
                //   stopValue: e.pointStatus === 200,
                //   breakValue: e.pointStatus === 300,
                //   noValue: e.pointStatus === 900,
                //   commonStyle: true,
                // })} >{num}</span>);
              })}
            </div>);
          })}
        </div>
      </div>
    )
  }
}

export default PvmoduleList;
