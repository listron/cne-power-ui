import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Select, Modal, Button } from 'antd';
import InputLimit from '@components/Common/InputLimit';
import CneButton from '@components/Common/Power/CneButton';
import styles from './eventListPage.scss';
const Option = Select.Option;
const FormItem = Form.Item;

class IgnoreModal extends Component {
  static propTypes = {
    records: PropTypes.array,
    form: PropTypes.object,
    onModalIgnore: PropTypes.func,
    onModalCancel: PropTypes.func,
  }

  componentDidMount(){
    this.props.form.setFieldsValue({ ignoreCode: 1 });
  }

  checkIgnoreCode = (ignoreCode) => {
    this.props.form.setFieldsValue({ ignoreCode });
  }

  onIgnore = () => {
    const { records, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err && records.length > 0) {
        const daysNum = [undefined, 7, 30, 90];
        const addDaysNum = daysNum[values.ignoreTime];
        const diagWarningIds = records.map(e => e.diagWarningId);
        this.props.onModalIgnore({
          diagWarningIds,
          type: 1,
          ignoreCode: values.ignoreCode,
          ignoreMessage: values.ignoreMessage,
          endDate: addDaysNum && moment().add(addDaysNum, 'days').format('YYYY-MM-DD'),
        });
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const buttonInfo = ['固定物遮挡', '地形因素', '植被遮挡', '限电因素', '其他因素'];
    const ignoreCode = getFieldValue('ignoreCode');
    console.log(ignoreCode);
    return (
      <Modal
        visible
        title="忽略选中事件"
        width={635}
        footer={null}
        onCancel={this.props.onModalCancel}
        wrapClassName={styles.ignoreModal}
        maskClosable={false}
      >
        <Form className={styles.ignoreModalForm}>
          <FormItem className={styles.formItem} label="忽略时间">
            {getFieldDecorator('ignoreTime', {
              initialValue: 0,
              rules: [{
                required: true,
                message: '请选择忽略时间',
              }],
            })(
              <Select style={{ width: 120 }}>
                <Option value={0}>永久</Option>
                <Option value={1}>周(7天)</Option>
                <Option value={2}>月(30天)</Option>
                <Option value={3}>季(90天)</Option>
              </Select>
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="忽略原因">
            {getFieldDecorator('ignoreCode', {
              rules: [{
                required: true,
                message: '请选择忽略原因',
              }],
            })(
              <div className={styles.reasonGroup}>
                {buttonInfo.map((e, i) => (
                  <Button
                    key={e}
                    className={ignoreCode === i + 1 ? styles.activeBtn : styles.normalBtn}
                    onClick={ () => { ignoreCode !== (i + 1) ? this.checkIgnoreCode(i + 1) : null; }}
                  >{e}</Button>
                ))}
              </div>
            )}
          </FormItem>
          {ignoreCode === 5 && <FormItem className={styles.formItem} label="">
            {getFieldDecorator('ignoreMessage')(
              <InputLimit style={{ marginLeft: 20 }} placeholder="请输入不超过80字的忽略原因..." />
            )}
          </FormItem>}
          <div className={styles.formFooter}>
            <div className={styles.cancelIgnore} onClick={this.props.onModalCancel}>取消</div>
            <CneButton lengthMode="short" onClick={this.onIgnore}>确认</CneButton>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(IgnoreModal);
