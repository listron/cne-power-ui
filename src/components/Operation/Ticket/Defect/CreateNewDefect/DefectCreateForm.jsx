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
  };
  constructor(props){
    super(props);
  }
  onStationSelected = (stations) =>{

  }
  
  render() {
    const {stations} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('stationCode', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <StationSelect data={stations} multiple={false} onSelected={this.onStationSelected} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('deviceTypeCode', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <div data={stations} multiple={false}></div>
          )}
        </FormItem>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;