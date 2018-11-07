
import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import moment from 'moment';
import EditBaseInfo from './EditBaseInfo';
const FormItem = Form.Item;
const { Option } = Select; 
// kankankankankanknfaknfklwenflkjewklfjewlkjflewjklfewjfewlk

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
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
    const { stationDetail, loading, form } = this.props;
    const { getFieldDecorator } = form;

    const longitude = (stationDetail.longitude || parseFloat(stationDetail.longitude) === 0)? `${parseFloat(stationDetail.longitude).toFixed(2)}°` : '--';
    const latitude = (stationDetail.latitude || parseFloat(stationDetail.latitude) === 0)? `${parseFloat(stationDetail.latitude).toFixed(2)}°` : '--';
    const ongridTime = stationDetail.ongridTime?moment(stationDetail.ongridTime).format('YYYY-MM-DD'):'';
    const fullOngridTime = stationDetail.fullOngridTime?moment(stationDetail.fullOngridTime).format('YYYY-MM-DD'):'';
    
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
          <EditBaseInfo stationDetail={stationDetail} form={form} />
{/*           
          <FormItem label="所属区域" >
            {getFieldDecorator('regionName',{
              initialValue: stationDetail.regionName,
              rules: [{
                required: true, message: '所属区域',
              }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="并网容量" >
            {getFieldDecorator('stationCapacity',{
              initialValue: stationDetail.stationCapacity,
              rules: [{
                required: true, message: '请输入并网容量',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '并网容量必须是数字'
              }]
            })(
              <Input className={styles.capacity} />
            )}
            <span>MW</span>
          </FormItem>
          <FormItem label="设计容量" >
            {getFieldDecorator('designCapacity',{
              initialValue: stationDetail.designCapacity,
              rules: [{
                required: true, message: '请输入设计容量',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '设计容量必须是数字'
              }]
            })(
              <Input className={styles.capacity} />
            )}
            <span>MW</span>
          </FormItem>
          <FormItem label="占地面积" >
            {getFieldDecorator('floorArea',{
              initialValue: stationDetail.floorArea,
              rules: [{
                required: true, message: '请输入占地面积',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '占地面积必须是数字'
              }]
            })(
              <Input className={styles.floorArea} />
            )}
            <span>平方公里</span>
          </FormItem>
          <FormItem label="年利用小时数" >
            {getFieldDecorator('designUtilizationHours',{
              initialValue: stationDetail.designUtilizationHours,
              rules: [{
                required: true, message: '请输入年利用小时数',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '年利用小时数必须是数字'
              }]
            })(
              <Input className={styles.designUtilizationHours} />
            )}
            <span>小时</span>
          </FormItem>
          <FormItem label="是否接入" >
            {getFieldDecorator('stationStatus',{
              initialValue: stationDetail.stationStatus===1?1:0,
              rules: [{
                required: true, message: '选择是否接入',
              }]
            })(
              <Select style={{width:'145px'}}>
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            )}
          </FormItem> */}
        </div>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
