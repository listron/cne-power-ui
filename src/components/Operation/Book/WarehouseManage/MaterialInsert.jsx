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
    insertWarehouse: PropTypes.func,
    changeStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    const { originInsertInfo } = props;
    const inventoryNum = originInsertInfo ? originInsertInfo.inventoryNum : 0;
    this.state = {
      materialNumber: inventoryNum,
      saveMode: '',
    }
  }

  componentDidMount(){
    const { originInsertInfo, form } = this.props; 
    if (originInsertInfo) {// 基于originInsertInfo判断是 入库 or edit再入库
      form.setFieldsValue({
        warehouseId: originInsertInfo.warehouseId,
        goodsType: parseInt(originInsertInfo.goodsType),
        goodsName: originInsertInfo.goodsName,
        devManufactorName: originInsertInfo.devManufactorName,
        modeName: originInsertInfo.modeName,
        manufactorName: '',
        supplierName: '',
      })
    }
  }

  componentDidUpdate(preProps){
    const preInsertStatus = preProps.insertStatus;
    const { insertStatus, form, originInsertInfo } = this.props;
    if ( preInsertStatus === 'loading' && insertStatus === 'success') { // 保存操作请求成功
      const { saveMode } = this.state;
      if (saveMode === 'once') { // 保存 => 清空form并返回
        form.resetFields();
        this.backToList();
      } else if (saveMode === 'more' && !!originInsertInfo) { // 继续添加+再入库 => 清除form可编辑项
        this.recordMaterialNum(); // 更新库存数量
        form.setFieldsValue({
          manufactorName: '',
          supplierName: '',
          entryNum: '',
          price: '',
          remarks: '',
        })
      } else if (saveMode === 'more' && !originInsertInfo) { // 新入库 继续添加 => 清除form数据并清空树。
        form.resetFields();
      }
    }
  }

  recordMaterialNum = () => { // 调整当前库存数量
    const { materialNumber } = this.state;
    const { form } = this.props;
    this.setState({
      materialNumber: parseFloat(materialNumber) + parseFloat(form.getFieldValue('entryNum'))
    })
  }

  backToList = () => {
    this.props.changeStore({
      originInsertInfo: null,
    });
    this.props.backList();
  }

  refreshGoodList = (goodsMaxType) => {
    this.props.getGoodsList({ goodsMaxType })
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
      !err && insertWarehouse({ ...values });
    })
  }

  render(){
    const { saveMode, materialNumber } = this.state;
    const {
      form, tabName, warehouseList, addNewGood, goodsList, addGoodName,
      insertStatus, originInsertInfo, addGoodStatus
    } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { goodsType } = getFieldsValue(['goodsType']);
    const requireInfoFun = (text) => ({
      rules: [{ required: true, message: text }],
    });
    const numValidator = (text) => (rule, value, callback) => {
      !value && callback(`请填写${text}`);
      isNaN(value) && callback('请填写数字');
      callback();
    }
    const goodsInfo = [
      { value: 301, label: '生活物资' },
      { value: 302, label: '办公物资' },
      { value: 303, label: '其他' },
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
              <Select placeholder="请选择" style={{width: 200}} onChange={this.refreshGoodList} disabled={!!originInsertInfo}>
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
                goodsType={goodsType}
                disabled={!!originInsertInfo || !goodsType}
              />
            )}
          </FormItem>
          <FormItem label="厂家">
            {getFieldDecorator('devManufactorName', requireInfoFun('请选择厂家'))(
              <Input placeholder="请输入..." style={{width: 200}} disabled={!!originInsertInfo} />
            )}
          </FormItem>
          <FormItem label="型号">
            {getFieldDecorator('modeName', requireInfoFun('请选择型号'))(
              <Input placeholder="请输入..." style={{width: 200}} disabled={!!originInsertInfo} />
            )}
          </FormItem>
          <FormItem label="制造商">
            {getFieldDecorator('manufactorName')(
              <Input placeholder="30字以内" style={{width: 200}} />
            )}
          </FormItem>
          <FormItem label="供货商">
            {getFieldDecorator('supplierName')(
              <Input placeholder="30字以内" style={{width: 200}} />
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
            {originInsertInfo && <span className={styles.prompt}>当前库存量为{materialNumber}</span>}
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
