import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceFactory.scss';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import { Button, Table, Form, Input, Icon, Modal } from 'antd';
const FormItem = Form.Item;

class EditFactors extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  changeSelctNode = () => {
    console.log('selectNode');
  };
  confirmForm = () => {
    const { validateFieldsAndScroll } = this.props.form;

    validateFieldsAndScroll(['editDeviceFactor', 'eidtAssetIds'], (err, values) => {
      console.log('values: ', values);
      const { tableRecord } = this.props;
      const { manufactorId } = tableRecord;
      if (!err) {
        this.props.editDeviceFactors({ manufactorId, assetsIds: values.eidtAssetIds.assetsIds, manufactorName: values.editDeviceFactor });
        this.props.cancleModal();

      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showModal, assetList, stationTypeCount, queryDataType, cancleModal, tableRecord } = this.props;
    const { manufactorName, assetsDatas, isBuild } = tableRecord;
    console.log('isBuild: ', isBuild);
    const pv = assetsDatas && assetsDatas.filter((e) => e.stationType === 1).map((e) => (e.assetsIds));
    const wind = assetsDatas && assetsDatas.filter((e) => e.stationType === 0).map((e) => (e.assetsIds));
    const stationType = pv.length ? 1 : 0;
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
          wrapClassName={styles.test}

        >
          <Form className={styles.preFormStyle}>
            <FormItem label="设备厂家" colon={false} >
              {getFieldDecorator('editDeviceFactor', {
                initialValue: manufactorName,
                rules: [
                  { message: '请输入设备厂家名称', required: true },
                ],
              })(
                isBuild ? <span>manufactorName</span> : <Input placeholder="请输入..." />
              )}
            </FormItem>
            <FormItem label="生产资产" colon={false} >
              {getFieldDecorator('eidtAssetIds', {
                initialValue: { assetsIds: [...pv, ...wind] },
                rules: [
                  { message: '请选择生产资产节点', required: true },
                ],
              })(
                <AssetNodeSelect onChange={this.changeSelctNode} stationType={stationType} assetList={assetList} stationTypeCount={stationTypeCount} queryDataType={queryDataType} multiple={true} assetsIds={{ pv, wind }} />
              )}
            </FormItem>
            <Button type="primary" onClick={this.confirmForm} className={styles.nextButton}>确定</Button>
          </Form>

        </Modal>
      </div>
    );
  }
}
export default Form.create()(EditFactors);
