

import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import Footer from '../../../../Common/Footer';
import EditForm from './EditForm';

class StationManageEdit extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationDetail: PropTypes.object,
    onShowSideChange: PropTypes.func,
    saveStationDetail: PropTypes.func,
    changeStationManageStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  backToDetail = () => {
    this.props.onShowSideChange({showSidePage:'detail'});
    this.props.changeStationManageStore({showPage: 'detail'});
  }

  render(){
    const { stationDetail, saveStationDetail, loading } = this.props;
    return (
      <div className={styles.stationManageEdit} >
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <span className={styles.title}>电站详情</span>
            {stationDetail.stationStatus?<span>接入时间: 2018-08-08</span>:<span>电站未接入</span>}
          </span>
          <span className={styles.handleArea} >
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToDetail} />
          </span>
        </div>
        <EditForm stationDetail={stationDetail} saveStationDetail={saveStationDetail} backToDetail={this.backToDetail} loading={loading} />
      </div>
    )
  }
}

export default StationManageEdit;
