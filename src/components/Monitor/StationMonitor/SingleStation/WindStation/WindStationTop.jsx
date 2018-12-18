

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Icon, Progress, Modal, Input } from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
import { dataFormat } from '../../../../../utils/utilFunc';

const ValueFormat = ({ value,  points }) => { // value必为数值 或 '--'。
  if (value === '--' || (!points && points === 0)) { // value无值，或不需对数据进行浮点处理
    return <span>{value}</span>;
  } else { // value为数值且有浮点数展示要求
    let stringValue = value.toFixed(points);
    const valueArr = stringValue.split('.');
    return (
      <span className={styles.valueFormat}>
        <span className={styles.int}>{valueArr[0]}</span>
        {valueArr[1] && <span className={styles.decimal}>.{valueArr[1]}</span>}
      </span>
    )
  }
}

class WindStationTop extends Component {
  static propTypes = {
    match: PropTypes.object,
    singleStationData: PropTypes.object,
    getSingleStation: PropTypes.func,
    stationList: PropTypes.array,
    showStationList: PropTypes.bool,
    changeSingleStationStore: PropTypes.func,
    onSelectedDeviceType: PropTypes.func,
    editData: PropTypes.func,
    stationCode: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showStationList: false,
      modalMonth: false,
      modalYear: false,
      editValue: '',
      editInfoError: false,
    }
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);
  }

  onChange = (e) => {
    const editValue = e.target.value;
    this.setState({
      editValue,
      editInfoError: (!editValue || isNaN(editValue)) ? true : false,
    });
  }
  onOk = () => {
    const { editData, stationCode } = this.props
    const { editValue } = this.state;
    if (!editValue || isNaN(editValue)) {
      return;
    }
    const editTime = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.state.modalMonth ? editData({
      monthGen: editValue,
      date: editTime,
      stationCode: stationCode
    }) : editData({
      yearGen: editValue,
      date: editTime,
      stationCode: stationCode
    });
    this.setState({ modalMonth: false, modalYear: false, editValue: '' });
  }
  onCancel = () => {
    this.setState({
      modalMonth: false,
      modalYear: false,
      editValue: '',
      editInfoError: false,
    });
  }
  setModalMonth = () => {
    this.setState({ modalMonth: true });
  }
  setModalYear() {
    this.setState({ modalYear: true });
  }
  hiddenStationList = () => {
    this.setState({
      showStationList: false,
    });
  }

  showStationList = () => {
    this.setState({
      showStationList: true,
    });
  }

  hideStationChange = () => {
    this.setState({
      showStationList: false,
    });
  }

  render() {
    const { singleStationData, stationList } = this.props;
    const { showStationList, editValue, editInfoError } = this.state;

    const stationPower =  singleStationData.stationPower;
    const stationCapacity =  singleStationData.stationCapacity;
    const powerPercent = stationPower / stationCapacity * 100;

    const provenceCodes = stationList && stationList.length > 0 ? stationList.map(e => e.provinceCode) : [];
    const stationListSet = new Set(provenceCodes);
    const tmpProvenceCodes = [...stationListSet];
    tmpProvenceCodes.forEach((value, key) => {
      tmpProvenceCodes[key] = stationList.filter(e => value === e.provinceCode);
    });

    let stationStatusTime =  singleStationData.stationStatus && singleStationData.stationStatus.stationStatusTime;
    let localTime = stationStatusTime && moment.utc(stationStatusTime).toDate();
    let tmpStationStatusTime = localTime && moment(localTime).fromNow();

    const baseLinkPath = `/monitor/singleStation`;
    const pathAllStation = "/monitor/station";
    //权限控制
    const rightHandler = localStorage.getItem('rightHandler');
    const powerUpdate = rightHandler && rightHandler.split(',').includes('monitor_powerUpdate');
    return (
      <div className={styles.pvStationTop} >
        <div className={styles.pvStationTitle} >
          <div className={styles.pvStationName} >
            {showStationList && <ChangeStation stations={stationList.filter(e => e.isConnected === 1)} stationName={singleStationData.stationName} baseLinkPath={baseLinkPath} hideStationChange={this.hideStationChange} />}
            <div onClick={this.showStationList} className={styles.stationToggle} id="stationToggle" >
              <Icon type="swap" />
              <h3>{ singleStationData.stationName}-{ singleStationData.provinceName}</h3>
            </div>
            <i className="iconfont icon-windlogo" ></i>
            <span>电站状态：{ singleStationData.stationStatus && singleStationData.stationStatus.stationStatusName}</span>
            { singleStationData.stationStatus && singleStationData.stationStatus.stationStatus !== 400 && stationStatusTime !== null && <span>时间：{tmpStationStatusTime || ""}</span>}
          </div>
          <Link to={pathAllStation}  >
            <Icon type="arrow-left" className={styles.backIcon} />
          </Link>
        </div>
        <div className={styles.trueTimeData} >
          <div className={styles.powerScale} >
            <div className={styles.trueTimeValue}>
              <ValueFormat value={dataFormat(singleStationData.stationPower,'--', 2)}  points={2} />
              <ValueFormat value={dataFormat(singleStationData.stationCapacity,'--', 2)}  points={2} />
            </div>
            <Progress percent={powerPercent || 0} showInfo={false} strokeWidth={3} type="line" strokeColor="#199475" />
            <div className={styles.trueTimeDesc}><span>实时功率 (MW)</span><span>装机容量 (MW)</span></div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>
              <ValueFormat value={dataFormat(singleStationData.stationUnitCount)} />
            </div>
            <div className={styles.trueTimeUnit}>装机台数 (台)</div>
          </div>
          <div>
            <div className={styles.trueTimeValue} style={{ color: "#3e97d1" }}>
              <ValueFormat value={dataFormat(singleStationData.instantaneous,'--', 2)}  points={2} />
            </div>
            <div className={styles.trueTimeUnit}>平均风速 (m/s)</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>
              <ValueFormat value={dataFormat(singleStationData.dayPower,'--', 4)}  points={4} />
            </div>
            <div className={styles.trueTimeUnit}>日发电量 (万kWh)</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>
              <div>
                <ValueFormat value={dataFormat(singleStationData.monthPower,'--', 4)}  points={4} />
                {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModalMonth() }} ><i className="iconfont icon-edit"></i></span> : ''}
              </div>
            </div>
            <div className={styles.trueTimeUnit}>月发电量 (万kWh)</div>
          </div>
          <Modal
            title="请填写"
            style={{ top: 300 }}
            visible={this.state.modalMonth || this.state.modalYear}
            onOk={this.onOk}
            onCancel={this.onCancel}
            mask={false}
            closable={false}
            maskClosable={false}
          >
            {this.state.modalMonth ? <div className={styles.editElecDataModal}>
              截止到昨日，本月累计发电量
              <Input value={editValue} placeholder="请输入" onChange={this.onChange} />  万kWh
                {editInfoError && <div className={styles.warningInfo}>请输入数字</div>}
            </div> : <div className={styles.editElecDataModal}>
                截止到昨日，本年累计发电量
                <Input placeholder="请输入" value={editValue} onChange={this.onChange} />  万kWh
                {editInfoError && <div className={styles.warningInfo}>请输入数字</div>}
              </div>}

          </Modal>
          <div className={styles.stationYearPlan}>
            <div className={styles.annualEnergyScale} >
              <div className={styles.trueTimeValue}>
                <div className={styles.editYearPower}>
                  <ValueFormat value={dataFormat(singleStationData.yearPower,'--', 4)}  points={4} />
                  {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModalYear() }}><i className="iconfont icon-edit"></i></span> : ''}
                </div>
                <ValueFormat value={dataFormat(singleStationData.yearPlanPower,'--', 4)}  points={4} />
              </div>
              <Progress percent={+( singleStationData.yearPlanRate.split('%')[0]) || 0} showInfo={false} strokeWidth={3} type="line" strokeColor="#199475" />
              <div className={styles.trueTimeDesc}><span>年累计发电量 (万kWh)</span><span>计划 (万kWh)</span></div>
            </div>
            <div className={styles.yearPlanRate} >{ singleStationData.yearPlanRate}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default WindStationTop;
