import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import styles from './stationSelectModal.scss';
const ButtonGroup = Button.Group;

class StationSelectModal extends Component {
  static propTypes = {
    stations: PropTypes.object,
    onCancel: PropTypes.func,
    onChangeStation: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCode: '',
      stationData: props.stations.filter(station=>station.get('stationType')===0)
    };
  }

  onChangeStationType(data) {
    this.setState({
      stationCode: '',
      sttaionData: data
    });
  }

  onChangeStation = (stationCode) => {
    this.setState({
      stationCode
    });
  }

  renderProvinceStation(stations) {
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toList();
    return provinceStation.map((province, index) => {
      return (
        <div className={styles.provinceItem} key={province.getIn([0, 'provinceCode'])}>
          <span>{province.getIn([0, 'provinceName'])}</span>
          {province.map(station => {
            return (
              <div className={styles.stationItem} 
                key={station.get('statinCode')} 
                onClick={()=>this.onChangeStation(station.get('statinCode'))}>
                {station.get('stationName')}
              </div>
            );
          })}
        </div>
      );

    });
  }

  renderStation() {
    const stations = this.props.stations;
    const pvStations = stations.filter(station=>station.get('stationType')===1);
    const windStations = stations.filter(station=>station.get('stationType')===0);
    return (
      <div className={styles.content}>
        <ButtonGroup>
          <Button type="primary" onClick={()=>this.onChangeStationType(windStations)}>风电</Button>
          <Button type="primary" onClick={()=>this.onChangeStationType(pvStations)}>光伏</Button>
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
        className={styles.stationSelect}
        title={title}
        visible={true}
        mask={false}
        okText="确认"
        cancelText="重置"
        onOk={this.onOk}
        onCancel={this.props.onCancel}
      >
        {this.renderStation()}
      </Modal>
    );
  }
}

export default StationSelectModal;