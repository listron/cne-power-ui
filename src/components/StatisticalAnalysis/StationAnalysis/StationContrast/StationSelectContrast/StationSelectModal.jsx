import React, { Component } from 'react';
import { Icon, Modal, Radio, message } from 'antd';
import ProvinceItem from './ProvinceItem';
import WarningTip from '../../../../Common/WarningTip';
import styles from './style.scss';
import PropTypes from 'prop-types';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StationSelectModal extends Component {
  static propTypes = {
    stationModalShow: PropTypes.bool,
    checkedStations: PropTypes.array,
    data: PropTypes.array,
    disabledStation: PropTypes.array,
    multiple: PropTypes.bool,
    hideStationModal: PropTypes.func,
    showStationModal: PropTypes.func,
    handleOK: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      filterStationType: 2, //选中电站类型
      stationType: [2, 0, 1], //0所有,0风电，1光伏
      selectedStation: props.checkedStations, //暂存选中的电站数组
      showWarningTip: false,
      warningTipText: '',
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
    const { selectedStation } = this.state;
    const tmpStationType = new Set(selectedStation.map(e => e.stationType));
    if (selectedStation.length > 10 || selectedStation.length === 1 || tmpStationType.size !== 1) {
      message.warning('请选择同一类型的电站进行对比,最多选择10个电站!!');
    } else {
      this.props.handleOK(selectedStation);
    }
  }

  checkStation = (selectedStation) => {
    this.setState({
      selectedStation,
    });
  }


  _filterStation = () => {
    const { data, multiple, disabledStation } = this.props;
    const { filterStationType, selectedStation } = this.state;
    const tmpStations = filterStationType === 2 ? data : data.filter(e => (e.stationType === filterStationType));
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
    return filteredStation.map((e, i) => (
      <ProvinceItem
        key={i}
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
          {selectedStation.map((e, i) => {
            return <div key={i} className={styles.eachSelectedStation} > <span>{e.stationName}</span> <Icon type="close" className={styles.deleteIcon} onClick={() => this.onDeleteOneStation(e)} /> </div>;
          })}
        </div>
      </div>
    );
  }

  render() {
    const { stationModalShow, hideStationModal, showStationModal, multiple, data, theme } = this.props;
    const { filterStationType, stationType, showWarningTip, warningTipText } = this.state;
    const tmpStationSet = new Set(data.map(e => e.stationType));
    const hasMultipleType = tmpStationSet.size > 1;
    return (
      <div className={styles.stationSelectModal}>
        {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} theme={theme} />}
        <i className="iconfont icon-filter" onClick={showStationModal} />
        <span ref={'stations'} />
        <Modal
          visible={stationModalShow}
          onOk={this.handleOK}
          onCancel={hideStationModal}
          cancelText="取消"
          okText="保存"
          title="请选择2-10个电站对比"
          width={625}
          getContainer={() => this.refs.stations}
          wrapClassName={styles.stationModal}
        >
          <div className={styles.stationStyleModal}>
            {hasMultipleType && <div className={styles.stationType}>
              <RadioGroup onChange={this.onSelectStationType} value={filterStationType}>
                {stationType.map((e, i) => (<RadioButton key={i} value={e} >{e === 2 ? '全部' : e === 1 ? '光伏' : '风电'}</RadioButton>))}
              </RadioGroup>
            </div>}
            <div className={styles.provinceList}>
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
