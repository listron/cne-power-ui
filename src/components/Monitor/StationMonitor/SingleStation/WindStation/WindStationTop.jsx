

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Icon, Progress, Modal, Input } from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
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

    const stationPower = singleStationData && singleStationData.stationPower;
    const stationCapacity = singleStationData && singleStationData.stationCapacity;
    const powerPercent = stationPower / stationCapacity * 100;

    const provenceCodes = stationList && stationList.length > 0 ? stationList.map(e => e.provinceCode) : [];
    const stationListSet = new Set(provenceCodes);
    const tmpProvenceCodes = [...stationListSet];
    tmpProvenceCodes.forEach((value, key) => {
      tmpProvenceCodes[key] = stationList.filter(e => value === e.provinceCode);
    });

    let stationStatusTime = singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusTime;
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
              <h3>{singleStationData && singleStationData.stationName}-{singleStationData && singleStationData.provinceName}</h3>
            </div>
            <span>电站状态：{singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusName}</span>
            {singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatus !== 400 && stationStatusTime !== null && <span>时间：{tmpStationStatusTime || ""}</span>}
          </div>
          <Link to={pathAllStation}  >
            <Icon type="arrow-left" className={styles.backIcon} />
          </Link>
        </div>
        <div className={styles.trueTimeData} >
          <div className={styles.pvlogo} >
            <i className="iconfont icon-windlogo" ></i>
          </div>
          <div className={styles.powerScale} >
            <div className={styles.trueTimeValue}>
              <span>{singleStationData && singleStationData.stationPower && parseFloat(singleStationData.stationPower).toFixed(2) || 0}</span>
              <span>{singleStationData && singleStationData.stationCapacity && parseFloat(singleStationData.stationCapacity).toFixed(2) || 0}</span>
            </div>
            <Progress percent={powerPercent || 0} showInfo={false} strokeWidth={3} type="line" strokeColor="#199475" />
            <div className={styles.trueTimeDesc}><span>实时功率 MW</span><span>装机容量 MW</span></div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount || 0}</div>
            <div className={styles.trueTimeUnit}>装机台数 台</div>
          </div>
          <div>
            <div className={styles.trueTimeValue} style={{ color: "#3e97d1" }}>{singleStationData && singleStationData.instantaneous && parseFloat(singleStationData.instantaneous).toFixed(2) || 0}</div>
            <div className={styles.trueTimeUnit}>平均风速 m/s</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.dayPower && parseFloat(singleStationData.dayPower).toFixed(4) || 0}</div>
            <div className={styles.trueTimeUnit}>日发电量 万kWh</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>
              <div>
                {singleStationData && singleStationData.monthPower && parseFloat(singleStationData.monthPower).toFixed(4) || 0}
                {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModalMonth() }} ><i className="iconfont icon-edit"></i></span> : ''}
              </div>
            </div>
            <div className={styles.trueTimeUnit}>月发电量 万kWh</div>
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
                <div>
                  <span>{singleStationData && singleStationData.yearPower && parseFloat(singleStationData.yearPower).toFixed(4) || 0}</span>
                  {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModalYear() }}><i className="iconfont icon-edit"></i></span> : ''}
                </div>
                <span>{singleStationData && singleStationData.yearPlanPower && parseFloat(singleStationData.yearPlanPower).toFixed(4) || 0}</span>
              </div>
              <Progress percent={+(singleStationData && singleStationData.yearPlanRate.split('%')[0]) || 0} showInfo={false} strokeWidth={3} type="line" strokeColor="#199475" />
              <div className={styles.trueTimeDesc}><span>年累计发电量 万kWh</span><span>计划 万kWh</span></div>
            </div>
            <div className={styles.yearPlanRate} >{singleStationData && singleStationData.yearPlanRate}</div>
          </div>


        </div>
      </div>
    )
  }
}

export default WindStationTop;
