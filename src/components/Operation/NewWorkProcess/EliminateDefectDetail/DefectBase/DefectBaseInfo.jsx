import React, { Component } from 'react';
import StationSelect from '@components/Common/StationSelect/index';
import ResponsorCheck from './ResponsorCheck';
import { DatePicker, Input } from 'antd';
import styles from './baseinfo.scss';
const { TextArea } = Input;

export default class DefectBaseInfo extends Component {

  static propTypes = {

  };

  infoEditCreater = (status) => {
    // true代表对应的是编辑态;
    return {
      isStationEdit: false,
      isExpectTimeEdit: false,
      isResponsorEdit: false,
      isDescEdit: false,
    };
  }

  onStationSelected = (stations) => { // 电站选择
    console.log(stations);
  }

  onExpectTimeChange = (value) => { // 要求完成时间选择
    console.log(value);
  }

  onDescChange = (value) => { // 描述信息更变
    console.log(value);
  }

  render() {
    const { isStationEdit, isExpectTimeEdit, isResponsorEdit, isDescEdit } = this.infoEditCreater();
    // 额外接收外界参数, 用于调整编辑态输入框的状态(必填, 出错);
    return (
      <div className={styles.defectBaseInfo}>
        <div className={styles.infoRow}>
          <div className={
            `${styles.firstInfoTitle} ${isStationEdit ? styles.require : ''}`
          }>电站名称</div>
          <div className={`${styles.infoContent} ${styles.stations}`}>
            {isStationEdit ? <StationSelect
              data={[]}
              onOK={this.onStationSelected}
            /> : <div>电站12345</div>}
          </div>
          <div className={styles.infoTitle}>工单类型</div>
          <div className={`${styles.infoContent} ${styles.types}`}>消缺工单</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.firstInfoTitle}>创建人</div>
          <div className={`${styles.infoContent} ${styles.creater}`}>没有~</div>
          <div className={styles.infoTitle}>工单创建时间</div>
          <div className={`${styles.infoContent} ${styles.createTime}`}>没有时间</div>
          <div className={
            `${styles.infoTitle} ${isExpectTimeEdit ? styles.require : ''}`
          }>要求完成时间</div>
          <div className={`${styles.infoContent} ${styles.expectTime}`}>
            {isExpectTimeEdit ? <DatePicker
              onChange={this.onExpectTimeChange}
            /> : <div>2018-01-22</div>}
          </div>
        </div>
        <div className={styles.infoRow}>
          <div className={
            `${styles.firstInfoTitle} ${isResponsorEdit ? styles.require : ''}`
          }>接单人</div>
          <div className={`${styles.infoContent} ${styles.responsor}`}>
            {isResponsorEdit ? <ResponsorCheck /> : <div>接单人123</div>}
          </div>
          <div className={styles.infoTitle}>验收人</div>
          <div className={`${styles.infoContent} ${styles.examiner}`}>验收人123</div>
          <div className={styles.infoTitle}>实际完成时间</div>
          <div className={`${styles.infoContent} ${styles.finishTime}`}>2019-02-11</div>
        </div>
        <div className={styles.descRow}>
          <div className={styles.firstInfoTitle}>
            <div className={styles.desc}>工单描述</div>
            <div className={styles.descTextNum}>0/999字</div>
          </div>
          <div className={styles.infoContent}>
            {isDescEdit ? <TextArea onChange={this.onDescChange} />: <div>接单人123</div>}
          </div>
        </div>
      </div>
    );
  }
}
