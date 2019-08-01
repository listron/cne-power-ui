import React, { Component } from 'react';
import { Icon, Modal, Radio } from 'antd';
import ProvinceItem from './ProvinceItem';
import WarningTip from '../WarningTip';
import styles from './style.scss';
import PropTypes from 'prop-types';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StationSelectModal extends Component {
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
  }
  constructor(props) {
    super(props);
    this.state = {
      filterStationType: 'all', //选中电站类型
      reportType: ['all', '1', '2'], //null所有,1 集中式光伏电站，2 分布式光伏电站
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
    this.props.handleOK(this.state.selectedStation);
  }

  checkStation = (selectedStation) => {
    this.setState({
      selectedStation,
    });
  }


  _filterStation = () => {
    const { data, multiple, disabledStation, oneStyleOnly } = this.props;
    const { filterStationType, selectedStation } = this.state;
    const tmpStations = filterStationType === 'all' ? data : data.filter(e => (e.reportType === filterStationType));
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
            return <div key={e.stationCode} className={styles.eachSelectedStation} > <span>{e.stationName}</span> <Icon type="close" className={styles.deleteIcon} onClick={() => this.onDeleteOneStation(e)} /> </div>;
          })}
        </div>
      </div>
    );
  }

  render() {
    const { stationModalShow, hideStationModal, showStationModal, multiple, data } = this.props;
    const { filterStationType, reportType, showWarningTip, warningTipText } = this.state;
    const tmpStationSet = new Set(data.map(e => e.reportType));
    const hasMultipleType = tmpStationSet.size > 1;
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
            {hasMultipleType && <div className={styles.stationType}>
              <RadioGroup onChange={this.onSelectStationType} value={filterStationType}>
                {reportType.map(e => (<RadioButton key={e} value={e} >{e === 'all' ? '全部' : e === '1' ? '集中式光伏电站' : '分布式光伏电站'}</RadioButton>))}
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
