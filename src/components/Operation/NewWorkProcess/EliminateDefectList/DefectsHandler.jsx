import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import CommonPagination from '@components/Common/CommonPagination';
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import styles from './listPage.scss';

export default class DefectsHandler extends Component {

  addDefect = () => {
    console.log('新建消缺工单');
  }

  onChangeStatus = (value) => {
    console.log(value);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    console.log(currentPage, pageSize);
  }

  render() {
    const defectStatic = {
      toConfirm: 12,
      toReceive: 22,
      toDo: 221,
      toExamine: 21,
    };
    return (
      <div className={styles.defectsHandler}>
        <div className={styles.leftHandler}>
          <CneButton className={styles.addBtn} onClick={this.addDefect}>
            <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
            <span className={styles.text}>新建</span>
          </CneButton>
          <RadioGroup onChange={this.onChangeStatus} value="0">
            <RadioButton value="all">全部</RadioButton>
            <RadioButton value="0">{`待确认  ${defectStatic.toConfirm}`}</RadioButton>
            <RadioButton value="1">{`待领取  ${defectStatic.toReceive}`}</RadioButton>
            <RadioButton value="2">{`执行中  ${defectStatic.toDo}`}</RadioButton>
            <RadioButton value="3">{`待验收  ${defectStatic.toExamine}`}</RadioButton>
            <RadioButton value="4">已结单</RadioButton>
          </RadioGroup>
        </div>
        <CommonPagination
          pageSize={30}
          currentPage={1}
          total={800}
          onPaginationChange={this.onPaginationChange}
        />
      </div>
    );
  }
}
