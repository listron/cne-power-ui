import React from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { Modal, InputNumber, Tooltip } from 'antd';
import { deviceValueFormat, divideFormarts, multiplyFormarts } from '../../PvCommon/PvDataformat';
import moment from 'moment';

class PvStationHeader extends React.Component {
  static propTypes = {
    singleStationData: PropTypes.object,
    editData: PropTypes.func,
    stationCode: PropTypes.string,
    monitorPvUnit: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      editType: '',
      modalVisiable: false,
      editValue: null,
    };
  }


  onChange = (e) => {
    this.setState({ editValue: e });
  }

  onOk = () => {
    const { editData, stationCode } = this.props;
    const { editType, editValue } = this.state;
    if (!editValue || isNaN(editValue)) {
      return;
    }
    const editTime = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const editName = editType === 'month' ? { monthGen: editValue } : { yearGen: editValue };
    editData({
      ...editName,
      date: editTime,
      stationCode: stationCode,
    });
    this.setState({ modalVisiable: false, editValue: null });
  }

  onCancel = () => {
    this.setState({
      modalVisiable: false,
      editValue: null,
      editInfoError: false,
    });
  }

  setModal = (e) => {
    this.setState({ editType: e, modalVisiable: true });
  }

  unitFormarts = (data, quantity) => {
    if (isNaN(data) || (!data && data !== 0)) {
      return '--';
    }
    return data / quantity;
  }


  render() {
    const { singleStationData, monitorPvUnit, theme = 'light' } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const { editInfoError, editType, modalVisiable, editValue } = this.state;
    const stationDataSummary = singleStationData || {};
    const stationPower = divideFormarts(stationDataSummary.stationPower, realTimePowerUnit);
    const stationCapacity = realCapacityUnit === 'MW' ? stationDataSummary.stationCapacity : multiplyFormarts(stationDataSummary.stationCapacity, 1000);
    const stationUnitCount = stationDataSummary.stationUnitCount;
    const instantaneous = stationDataSummary.instantaneous;
    const dayPower = divideFormarts(stationDataSummary.dayPower, powerUnit);
    const monthPower = divideFormarts(stationDataSummary.monthPower, powerUnit);
    const yearPower = divideFormarts(stationDataSummary.yearPower, powerUnit);
    const monthRate = stationDataSummary.monthRate;
    const equivalentHours = stationDataSummary.equivalentHours;
    const yearRate = stationDataSummary.yearRate;
    const percent = (stationDataSummary.stationPower && stationCapacity) ? (stationDataSummary.stationPower / multiplyFormarts(stationDataSummary.stationCapacity, 1000)) * 100 : 0;
    const rightHandler = localStorage.getItem('rightHandler');
    const powerUpdate = rightHandler && rightHandler.split(',').includes('monitor_powerUpdate');
    return (
      <div className={styles.headStation}>
        <div className={`${styles.leftIcon}`}> <span className={'iconfont icon-pvlogo'}></span> </div>
        <div className={styles.dataColumn}>
          <div className={styles.stationPower}>
            <div> <span className={styles.dataValue}>{deviceValueFormat(stationPower, '--', 2)}</span>{realTimePowerUnit}</div>
            <div> <span className={styles.dataValue}>{deviceValueFormat(stationCapacity, '--', 2)}</span>{realCapacityUnit}</div>
          </div>
          <OwnProgress percent={percent} active={true} theme={theme} />
          <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
        </div>
        <div className={styles.dataColumn}>
          <div className={styles.instantaneous}> <span>瞬时辐射  <span className={`${styles.dataValue}`}>{deviceValueFormat(instantaneous, '--', 2)}</span> W/m²</span>
            {/* <div className={styles.tooltipName}>
              <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={'不含未填写计划发电量的电站'}> <i className="iconfont icon-help"></i>
              </Tooltip>
            </div> */}
          </div>
          <div >  装机台数 <span className={styles.dataValue}>{deviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{deviceValueFormat(dayPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div className={styles.equivalentTime}>
            <span>
              日利用小时
              {/* 日等效时 */}
              <span className={styles.dataValue}>{deviceValueFormat(equivalentHours, '--', 2)}</span>
              h
            </span>
            {/* <div className={styles.tooltipName}>
              <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={'不含未填写计划发电量的电站'}> <i className="iconfont icon-help"></i>
              </Tooltip>
            </div> */}
          </div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{deviceValueFormat(monthPower, '--', 2, true)}</span>
            {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModal('month'); }} ><i className="iconfont icon-edit"></i></span> : ''}
            {powerUnit} </div>
          <div> 月完成率 <span className={styles.dataValue}>{deviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{deviceValueFormat(yearPower, '--', 2, true)}</span>
            {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModal('yer'); }} ><i className="iconfont icon-edit"></i></span> : ''}
            {powerUnit}</div>
          <div> 年完成率 <span className={styles.dataValue}>{deviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
        <span ref={'modal'} />
        <Modal
          title="请填写"
          style={{ top: 300 }}
          visible={modalVisiable}
          onOk={this.onOk}
          onCancel={this.onCancel}
          mask={false}
          closable={false}
          maskClosable={false}
          getContainer={() => this.refs.modal}
        >
          <div >
            {<span>截止到昨日，{editType === 'month' && '本月' || '本年'}累计发电量  </span>}
            <InputNumber placeholder="请输入" onChange={this.onChange} style={{ width: 100 }} min={0} value={editValue} />  万kWh
            {editInfoError && <div className={styles.warningInfo}>请输入数字</div>}
          </div>
        </Modal>
      </div >
    );
  }
}
export default (PvStationHeader);
