

import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import moment from 'moment';

class StationManageDetail extends Component {
  static propTypes = {
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    changeStationManageStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onShowSideChange = ({showSidePage}) => {
    this.props.onShowSideChange({ showSidePage:'edit' });
    this.props.changeStationManageStore({ showPage: 'edit' });
  }

  preDepartment = () => {
    console.log('上一个详情');
  }

  nextDepartment = () => {
    console.log('下一个详情');
  }
  
  backToList = () => {
    this.props.changeStationManageStore({ showPage: 'list' });
  }

  render(){
    const { stationDetail } = this.props;
    return (
      <div className={styles.stationManageDetail}>
        <div className={styles.detailTop}>
          <span>电站详情</span>
          {stationDetail.stationStatus?<span>接入时间: 2018-08-08</span>:<span>电站未接入</span>}
          <Button className={styles.editButton} onClick={()=>this.onShowSideChange({showSidePage:'eidt'})}>编辑</Button>
          <span className={styles.handleArea} >
            <Icon type="arrow-up" className={styles.previous} title="上一个" onClick={this.preDepartment} />
            <Icon type="arrow-down" className={styles.next} title="下一个" onClick={this.nextDepartment} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.departmentBox} >
          <div className={styles.departmentInfo} >
            
          </div>
        </div>
      </div>
    )
  }
}

export default StationManageDetail ;
