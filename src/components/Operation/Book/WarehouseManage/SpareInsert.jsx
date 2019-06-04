import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import AddGood from './ManageCommon/AddGood';

const FormItem = Form.Item;
const { Option } = Select;

class SpareInsert extends Component {

  static propTypes = {
    originInsertInfo: PropTypes.object, // 是否编辑状态唯一标识。null: 新入库, object: 编辑信息
    warehouseList: PropTypes.array,
    manufacturerList: PropTypes.array,
    form: PropTypes.object,
    backList: PropTypes.func,
  }

  state = {
    warehouseId: null,
  }

  changeWarehouse = () => { // 仓库选择 并重置物品选择。

  }



  // <FormItem className={styles.formItem} label="解除原因">
  //           {getFieldDecorator('operateReason', {
  //             rules: [{
  //               required: true,
  //               message: '请输入解除原因'
  //             }],
  //           })(
  //             <InputLimit style={{ marginLeft: -80, marginTop: 15 }} placeholder="请输入不超过80字的解除原因..." />
  //           )}
  //         </FormItem>
  // .previous, .next, .backIcon{
  //   font-size: 20px;
  //   cursor: pointer;
  //   color: $darkColor;
  //   height: 100%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  // }
  // .backIcon{
  //   width: 60px;
  //   border-left: solid 1px $promptColor;
  //   margin-left: 20px;
  // }

  backToList = () => {
    this.props.backList();
  }

  render(){
    const { form, warehouseList, manufacturerList } = this.props;
    const { getFieldDecorator } = form;
    const { warehouseId } = this.state;
    return (
      <section>
        <h3>
          <span>备品备件 - 入库</span>
          {/* <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} /> */}
          <Icon type="arrow-left" onClick={this.backToList} />
        </h3>
        <Form>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseId', {
              rules: [{
                required: true,
                message: '请选择仓库名称'
              }],
            })(
              <Select placeholder="请选择" onChange={this.changeWarehouse}>
                {warehouseList.map(e => (
                  <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="物品名称">
            {getFieldDecorator('goodsName', {
              rules: [{
                required: true,
                message: '请选择物品名称'
              }],
            })(
              <AddGood warehouseId={warehouseId} />
            )}
          </FormItem>
          <FormItem label="厂家">
            {getFieldDecorator('manufactorId', {
              rules: [{
                required: true,
                message: '请选择厂家'
              }],
            })(
              <Select placeholder="请选择" onChange={this.changeWarehouse} >
                {manufacturerList.map(e => (
                  <Option key={e.code} value={e.code}>{e.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="型号">
            {getFieldDecorator('modeId', {
              rules: [{
                required: true,
                message: '请选择型号'
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="制造商">
            {getFieldDecorator('manufactorName')(
              <Input />
            )}
          </FormItem>
          <FormItem label="供货商">
            {getFieldDecorator('supplierName')(
              <Input />
            )}
          </FormItem>
          <FormItem label="对应生产资产">
            {getFieldDecorator('assetsIds')(
              <Input />
            )}
          </FormItem>
          <FormItem label="入库数量">
            {getFieldDecorator('entryNum')(
              <Input />
            )}
          </FormItem>
          <FormItem label="单价">
            {getFieldDecorator('price')(
              <Input />
            )}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remarks')(
              <Input />
            )}
          </FormItem>
          <div>
            <Button>保存</Button>
            <Button>保存并继续添加</Button>
          </div>
        </Form>
      </section>
    )
  }
}



export default Form.create()(SpareInsert);