import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectBasicInfo.scss';
class InspectBasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object,
  }

  static defaultProps = {

  }

  constructor(props){
    super(props);
    this.state={

    }
  }

  renderBasic(){
    const info = this.props.basicInfo;
    return (
      <div className={styles.basicContent}>
        <div className={styles.basicItem}>
          <div>电站名称</div>
          <span>{info.get('stationName')}</span>
          <span>{info.get('stationType') === '0' ? <i className="iconfont icon-windlogo" /> :
           <i className="iconfont icon-pvs" />}</span>
        </div>
        <div className={styles.basicItem}><div>巡检名称</div><span>{info.get('inspectName')}</span></div>
        <div className={styles.basicItem}><div>巡检时间</div><span>{info.get('createTime')}至{info.get('deadLine')}</span></div>
        <div className={styles.basicItem}><div>设备类型</div><span>{info.get('deviceTypeNames')}</span></div>
      </div>
    )
  }

  render(){ 
    const info = this.props.basicInfo;
    return (
      <div className={styles.basicInfo} >
        <div className={styles.title}>
          <div className={styles.text}>
            基本信息
            <i className="iconfont icon-content" />
          </div>
          <div className={styles.warning}>
            {info.get('isOvertime') === '0'? <div className={styles.overTime}>超时</div> : null}
          </div>
        </div>
        {this.renderBasic()}  
      </div>
    )
  }

}

export default InspectBasicInfo;