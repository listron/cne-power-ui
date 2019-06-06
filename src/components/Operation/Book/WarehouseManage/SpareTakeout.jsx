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
    backList: PropTypes.func,
    originTakeoutInfo: PropTypes.object,
    changeStore: PropTypes.func,
    getMaterialDetailsList: PropTypes.func,
  }

  componentDidMount(){
    const { getMaterialDetailsList, originTakeoutInfo } = this.props;
    const { inventoryId } = originTakeoutInfo;
    getMaterialDetailsList({ inventoryId });
  }

  // componentDidUpdate(preProps){ //  loading to do 
  //   const preInsertStatus = preProps.insertResult;
  //   const { insertStatus, changeStore } = this.props;
  //   if ( preInsertStatus === 'loading' && insertStatus === 'success') { // 保存操作请求成功
  //     this.backToList();
  //     changeStore({ assetsTree: [] }); // 树清空
  //   }
  // }

  backToList = () => {
    this.props.changeStore({ originTakeoutInfo: {} });
    this.props.backList();
  }

  takeoutSave = () => {
    const { form, originTakeoutInfo } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        const { remarks, materialCodes } = values;
        const { inventoryId } = originTakeoutInfo;
        // takeoutWarehouseMaterial 出库请求.todo 
        // {
        //   remarks, materialCodes, inventoryId
        // }
      }
    })
  }

  render(){
    const { form, originTakeoutInfo, materialDetailsList } = this.props;
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
          <Button onClick={this.takeoutSave} >保存</Button>
        </div>
      </section>
    )
  }
}

export default Form.create()(SpareTakeout);
