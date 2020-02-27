import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import AddGood from './ManageCommon/AddGood';
import AddManu from './ManageCommon/AddManu';
import AddType from './ManageCommon/AddType';
import AssetsSelectTree from './ManageCommon/AssetsSelectTree';
import InputLimit from '../../../Common/InputLimit';
import styles from './warehouseManageComp.scss';

const FormItem = Form.Item;
const { Option } = Select;

class SpareInsert extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    insertStatus: PropTypes.string,
    addGoodName: PropTypes.string,
    addGoodStatus: PropTypes.string,
    addManuStatus: PropTypes.string,
    addTypeStatus: PropTypes.string,
    addManufactorId: PropTypes.string,
    adddModeName: PropTypes.string,
    originInsertInfo: PropTypes.object, // 是否编辑状态唯一标识。null: 新入库, object: 编辑信息
    warehouseList: PropTypes.array,
    insertModes: PropTypes.array,
    goodsList: PropTypes.array,
    assetsManufac: PropTypes.array,
    assetsTree: PropTypes.array,
    mainDeviceEditCodes: PropTypes.array,
    form: PropTypes.object,
    backList: PropTypes.func,
    addNewGood: PropTypes.func,
    addNewManu: PropTypes.func,
    addNewType: PropTypes.func,
    getGoodsList: PropTypes.func,
    getModes: PropTypes.func,
    getWarehouseStationType: PropTypes.func,
    getAssetsManufacture: PropTypes.func,
    insertWarehouse: PropTypes.func,
    changeStore: PropTypes.func,
    getManufactures: PropTypes.func,
    getMainDeviceEditCodes: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { originInsertInfo } = props;
    const inventoryNum = originInsertInfo ? originInsertInfo.inventoryNum : 0;
    this.state = {
      spareNumber: inventoryNum,
      saveMode: '',
      addManufactorRight: true, // 默认无添加厂家权限。
    };
  }

  componentDidMount() {
    const { originInsertInfo, form, getGoodsList, getMainDeviceEditCodes } = this.props;
    getMainDeviceEditCodes();
    getGoodsList({ goodsMaxType: 101 });
    if (originInsertInfo) {// 基于originInsertInfo判断是 入库 or edit再入库
      form.setFieldsValue({
        warehouseId: originInsertInfo.warehouseId,
        goodsName: originInsertInfo.goodsName,
        manufactorId: originInsertInfo.manufactorId,
        modeId: originInsertInfo.modeId,
        manufactorName: '',
        supplierName: '',
        assetsIds: originInsertInfo.assetsIds,
      });
    }
  }

  componentDidUpdate(preProps) {
    const preInsertStatus = preProps.insertStatus;
    const { insertStatus, form, changeStore, originInsertInfo } = this.props;
    if (preInsertStatus === 'loading' && insertStatus === 'success') { // 保存操作请求成功
      const { saveMode } = this.state;
      if (saveMode === 'once') { // 保存 => 清空form并返回
        form.resetFields();
        this.backToList();
      } else if (saveMode === 'more' && !!originInsertInfo) { // 继续添加+再入库 => 清除form可编辑项
        this.recordSpareNum(); // 更新库存数量
        form.setFieldsValue({
          manufactorName: '',
          supplierName: '',
          entryNum: '',
          price: '',
          remarks: '',
        });
      } else if (saveMode === 'more' && !originInsertInfo) { // 新入库 继续添加 => 清除form数据并清空树。
        form.resetFields();
        changeStore({ assetsTree: [] });
      }
    }
  }

  recordSpareNum = () => { // 调整当前库存数量
    const { spareNumber } = this.state;
    const { form } = this.props;
    this.setState({
      spareNumber: parseFloat(spareNumber) + parseFloat(form.getFieldValue('entryNum')),
    });
  }

  backToList = () => {
    this.props.changeStore({
      assetsTree: [],
      assetsManufac: [],
      originInsertInfo: null,
    }); // 树清空
    this.props.backList();
  }

  selectWarehouse = (warehouseId) => { // 仓库 => 下物品 + 所有生产资产
    const { getWarehouseStationType, form } = this.props;
    form.setFieldsValue({ // 仓库选择后，应清空厂家和型号。
      assetsIds: [],
      manufactorId: undefined, // 清除已选择的厂家
      modeId: undefined, // 清除已选择的型号
    });
    getWarehouseStationType({ warehouseId });
  }

  selectAssets = (assetsIds) => {
    this.props.changeStore({ assetsManufac: [] });
    this.props.form.setFieldsValue({
      assetsIds,
      manufactorId: undefined, // 清除已选择的厂家
      modeId: undefined, // 清除已选择的型号
    });
    this.props.getAssetsManufacture({ assetsIds });
  }

  changeManufactorRight = (addManufactorRight) => { // 选中生产资产时，判断是否可添加厂家。
    this.setState({ addManufactorRight });
  }

  selectManufacturer = (selectedManufacturer) => { // 选择厂家
    this.props.form.setFieldsValue({
      modeId: undefined, // 清除已选择的型号
    });
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
      const assetsTotal = values.assetsIds[0] || '';
      const assetsArr = assetsTotal.split(',').filter(e => !!e);
      const assetsIds = assetsArr[assetsArr.length - 1];
      !err && insertWarehouse({ ...values, assetsIds });
    });
  }

  render() {
    const { saveMode, spareNumber, addManufactorRight } = this.state;
    const {
      form, tabName, warehouseList, assetsManufac, addNewGood, goodsList, addGoodName, insertModes, assetsTree, insertStatus, originInsertInfo, addGoodStatus, addNewManu, addManufactorId, addManuStatus, getManufactures, addNewType, addTypeStatus, adddModeName,
      mainDeviceEditCodes,
    } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { manufactorId, assetsIds } = getFieldsValue(['manufactorId', 'assetsIds']);
    const requireInfoFun = (text) => ({
      rules: [{ required: true, message: text }],
    });
    return (
      <section className={styles.insert}>
        <h3 className={styles.title}>
          <span className={styles.text}>备品备件 - 入库</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.backToList} />
        </h3>
        <Form className={styles.formPart}>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseId', requireInfoFun('请选择仓库名称'))(
              <Select placeholder="请选择" style={{ width: 200 }} onChange={this.selectWarehouse} disabled={!!originInsertInfo}>
                {warehouseList.map(e => (
                  <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="物品名称">
            {getFieldDecorator('goodsName', requireInfoFun('请选择物品名称'))(
              <AddGood
                goodsType={101}
                goodsList={goodsList}
                addNewGood={addNewGood}
                addGoodName={addGoodName}
                addGoodStatus={addGoodStatus}
                tabName={tabName}
                disabled={!!originInsertInfo}
              />
            )}
          </FormItem>
          <FormItem label="对应生产资产">
            {getFieldDecorator('assetsIds', requireInfoFun('请填写生产资产'))(
              <AssetsSelectTree
                mainDeviceEditCodes={mainDeviceEditCodes}
                assetsTree={assetsTree}
                originInsertInfo={originInsertInfo}
                onChange={this.selectAssets}
                changeManufactorRight={this.changeManufactorRight}
              />
            )}
          </FormItem>
          <FormItem label="厂家">
            {getFieldDecorator('manufactorId', requireInfoFun('请选择厂家'))(
              !!originInsertInfo ? <Select placeholder="请选择"
                onChange={this.selectManufacturer}
                style={{ width: 200 }}
                disabled
              >
                <Option value={originInsertInfo.manufactorId}>{originInsertInfo.devManufactorName}</Option>
              </Select> : <AddManu
                  addManufactorRight={addManufactorRight}
                  assetsManufac={assetsManufac}
                  addNewManu={addNewManu}
                  addManufactorId={addManufactorId}
                  addManuStatus={addManuStatus}
                  tabName={tabName}
                  disabled={!assetsIds || assetsIds.length === 0}
                  assetsIds={assetsIds}
                  getManufactures={getManufactures}
                  getModes={this.selectManufacturer}
                />
            )}
          </FormItem>
          <FormItem label="型号">
            {getFieldDecorator('modeId', requireInfoFun('请选择型号'))(
              !!originInsertInfo ? <Select placeholder="请选择" style={{ width: 200 }} disabled>
                <Option value={originInsertInfo.modeId}>{originInsertInfo.modeName}</Option>
              </Select> : <AddType
                  insertModes={insertModes}
                  addNewType={addNewType}
                  addTypeStatus={addTypeStatus}
                  adddModeName={adddModeName}
                  disabled={!manufactorId}
                  assetsId={assetsIds}
                  manufactorInfo={assetsManufac.find(e => e.manufactorId === manufactorId) || {}}
                />
            )}
          </FormItem>
          <FormItem label="制造商">
            {getFieldDecorator('manufactorName')(
              <Input placeholder="30字以内" style={{ width: 200 }} />
            )}
          </FormItem>
          <FormItem label="供货商">
            {getFieldDecorator('supplierName')(
              <Input placeholder="30字以内" style={{ width: 200 }} />
            )}
          </FormItem>
          <FormItem label="入库数量">
            {getFieldDecorator('entryNum', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  !value && callback('请填写入库数量');
                  isNaN(value) && callback('请填写数字');
                  value >= 1000 && callback('数据过大');
                  value.includes('.') && callback('入库数量必须是整数');
                  value < 0 && callback('不能为负数');
                  callback();
                },
              }],
            })(
              <Input placeholder="30字以内" style={{ width: 200 }} />
            )}
            {originInsertInfo && <span className={styles.prompt}>当前库存量为{spareNumber}</span>}
          </FormItem>
          <FormItem label="单价">
            {getFieldDecorator('price', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  !value && callback('请填写单价');
                  isNaN(value) && callback('请填写数字');
                  value >= 1000000000 && callback('数据过大');
                  value.includes('.') && value.split('.')[1].length > 4 && callback('不可超出4位小数');
                  value < 0 && callback('不能为负数');
                  callback();
                },
              }],
            })(
              <Input placeholder="请输入..." style={{ width: 200 }} />
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
    );
  }
}

export default Form.create()(SpareInsert);
