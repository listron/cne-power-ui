import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import { Input, Form, DatePicker, Select,  } from 'antd';
const FormItem = Form.Item;

const WindMeasurement =({form})=>{
  const { getFieldDecorator } = form;
  return(
    <div className={styles.rightStyles}>
    <FormItem
        label="海拔高度"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('altitude')(
          <Input placeholder="保留小数点后两位" />
        )}米
      </FormItem>
      
      <FormItem
        label="立塔时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('towerAssemblyTime')(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="塔高"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('towerHeight')(
          <Input placeholder="保留小数点后两位" />
        )}
      </FormItem>
      <FormItem
        label="测风设备"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('windMeasurementEquipment')(
          <Input placeholder="不超过30字" />
        )}米
      </FormItem>
      


    </div>
  )

}

export default (WindMeasurement)