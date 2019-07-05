import React, { Component } from 'react';
import { Icon, Form, Select, Button, Input } from 'antd';
import PropTypes from 'prop-types';
import MaterialDetailsList from './ManageCommon/MaterialDetailsList';
import InputLimit from '../../../Common/InputLimit';
import styles from './warehouseManageComp.scss';

const FormItem = Form.Item;
const { Option } = Select;

class ToolTakeout extends Component {

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
    getMaterialDetailsList({ inventoryId }); // 该仓库下的物资列表
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
      if (!err) {
        const { remarks, materialCodes, entryType } = values;
        const { inventoryId } = originTakeoutInfo;
        takeoutWarehouseMaterial({
          inventoryId,
          entryType,
          materialCodes: materialCodes.map(e => e.materialCode).join(','),
          remarks,
        });
      }
    });
  }

  render(){
    const { form, originTakeoutInfo, materialDetailsList, takeoutStatus } = this.props;
    const { getFieldDecorator } = form;
    const requireInfoFun = (text, initialValue) => ({
      rules: [{ required: true, message: text }],
      initialValue,
    });
    const goodsInfo = [
      { value: '201', label: '安全工器具' },
      { value: '202', label: '检修工器具' },
      { value: '203', label: '仪器仪表' },
    ];
    return (
      <section className={styles.takeout}>
        <h3 className={styles.title}>
          <span className={styles.text}>工器具 - 损耗</span>
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
          <FormItem label="物品类型">
            {getFieldDecorator('goodsType', requireInfoFun('请选择物品类型', originTakeoutInfo.goodsType))(
              <Select placeholder="请选择" style={{width: 200}} disabled>
                {goodsInfo.map(e => (
                  <Option key={e.value} value={e.value}>{e.label}</Option>
                ))}
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
            {getFieldDecorator('devManufactorName', requireInfoFun('无厂家名称', originTakeoutInfo.devManufactorName))(
              <Input style={{width: 200}} disabled />
            )}
          </FormItem>
          <FormItem label="型号">
            {getFieldDecorator('modeName', requireInfoFun('无型号', originTakeoutInfo.modeName))(
              <Input style={{width: 200}} disabled />
            )}
          </FormItem>
          <FormItem label="损耗类型">
            {getFieldDecorator('entryType', requireInfoFun('请选择损耗类型'))(
              <Select style={{width: 200}}>
                <Option value={1}>丢失</Option>
                <Option value={2}>损坏</Option>
                <Option value={3}>报废</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="损耗数量" className={styles.materialCodes}>
            {getFieldDecorator('materialCodes', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  (!value || value.length === 0) && callback('请选择物资');
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
    );
  }
}

export default Form.create()(ToolTakeout);
