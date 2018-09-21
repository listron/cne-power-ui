

import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import WarningTip from '../../../../Common/WarningTip';
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
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }

  cancelEdit = () => {
    this.setState({
      showWarningTip: true,
    })
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.changeStationManageStore({showPage: 'detail'});  
    this.props.onShowSideChange({showSidePage:'detail'});  
  }

  render(){
    const { stationDetail, saveStationDetail, loading } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.stationManageEdit} >
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <span className={styles.topInfoShow}>
            <span className={styles.title}>电站详情</span>
            {stationDetail.stationStatus?<span>接入时间: 2018-08-08</span>:<span>电站未接入</span>}
          </span>
          <span className={styles.handleArea} >
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.cancelEdit} />
          </span>
        </div>
        <EditForm stationDetail={stationDetail} saveStationDetail={saveStationDetail} cancelEdit={this.cancelEdit} loading={loading} confirmWarningTip={this.confirmWarningTip} {...this.props} />
      </div>
    )
  }
}

export default StationManageEdit;
