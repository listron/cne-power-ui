import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import { Input, Form, DatePicker, Select,  } from 'antd';
const FormItem = Form.Item;
import moment from 'moment';

const WindMeasurement =({form,stationDeviceDetail})=>{
  const { getFieldDecorator } = form;
  const mapData=stationDeviceDetail.map;
  const towerAssemblyTime=mapData?(mapData.towerAssemblyTime?moment(mapData.towerAssemblyTime):''):'';

  return(
    <div className={styles.rightStyles}>
    <FormItem
        label="海拔高度"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('altitude',{ 
          initialValue:stationDeviceDetail.map?stationDeviceDetail.map.altitude:null,
          rules:[{pattern:/^\d+([.]\d{1,2})?$/,message: '保留小数点后两位'}],
        })(
          <Input placeholder="保留小数点后两位" />
        )}<span className={styles.unitStyle}>m</span>
      </FormItem>
      
      <FormItem
        label="立塔时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('towerAssemblyTime',{ initialValue:towerAssemblyTime,})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="塔高"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('towerHeight',{ 
          initialValue:stationDeviceDetail.map?stationDeviceDetail.map.towerHeight:null,
          rules:[{pattern:/^\d+([.]\d{1,2})?$/,message: '保留小数点后两位'}],
        })(
          <Input placeholder="保留小数点后两位" />
        )}<span className={styles.unitStyle}>m</span>
      </FormItem>
      <FormItem
        label="测风设备"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('windMeasurementEquipment',{ initialValue:stationDeviceDetail.map?stationDeviceDetail.map.windMeasurementEquipment:null,
          rules: [{ max: 30, message: '不超过30字' }],})(
          <Input placeholder="不超过30字" />
        )}
      </FormItem>
    </div>
  )
}

export default (WindMeasurement)