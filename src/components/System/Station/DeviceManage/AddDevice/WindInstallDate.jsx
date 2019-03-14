import React from "react";
import { Input, Form, DatePicker } from 'antd';
import styles from '../deviceSide.scss'
import moment from 'moment';
const FormItem = Form.Item;
const WindInstallDate = ({ form, stationDeviceDetail }) => {
  const { getFieldDecorator } = form;
  return (
    <div className={styles.rightStyles}>
      <FormItem
        label="安装时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('assemblyTime', { initialValue:stationDeviceDetail.map? moment(stationDeviceDetail.map.assemblyTime):null, })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="并网时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('ongridTime', { initialValue:stationDeviceDetail.map? moment(stationDeviceDetail.map.ongridTime):null, })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="进质保时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('warrantyBegintime', { initialValue:stationDeviceDetail.map? moment(stationDeviceDetail.map.warrantyBegintime):null, })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="出质保时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('warrantyEndtime', { initialValue:stationDeviceDetail.map? moment(stationDeviceDetail.map.warrantyEndtime):null, })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="报废时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('scrapTime', { initialValue:stationDeviceDetail.map? moment(stationDeviceDetail.map.scrapTime):null, })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="轮毂高度"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('hubHeight', { initialValue:stationDeviceDetail.map? stationDeviceDetail.map.hubHeight:null, })(
          <Input placeholder="保留小数点后两位" />
        )}<span className={styles.unitStyle}>米</span>
      </FormItem>

    </div>
  )
}
export default (WindInstallDate)