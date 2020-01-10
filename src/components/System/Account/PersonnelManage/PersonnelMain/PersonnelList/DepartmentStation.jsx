

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import StationModal from '@components/Common/StationSelect/StationModal';
import styles from './list.scss';

class DepartmentStation extends Component {
  static propTypes = {
    showDepartmentStationModal: PropTypes.bool,
    selectedDepartment: PropTypes.object,
    stations: PropTypes.array,
    departmentStations: PropTypes.array,
    changeStore: PropTypes.func,
    editDepartmentStations: PropTypes.func,
  }

  showStationModal = () => {
    this.props.changeStore({showDepartmentStationModal: true});
  }

  handleOK = (values) => { // 给指定部门分配电站
    const { selectedDepartment } = this.props;
    const { departmentId, departmentName } = selectedDepartment;
    this.props.changeStore({ showDepartmentStationModal: false });
    this.props.editDepartmentStations({
      departmentId,
      departmentName,
      stationCodes: values.map(e => e.stationCode),
    });
  }

  hideStationModal = () => { // 隐藏分配电站弹框
    this.props.changeStore({showDepartmentStationModal: false});
  }

  render(){
    const { departmentStations, stations, showDepartmentStationModal } = this.props;
    const rights = localStorage.getItem('rightHandler');
    const updateRight = rights && rights.split(',').includes('account_department_update');
    return (
      <div className={styles.departmentStation}>
        <span className="iconfont icon-elecmanage" />
        <span className={styles.stationTips}>负责电站({departmentStations.length}/{stations.length})&nbsp;:&nbsp;</span>
        <span className={styles.stationNames}>
          {departmentStations.map(e => e.stationName).join('、')}
        </span>
        {updateRight && <Button className={styles.editButton} onClick={this.showStationModal}>编辑</Button>}
        <StationModal
          theme="light"
          multiple={true}
          oneStyleOnly={false}
          checkedStations={departmentStations}
          data={stations}
          stationRef={null}
          handleOK={this.handleOK}
          stationModalShow={showDepartmentStationModal}
          hideStationModal={this.hideStationModal}
        />
      </div>
    );
  }
}

export default DepartmentStation;
