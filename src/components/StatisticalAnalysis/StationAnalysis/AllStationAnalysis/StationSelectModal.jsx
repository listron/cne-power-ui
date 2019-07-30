import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import styles from './stationSelectModal.scss';
const ButtonGroup = Button.Group;

class StationSelectModal extends Component {
  static propTypes = {
    stations: PropTypes.object,
    onClose: PropTypes.func,
    onChangeStation: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCode: '',
      stationType: 1,
      stationData: props.stations.filter(station => station.get('stationType') === 1),
    };
  }

  onChangeStationType(stationType) {
    const data = this.props.stations.filter(station => station.get('stationType') === stationType);
    this.setState({
      stationType,
      stationCode: '',
      stationData: data,
    });
  }

  onChangeStation = (stationCode) => {
    this.setState({
      stationCode,
    });
  }

  onOk = () => {
    if (this.state.stationCode !== '') {
      this.props.onChangeStation(this.state.stationCode);
      this.props.onClose();
    }
  }

  onCancel = () => {
    this.setState({
      stationCode: '',
    });
  }

  stationIsOneType() {
    const { stations } = this.props;
    const length = stations.map(e => e.get('stationType')).toSet().size;
    return length === 1;//需求：只有一种类型,不显示tab;两种类型(风电/光伏)才显示tab
  }

  renderProvinceStation(stations) {
    const provinceStation = stations.groupBy(item => item.get('provinceCode')).toList();
    return provinceStation.map((province, index) => {
      return (
        <div className={styles.provinceItem} key={index}>
          <div className={styles.provinceName}>{province.getIn([0, 'provinceName'])}</div>
          <div className={styles.stationList}>
            {province.map((station, i) => {
              return (
                <div className={station.get('stationCode') === this.state.stationCode ? styles.selectedStationItem : styles.stationItem}
                  key={i}
                  onClick={() => this.onChangeStation(station.get('stationCode'))}>
                  {station.get('stationName')}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }

  renderStation() {
    const stationType = this.state.stationType;
    const { stations } = this.props;
    const stationTypeSet = new Set(stations.toJS().map(e => e.stationType));
    const stationTypes = [...stationTypeSet];
    const showButtonGroup = stationTypes.includes(0) && stationTypes.includes(1);
    return (
      <div className={styles.content}>
        {showButtonGroup && <ButtonGroup>
          <Button type={stationType === 0 ? 'primary' : ''} onClick={() => this.onChangeStationType(0)}>风电</Button>
          <Button type={stationType === 1 ? 'primary' : ''} onClick={() => this.onChangeStationType(1)}>光伏</Button>
        </ButtonGroup>}
        {this.renderProvinceStation(showButtonGroup ? this.state.stationData : stations)}
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
    const { theme } = this.props;
    return (
      <React.Fragment>
        <span ref={'singleModal'} />
        <Modal
          wrapClassName={`${styles.stationSelectModal} ${styles[theme]}`}
          style={{ top: 82, right: 24, height: '90%', float: 'right', paddingBottom: 0 }}
          width={620}
          title={title}
          visible={true}
          mask={false}
          getContainer={() => this.refs.singleModal}
          onCancel={this.props.onClose}
          footer={<div className={styles.btn}>
            <Button onClick={this.onCancel}>重置</Button>
            <Button type="primary" onClick={this.onOk}>确认</Button>
          </div>}
        >
          {this.renderStation()}
        </Modal>
      </React.Fragment>

    );
  }
}

export default StationSelectModal;
