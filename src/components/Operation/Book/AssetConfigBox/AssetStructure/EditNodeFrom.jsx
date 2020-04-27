import React from 'react';
import PropTypes from 'prop-types';
import styles from './assetStructure.scss';

import { Input, Form, Select, TreeSelect, message } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
class EditNodeFrom extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
    closeFrom: PropTypes.func,
    getNodeDetail: PropTypes.func,
    deleteAssetNode: PropTypes.func,
    editAssetNode: PropTypes.func,
    stationType: PropTypes.number,
    childrenNum: PropTypes.number,
    assetsParentId: PropTypes.string,
    stationTypeCount: PropTypes.string,
    assetsName: PropTypes.string,
    assetsId: PropTypes.string,
    assetList: PropTypes.array,
    form: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }
  submitForm = (e) => {
    const { stationType, assetsId, childrenNum } = this.props;
    const assetsParentId = assetsId;//把被选中的当前节点，更换成后台要的字段。
    this.props.form.validateFieldsAndScroll((err, values) => {
      //当前父节点所处的第几级+下面还有多少子节点，
      //父节点可以通过id长度来判断，
      const parentLeavel = values.assetsId.split(',').length;
      const maxNum = parentLeavel + childrenNum;
      if (!err) {
        maxNum < 7 ? this.props.editAssetNode({ ...values, stationType, assetsParentId }) : message.error('超出六级，重新选择');
      }
    });
  }
  recoveryForm = () => {
    const { assetsId, assetsName } = this.props;
    const assetsIdArr = assetsId.split(',');
    assetsIdArr.pop();
    const assetsParentId = assetsIdArr.toString();
    this.props.form.setFieldsValue({
      assetsId: assetsParentId,
      assetsName,
    });
  }
  closeFrom = () => {
    this.props.closeFrom();
  }
  parentFunc = (rule, value, callback) => {
    if (value === '父级名称') {
      rule.message = '不能子节点名称相同';
      callback(rule.message);
      return;
    }
    callback();
  }
  childrenFunc = (rule, value, callback) => {
    if (value === '父级名称') {
      rule.message = '不能父级名称相同';
      callback(rule.message);
      return;
    } else if (value.length > 30) {
      rule.message = '不能超过30字';
      callback(rule.message);
    }
    callback();
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.childernNodes) {
      return (
        <TreeNode title={item.assetsName} key={item.assetName} value={`${item.assetsId}`} >
          {this.renderTreeNodes(item.childernNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.assetsName} key={item.assetName} value={item.assetsId} />;
  })
  render() {
    const { getFieldDecorator } = this.props.form;
    const { assetList, assetsName, assetsId, assetsUnit, childrenNum, assetsType, isBuild } = this.props;
    //childrenNum为当前节点的子节点数。
    //assetsId是当前节点所有的父节点+当前节点id,去除最后一项得到父节点id
    //assetsParentId是当前选中节点的父节点Id
    const assetsIdArr = assetsId.split(',');
    assetsIdArr.pop();
    const assetsParentId = assetsIdArr.toString();
    return (
      <div className={styles.editNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>当前节点编辑</div>
        </div>
        <div className={styles.contantBox}>
          <div className={styles.contant}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="父节点名称">
                {getFieldDecorator('assetsId', {
                  initialValue: `${assetsParentId}`,
                  rules: [{
                    required: true,
                    message: '请输入缺陷描述',
                    validator: this.parentFunc,
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
                  initialValue: assetsName,
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: 'string', max: 30, validator: this.childrenFunc }],
                })(
                  <Input disabled={!this.props.isBuild} placeholder="30字以内" />
                )}
              </FormItem>

              <FormItem label="分类" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsType', {
                  initialValue: assetsType,
                  rules: [{ required: true, message: '请选择分类' }],
                })(
                  <Select style={{ width: 194 }} disabled={!isBuild}>
                    <Option value={1}>系统</Option>
                    <Option value={2}>设备</Option>
                    <Option value={3}>部件</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="计量单位" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsUnit', {
                  initialValue: assetsUnit,
                  rules: [{ message: '请填写正确的计量单位6字以内', type: 'string', max: 6 }],
                })(
                  <Input disabled={!isBuild} placeholder="6字以内" />
                )}
              </FormItem>
              <div className={styles.editSaveButton}>
                {/*这里恢复是设置父节点和节点名为初始值，setFieldsValue */}
                <CneButton className={styles.restore} onClick={this.recoveryForm} >恢复</CneButton>
                <CneButton className={styles.saveButton} onClick={this.submitForm} >保存</CneButton>
              </div>
            </Form>

          </div>
        </div>

      </div>

    );
  }
}
export default Form.create()(EditNodeFrom);
