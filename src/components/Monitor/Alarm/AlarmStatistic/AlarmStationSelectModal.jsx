import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import styles from './alarmStationSelectModal.scss';
const ButtonGroup = Button.Group;

class AlarmStationSelectModal extends Component {
  static propTypes = {
    stations: PropTypes.object,
    onClose: PropTypes.func,
    onChangeStation: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCode: '',
      stationType: 0,
      stationData: props.stations.filter(station=>station.get('stationType')===0)
    };
  }

  onChangeStationType(stationType) {
    const data = this.props.stations.filter(station=>station.get('stationType')===stationType);
    this.setState({
      stationType,
      stationCode: '',
      stationData: data
    });
  }

  onChangeStation = (stationCode) => {
    this.setState({
      stationCode
    });
  }

  onOk = () => {
    this.props.onChangeStation(this.state.stationCode);
    this.props.onClose();
  }

  onCancel = () => {
    this.setState({
      stationCode: ''
    });
  }

  renderProvinceStation(stations) {
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toList();
    return provinceStation.map((province, index) => {
      return (
        <div className={styles.provinceItem} key={index}>
          <div className={styles.provinceName}>{province.getIn([0, 'provinceName'])}</div>
          {province.map((station, i) => {
            return (             
              <div className={station.get('stationCode')===this.state.stationCode?styles.selectedStationItem:styles.stationItem} 
                key={i} 
                onClick={()=>this.onChangeStation(station.get('stationCode'))}>
                {station.get('stationName')}
              </div>
            );
          })}
        </div>
      );
    });
  }

  renderStation() {
    const stationType = this.state.stationType;
    return (
      <div className={styles.content}>
        <ButtonGroup>
          <Button type={stationType===0?'primary':''} onClick={()=>this.onChangeStationType(0)}>风电</Button>
          <Button type={stationType===1?'primary':''} onClick={()=>this.onChangeStationType(1)}>光伏</Button>
        </ButtonGroup>
        {this.renderProvinceStation(this.state.stationData)}
      </div>
    );
  }

  render() {
    const title = (
      <span className={styles.title}>
        <i className="iconfont icon-powerstation"></i>
        请选择一个电站
      </span>
    );
    return (
      <Modal
        wrapClassName={styles.stationSelectModal}
        style={{top:82,right:24,height:'90%',float:'right',paddingBottom:0}}
        width={600}
        title={title}
        visible={true}
        mask={false}
        okText="确认"
        cancelText="重置"
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        {this.renderStation()}
      </Modal>
    );
  }
}

export default AlarmStationSelectModal;