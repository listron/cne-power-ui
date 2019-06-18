import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import AddGood from './ManageCommon/AddGood';
import InputLimit from '../../../Common/InputLimit';
import styles from './warehouseManageComp.scss';

const FormItem = Form.Item;
const { Option } = Select;

class MaterialInsert extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    insertStatus: PropTypes.string,
    addGoodName: PropTypes.string,
    addGoodStatus: PropTypes.string,
    originInsertInfo: PropTypes.object, // 是否编辑状态唯一标识。null: 新入库, object: 编辑信息
    stations: PropTypes.array,
    warehouseList: PropTypes.array,
    insertModes: PropTypes.array,
    goodsList: PropTypes.array,
    manufacturerList: PropTypes.array,
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
    getGoodsList({ goodsMaxType: 300 });
    if (originInsertInfo) {// 基于originInsertInfo判断是 入库 or edit再入库
      form.setFieldsValue({
        warehouseId: originInsertInfo.warehouseId,
        goodsType: parseInt(originInsertInfo.goodsType),
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
    const { insertStatus, form } = this.props;
    if ( preInsertStatus === 'loading' && insertStatus === 'success') { // 保存操作请求成功
      const { saveMode } = this.state;
      form.resetFields(); // form内数据需重置
      if (saveMode === 'once') {
        this.backToList();
      }
    }
  }

  backToList = () => {
    this.props.changeStore({
      originInsertInfo: null,
    });
    this.props.backList();
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
      insertWarehouse({ ...values });
    })
  }

  render(){
    const { saveMode } = this.state;
    const {
      form, tabName, warehouseList, manufacturerList, addNewGood, goodsList, addGoodName, insertModes,
      insertStatus, originInsertInfo, addGoodStatus
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
    const goodsInfo = [
      { value: 201, label: '安全工器具' },
      { value: 202, label: '检修工器具' },
      { value: 203, label: '仪器仪表' },
    ];
    return (
      <section className={styles.insert}>
        <h3 className={styles.title}>
          <span className={styles.text}>物资 - 入库</span>
          <Icon type="arrow-left" onClick={this.backToList} className={styles.backIcon} />
        </h3>
        <Form className={styles.formPart}>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseId', requireInfoFun('请选择仓库名称'))(
              <Select placeholder="请选择" style={{width: 200}} disabled={!!originInsertInfo}>
                {warehouseList.map(e => (
                  <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="物品类型">
            {getFieldDecorator('goodsType', requireInfoFun('请选择物品类型'))(
              <Select placeholder="请选择" style={{width: 200}} disabled={!!originInsertInfo}>
                {goodsInfo.map(e => (
                  <Option key={e.value} value={e.value}>{e.label}</Option>
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
                tabName={tabName}
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

export default Form.create()(MaterialInsert);
