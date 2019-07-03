import React, { Component } from 'react';
import { Form, Select, Input, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';

const FormItem = Form.Item;
const { Option } = Select;

class AddManu extends Component {

  static propTypes = {
    addManufactorId: PropTypes.string,
    addManuStatus: PropTypes.string,
    assetsManufac: PropTypes.array,
    form: PropTypes.object,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    addNewManu: PropTypes.func,
    getManufactures: PropTypes.func,
    getModes: PropTypes.func,
    assetsIds: PropTypes.array,
  }

  state = {
    saveMode: '', // 保存 || 继续添加
    addModalShow: false,
  }

  componentDidUpdate(preProps){
    const { addManufactorId, onChange, form, addManuStatus, getModes } = this.props;
    const preAddId = preProps.addManufactorId;
    if (preAddId !== addManufactorId && addManuStatus === 'success') { // 添加新物品成功 => 重置数据, 选中物品
      const { saveMode } = this.state;
      if (saveMode === 'once') {
        getModes(addManufactorId);
        onChange(addManufactorId);
        this.hideModal();
      } else {
        onChange(addManufactorId);
        form.resetFields();
      }
    }
  }

  selectManu = (manufactorId) => {
    this.props.getModes(manufactorId);
    this.props.onChange(manufactorId);
  }

  hideModal = () => {
    this.setState({ addModalShow: false });
    if (this.state.saveMode) { // 有过新增厂家 => 重新请求备品备件外界厂家下拉表。
      this.props.getManufactures();
    }
  }

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
    const { form, addNewManu, assetsIds } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        addNewManu({ ...values, assetsIds });
      }
    });
  }

  render(){
    const { addModalShow, saveMode } = this.state;
    const { form, assetsManufac, disabled, value, addManuStatus } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div className={styles.addManu}>
        <Select
          placeholder="请选择"
          onChange={this.selectManu}
          value={value}
          style={{width: 200}}
          disabled={disabled}
        >
          {assetsManufac.map(e => (
            <Option key={e.manufactorId} value={e.manufactorId}>{e.manufactorName}</Option>
          ))}
        </Select>
        <span
          onClick={disabled ? null : this.showModal}
          className={`${styles.addIcon} ${disabled ? styles.disabled : null}`}
        >+</span>
        {addModalShow && <Modal
          title="添加厂家"
          visible={addModalShow}
          onCancel={this.hideModal}
          width={744}
          footer={null}
          maskClosable={false}
        >
          <Form className={styles.addManuModal}>
            <FormItem label="厂家名称" className={styles.eathItem}>
              {getFieldDecorator('manufactorName', {
                rules: [{
                  required: true,
                  message: '请填写不超过30字的厂家名称',
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
                loading={saveMode === 'once' && addManuStatus === 'loading'}
              >保存</Button>
              <Button
                onClick={this.saveContinue}
                loading={saveMode === 'more' && addManuStatus === 'loading'}
              >保存并继续添加</Button>
            </div>
          </Form>
        </Modal>}
      </div>
    );
  }
}

export default Form.create()(AddManu);
