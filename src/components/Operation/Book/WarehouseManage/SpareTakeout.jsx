import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
// import moment from 'moment';
// import AddGood from './ManageCommon/AddGood';
import MaterialDetailsList from './ManageCommon/MaterialDetailsList';
import InputLimit from '../../../Common/InputLimit';
import styles from './warehouseManageComp.scss';

const FormItem = Form.Item;
const { Option } = Select;

class SpareTakeout extends Component {

  static propTypes = {
    form: PropTypes.object,
    materialDetailsList: PropTypes.array,
    takeoutStatus: PropTypes.string,
    backList: PropTypes.func,
    originTakeoutInfo: PropTypes.object,
    changeStore: PropTypes.func,
    getMaterialDetailsList: PropTypes.func,
    takeoutWarehouseMaterial: PropTypes.func,
  }

  componentDidMount(){
    const { getMaterialDetailsList, originTakeoutInfo } = this.props;
    const { inventoryId } = originTakeoutInfo;
    getMaterialDetailsList({ inventoryId });
  }

  componentDidUpdate(preProps){
    const preStatus = preProps.takeoutStatus;
    const { takeoutStatus } = this.props;
    if ( preStatus === 'loading' && takeoutStatus === 'success') {
      this.backToList(); // 成功，返回主页面
    }
  }

  backToList = () => {
    this.props.changeStore({ originTakeoutInfo: {} });
    this.props.backList();
  }

  takeoutSave = () => {
    const { form, originTakeoutInfo, takeoutWarehouseMaterial } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        const { remarks, materialCodes } = values;
        const { inventoryId } = originTakeoutInfo;
        takeoutWarehouseMaterial({
          inventoryId,
          materialCodes: materialCodes.map(e => e.materialCode).join(','),
          remarks
        });
      }
    })
  }

  render(){
    const { form, originTakeoutInfo, materialDetailsList, takeoutStatus } = this.props;
    const { getFieldDecorator } = form;
    const requireInfoFun = (text, initialValue) => ({
      rules: [{ required: true, message: text }],
      initialValue
    });
    return (
      <section className={styles.takeout}>
        <h3 className={styles.title}>
          <span className={styles.text}>备品备件 - 出库</span>
          <Icon type="arrow-left" onClick={this.backToList} className={styles.backIcon} />
        </h3>
        <Form className={styles.formPart}>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseId', requireInfoFun('无仓库名称', originTakeoutInfo.warehouseName))(
              <Select style={{width: 200}} disabled>
                <Option value={originTakeoutInfo.warehouseName}>{originTakeoutInfo.warehouseName}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="物品名称">
            {getFieldDecorator('goodsName', requireInfoFun('无物品名称', originTakeoutInfo.goodsName))(
              <Select style={{width: 200}} disabled>
                <Option value={originTakeoutInfo.goodsName}>{originTakeoutInfo.goodsName}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="厂家">
            {getFieldDecorator('devManufactorName', requireInfoFun('无厂家名称'))(
              <Select style={{width: 200}} disabled>
                <Option value={originTakeoutInfo.devManufactorName}>{originTakeoutInfo.devManufactorName}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="型号">
            {getFieldDecorator('modeName', requireInfoFun('无型号'))(
              <Select style={{width: 200}} disabled>
                <Option value={originTakeoutInfo.modeName}>{originTakeoutInfo.modeName}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="物资编码" className={styles.materialCodes}>
            {getFieldDecorator('materialCodes', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  (!value || value.length === 0) && callback(`请选择物资`);
                  callback();
                },
              }],
            })(
              <MaterialDetailsList materialDetailsList={materialDetailsList} total={originTakeoutInfo.inventoryNum} />
            )}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remarks')(
              <InputLimit placeholder="请输入..." />
            )}
          </FormItem>
        </Form>
        <div className={styles.handlePart}>
          <span className={styles.holder} />
          <Button onClick={this.takeoutSave} loading={takeoutStatus === 'loading'}>保存</Button>
        </div>
      </section>
    )
  }
}

export default Form.create()(SpareTakeout);
