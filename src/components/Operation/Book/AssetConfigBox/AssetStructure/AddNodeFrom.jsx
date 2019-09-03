import React from 'react';
import PropTypes from 'prop-types';
import styles from './assetStructure.scss';
import WarningTip from '../../../../Common/WarningTip';

import { Button, Input, Form, Icon, Select, InputLimit, TreeSelect, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class AddNodeFrom extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
    closeFrom: PropTypes.func,
    getNodeDetail: PropTypes.func,
    deleteAssetNode: PropTypes.func,
    stationType: PropTypes.number,
    assetsParentId: PropTypes.string,
    stationTypeCount: PropTypes.string,
    assetsId: PropTypes.string,
    assetList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }
  onConfirmWarningTip = () => {

    this.setState({
      showWarningTip: false,
      warningTipText: '',
    });
    this.props.closeFrom();
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false,
    });
  }
  submitForm = (e) => {
    const { stationType, assetsId, childrenNum } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      const parentLeavel = values.assetsId.split('_')[0].split(',').length;
      if (!err) {
        parentLeavel + 1 < 7 ?
          this.props.addAssetNode({ ...values, stationType }) : message.error('超出6级，重新选择父节点');
        this.props.closeFrom();
      }
    });
  }
  closeFrom = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确定关闭,关闭后数据不会被保存',
    });
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
        <TreeNode title={item.assetsName} key={item.assetName} value={item.assetsId} >
          {this.renderTreeNodes(item.childernNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.assetsName} key={item.assetName} value={item.assetsId} />;
  })
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { assetList, assetsId } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.addNodeFrom}>
        <div className={styles.title}>
          <div className={styles.leftText}>添加子节点</div>
          <div className={styles.iconstyles} onClick={this.closeFrom}><Icon type="close" /></div>
        </div>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '240px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
        <div className={styles.contantBox}>
          <div className={styles.contant}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="父节点名称">
                {getFieldDecorator('assetsId', {
                  initialValue: assetsId,
                  rules: [{
                    required: true,
                    message: '请输入缺陷描述',

                  }],
                })(

                  <TreeSelect
                    // showSearch
                    style={{ width: 194 }}
                    // value={this.state.value}
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
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: 'string', max: 30, validator: this.childrenFunc }],
                })(
                  <Input placeholder="30字以内" />
                )}
              </FormItem>

              <FormItem label="分类" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('assetsType', {
                  rules: [{ required: true, message: '请选择分类', type: 'string', max: 30 }],
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
                  rules: [{ message: '请填写正确的计量单位6字以内', type: 'string', max: 6 }],
                })(
                  <Input placeholder="6字以内" />
                )}
              </FormItem>
              <Button className={styles.saveStyle} onClick={this.submitForm} >添加</Button>

            </Form>

          </div>
        </div>

      </div>

    );
  }
}
export default Form.create()(AddNodeFrom);
