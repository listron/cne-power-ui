import React, { Component } from 'react';
import { Form, Select, Input, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';

const FormItem = Form.Item;
const { Option } = Select;

class AddGood extends Component {

  // 101:备品备件、201：安全工器具、202：检修工器具、203：仪器仪表、301：生活物资、302：办公物资、303：其他
  static propTypes = {
    goodsType: PropTypes.number,
    tabName: PropTypes.string,
    addGoodName: PropTypes.string,
    addGoodStatus: PropTypes.string,
    goodsList: PropTypes.array,
    form: PropTypes.object,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    addNewGood: PropTypes.func,
  }

  state = {
    saveMode: '', // 保存 || 继续添加
    addModalShow: false,
    goodTypeInfo: [
      { value: 101, label: '备品备件' },
      { value: 201, label: '安全工器具' },
      { value: 202, label: '检修工器具' },
      { value: 203, label: '仪器仪表' },
      { value: 301, label: '生活物资' },
      { value: 302, label: '办公物资' },
      { value: 303, label: '其他' },
    ],
    // goodTypeInfo: {
    //   spares: [
    //     { value: 101, label: '备品备件' }
    //   ],
    //   tools: [
    //     { value: 201, label: '安全工器具' },
    //     { value: 202, label: '检修工器具' },
    //     { value: 203, label: '仪器仪表' },
    //   ],
    //   materials: [
    //     { value: 301, label: '生活物资' },
    //     { value: 302, label: '办公物资' },
    //     { value: 303, label: '其他' },
    //   ]
    // }
  }

  componentDidUpdate(preProps){
    const { addGoodName, onChange, form, addGoodStatus } = this.props;
    const preAddName = preProps.addGoodName;
    if (addGoodName !== preAddName && addGoodStatus === 'success') { // 添加新物品成功 => 重置数据, 选中物品
      const { saveMode } = this.state;
      if (saveMode === 'once') {
        onChange(addGoodName);
        this.hideModal();
      } else {
        onChange(addGoodName);
        form.resetFields();
      }
    }
  }

  selectGoods = (goodsName) => {
    this.props.onChange(goodsName);
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
    const { form, addNewGood } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        addNewGood({ ...values });
      }
    });
  }

  render(){
    const { addModalShow, saveMode, goodTypeInfo } = this.state;
    const { form, goodsList, disabled, value, addGoodStatus, tabName, goodsType } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div className={styles.addGood}>
        <Select
          placeholder="请选择"
          onChange={this.selectGoods}
          value={value}
          style={{width: 200}}
          disabled={disabled}
        >
          {goodsList.map(e => (
            <Option key={e.goodsName} value={e.goodsName}>{e.goodsName}</Option>
          ))}
        </Select>
        <span
          onClick={disabled ? null : this.showModal}
          className={`${styles.addIcon} ${disabled ? styles.disabled : null}`}
        >+</span>
        {addModalShow && <Modal
          title="添加物品"
          visible={addModalShow}
          onCancel={this.hideModal}
          width={744}
          footer={null}
          maskClosable={false}
        >
          <Form className={styles.addGoodModal}>
            <FormItem label="物品名称" className={styles.eathItem}>
              {getFieldDecorator('goodsName', {
                rules: [{
                  required: true,
                  message: '请填写不超过30字的物品名称',
                  max: 30,
                }],
              })(
                <Input placeholder="30字以内" />
              )}
            </FormItem>
            <FormItem
              label="物品类型"
              className={styles.eathItem}
              style={{display: tabName === 'spares' ? 'none' : 'flex'}}
            >
              {getFieldDecorator('goodsType', {
                rules: [{
                  required: true,
                  message: '请选择物品类型',
                }],
                initialValue: goodsType,
              })(
                <Select placeholder="请选择" style={{width: 200}} disabled>
                  {goodTypeInfo.map(e => (
                    <Option key={e.value} value={e.value}>{e.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="计量单位" className={styles.eathItem}>
              {getFieldDecorator('goodsUnit', {
                rules: [{
                  required: true,
                  message: '请输入不超过30字的计量单位',
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
                loading={saveMode === 'once' && addGoodStatus === 'loading'}
              >保存</Button>
              <Button
                onClick={this.saveContinue}
                loading={saveMode === 'more' && addGoodStatus === 'loading'}
              >保存并继续添加</Button>
            </div>
          </Form>
        </Modal>}
      </div>
    );
  }
}

export default Form.create()(AddGood);
