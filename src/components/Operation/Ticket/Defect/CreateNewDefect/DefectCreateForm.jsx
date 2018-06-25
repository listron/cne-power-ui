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
  
  render() {
    const {stations} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('station', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <StationSelect data={stations} multiple={false} />
          )}
        </FormItem>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;