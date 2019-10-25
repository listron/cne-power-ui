import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import styles from './recordModals.scss';
import InputLimit from '@components/Common/InputLimit';
import StationSelect from '@components/Common/StationSelect';
const FormItem = Form.Item;

class AddRecord extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    modalKey: PropTypes.string,
    form: PropTypes.object,
    stageStations: PropTypes.array,
    recordDetailInfo: PropTypes.object,
    saveRecordLoading: PropTypes.bool,
    addNewRecord: PropTypes.func,
    cancelHandle: PropTypes.func,
    editRecord: PropTypes.func,
  };

  state = {
    saveMode: 'normal', // 普通保存normal, 继续保存continue
  }

  componentDidUpdate(preProps){ // 保存完成, 清除信息并关闭弹框;
    const { saveRecordLoading, recordDetailInfo, modalKey } = this.props;
    const preLoading = preProps.saveRecordLoading;
    if (modalKey === 'addRecord' && !saveRecordLoading && preLoading && !recordDetailInfo) {
      // 新增页 保存请求完毕 && 上次数据被清除 => 请求成功
      const { saveMode } = this.state;
      saveMode === 'normal' ? this.cancelAdd() : this.props.form.resetFields(); // normal正常关闭 / continue重置继续添加
    }
  }

  componentWillUnmount(){
    this.props.form.resetFields();
  }

  saveAddRecord = () => this.onAddSave('normal');

  continueAddRecord = () => this.onAddSave('continue');

  onAddSave = (saveMode) => {
    this.setState({ saveMode }, () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.addNewRecord(values);
        }
      });
    });
  }

  editRecordInfo = () => { // 编辑
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { recordDetailInfo } = this.props;
        const { noteId } = recordDetailInfo;
        this.props.editRecord({ ...values, noteId });
      }
    });
  }

  cancelAdd = () => {
    this.props.cancelHandle();
  }

  render(){
    const { theme, form, stageStations, recordDetailInfo, modalKey, saveRecordLoading } = this.props;
    const { saveMode } = this.state;
    const { getFieldDecorator } = form;
    const { stations = [], completeTime = null, handleUser = '', noteContent = ''} = recordDetailInfo || {};
    return (
      <Form className={`${styles.addRecord} ${styles[theme]}`}>
        <FormItem label="电站" colon={false} className={styles.eachRecordForm}>
          {getFieldDecorator('stationList', {
            rules: [{ required: true, message: '请选择电站' }],
            initialValue: stageStations.filter(e => stations.map(m => m.stationCode).includes(e.stationCode)),
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
            initialValue: completeTime ? moment(completeTime) : null,
          })(
            <DatePicker showTime placeholder="请选择时间" style={{width: '200px'}} allowClear={false} />
          )}
        </FormItem>
        <FormItem label="执行人" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('handleUser', {
            // rules: [{ required: true, message: '请输入执行人' }],
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
          {modalKey === 'addRecord' && <Button
            onClick={this.saveAddRecord}
            loading={saveMode === 'normal' && saveRecordLoading}
            className={styles.saveBtn}
          >保存</Button>}
          {modalKey === 'addRecord' && <Button
            onClick={this.continueAddRecord}
            loading={saveMode === 'continue' && saveRecordLoading}
            className={styles.continueSaveBtn}
          >保存并继续添加</Button>}
          {modalKey === 'editRecord' && <Button
            onClick={this.editRecordInfo}
            loading={saveRecordLoading}
            className={styles.saveBtn}
          >保存</Button>}
          <Button onClick={this.cancelAdd} className={styles.cancelSaveBtn}>取消</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(AddRecord);
