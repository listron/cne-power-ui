import React from 'react';
import PropTypes from 'prop-types';
import styles from './partInfoBox.scss';
import ShowAddPartsModeModal from './ShowAddPartsModeModal';
import ShowAddFactor from './ShowAddFactor';

import { Button, Icon, Input, Form, Select, TreeSelect } from 'antd';

import WarningTip from '../../../../components/Common/WarningTip';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
class AddPartsInfo extends React.Component {
  static propTypes = {
    changePartInfoStore: PropTypes.func,
    getPartsFactorsList: PropTypes.func,
    getPartsAssetTree: PropTypes.func,
    form: PropTypes.object,
    addPartInfo: PropTypes.func,
    getfactorsPartsMode: PropTypes.func,
    partsFactorsList: PropTypes.array,
    factorsPartsMode: PropTypes.array,
    partAssetsTree: PropTypes.array,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      showAddPartsMode: false,
      showAddfactorsModal: false,
    };
  }

  onChangeAssets = value => {
    const { getPartsFactorsList, deviceTypeCode } = this.props;

    getPartsFactorsList({
      deviceTypeCode: '',
      orderField: '1',
      orderMethod: 'desc',
      assetsId: value,
    });
  };
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changePartInfoStore({
      showPage: 'list',
    });
  };
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  };
  backToList = () => {
    this.setState({
      showWarningTip: true,
    });
    // this.props.changePartInfoStore({ showPage: 'list' });
    // this.props.onShowSideChange('list');
  };
  showAddPartsMode = () => {
    this.setState({
      showAddPartsMode: true,
    });
  };
  cancleDeviceModeModal = () => {
    this.setState({
      showAddPartsMode: false,
    });
  };
  showAddfactors = () => {
    this.setState({
      showAddfactorsModal: true,
    });
  };
  cancleFactorModal = () => {
    this.setState({
      showAddfactorsModal: false,
    });
  };
  changeFactors = value => {
    this.props.getfactorsPartsMode({
      manufactorId: value,
      assetsId: '',
      isConnectDevice: 0,
    });
  };

  nextAdd = () => {
    const { validateFieldsAndScroll, resetFields } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.addPartInfo({
          ...values,
          stationCode: this.props.stationCode,
          // deviceCodes: ['2M201M1M19'],
          deviceCodes: [this.props.deviceCode],
        });
      }
    });
    resetFields('partsName');
  };
  submitForm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values: ', values);
      if (!err) {
        this.props.addPartInfo({
          ...values,
          stationCode: this.props.stationCode,
          // deviceCodes: ['2M201M1M19'],
          deviceCodes: [this.props.deviceCode],
          // modeId: "2"
        });
        this.props.changePartInfoStore({ showPage: 'list' });
      }
    });
  };
  renderTreeNodes = data =>
    data.map((item, index) => {
      const selectType = item.assetsType;
      const isable = selectType ? selectType === 3 : false;
      if (item.assetsData) {
        return (
          <TreeNode
            title={item.assetsName}
            key={index.toString()}
            value={item.assetsId}
            selectable={isable}
            disabled={!isable}
          >
            {this.renderTreeNodes(item.assetsData)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.assetsName}
          key={index.toString()}
          value={item.assetsId}
          selectable={isable}
          disabled={!isable}
        />
      );
    });

  render() {
    const {
      partsFactorsList,
      partAssetsTree,
      factorsPartsMode,
      stationName,
      deviceName,
      addmanufactorId,
      addmodeId,
    } = this.props;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      showWarningTip,
      warningTipText,
      showAddPartsMode,
      showAddfactorsModal,
    } = this.state;
    const manufacturerValue = getFieldValue('manufactorId');
    //新加的厂家应该反回一个Id，如果有则赋值给厂家，当先添加组件型号时，拿到选择的厂家，然后赋值。
    const changjia = getFieldValue('addManufacturer')
      ? getFieldValue('addManufacturer')
      : addmanufactorId;
    return (
      <div className={styles.addDevice}>
        {showWarningTip && (
          <WarningTip
            onCancel={this.cancelWarningTip}
            onOK={this.confirmWarningTip}
            value={warningTipText}
          />
        )}
        <div className={styles.editTop}>
          <span className={styles.text}>新增</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.backToList} />
        </div>

        <Form className={styles.editPart}>
          <FormItem
            label="电站名称"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('stationCode')(<span>{stationName}</span>)}
          </FormItem>
          <FormItem
            label="上级设备"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('deviceCodes')(<span>{deviceName}</span>)}
          </FormItem>
          <FormItem
            label="部件名称"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('partsName', {
              rules: [
                {
                  required: true,
                  message: '请正确填写,不超过30字',
                  type: 'string',
                  max: 30,
                },
              ],
            })(<Input placeholder="不超过30字" />)}
          </FormItem>
          <FormItem
            label="生产资产"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('assetsId', {
              rules: [
                {
                  required: true,
                  message: '请正确填写,不超过30字',
                  type: 'string',
                  max: 30,
                },
              ],
            })(
              <TreeSelect
                style={{ width: 194 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请输入父节点"
                onChange={this.onChangeAssets}
              >
                <TreeNode
                  title="生产资产"
                  key="0"
                  value={'0'}
                  selectable={false}
                  disabled={true}
                >
                  {this.renderTreeNodes(partAssetsTree)}
                </TreeNode>
              </TreeSelect>
            )}
          </FormItem>
          <FormItem
            label="部件厂家"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('manufactorId', {
              initialValue: changjia,
              rules: [{ required: true, message: '请选择部件厂家' }],
            })(
              <Select
                className={styles.modelSelect}
                placeholder="请选择部件厂家"
                onChange={this.changeFactors}
                disabled={false}
              // disabled={partsFactorsList.length === 0}
              >
                <Option key={'all'} value={''}>
                  请选择部件厂家
                </Option>
                {partsFactorsList.map((e, i) => {
                  if (!e) {
                    return null;
                  }
                  return (
                    <Option key={i.toString()} value={e.manufactorId}>
                      {e.manufactorName}
                    </Option>
                  );

                })}
              </Select>
            )}
            {
              <span className={styles.fontColor} onClick={this.showAddfactors}>
                <Icon type="plus-circle" />
              </span>
            }
          </FormItem>

          <FormItem
            label="部件型号"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('modeId', {
              initialValue: `${addmodeId}`,
              rules: [
                {
                  required: true,
                  message: '请选择部件型号',
                },
              ],
            })(
              <Select
                className={styles.modelSelect}
                placeholder="请选择部件型号"
                onChange={this.changeDeviceMode}
                disabled={false}
              >
                <Option key={'all'} value={''}>
                  请选择部件型号
                </Option>
                {factorsPartsMode.map((e, i) => {
                  if (!e) {
                    return null;
                  }
                  return (
                    <Option key={i.toString()} value={e.modeId}>
                      {e.modeName}
                    </Option>
                  );

                })}
              </Select>
            )}
            <span className={styles.fontColor} onClick={this.showAddPartsMode}>
              <Icon type="plus-circle" />
            </span>
          </FormItem>
          <FormItem
            label="批次号"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('batchNumber', {
              rules: [
                { message: '请正确填写,不超过30字', type: 'string', max: 30 },
              ],
            })(<Input placeholder="不超过30字" />)}
          </FormItem>
          <FormItem
            label="制造商"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('madeName', {
              rules: [
                { message: '请正确填写,不超过30字', type: 'string', max: 30 },
              ],
            })(<Input placeholder="不超过30字" />)}
          </FormItem>
          <FormItem
            label="供货商"
            colon={false}
            className={styles.formItemStyle}
          >
            {getFieldDecorator('supplierName', {
              rules: [
                { message: '请正确填写,不超过30字', type: 'string', max: 30 },
              ],
            })(<Input placeholder="不超过30字" />)}
          </FormItem>
          <div className={styles.submitStyle}>
            <Button onClick={this.submitForm} className={styles.leftsave}>
              保存
            </Button>
            <Button onClick={this.nextAdd} className={styles.leftsave}>
              保存并继续添加
            </Button>
          </div>
        </Form>
        {showAddPartsMode && (
          <ShowAddPartsModeModal
            {...this.props}
            showAddPartsMode={showAddPartsMode}
            cancleDeviceModeModal={this.cancleDeviceModeModal}
            manufacturerValue={manufacturerValue}
          />
        )}
        {showAddfactorsModal && (
          <ShowAddFactor
            {...this.props}
            showAddfactorsModal={showAddfactorsModal}
            cancleFactorModal={this.cancleFactorModal}
          />
        )}
      </div>
    );
  }
}
export default Form.create()(AddPartsInfo);
