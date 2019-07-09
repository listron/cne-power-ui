import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceMode.scss';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import { Button, Table, Form, Input, Icon, Modal, Select } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class EditMode extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectassetsId: [],
    };
  }
  changeSelctNode = (data) => {
    this.setState({
      selectassetsId: data.assetsIds,
    });
    this.props.getDeviceFactorsList({
      assetsId: data.assetsIds.join(),
      orderField: '1',
      orderMethod: 'desc',
    });
    this.props.form.setFieldsValue({ 'eidtFactor': '' });
  };
  confirmForm = () => {
    const { validateFieldsAndScroll } = this.props.form;

    validateFieldsAndScroll(['editDeviceMode', 'eidtAssetIds', 'eidtFactor'], (err, values) => {

      const { tableRecord } = this.props;
      const { modeId } = tableRecord;

      if (!err) {
        this.props.editDeviceModes({
          modeId,
          deviceModeName: values.editDeviceMode,
          assetsId: values.eidtAssetIds.assetsIds.join(),
          manufactorId: values.eidtFactor,
        });
        this.props.cancleModal();
      }

    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectassetsId } = this.state;
    const { showModal, assetList, stationTypeCount, queryDataType, cancleModal, tableRecord, deviceFactorsList } = this.props;
    const { deviceModeName, assetsId, stationType, manufactorName, assetsName, manufactorId } = tableRecord;
    const pv = assetsId && stationType === '1' ? [assetsId] : [];
    const wind = assetsId && stationType === '0' ? [assetsId] : [];
    return (
      <div>
        <Modal
          visible={showModal}
          title="编辑"
          onOk={this.onSave}
          onCancel={cancleModal}
          destroyOnClose={true}
          width={635}
          okText="保存"
          centered={true}
          mask={false}
          footer={null}
          closable
          maskClosable={false}
          wrapClassName={styles.modeModal}
        >
          <Form className={styles.preFormStyle}>
            <FormItem label="设备型号" colon={false} >
              {getFieldDecorator('editDeviceMode', {
                initialValue: deviceModeName,
                rules: [
                  { message: '请输入设备厂家名称', required: true },
                ],
              })(
                <Input placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem label="生产资产" colon={false} >
              {getFieldDecorator('eidtAssetIds', {
                initialValue: { assetsIds: [...pv, ...wind] },
                rules: [
                  { message: '请选择生产资产节点', required: true },
                ],
              })(
                <AssetNodeSelect onChange={this.changeSelctNode} stationType={+stationType} assetList={assetList} stationTypeCount={stationTypeCount} queryDataType={queryDataType} checkedName={assetsName.replace(/,/g, '/')} assetsIds={{ pv, wind }} />
              )}
            </FormItem>
            <FormItem label="设备厂家" colon={false} >
              {getFieldDecorator('eidtFactor', {
                initialValue: manufactorId,
                rules: [
                  { message: '请选择生产资产节点', required: true },
                ],
              })(
                <Select
                  onSelect={this.selectManufactor}
                  disabled={selectassetsId.length === 0}
                  style={{ width: 194 }}
                  placeholder="请选择厂家" >
                  {deviceFactorsList.map(e => (<Option key={e.manufactorCode} value={e.manufactorId}>
                    {e.manufactorName}
                  </Option>))}
                </Select>
              )}
            </FormItem>
            <Button type="primary" onClick={this.confirmForm} className={styles.nextButton}>确定</Button>
          </Form>

        </Modal>
      </div>
    );
  }
}
export default Form.create()(EditMode);
