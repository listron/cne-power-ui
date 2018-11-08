
import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import moment from 'moment';
import EditBaseInfo from './EditBaseInfo';
import EditStationBelong from './EditStationBelong';
import EditConnectNetInfo from './EditConnectNetInfo';
import EditOtherInfo from './EditOtherInfo';
const FormItem = Form.Item;
const { Option } = Select; 
// kankankankankanknfaknfklwenflkjewklfjewlkjflewjklfewjfewlk

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    stationBelongInfo: PropTypes.object,
    stationDetail: PropTypes.object,
    cancelEdit: PropTypes.func,
    saveStationDetail: PropTypes.func,
    confirmWarningTip: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  cancelEdit = () => {
    this.props.cancelEdit()
  }

  saveStationInfo = () => {
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        const { stationDetail } = this.props;
        this.props.saveStationDetail({
          ...stationDetail,
          ...values,
        })
        this.props.confirmWarningTip()
      }
    })
  }

  render(){
    const { stationDetail, loading, form, stationBelongInfo } = this.props;
    console.log(stationBelongInfo);
    return (
      <Form className={styles.editPart}>
        <div className={styles.baseEdit}>
          <div className={styles.title}>
            <span className={styles.titleText}>基本信息</span>
            <div className={styles.titleHandle}>
              <span className={styles.cancel} onClick={this.cancelEdit}>取消</span>
              <Button className={styles.save} onClick={this.saveStationInfo} loading={loading}>保存</Button>
            </div>
          </div>
          <EditBaseInfo stationDetail={stationDetail} form={form} stationBelongInfo={stationBelongInfo} />
          <EditStationBelong stationDetail={stationDetail} form={form} stationBelongInfo={stationBelongInfo} />
          <EditConnectNetInfo stationDetail={stationDetail} form={form} stationBelongInfo={stationBelongInfo} />
          <EditOtherInfo stationDetail={stationDetail} form={form} />
        </div>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
