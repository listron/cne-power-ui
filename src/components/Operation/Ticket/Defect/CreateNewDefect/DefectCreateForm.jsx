import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect'
import { Form, Icon, Input, Button } from 'antd';
import styles from './newDefect.scss';
const FormItem = Form.Item;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    getDevieceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
  };
  constructor(props){
    super(props);
  }
  onStationSelected = (stations) =>{
    console.log(stations)
    // this.props.getDevieceTypes()
    // this.props.getDefectTypes()
    //请求设备类型，请求缺陷种类
  }
  
  render() {
    const {stations, devieceTypes} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('stationCode', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <StationSelect data={stations} multiple={false} onOK={this.onStationSelected} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('deviceTypeCode', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <div data={devieceTypes}></div>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('defectTypeCode', {
            rules: [{ required: true, message: '请选择缺陷类型' }],
          })(
            <div></div>
          )}
        </FormItem>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;