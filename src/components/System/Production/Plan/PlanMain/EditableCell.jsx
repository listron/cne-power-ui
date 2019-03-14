import React, { Component } from 'react';
import { Input, Form, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './planMain.scss';
import { getMonth, } from '../plan';

const FormItem = Form.Item;

class EditableCell extends React.Component {

  static propTypes = {
    editing: PropTypes.bool,
    form: PropTypes.object,
    record: PropTypes.object,
    dataIndex: PropTypes.string,
  };

  getInput = (form) => {
    const { dataIndex, record } = this.props;
    const stationType = record.stationType;
    if (dataIndex === 'yearPR') { // PR年计划
      return (<span>
        <Input onChange={(e) => this.valueChange(e, dataIndex, record, 'pr')}
          defaultValue={record[dataIndex]} disabled={stationType === 0} placeholder={'--'} /></span>);
    }
    if (record.setGridTime) {// 并网数据
      if (getMonth(dataIndex) < +(record.setGridTime)) {
        return <Input disabled={true} placeholder="--" />
      }
    }
    return (<Input onChange={(e) => this.valueChange(e, dataIndex, record)}
      placeholder="--" />);
  };



  valueChange = (e, dataIndex, record, type) => {//月份的修改，修改完毕之后年计划跟着变化
    const number = e.target.value;
    const pointLength = number.split('.')[1] ? number.split('.')[1].length : 0;
    const limitPointLength = type === 'pr' ? 2 : 4
    if (isNaN(number) || pointLength > limitPointLength) {
      message.config({
        top: 400,
        duration: 2,
        maxCount: 1,
      })
      message.warning(`只可以填写数字,可精确到小数点后${limitPointLength}位`);
    } else {
      const index = getMonth(dataIndex) - 1;
      if (index >= 0) {
        record.planMonthGens[index] = number;
      }
      let planMonthValue = record.planMonthGens.filter(e => e !== "null");
      const planPower = planMonthValue.reduce((prev, next) => (+prev) + (+next), 0)
      this.props.form.setFieldsValue({ planPower: +planPower.toFixed(4) });
      type === 'pr' ? record.yearPR = number : '';
    }
  };

  render() {
    const {
      form,
      editing,
      dataIndex,
      record,
      ...restProps
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <td {...restProps}>
        {editing && dataIndex === 'planPower' && <FormItem style={{ margin: 0 }}>
          {getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex] === "null" ? '--' : record[dataIndex],
          })(<div className={styles.save}>{form.getFieldValue('planPower')}</div>)}
        </FormItem>}
        {editing && dataIndex !== 'planPower' && <FormItem style={{ margin: 0 }}>
          {getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex] === "null" ? '--' : record[dataIndex],
          })(this.getInput(form))}
        </FormItem>}
        {!editing && restProps.children}
      </td>
    );
  }
}

export default EditableCell;
