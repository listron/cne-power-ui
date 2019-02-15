import React from "react";
import {  Input, Form, DatePicker } from 'antd';
import styles from '../deviceSide.scss'

const FormItem = Form.Item;
const WindInstallDate = ({form}) => {
  const { getFieldDecorator } = form;
  return(
   
  <div className={styles.rightStyles}>
  <FormItem
  label="安装时间"
  colon={false}
  className={styles.formItemStyle}
>
  {getFieldDecorator('assemblyTime')(
   <DatePicker   />
  )}
</FormItem>
<FormItem
  label="并网时间"
  colon={false}
  className={styles.formItemStyle}
>
  {getFieldDecorator('ongridTime')(
   <DatePicker   />
  )}
</FormItem>
<FormItem
  label="进质保时间"
  colon={false}
  className={styles.formItemStyle}
>
  {getFieldDecorator('warrantyBegintime')(
   <DatePicker   />
  )}
</FormItem>
<FormItem
  label="出质保时间"
  colon={false}
  className={styles.formItemStyle}
>
  {getFieldDecorator('warrantyEndtime')(
   <DatePicker   />
  )}
</FormItem>
<FormItem
  label="报废时间"
  colon={false}
  className={styles.formItemStyle}
>
  {getFieldDecorator('scrapTime')(
   <DatePicker   />
  )}
</FormItem>
<FormItem
  label="轮毂高度"
  colon={false}
  className={styles.formItemStyle}
>
  {getFieldDecorator('hubHeight')(
    <Input placeholder="保留小数点后两位" />
  )}米
</FormItem>
  
  </div>
)
}
export default (WindInstallDate)