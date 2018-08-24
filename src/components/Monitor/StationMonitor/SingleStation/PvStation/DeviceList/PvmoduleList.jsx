

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
    return (
      <div className={styles.pvmodule}>
        {/* <div className={styles.pvmoduleTop} >
          <Switch defaultChecked onChange={this.onChange} />告警
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">全部</Radio.Button>
            <Radio.Button value="b">正常</Radio.Button>
            <Radio.Button value="c">类别</Radio.Button>
            <Radio.Button value="d">Chengdu</Radio.Button>
          </Radio.Group>
        </div> */}
        <div className={styles.pvmoduleList} >
          {pvmoduleList && pvmoduleList.map(item=>{
            return (<div key={item.deviceCode} className={styles.pvmoduleItem} >
              <div><i className="iconfont icon-nb" ></i>{item.deviceCode}</div>
              {item.electricityList && item.electricityList.map(e=>{
                return (<span className={styles.sightValue} >{e.NB039}</span>);
              })}
            </div>);
          })}
        </div>
      </div>
    )
  }
}

export default PvmoduleList;
