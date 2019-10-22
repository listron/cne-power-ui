import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Form, Input, DatePicker, Modal } from 'antd';
import styles from './recordModals.scss';
import InputLimit from '@components/Common/InputLimit';
import StationSelect from '@components/Common/StationSelect';
// import { dataFormats } from '@utils/utilFunc';
const FormItem = Form.Item;

class EditRecord extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    form: PropTypes.object,
    showModal: PropTypes.bool,
    stageStations: PropTypes.array,
    recordDetailInfo: PropTypes.object,
    saveRecordLoading: PropTypes.bool,
    // stageList: PropTypes.array,
    changeStore: PropTypes.func,
    addNewRecord: PropTypes.func,
  };

  state = {
    saveMode: 'normal', // 普通保存normal, 继续保存continue
  }

  componentDidUpdate(preProps){ // 保存完成, 清除信息并关闭弹框;
    const { saveRecordLoading, recordDetailInfo } = this.props;
    const preLoading = preProps.saveRecordLoading;
    if (!saveRecordLoading && preLoading && !recordDetailInfo) { // 保存请求完毕 && 上次数据被清除 => 请求成功
      const { saveMode } = this.state;
      saveMode === 'normal' ? this.cancelSaveRecord() : this.props.form.resetFields();
    }
  }

  saveRecord = () => this.onRecordInfoSave('normal');

  continueSaveRecord = () => this.onRecordInfoSave('continue');

  onRecordInfoSave = (saveMode) => {
    this.setState({ saveMode }, () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.addNewRecord(values);
        }
      });
    });
  }

  cancelSaveRecord = () => {
    this.props.form.resetFields();
    this.props.changeStore({
      showModal: false,
      modalKey: null,
      recordDetailInfo: null,
    });
  }

  render(){
    const { theme, form, stageStations, recordDetailInfo, showModal } = this.props;
    const { getFieldDecorator } = form;
    const { stationList = [], completeTime = null, handleUser = '', noteContent = ''} = recordDetailInfo || {};
    return (
      <Modal
        title="添加工作记事"
        visible={showModal}
        onCancel={this.cancelSaveRecord}
        footer={null}
        width={625}
      >
        <Form className={`${styles.addRecord} ${styles[theme]}`}>
          <FormItem label="电站" colon={false} className={styles.eachRecordForm}>
            {getFieldDecorator('stationList', {
              rules: [{ required: true, message: '请选择电站' }],
              initialValue: stationList,
            })(
              <StationSelect
                data={stageStations}
                multiple={true}
                style={{ width: '200px' }}
              />
            )}
          </FormItem>
          <FormItem label="完成时间" colon={false} className={styles.eachRecordForm} >
            {getFieldDecorator('completeTime', {
              rules: [{ required: true, message: '请选择完成时间' }],
              initialValue: completeTime,
            })(
              <DatePicker showTime placeholder="请选择时间" style={{width: '200px'}} allowClear={false} />
            )}
          </FormItem>
          <FormItem label="执行人" colon={false} className={styles.eachRecordForm} >
            {getFieldDecorator('handleUser', {
              rules: [{ required: true, message: '请输入执行人' }],
              initialValue: handleUser,
            })(
              <Input style={{width: '200px'}} placeholder="请输入..." />
            )}
          </FormItem>
          <FormItem label="记事内容" colon={false} className={styles.eachRecordForm} >
            {getFieldDecorator('noteContent', {
              rules: [{ required: true, message: '请输入记事内容' }],
              initialValue: noteContent,
            })(
              <InputLimit width={400} size={999} placeholder="请输入..." />
            )}
          </FormItem>
          <div className={styles.saveRow}>
            <Button onClick={this.saveRecord}>保存</Button>
            <Button onClick={this.continueSaveRecord}>保存并继续添加</Button>
            <Button onClick={this.cancelSaveRecord}>取消</Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(EditRecord);
