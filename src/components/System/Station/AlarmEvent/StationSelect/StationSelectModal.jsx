import React, { Component } from 'react';
import { Icon, Modal, Radio, Checkbox, Switch } from 'antd';
import ProvinceItem from './ProvinceItem';
import WarningTip from '../../../../Common/WarningTip';
import styles from './style.scss';
import PropTypes from 'prop-types';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StationSelectModal extends Component { // todo, 模块的公用化还不够， 后续考虑./StationModal直接脱离为一个公用模块, 该组件作为高阶组件再引用继续生成即可
  static propTypes = {
    stationModalShow: PropTypes.bool,
    oneStyleOnly: PropTypes.bool,
    checkedStations: PropTypes.array,
    data: PropTypes.array,
    disabledStation: PropTypes.array,
    multiple: PropTypes.bool,
    hideStationModal: PropTypes.func,
    showStationModal: PropTypes.func,
    handleOK: PropTypes.func,
    filterStations: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      filterStationType: 2, //选中电站类型
      stationType: [2, 0, 1], //2所有,0风电，1光伏
      selectedStation: props.checkedStations, //暂存选中的电站数组
      showWarningTip: false,
      warningTipText: '',
      filterDeviceType: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const tmpCheckedStations = this.props.checkedStations;
    const { checkedStations } = nextProps;
    const tmpCodes = tmpCheckedStations.map(e => e.stationCode);
    const newCodes = checkedStations.map(e => e.stationCode);
    const isCodesSame = (tmpCodes.length === newCodes.length) && newCodes.every(e => tmpCodes.includes(e));
    if (!isCodesSame) { // 电站数据不同。
      this.setState({
        selectedStation: checkedStations,
      });
    }
  }

  onSelectStationType = (e) => {
    this.setState({
      filterStationType: e.target.value,
    });
  }

  onClearSelected = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认取消所有已选电站么',
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.setState({
      selectedStation: [],
    });
  }
  onDeleteOneStation = (stationInfor) => {
    const { selectedStation } = this.state;
    const tmpSelectedStation = selectedStation.filter(e => e.stationCode !== stationInfor.stationCode);
    this.setState({
      selectedStation: tmpSelectedStation,
    });
  }

  handleOK = () => {
    this.props.handleOK(this.state.selectedStation);
  }

  checkStation = (selectedStation) => {
    this.setState({
      selectedStation,
    });
  }


  _filterStation = () => {
    const { multiple, disabledStation, oneStyleOnly, filterStations } = this.props;
    let { data } = this.props;
    const { filterStationType, selectedStation, filterDeviceType } = this.state;
    if (filterDeviceType) {
      data = data.filter(e => filterStations.includes(e.stationCode));
    }
    let tmpStations = data;
    if (filterStationType !== 2) { // 有类型
      tmpStations = data.filter(e => (e.stationType === filterStationType));
    }
    const filteredStation = [];
    tmpStations && tmpStations.length > 0 && tmpStations.forEach(e => {
      let findExactStation = false;
      filteredStation.forEach(m => {
        if (m.provinceCode === e.provinceCode) {
          findExactStation = true;
          m.stations.push(e);
        }
      });
      if (!findExactStation) {
        filteredStation.push({
          provinceCode: e.provinceCode,
          provinceName: e.provinceName,
          stations: [e],
        });
      }
    });
    return filteredStation.map(e => (
      <ProvinceItem
        key={e.provinceCode}
        filterStationType={filterStationType}
        oneStyleOnly={oneStyleOnly}
        disabledStation={disabledStation}
        multiple={multiple}
        checkStation={this.checkStation}
        provinceInfo={{ ...e }}
        selectedStation={selectedStation}
      />
    ));
  }
  _selectedStation = () => {
    const { selectedStation } = this.state;
    return (
      <div className={styles.selectedStationList}>
        <div className={styles.selectedStationTitle}>
          <span>已选电站{selectedStation.length}个</span>
          {selectedStation.length > 0 && <span className={styles.clearAll} onClick={this.onClearSelected}>清空</span>}
        </div>
        <div className={styles.innerStationList}>
          {selectedStation.map(e => {
            return <div key={e.stationCode} title={e.stationName} className={styles.eachSelectedStation} > <span>{e.stationName}</span> <Icon type="close" className={styles.deleteIcon} onClick={() => this.onDeleteOneStation(e)} /> </div>;
          })}
        </div>
      </div>
    );
  }
  changeAllStation = (e) => {
    const { disabledStation, filterStations } = this.props;
    let { data } = this.props;
    const { filterDeviceType } = this.state;
    if (filterDeviceType) {
      data = data.filter(e => filterStations.includes(e.stationCode));
    }
    const tmpStations = data.filter(e => (!disabledStation.includes(e.stationCode)));
    const { checked } = e.target;
    if (checked) {
      this.setState({
        selectedStation: tmpStations,
      });
    } else {
      this.setState({
        selectedStation: [],
      });
    }
  }

  filterDeviceType = (value) => { //筛选设备
    this.setState({ filterDeviceType: value });
  }


  render() {
    const { stationModalShow, hideStationModal, showStationModal, multiple, oneStyleOnly, disabledStation, filterSwitch, filterStations } = this.props;
    let { data } = this.props;
    const { filterStationType, stationType, showWarningTip, warningTipText, selectedStation, filterDeviceType } = this.state;
    if (filterDeviceType) {
      data = data.filter(e => filterStations.includes(e.stationCode));
    }
    const tmpStationSet = new Set(data.map(e => e.stationType));
    const hasMultipleType = tmpStationSet.size > 1;
    const checked = selectedStation.length + disabledStation.length === data.length;
    return (
      <div className={styles.stationSelectModal}>
        {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <i className="iconfont icon-filter" onClick={showStationModal} />
        <span ref={'stations'} />
        <Modal
          visible={stationModalShow}
          onOk={this.handleOK}
          onCancel={hideStationModal}
          cancelText="取消"
          okText="确定"
          title="请选择"
          width={625}
          getContainer={() => this.refs.stations}
          wrapClassName={styles.stationModal}
        >
          <div className={styles.stationStyleModal}>
            {(hasMultipleType && !filterDeviceType) && <div className={styles.stationType}>
              <RadioGroup onChange={this.onSelectStationType} value={filterStationType}>
                {stationType.map(e => (<RadioButton key={e} value={e} >{e === 2 ? '全部' : e === 1 ? '光伏' : '风电'}</RadioButton>))}
              </RadioGroup>
            </div>}
            <div className={styles.filterDeviceType}>
              <Switch onChange={this.filterDeviceType} disabled={!filterSwitch} style={{ marginRight: 4 }} /> 只看已有选中设备型号电站
            </div>
            <div className={styles.provinceList}>
              {(multiple && !hasMultipleType) && <Checkbox
                style={{ marginBottom: 10 }}
                checked={checked}
                onChange={this.changeAllStation}
              >
                全部
          </Checkbox>}
              {this._filterStation()}
            </div>
            <div className={styles.selectStations}>
              {multiple && this._selectedStation()}
            </div>
          </div>
        </Modal>
      </div>
    );

  }
}
export default StationSelectModal;
