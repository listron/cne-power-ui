import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker } from 'antd';

import styles from '../deviceSide.scss';
import WindInstallDate from "../AddDevice/WindInstallDate";
import WindMeasurement from "../AddDevice/WindMeasurement";
import Confluence from "../AddDevice/Confluence";
const FormItem = Form.Item;
const Option = Select.Option;
class EditDeviceForm extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
 
 
  submitForm=(e)=>{
    e.preventDefault();
   
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    this.props.changeDeviceManageStore({showPage: 'detail',})

  }
 
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode, form, selectdeviceType, selectStation } = this.props;
    const stationName='123';
    const deviceTypeName='风电机组'
    // console.log('deviceTypeName: ', deviceTypeName);
    const selectDeviceTypeName= typeof(selectdeviceType)==='number'?stationDeviceTypes.filter((e, i) => (e.deviceTypeCode === selectdeviceType))[0].deviceTypeName:selectdeviceType
  
    //101是风电机组，箱变304，测风塔501，组串式逆变器、汇流箱：206、202

    return (
      <div className={styles.colStyles}>
        <Form className={styles.editPart}>
          <div className={styles.leftlayout}>
            <div className={styles.defaultConfigStyles}>
              <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('stationCode',)(
                  
                 
                  <span>{stationName}</span>

                )}
              </FormItem>
              <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('deviceTypeCode',)(
                 
                  <span>{stationName}</span>
                )}
              </FormItem>
              <FormItem label="设备名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceName', )(
                  <span>{stationName}</span>
                )}
              </FormItem>
              <FormItem label="设备型号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceModeCode', )(
                  <span>{stationName}</span>
                )}
              </FormItem>
              <FormItem label="生产厂家" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('manufacturer', )(
                  <span>{stationName}</span>
                )}
              </FormItem>
              <FormItem label="批次号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('lotNumber')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>
            <div className={styles.valueStyles}>
              <FormItem label="关联设备" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('pareneDeviceName')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="是否为样板机" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('templateMachine')(
                  <Select>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="额定容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('ratedPower')(
                  <Input placeholder="保留小数点后两位" />
                )}kW
              </FormItem>
              <FormItem label="装机容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceCapacity')(
                  <Input placeholder="保留小数点后两位" />
                )}<span>kW</span>
              </FormItem>
              <FormItem label="经度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('longitude')(
                  <Input placeholder="请输入..." />
                )}°
              </FormItem>
              <FormItem label="纬度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('latitude')(
                  <Input placeholder="请输入..." />
                )}°
              </FormItem>
            </div>
            <div className={styles.systermStyle}>
              <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('enableDisplay',{ initialValue: 'true',})(
                  <Select>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                )}
              </FormItem>
              
            </div>
          </div>
          <div className={styles.rightContainer}>
          { deviceTypeName==='测风塔'&&<WindMeasurement form={form} />}
            {deviceTypeName ==='箱变'&& <div className={styles.rightStyles}>
              <FormItem label="所属方阵" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('belongMatrix')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>}
            {deviceTypeName === '风电机组' && <WindInstallDate form={form} />}
            {(deviceTypeName === '206' || deviceTypeName === 202) && <Confluence form={form} />}
            <div className={styles.submitStyle}>
             
              <Button onClick={this.submitForm} >保存</Button>
            </div>


          </div>

        </Form>

      </div>
    )
  }
}
export default Form.create()(EditDeviceForm)
