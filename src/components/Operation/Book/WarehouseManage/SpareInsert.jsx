import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import AddGood from './ManageCommon/AddGood';
import AssetsSelectTree from './ManageCommon/AssetsSelectTree';
import InputLimit from '../../../Common/InputLimit';
import styles from './warehouseManageComp.scss';

const FormItem = Form.Item;
const { Option } = Select;

class SpareInsert extends Component {

  static propTypes = {
    insertStatus: PropTypes.string,
    addGoodName: PropTypes.string,
    addGoodStatus: PropTypes.string,
    originInsertInfo: PropTypes.object, // 是否编辑状态唯一标识。null: 新入库, object: 编辑信息
    stations: PropTypes.array,
    warehouseList: PropTypes.array,
    insertModes: PropTypes.array,
    goodsList: PropTypes.array,
    manufacturerList: PropTypes.array,
    assetsTree: PropTypes.array,
    form: PropTypes.object,
    backList: PropTypes.func,
    addNewGood: PropTypes.func,
    getGoodsList: PropTypes.func,
    getModes: PropTypes.func,
    getAssetslist: PropTypes.func,
    insertWarehouse: PropTypes.func,
    changeStore: PropTypes.func,
  }

  state = {
    saveMode: '',
  }

  componentDidMount(){
    const { originInsertInfo, form, getGoodsList } = this.props; 
    getGoodsList({ goodsMaxType: 101 });
    if (originInsertInfo) {// 基于originInsertInfo判断是 入库 or edit再入库
      form.setFieldsValue({
        warehouseId: originInsertInfo.warehouseId,
        goodsName: originInsertInfo.goodsName,
        manufactorId: originInsertInfo.manufactorId,
        modeId: originInsertInfo.modeId,
        manufactorName: originInsertInfo.manufactorName,
        supplierName: originInsertInfo.supplierName,
        assetsIds: originInsertInfo.assetsIds,
      })
    }
  }

  componentDidUpdate(preProps){
    const preInsertStatus = preProps.insertStatus;
    const { insertStatus, form, changeStore } = this.props;
    if ( preInsertStatus === 'loading' && insertStatus === 'success') { // 保存操作请求成功
      const { saveMode } = this.state;
      form.resetFields(); // form内数据需重置
      if (saveMode === 'once') {
        this.backToList();
      } else {
        changeStore({ assetsTree: [] }); // 树清空
      }
    }
  }

  backToList = () => {
    this.props.changeStore({
      assetsTree: [], 
      originInsertInfo: null,
    }); // 树清空
    this.props.backList();
  }

  selectWarehouse = (warehouseId) => { // 仓库 => 下物品 + 所有生产资产
    const { warehouseList, stations, getAssetslist } = this.props;
    const { stationName } = warehouseList.find(e => e.warehouseId === warehouseId) || {};
    const { stationType = 1 } = stations.find(e => e.stationName === stationName) || {};
    getAssetslist({
      stationType,
      assetsParentId: 0,
      nowTime: moment().utc().format(),
    })
  }

  selectManufacturer = (selectedManufacturer) => { // 选择厂家
    this.props.getModes({ selectedManufacturer, formModes: true });
  }

  insertSave = () => { // 保存
    this.setState({ saveMode: 'once' });
    this.saveInfo();
  }

  saveAndContinue = () => { // 保存并继续添加
    this.setState({ saveMode: 'more' });
    this.saveInfo();
  }

  saveInfo = () => {
    const { form, insertWarehouse } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const assetsIds = values.assetsIds[0];
      insertWarehouse({ ...values, assetsIds });
    })
  }

  render(){
    const { saveMode } = this.state;
    const {
      form, warehouseList, manufacturerList, addNewGood, goodsList, addGoodName, insertModes, assetsTree, insertStatus, originInsertInfo, addGoodStatus
    } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { manufactorId } = getFieldsValue(['manufactorId']);
    const requireInfoFun = (text) => ({
      rules: [{ required: true, message: text }],
    });
    const numValidator = (text) => (rule, value, callback) => {
      !value && callback(`请填写${text}`);
      isNaN(value) && callback('请填写数字');
      callback();
    }
    return (
      <section className={styles.insert}>
        <h3 className={styles.title}>
          <span className={styles.text}>备品备件 - 入库</span>
          <Icon type="arrow-left" onClick={this.backToList} className={styles.backIcon} />
        </h3>
        <Form className={styles.formPart}>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseId', requireInfoFun('请选择仓库名称'))(
              <Select placeholder="请选择" style={{width: 200}} onChange={this.selectWarehouse} disabled={!!originInsertInfo}>
                {warehouseList.map(e => (
                  <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="物品名称">
            {getFieldDecorator('goodsName', requireInfoFun('请选择物品名称'))(
              <AddGood
                goodsList={goodsList}
                addNewGood={addNewGood}
                addGoodName={addGoodName}
                addGoodStatus={addGoodStatus}
                goodsType="101"
                disabled={!!originInsertInfo}
              />
            )}
          </FormItem>
          <FormItem label="厂家">
            {getFieldDecorator('manufactorId', requireInfoFun('请选择厂家'))(
              <Select placeholder="请选择" onChange={this.selectManufacturer} style={{width: 200}} disabled={!!originInsertInfo}>
                {manufacturerList.map(e => (
                  <Option key={e.code} value={e.code}>{e.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="型号">
            {getFieldDecorator('modeId', requireInfoFun('请选择型号'))(
              <Select placeholder="请选择" style={{width: 200}} disabled={!manufactorId || !!originInsertInfo}>
                {insertModes.map(e => (
                  <Option key={e.code} value={e.code}>{e.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="制造商">
            {getFieldDecorator('manufactorName')(
              <Input placeholder="30字以内" style={{width: 200}} disabled={!!originInsertInfo} />
            )}
          </FormItem>
          <FormItem label="供货商">
            {getFieldDecorator('supplierName')(
              <Input placeholder="30字以内" style={{width: 200}} disabled={!!originInsertInfo} />
            )}
          </FormItem>
          <FormItem label="对应生产资产">
            {getFieldDecorator('assetsIds', requireInfoFun('请填写生产资产'))(
              <AssetsSelectTree assetsTree={assetsTree} originInsertInfo={originInsertInfo} />
            )}
          </FormItem>
          <FormItem label="入库数量">
            {getFieldDecorator('entryNum',{
              rules: [{
                required: true,
                validator: numValidator('入库数量'),
              }],
            })(
              <Input placeholder="30字以内" style={{width: 200}} />
            )}
            <span className={styles.prompt}>当前库存量为{originInsertInfo ? originInsertInfo.inventoryNum : 0}</span>
          </FormItem>
          <FormItem label="单价">
            {getFieldDecorator('price', {
              rules: [{
                required: true,
                validator: numValidator('单价'),
              }],
            })(
              <Input placeholder="请输入..." style={{width: 200}} />
            )}
            <span className={styles.prompt}>元</span>
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remarks')(
              <InputLimit placeholder="请输入..." />
            )}
          </FormItem>
        </Form>
        <div className={styles.handlePart}>
          <span className={styles.holder} />
          <Button
            onClick={this.insertSave}
            loading={saveMode === 'once' && insertStatus === 'loading'}
          >保存</Button>
          <Button
            onClick={this.saveAndContinue}
            loading={saveMode === 'more' && insertStatus === 'loading'}
          >保存并继续添加</Button>
        </div>
      </section>
    )
  }
}

export default Form.create()(SpareInsert);
