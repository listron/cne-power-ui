import React from "react";
import { Input, Form, DatePicker } from 'antd';
import styles from '../deviceSide.scss'
import moment from 'moment';
const FormItem = Form.Item;
const WindInstallDate = ({ form, stationDeviceDetail }) => {
  const { getFieldDecorator } = form;
  const mapData=stationDeviceDetail.map;
  const assemblyTime=mapData?(mapData.assemblyTime?moment(mapData.assemblyTime):''):'';
  const ongridTime=mapData?(mapData.ongridTime?moment(mapData.ongridTime):''):'';
  const warrantyBegintime=mapData?(mapData.warrantyBegintime?moment(mapData.warrantyBegintime):''):'';
  const warrantyEndtime=mapData?(mapData.warrantyEndtime?moment(mapData.warrantyEndtime):''):'';
  const scrapTime=mapData?(mapData.scrapTime?moment(mapData.scrapTime):''):'';
  const hubHeight=mapData?(mapData.hubHeight?mapData.scrapTime:''):'--';
  
  return (
    <div className={styles.rightStyles}>
      <FormItem
        label="安装时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('assemblyTime', { initialValue:assemblyTime, })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="并网时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('ongridTime', { initialValue:ongridTime})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="进质保时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('warrantyBegintime', { initialValue:warrantyBegintime})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="出质保时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('warrantyEndtime', { initialValue:warrantyEndtime})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="报废时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('scrapTime', { initialValue:scrapTime})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="轮毂高度"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('hubHeight', { initialValue:hubHeight })(
          <Input placeholder="保留小数点后两位" />
        )}<span className={styles.unitStyle}>米</span>
      </FormItem>

    </div>
  )
}
export default (WindInstallDate)