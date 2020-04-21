import React, { Component } from 'react';
import { Input, Form, message } from 'antd';
import PropTypes from 'prop-types';
import { getMonth } from '../plan';
import styles from './planSide.scss';
const FormItem = Form.Item;

class EditableCell extends React.Component {

  static propTypes = {
    editing: PropTypes.bool,
    form: PropTypes.object,
    record: PropTypes.object,
    dataIndex: PropTypes.string,
    changePlanStore: PropTypes.func,
    AddPlandata: PropTypes.array,
  };



  getInput = (form) => { // 根据不同的设置不同的数据
    const { dataIndex, record = {} } = this.props;
    if (dataIndex === 'yearPR') { // PR年计划
      return (<Input onChange={(e) => this.valueChange(e, form, dataIndex, record, 'pr')}
        defaultValue={record[dataIndex]} placeholder="--" />);
    }
    if (record.setGridTime) {// 并网数据
      if (getMonth(dataIndex) < +(record.setGridTime)) {
        return <Input disabled={true} placeholder="--" />;
      }
    }
    return (<Input onChange={(e) => this.valueChange(e, form, dataIndex, record)}
      placeholder="--" />);
  };



  valueChange = (e, form, dataIndex, record, type) => {//月份的修改，修改完毕之后年计划跟着变化
    const number = e.target.value;
    const pointLength = number.split('.')[1] ? number.split('.')[1].length : 0;
    const limitPointLength = type === 'pr' ? 2 : 4;
    if (isNaN(number) || pointLength > limitPointLength) {
      message.config({
        top: 400,
        duration: 2,
        maxCount: 1,
      });
      message.warning(`只可以填写数字,可精确到小数点后${limitPointLength}位`);
    } else {
      const index = getMonth(dataIndex) - 1;
      if (index >= 0) {
        record.monthPower[index] = number;
      }
      const planMonthValue = record.monthPower.filter(e => e !== 'null');
      const planPower = planMonthValue.reduce((prev, next) => (+prev) + (+next), 0);
      record.planPower = +planPower.toFixed(4);
      this.props.form.setFieldsValue({ planPower: +planPower.toFixed(4) });
      type === 'pr' ? record.yearPR = number : '';
      record.eddit = 'true';
    }

  };


  render() {
    const {
      form,
      editing,
      dataIndex,
      record = {},
      valueChange,
      ...restProps
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <td {...restProps}>
        {editing && dataIndex === 'planPower' && <FormItem className={styles.formItem}>
          {getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex] ? '--' : record[dataIndex],
          })(<div className={styles.save}>{form.getFieldValue('planPower') || '--'}</div>)}
        </FormItem>}
        {editing && dataIndex !== 'planPower' && <FormItem className={styles.formItem}>
          {getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex] === 'null' ? '--' : record[dataIndex],
          })(this.getInput(form))}
        </FormItem>}
        {!editing && restProps.children}
      </td>
    );
  }
}

export default EditableCell;
