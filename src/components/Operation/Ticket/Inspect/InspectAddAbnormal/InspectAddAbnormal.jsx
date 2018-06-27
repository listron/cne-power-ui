import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAddAbnormal.scss';
import { Icon, Button, Form, Select, Input, Modal } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
class inspectAddAbnormal extends Component {

  static propTypes={
    form: PropTypes.object,
    onCloseInspectDetail: PropTypes.func,
    deviceTypes: PropTypes.object,
    defectTypes: PropTypes.object,
    getDeviceTypeList: PropTypes.func,
    inspectDetail: PropTypes.object,
    getDefectTypes: PropTypes.func,
    finishInspect: PropTypes.func,
    addInspectAbnormal: PropTypes.func,
  }

  static defaultProps={

  }

  constructor(props){
    super(props);
    this.state={
      showAddAbnormal: false,
    }
    this.showAdd = this.showAdd.bind(this);
    this.hideAdd = this.hideAdd.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onFinishInspect = this.onFinishInspect.bind(this);
  }

  componentDidMount(){
    let stationCodes = this.props.inspectDetail.get('stationCode'); 
    let stationType = this.props.inspectDetail.get('stationType');
    this.props.getDeviceTypeList({stationCodes: stationCodes, }); 
    this.props.getDefectTypes({stationType: stationType, });
  }

  onFinishInspect(){
    let inspectId = this.props.inspectDetail.get('inspectId');
    var that = this;
    confirm({
      title: '确定此工单全部完成?',
      onOk() {
        that.props.finishInspect({
          inspectId: inspectId,
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  onHandleSubmit(e){
    e.preventDefault();
    // let params = {
    //   inspectId: this.props.inspectDetail.get('inspectId'),
    //   deviceTypeCode: deviceTypeCodes.value,
    // }
    this.props.form.validateFields((err, values) => {
      if(!err){
        console.log('Received values of form: ', values);
        this.props.addInspectAbnormal({
          inspectId: this.props.inspectDetail.get('inspectId'),
          deviceTypeCode: values.deviceTypeCode,
          deviceCode: values.deviceCode,
          defectTypeCode: values.defectTypeCode,
        });
      }
    })
  }

  showAdd(){
    this.setState({
      showAddAbnormal: true,
    })  
    
  }

  hideAdd(){
    this.setState({
      showAddAbnormal: false,
    })
  }
  
  render(){
    const { deviceTypes, defectTypes} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return(
      <div className={styles.inspectHandleForm} >
        <div>
          <Button icon="plus" onClick={this.showAdd} >添加异常</Button>
          <Button type="primary" onClick={this.onFinishInspect} >完成巡检</Button>
        </div>
        {this.state.showAddAbnormal &&
          <div >
            <div>添加</div>
            <Form  onSubmit={this.onHandleSubmit} >
              <FormItem
                {...formItemLayout}
                label="设备类型" 
              >
                {getFieldDecorator('deviceTypeCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select
                    placeholder="必选"
                    onChange={this.selectChange}
                  >
                  {deviceTypes.map(item => {
                    return (
                      <Option key={item.get('deviceTypeCode') } value={item.get('deviceTypeCode') } >
                        {item.get('deviceTypeName') }
                      </Option>
                    )
                  })}
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="设备名称"
              >
                {getFieldDecorator('deviceCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Input 
                    placeholder="输入关键字快速查询" 
                    onClick={this.filterDevice} 
                    addonAfter={<Icon type="filter" />} 
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="缺陷类型" 
              >
                {getFieldDecorator('defectTypeCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select
                    placeholder="必选"
                    onChange={this.selectChange}
                  >
                    {defectTypes.map(item => {
                      return(
                        <Option key={item.get('defectTypeCode') } value={item.get('defectTypeCode') } >
                          {item.get('defectTypeName') }
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
              {/*<FormItem
                {...formItemLayout}
                label="添加照片"
              >
                {getFieldDecorator('photoData',{
                  rules:[{
                    initialValue: [],
                    valuePropName: 'data',
                  }]
                })(
                  <ImgUploader editable={true}  />
                )}
              </FormItem>*/}
              <FormItem
                {...formItemLayout}
              >
                <Button htmlType="reset" onClick={this.hideAdd} >取消</Button>
                <Button type="primary" htmlType="submit" >添加</Button>
              </FormItem>
            </Form>
          </div>
        }
      </div>
    )

  }
}

export default Form.create()(inspectAddAbnormal);