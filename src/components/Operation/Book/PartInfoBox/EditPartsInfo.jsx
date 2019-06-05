import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import ShowAddPartsModeModal from "./ShowAddPartsModeModal";
import ShowAddFactor from "./ShowAddFactor";
import { Button, Table, Icon, Input, Form, Select, TreeSelect } from 'antd';
import WarningTip from '../../../../components/Common/WarningTip';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;

class EditPartsInfo extends React.Component {
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    editPartInfo: PropTypes.func,
    getPartsAssetTree: PropTypes.func,
    getPartsFactorsList: PropTypes.func,
    onShowSideChange: PropTypes.func,
    getfactorsPartsMode: PropTypes.func,
    addPartInfo: PropTypes.func,
    form: PropTypes.object,
    detailPartsRecord: PropTypes.object,
    partsFactorsList: PropTypes.array,
    factorsPartsMode: PropTypes.array,
    assetList: PropTypes.array,
    
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }
  }
  componentDidMount() {
  
  }
  backToList = () => {
    this.props.changePartInfoStore({ showPage: 'list' });
    this.props.onShowSideChange('list');
  }
  showAddPartsMode = () => {
    this.setState({
      showAddPartsMode: true
    })
  }
  cancleDeviceModeModal = () => {
    this.setState({
      showAddPartsMode: false,
    })
  }
  showAddfactors = () => {
    this.setState({
      showAddfactorsModal: true
    })
  }
  cancleFactorModal = () => {
    this.setState({
      showAddfactorsModal: false,
    })
  }
  changeFactors = (value) => {
    this.props.getfactorsPartsMode({
      manufactorId: value,
      assetsId: '',
    })
  }
  submitForm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.editPartInfo({
          ...values,
          partsId:this.props.detailPartsRecord.partsId
        })
        this.props.changePartInfoStore({ showPage: 'list' })
      }
    })
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
    let { partsFactorsList, assetList, factorsPartsMode, detailPartsRecord } = this.props;
    const { stationName, deviceName, partsName, batchNumber, supplierName,madeName,assetsIds,partsModeId,manufactorId ,partsModeName} = detailPartsRecord

    const { getFieldDecorator, getFieldValue } = this.props.form;
    let { showWarningTip, warningTipText, showAddPartsMode, showAddfactorsModal } = this.state;
    let manufacturerValue = getFieldValue('manufactorId');
   //新加的厂家应该反回一个Id，如果有则赋值给厂家，当先添加组件型号时，拿到选择的厂家，然后赋值。
    return (
      <div className={styles.editDevice}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
        </div>
        <Form className={styles.editPart}>
          <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('stationCode')(
              <span>{stationName}</span>
            )}
          </FormItem>
          <FormItem label="上级设备" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('deviceCodes')(
              <span>{deviceName}</span>
            )}
          </FormItem>
          <FormItem label="部件名称" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('partsName', {
              initialValue: partsName,
              rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
            })(
              <Input placeholder="不超过30字" />
            )}
          </FormItem>

          <FormItem label="部件厂家" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('manufactorId', {
              initialValue: manufactorId,
              rules: [{ required: true, message: '请选择部件厂家', }],
            })(
              <Select className={styles.modelSelect} placeholder="请选择部件厂家" onChange={this.changeFactors} disabled={partsFactorsList.length === 0}>
                <Option key={'all'} value={''}>请选择部件厂家</Option>
                {partsFactorsList.map((e, i) => {
                  if (!e) { return null; } else {
                    return <Option key={e.manufactorCode} value={e.manufactorId}>{e.manufactorName}</Option>
                  }
                })}
              </Select>
            )}
            {<span className={styles.fontColor} onClick={this.showAddfactors}><Icon type="plus-circle" /></span>}
          </FormItem>

          <FormItem label="部件型号" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('modeId', {
              initialValue: partsModeId,
              rules: [{ required: true, message: '请选择部件型号' }],
            })(
              <Select className={styles.modelSelect} placeholder="请选择部件型号" onChange={this.changeDeviceMode} disabled={false}>
                <Option key={'all'} value={''}>请选择部件型号</Option>
                {factorsPartsMode.map((e, i) => {
                  if (!e) { return null; } else {
                    return <Option key={e.modeId} value={e.modeId}>{e.deviceModeName}</Option>
                  }
                })}
              </Select>
            )}
            <span className={styles.fontColor} onClick={this.showAddPartsMode}><Icon type="plus-circle" /></span>
          </FormItem>
          <FormItem label="批次号" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('batchNumber', {
              initialValue: batchNumber,
              rules: [{ message: '请正确填写,不超过30字', type: "string", max: 30, }],
            })(
              <Input placeholder="不超过30字" />
            )}
          </FormItem>
          <FormItem label="生产资产" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('assetsId', {
              initialValue: assetsIds,
              rules: [{ message: '请正确填写,不超过30字', }],
            })(
              <TreeSelect
                // showSearch
                style={{ width: 194 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请输入父节点"
                onChange={this.onChange}
              >
                <TreeNode title="生产资产" key="0" value={'0'} >
                  {this.renderTreeNodes(assetList)}
                </TreeNode>
              </TreeSelect>
            )}
          </FormItem>
          <FormItem label="制造商" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('madeName', {
               initialValue: madeName,
              rules: [{ message: '请正确填写,不超过30字', type: "string", max: 30, }],
            })(
              <Input placeholder="不超过30字" />
            )}
          </FormItem>
          <FormItem label="供货商" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('supplierName', {
              initialValue: supplierName,
              rules: [{ message: '请正确填写,不超过30字', type: "string", max: 30, }],
            })(
              <Input placeholder="不超过30字" />
            )}
          </FormItem>
          <div className={styles.submitStyle}>
            <Button onClick={this.submitForm} className={styles.editSave}>保存</Button>
            {/* <Button onClick={this.nextAdd} className={styles.leftsave} >保存并继续添加</Button> */}
          </div>
        </Form>
        {showAddPartsMode && <ShowAddPartsModeModal {...this.props} showAddPartsMode={showAddPartsMode} cancleDeviceModeModal={this.cancleDeviceModeModal} manufacturerValue={manufacturerValue} />}
        {showAddfactorsModal && <ShowAddFactor {...this.props} showAddfactorsModal={showAddfactorsModal} cancleFactorModal={this.cancleFactorModal} />}
      </div>
    )
  }
}
export default Form.create()(EditPartsInfo)