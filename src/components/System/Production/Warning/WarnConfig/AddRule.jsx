import React, { Component } from "react";
import { Select, Table, Modal, Form, Input, Button, Switch, Radio, Cascader } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";
import StationSelect from '../../../../Common/StationSelect';
const Option = Select.Option;
const FormItem = Form.Item;
class AddRule extends Component {
  static propTypes = {
    form: PropTypes.object,
    resetStore: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() { // 初始请求数据

  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, devicePoints } = this.props;
    const typeSelectDisable=false;
    return (
      <Form onSubmit={this.handleSubmit} className={styles.addRule}>
        <FormItem label="所属电站" colon={false}>
          {getFieldDecorator('stations', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <StationSelect data={allStationBaseInfo} multiple={false} onOK={this.onStationSelected} />
          )}
        </FormItem>
        {/* <FormItem label="设备类型" colon={false}>
          {getFieldDecorator('deviceTypeCode', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <Select className={styles.typeSelect} onChange={this.selectDeviceType}  placeholder="请选择设备类型" disabled={typeSelectDisable}>
              <Option key={null} value={null}>{'全部设备类型'}</Option>
              {stationDeviceTypes.map(e => {
                if (!e) { return null; }
                return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              })}
            </Select>
          )}
        </FormItem> */}
      </Form>
    )
  }
}


export default Form.create()(AddRule);