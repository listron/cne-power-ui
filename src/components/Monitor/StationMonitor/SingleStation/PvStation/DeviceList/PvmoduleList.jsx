

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';

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
    return (
      <div className={styles.pvmodule}>
        <div className={styles.pvmoduleList} >
          {tmpPvmoduleList && tmpPvmoduleList.map((item,index)=>{
            return (
            <div key={item.deviceCode} className={styles.pvmoduleItem} key={item.index} >
              <div><i className="iconfont icon-nb" ></i>{item.deviceCode}</div>
              {item.electricityList && item.electricityList.map((e,i)=>{
                return (<span className={styles.sightValue} key={i}>{e.NB039}</span>);
              })}
            </div>);
          })}
        </div>
      </div>
    )
  }
}

export default PvmoduleList;
