import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";

import { Button, Input, Form, Icon, Select, InputLimit, TreeSelect,message } from 'antd';

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
    const{stationType,assetsId,childrenNum}=this.props;
    console.log('childrenNum子节点的最大子节点数: ', childrenNum);
    console.log('assetsId: ', assetsId);
    this.props.form.validateFieldsAndScroll((err, values) => {
      //判断父节点的子节点数+当前节点+当前节点的子节点数<6,可以把选中的父节点还有其子节点数用字符串拼起来当作key值
      console.log('values: ', values);
      values.assetsParentId=values.assetsParentId.split('_')[0];
      const parentLeavel=values.assetsParentId.split('_')[0].split(',').length;
      // console.log('test: ', test);
      // const =test.length;
      console.log('parentLeavel: ', parentLeavel);
      const maxNum=parentLeavel+childrenNum;
      console.log('maxNum: ', maxNum);
      if (!err) {
        maxNum<7?this.props.editAssetNode({...values,stationType,assetsId}): message.error('超出六级，重新选择')
        console.log('判断条件，比如子节点相加不能大于6，发送请求，并且刷新别的数据')
      }
    });
  }
  recoveryForm=()=>{
    const {assetsId,assetsName}=this.props;
    let assetsIdArr=assetsId.split(',');
    assetsIdArr.pop();
    const assetsParentId=assetsIdArr.toString();
    console.log('assetsParentId: ', assetsParentId);
    this.props.form.setFieldsValue({
      assetsParentId:assetsParentId,
      assetsName

    })
  }
  closeFrom = () => {
    this.props.closeFrom();
  }
  parentFunc=(rule,value,callback)=>{
    console.log('value: ', value);
    if (value==='父级名称') {
      rule.message='不能子节点名称相同'
      callback(rule.message);
      return;
    }
    callback();
  }
 
  childrenFunc=(rule,value,callback)=>{
    console.log('callback: ', callback);
    console.log('value: ', value);
    console.log('rule: ', rule);
    if (value==='父级名称') {
      rule.message='不能父级名称相同'
      callback(rule.message);
      return;
    }else if(value.length>30){
      rule.message='不能超过30字';
      callback(rule.message);
    }
    callback();

  }
  renderTreeNodes = data => data.map((item) => {
    if (item.childernNodes) {
      return (
        <TreeNode title={item.assetsName} key={item.assetName} value={`${item.assetsId}_${item.childNodeNum}`} >
          {this.renderTreeNodes(item.childernNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.assetsName} key={item.assetName} value={item.assetsId} />;
  })
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { assetList ,assetsName,assetsId,childrenNum} = this.props;
    //childrenNum为当前节点的子节点数。
    //assetsId是当前节点所有的父节点+当前节点id,去除最后一项得到父节点id
     //assetsParentId是当前选中节点的父节点Id
    let assetsIdArr=assetsId.split(',');
    assetsIdArr.pop();
    const assetsParentId=assetsIdArr.toString();
    return (
      <div className={styles.editNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>当前节点编辑</div>
        </div>
        <div className={styles.contantBox}>
          <div className={styles.contant}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="父节点名称">
                {getFieldDecorator('assetsParentId', {
                  initialValue:`${assetsParentId}_${+childrenNum+1}`,
                  rules: [{
                    required: true,
                    message: '请输入缺陷描述',
                    validator:this.parentFunc
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
                    <TreeNode title="生产资产" key="0" value={'0_5'} >
                      {this.renderTreeNodes(assetList)}
                    </TreeNode>
                  </TreeSelect>
                )}
              </FormItem>


              <FormItem label="节点名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsName', {
                 initialValue:assetsName ,
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30,validator:this.childrenFunc }],
                })(
                  <Input disabled={!this.props.isBuild} placeholder="30字以内" />
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
              {/*这里恢复是设置父节点和节点名为初始值，setFieldsValue */}
                <Button className={styles.restore} onClick={this.recoveryForm} >恢复</Button>
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