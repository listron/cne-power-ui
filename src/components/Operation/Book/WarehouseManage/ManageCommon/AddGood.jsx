import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';

const FormItem = Form.Item;
const { Option } = Select;

class AddGood extends Component {

  // 101:备品备件、201：安全工器具、202：检修工器具、203：仪器仪表、301：生活物资、302：办公物资、303：其他
  static propTypes = {
    warehouseId: PropTypes.number,
    addGoodSuccess: PropTypes.bool,
    goodsType: PropTypes.string, // 添加物品的
    form: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    addNewGood: PropTypes.func,
  }

  state = {
    saveMode: '', // 保存 || 继续添加
    addModalShow: false,
  }

  componentDidUpdate(preProps){
    const { addGoodSuccess } = this.props;
    const preAddResult = preProps.addGoodSuccess;
    if (!preAddResult && addGoodSuccess) { // 添加新物品成功 => 重置数据, 选中物品
      const { saveMode } = this.state;
    }
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
    const { form, warehouseId, addNewGood, goodsType } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        addNewGood({ ...values, goodsType, warehouseId });
      }
    });
  }

  render(){
    const { addModalShow } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div>
        <Input />
        <span onClick={this.showModal}>+</span>
        <Modal
          title="添加物品"
          visible={addModalShow}
          onCancel={this.hideModal}
          width={744}
          footer={null}
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
            <FormItem label="计量单位" className={styles.eathItem}>
              {getFieldDecorator('goodsUnit', {
                rules: [{
                  message: '不超过30字',
                  max: 30,
                }],
              })(
                <Input placeholder="30字以内" />
              )}
            </FormItem>
            <div className={styles.confirmRow}>
              <span className={styles.holder} />
              <Button className={styles.save} onClick={this.save}>保存</Button>
              <Button onClick={this.saveContinue}>保存并继续添加</Button>
            </div>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AddGood);