import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";

import { Button, Input, Form, Icon, Select, InputLimit, TreeSelect } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;


class EditNodeFrom extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
    closeFrom: PropTypes.func,
    getNodeDetail: PropTypes.func,
    deleteAssetNode: PropTypes.func,
    stationType: PropTypes.number,
    assetsParentId: PropTypes.string,
    stationTypeCount: PropTypes.string,
    assetsName: PropTypes.string,
    assetList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
  submitForm = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values: ', values);
      if (!err) {
        console.log('发送请求，并且刷新别的数据')
      }
    });
  }
  closeFrom = () => {
    this.props.closeFrom();
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.childernNodes) {
      return (
        <TreeNode title={item.assetsName} key={item.assetName} value={item.assetsId} >
          {this.renderTreeNodes(item.childernNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.assetsName} key={item.assetName} value={item.assetsId} />;
  })
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { assetList ,assetsName,assetsId} = this.props;
    console.log('assetsId: ', assetsId);
    const assetsParentId=assetsId.split(',')
    console.log('assetsParentId: ', assetsParentId);
    return (
      <div className={styles.editNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>当前节点编辑</div>
        </div>
        <div className={styles.contantBox}>
          <div className={styles.contant}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="父节点名称">
                {getFieldDecorator('assetsParentId', {initialValue:'0,1',
                  rules: [{
                    required: true,
                    message: '请输入缺陷描述'
                  }],
                })(
                  <TreeSelect
                    // showSearch
                    style={{ width: 194 }}
                   
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请输入父节点"
                    // allowClear
                    // treeDefaultExpandAll
                    onChange={this.onChange}
                  >
                    <TreeNode title="生产资产" key="0" value={'0'} >
                      {this.renderTreeNodes(assetList)}
                    </TreeNode>
                  </TreeSelect>
                )}
              </FormItem>


              <FormItem label="节点名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsName', {
                 initialValue:assetsName ,
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
                })(
                  <Input placeholder="30字以内" />
                )}
              </FormItem>

              <FormItem label="分类" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsType', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
                })(
                  <Select style={{ width: 194 }}>
                    <Option value="1">系统</Option>
                    <Option value="2">设备</Option>
                    <Option value="3">部件</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="计量单位" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsUnit', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 6, }],
                })(
                  <Input placeholder="6字以内" />
                )}
              </FormItem>
              <div className={styles.editSaveButton}>
                <Button className={styles.restore} onClick={this.submitForm} >恢复</Button>
                <Button className={styles.saveButton} onClick={this.submitForm} >保存</Button>
              </div>
            </Form>

          </div>
        </div>

      </div>

    )
  }
}
export default Form.create()(EditNodeFrom)