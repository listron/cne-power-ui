import React, { Component } from 'react';
import { Select, Input, Form, message} from 'antd';
import PropTypes from 'prop-types';
import styles from './planMain.scss';
import {getMonth, } from '../plan';

const FormItem = Form.Item;

class EditableCell extends React.Component {

  static propTypes = {
    editing: PropTypes.bool,
    form: PropTypes.object,
    record: PropTypes.object,
    dataIndex: PropTypes.string,
  };

  getInput = (form) => {
    const {dataIndex, record} = this.props;
    if (dataIndex === 'yearPR') { // PR年计划
      return (<span> <Input onChange={(e) => this.yearPRChange(e, form, dataIndex, record)}
                            defaultValue={record[dataIndex]} />%</span>);
    }
    if (record.setGridTime) {// 并网数据
      if (getMonth(dataIndex) < Number(record.setGridTime)) {
        return <Input disabled={true} placeholder="--" />
      }
    }
    return (<Input onChange={(e) => this.valueChange(e, form, dataIndex, record)}
                  placeholder="--" />);
  };

  yearPRChange = (e, form, dataIndex, record) => {//PR 数据修改
    const number = e.target.value;
    const pointLength = number.split('.')[1] ? number.split('.')[1].length : 0;
    if (isNaN(number) || pointLength > 2) {
      message.config({
        top: 400,
        duration: 2,
        maxCount: 1,
      })
      message.warning('只可以填写数字,可精确到小数点后两位');
      form.setFieldsValue({
        [dataIndex]: '',
      });
      return false;
    } else {
      // record.yearPR = number;
      // this.props.handlevaluechange(record, dataIndex, number, 'PR')
    }
  };

  valueChange = (e, form, dataIndex, record) => {//月份的修改，修改完毕之后年计划跟着变化
    const number = e.target.value;
    const pointLength = number.split('.')[1] ? number.split('.')[1].length : 0;
    if (isNaN(number) || pointLength > 4) {
      message.config({
        top: 400,
        duration: 2,
        maxCount: 1,
      })
      message.warning('只可以填写数字,可精确到小数点后四位');
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
      return false;
    } else {
      const index = getMonth(dataIndex) - 1;
      record.planMonthGens[index] = number;
      record.dataIndex = number;

      function sum(arr) {
        return arr.reduce(function (prev, curr, idx, arr) {
          return Number(prev) + Number(curr);
        });
      }

      let planMonthValue = [];
      if (record.setGridTime) {// 并网数据
        for (let i = Number(record.setGridTime) - 1; i < 12; i++) {
          planMonthValue.push(record.planMonthGens[i])
        }
      } else {
        planMonthValue = record.planMonthGens
      }

      const planPower = sum(planMonthValue).toFixed(4);
      this.props.form.setFieldsValue({ planPower });
      // this.props.handlevaluechange(record, dataIndex, number, 'month')
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
    const {getFieldDecorator} = form;
    return (
      <td {...restProps}>
        {editing && dataIndex === 'planPower' && <FormItem style={{margin: 0}}>
          {getFieldDecorator(dataIndex,{
            initialValue: record[dataIndex] === "null" ? '--' : record[dataIndex],
          })(<div className={styles.save}>{form.getFieldValue('planPower')}</div>)}
        </FormItem> }
        {editing && dataIndex !== 'planPower' && <FormItem style={{margin: 0}}>
          {getFieldDecorator(dataIndex, {
            initialValue: record[dataIndex] === "null" ? '--' : record[dataIndex],
          })(this.getInput(form))}
        </FormItem> }
        {!editing && restProps.children}
      </td>
    );
  }
}

export default EditableCell;
