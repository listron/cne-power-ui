import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAddAbnormal.scss';
import { Icon, Button, Form, Select, Input } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

const FormItem = Form.Item;
const Option = Select.Option;

class InspectHandleForm extends Component {

  static propTypes={
    form: PropTypes.object,
    onCloseInspectDetail: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    deviceTypeList: PropTypes.object,
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
  }

  onHandleSubmit(){
    console.log("onHandleSubmit")
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
    const deviceList = [];
    const deviceTypeList = this.props.deviceTypeList;
    for (let i = 0; i < deviceTypeList.size; i++) {
      deviceList.push(<Option key={deviceTypeList.getIn([i,'deviceTypeCode'])}>{deviceTypeList.getIn([i,'deviceTypeName'])}</Option>);
    }
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
          <Button type="primary" >完成巡检</Button>
        </div>
        {this.state.showAddAbnormal &&
          <div >
            <div>添加</div>
            <Form  onSubmit={this.onHandleSubmit} >
              <FormItem
                {...formItemLayout}
                label="设备类型" 
              >
                {getFieldDecorator('deviceTypeCodes',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select 
                    mode="multiple"
                    placeholder="必选"
                    onChange={this.selectChange}
                  >
                  {deviceTypeList.map((item,index) => {
                    return (
                      <Option key={'device'+index}>
                        {item.getIn([index, 'deviceTypeName'])}
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
                {getFieldDecorator('deviceName',{
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
                {getFieldDecorator('defectTypeName',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select 
                    mode="multiple"
                    placeholder="必选"
                    onChange={this.selectChange}
                  ></Select>
                )}
              </FormItem>
              {/*<FormItem
                {...formItemLayout}
                label="添加照片"
              >
                {getFieldDecorator('photoData',{
                  rules:[{
                    initialValue: []
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

export default Form.create()(InspectHandleForm);