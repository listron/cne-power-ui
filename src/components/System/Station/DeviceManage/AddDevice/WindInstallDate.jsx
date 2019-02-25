import React from "react";
import { Input, Form, DatePicker } from 'antd';
import styles from '../deviceSide.scss'
import moment from 'moment';
const FormItem = Form.Item;
const WindInstallDate = ({ form,stationDeviceDetail }) => {
  const { getFieldDecorator } = form;
  console.log('stationDeviceDetail: ', stationDeviceDetail);

  return (

    <div className={styles.rightStyles}>
      <FormItem
        label="安装时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('assemblyTime',{ initialValue:moment(stationDeviceDetail.assemblyTime),})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="并网时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('ongridTime',{ initialValue:moment(stationDeviceDetail.ongridTime),})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="进质保时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('warrantyBegintime',{ initialValue: moment(stationDeviceDetail.warrantyBegintime),})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="出质保时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('warrantyEndtime',{ initialValue: moment(stationDeviceDetail.warrantyEndtime),})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="报废时间"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('scrapTime',{ initialValue:moment(stationDeviceDetail.scrapTime),})(
          <DatePicker />
        )}
      </FormItem>
      <FormItem
        label="轮毂高度"
        colon={false}
        className={styles.formItemStyle}
      >
        {getFieldDecorator('hubHeight',{ initialValue: stationDeviceDetail.hubHeight,})(
          <Input placeholder="保留小数点后两位" />
        )}米
</FormItem>

    </div>
  )
}
export default (WindInstallDate)