import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { DeviceValueFormat } from '../../WindCommon/WindDataformat';
import { Popover, Modal, InputNumber } from 'antd';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
class windStationHeader extends React.Component {
  static propTypes = {
    singleStationData: PropTypes.object,
    editData: PropTypes.func,
    stationCode: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      editType: '',
      modalVisiable:false,
      editValue:null
    }
  }


  onChange = (e) => {
    this.setState({ editValue:e });
  }

  onOk = () => {
    const { editData, stationCode } = this.props
    const {editType, editValue } = this.state;
    if (!editValue || isNaN(editValue)) {
      return;
    }
    const editTime = moment().subtract(1, 'day').format('YYYY-MM-DD');
    let editName=editType==='month'?{monthGen:editValue} :{yearGen:editValue};
    editData({
      ...editName,
      date: editTime,
      stationCode: stationCode
    });
    this.setState({ modalVisiable:false, editValue: null });
  }

  onCancel = () => {
    this.setState({
      modalVisiable:false,
      editValue: null,
      editInfoError: false,
    });
  }

  setModal = (e) => {
    this.setState({ editType: e,modalVisiable:true });
  }

  unitFormarts = (data, quantity) => {
    if (isNaN(data) || (!data && data !== 0)) {
      return '--';
    }
    return data / quantity
  }


  render() {
    const { singleStationData, } = this.props;
    const { editInfoError, editType,modalVisiable,editValue} = this.state;
    const stationDataSummary = singleStationData || {};
    const stationPower = this.unitFormarts(stationDataSummary.stationPower, 1000);
    const stationCapacity = stationDataSummary.stationCapacity;
    const stationUnitCount = stationDataSummary.stationUnitCount;
    const instantaneous = stationDataSummary.instantaneous;
    const dayPower = this.unitFormarts(stationDataSummary.dayPower, 10000);
    const monthPower = this.unitFormarts(stationDataSummary.monthPower, 10000);
    const monthRate = stationDataSummary.monthRate;
    const yearPower = this.unitFormarts(stationDataSummary.yearPower, 10000);
    const equivalentHours = stationDataSummary.equivalentHours;
    const yearRate = stationDataSummary.yearRate;
    const capabilityRate = stationDataSummary.capabilityRate;
    const stationPlanPower = this.unitFormarts(stationDataSummary.stationPlanPower, 1000);
    const successPercent = (stationPlanPower && stationCapacity) ? stationPlanPower / stationCapacity * 100 : 0;
    const percent = (stationPower && stationCapacity) ? stationPower / stationCapacity * 100 : 0;
    const rightHandler = localStorage.getItem('rightHandler');
    const powerUpdate = rightHandler && rightHandler.split(',').includes('monitor_powerUpdate');
    const content = (
      <div>
        <div className={styles.poverItem}>
          <i>实时功率</i>
          <p><span>{dataFormats(stationPower, '--', 2, true)}</span><span className={styles.unit}>MW</span> </p>
        </div>
        <div className={styles.poverItem}>
          <i>应发功率</i>
          <p><span>{dataFormats(stationPlanPower, '--', 2, true)}</span> <span className={styles.unit}>MW</span> </p>
        </div>
        <div className={styles.poverItem}>
          <i>出力比</i>
          <p><span>{dataFormats(capabilityRate, '--', 2, true)}</span> <span className={styles.unit}>%</span> </p>
        </div>
      </div>)
    return (
      <div className={styles.headStation}>
        <div className={styles.leftIcon}></div>
        <div ref={'allStaionStatic'} className={styles.allStaionStatic}></div>
        <div className={styles.dataColumn}>
          <Popover
            content={content}
            placement="bottom"
            overlayClassName={styles.stationCard}
            trigger="hover"
            getPopupContainer={() => this.refs.allStaionStatic}
          >
            <div className={styles.stationPower}>
              <div> <span className={styles.dataValue}>{DeviceValueFormat(stationPower, '--', 2)}</span> MW </div>
              <div> <span className={styles.dataValue}>{DeviceValueFormat(stationCapacity, '--', 2)}</span>MW</div>
            </div>
            <OwnProgress percent={percent} successPercent={successPercent} />
            <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
          </Popover>
        </div>
        <div className={styles.dataColumn}>
          <div> 平均风速  <span className={`${styles.dataValue} ${styles.speed}`}>{DeviceValueFormat(instantaneous, '--', 2)}</span> m/s </div>
          <div >  装机台数 <span className={styles.dataValue}>{DeviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{DeviceValueFormat(dayPower, '--', 2, true)}</span> 万kWh  </div>
          <div> 月完成率 <span className={styles.dataValue}>{DeviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{DeviceValueFormat(monthPower, '--', 2, true)}</span>
            {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModal('month') }} ><i className="iconfont icon-edit"></i></span> : ''}
            万kWh</div>
          <div> 年完成率 <span className={styles.dataValue}>{DeviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{DeviceValueFormat(yearPower, '--', 2, true)}</span>
            {powerUpdate ? <span className={styles.iconStyle} onClick={() => { this.setModal('yer') }} ><i className="iconfont icon-edit"></i></span> : ''}
            万kWh</div>
          <div> 年利用小时 <span className={styles.dataValue}>{DeviceValueFormat(equivalentHours, '--', 2, true)}</span> h</div>
        </div>
       
        <Modal
          title="请填写"
          // wrapClassName={styles.powerModal}
          style={{ top: 300 }}
          visible={modalVisiable}
          // onOk={this.onOk}
          // onCancel={this.onCancel}
          mask={false}
          closable={false}
          maskClosable={false}
          footer={null}
        >
          <div >
            <div>
              {<span>截止到昨日，{editType === 'month' && '本月' || '本年'}累计发电量  </span>}
              <InputNumber placeholder="请输入" onChange={this.onChange} style={{width:100}} min={0} value={editValue}/>  万kWh
              {editInfoError && <div className={styles.warningInfo}>请输入数字</div>}
            </div>
            <div className={styles.headerModalBottom}>
              <div className={styles.cancelBtn} onClick={this.onCancel}>取消</div>
              <CneButton className={styles.okBtn} onClick={this.onOk} lengthMode="short">确定</CneButton>
            </div>
          </div>
        </Modal>
      </div >
    )
  }
}
export default (windStationHeader)