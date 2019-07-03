import React, { Component } from 'react';
import { Form, Select, Input, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';

const FormItem = Form.Item;
const { Option } = Select;

class AddType extends Component {

  static propTypes = {
    adddModeName: PropTypes.string,
    assetsId: PropTypes.array,
    insertModes: PropTypes.array,
    addTypeStatus: PropTypes.string,
    manufactorInfo: PropTypes.object,
    form: PropTypes.object,
    disabled: PropTypes.bool,
    value: PropTypes.number,
    onChange: PropTypes.func,
    addNewType: PropTypes.func,
  }

  state = {
    saveMode: '', // 保存 || 继续添加
    addModalShow: false,
  }

  componentDidUpdate(preProps){
    const { adddModeName, onChange, form, addTypeStatus, insertModes } = this.props;
    const preAddName = preProps.adddModeName;
    if (preAddName !== adddModeName && addTypeStatus === 'success') { // 添加新物品成功 => 重置数据, 选中物品
      const { saveMode } = this.state;
      const addInfo = insertModes.find(e => e.name === adddModeName) || {};
      if (saveMode === 'once') {
        onChange(addInfo.id);
        this.hideModal();
      } else {
        onChange(addInfo.id);
        form.resetFields();
      }
    }
  }

  selectType = (typeId) => {
    this.props.onChange(typeId);
  }

  hideModal = () => this.setState({ addModalShow: false });

  showModal = () => this.setState({ addModalShow: true });

  save = () => { // 保存
    this.setState({ saveMode: 'once' });
    this.querySaveInfo();
  }

  saveContinue = () => { // 保存并继续添加
    this.setState({ saveMode: 'more' });
    this.querySaveInfo();
  }

  querySaveInfo = () => {
    const { form, addNewType, assetsId } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        addNewType({ ...values, assetsId: assetsId[0] });
      }
    });
  }

  render(){
    const { addModalShow, saveMode } = this.state;
    const { form, insertModes, disabled, value, addTypeStatus, manufactorInfo } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div className={styles.addType}>
        <Select
          placeholder="请选择"
          onChange={this.selectType}
          value={value}
          style={{width: 200}}
          disabled={disabled}
        >
          {insertModes.map(e => (
            <Option key={e.id} value={e.id}>{e.name}</Option>
          ))}
        </Select>
        <span
          onClick={disabled ? null : this.showModal}
          className={`${styles.addIcon} ${disabled ? styles.disabled : null}`}
        >+</span>
        {addModalShow && <Modal
          title="添加规格/型号"
          visible={addModalShow}
          onCancel={this.hideModal}
          width={744}
          footer={null}
          maskClosable={false}
        >
          <Form className={styles.addTypeModal}>
            <FormItem label="厂家名称" className={styles.eathItem}>
              {getFieldDecorator('manufactorId', {
                rules: [{
                  required: true,
                  message: '请填写不超过30字的厂家名称',
                  max: 30,
                }],
                initialValue: manufactorInfo.manufactorId,
              })(
                <Select placeholder="请选择" style={{width: 200}} disabled>
                  <Option value={manufactorInfo.manufactorId}>{manufactorInfo.manufactorName}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="型号" className={styles.eathItem}>
              {getFieldDecorator('deviceModeName', {
                rules: [{
                  required: true,
                  message: '请填写不超过30字的型号名称',
                  max: 30,
                }],
              })(
                <Input placeholder="30字以内" />
              )}
            </FormItem>
            <div className={styles.confirmRow}>
              <span className={styles.holder} />
              <Button
                className={styles.save}
                onClick={this.save}
                loading={saveMode === 'once' && addTypeStatus === 'loading'}
              >保存</Button>
              <Button
                onClick={this.saveContinue}
                loading={saveMode === 'more' && addTypeStatus === 'loading'}
              >保存并继续添加</Button>
            </div>
          </Form>
        </Modal>}
      </div>
    );
  }
}

export default Form.create()(AddType);
