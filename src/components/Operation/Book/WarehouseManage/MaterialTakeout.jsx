import React, { Component } from 'react';
import { Icon, Form, Select, Input } from 'antd';
import PropTypes from 'prop-types';
import MaterialDetailsList from './ManageCommon/MaterialDetailsList';
import InputLimit from '../../../Common/InputLimit';
import styles from './warehouseManageComp.scss';
import CneButton from '@components/Common/Power/CneButton';

const FormItem = Form.Item;
const { Option } = Select;

class MaterialTakeout extends Component {

  static propTypes = {
    form: PropTypes.object,
    materialDetailsList: PropTypes.array,
    takeoutStatus: PropTypes.string,
    backList: PropTypes.func,
    originTakeoutInfo: PropTypes.object,
    materialListParams: PropTypes.object,
    changeStore: PropTypes.func,
    getMaterialDetailsList: PropTypes.func,
    takeoutWarehouseMaterial: PropTypes.func,
  }

  componentDidMount() {
    const { getMaterialDetailsList, originTakeoutInfo, materialListParams } = this.props;
    const { inventoryId } = originTakeoutInfo;
    getMaterialDetailsList({ inventoryId, ...materialListParams }); // 该仓库下的物资列表
  }

  componentDidUpdate(preProps) {
    const preStatus = preProps.takeoutStatus;
    const { takeoutStatus } = this.props;
    if (preStatus === 'loading' && takeoutStatus === 'success') {
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
        const { remarks, materialCodes } = values;
        const { inventoryId } = originTakeoutInfo;
        takeoutWarehouseMaterial({
          inventoryId,
          materialCodes: materialCodes.map(e => e.materialCode).join(','),
          remarks,
        });
      }
    });
  }

  render() {
    const { form, originTakeoutInfo, materialDetailsList, takeoutStatus } = this.props;
    const { getFieldDecorator } = form;
    const requireInfoFun = (text, initialValue) => ({
      rules: [{ required: true, message: text }],
      initialValue,
    });
    const goodsInfo = [
      { value: '301', label: '生活物资' },
      { value: '302', label: '办公物资' },
      { value: '303', label: '其他' },
    ];
    return (
      <section className={styles.takeout}>
        <h3 className={styles.title}>
          <span className={styles.text}>物资 - 出库</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backToList} />
        </h3>
        <div className={styles.contWrap}>
          <Form className={styles.formPart}>
            <FormItem label="仓库名称">
              {getFieldDecorator('warehouseId', requireInfoFun('无仓库名称', originTakeoutInfo.warehouseName))(
                <Select style={{ width: 200 }} disabled>
                  <Option value={originTakeoutInfo.warehouseName}>{originTakeoutInfo.warehouseName}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="物品类型">
              {getFieldDecorator('goodsType', requireInfoFun('请选择物品类型', originTakeoutInfo.goodsType))(
                <Select placeholder="请选择" disabled style={{ width: 200 }}>
                  {goodsInfo.map(e => (
                    <Option key={e.value} value={e.value}>{e.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="物品名称">
              {getFieldDecorator('goodsName', requireInfoFun('无物品名称', originTakeoutInfo.goodsName))(
                <Select style={{ width: 200 }} disabled>
                  <Option value={originTakeoutInfo.goodsName}>{originTakeoutInfo.goodsName}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="厂家">
              {getFieldDecorator('devManufactorName', requireInfoFun('无厂家名称', originTakeoutInfo.devManufactorName))(
                <Input style={{ width: 200 }} disabled />
              )}
            </FormItem>
            <FormItem label="型号">
              {getFieldDecorator('modeName', requireInfoFun('无型号', originTakeoutInfo.modeName))(
                <Input style={{ width: 200 }} disabled />
              )}
            </FormItem>
            <FormItem label="物资编码" className={styles.materialCodes}>
              {getFieldDecorator('materialCodes', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    (!value || value.length === 0) && callback('请选择物资');
                    callback();
                  },
                }],
              })(
                <MaterialDetailsList
                  {...this.props}
                  total={originTakeoutInfo.inventoryNum}
                  inventoryId={originTakeoutInfo.inventoryId}
                />
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
            <CneButton className={styles.saveButon} onClick={this.takeoutSave} loading={takeoutStatus === 'loading'}>保存</CneButton>
          </div>
        </div>
      </section>
    );
  }
}

export default Form.create()(MaterialTakeout);
