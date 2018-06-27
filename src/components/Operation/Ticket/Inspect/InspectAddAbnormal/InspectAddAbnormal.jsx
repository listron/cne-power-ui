import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAddAbnormal.scss';
import { Button, Form, Select } from 'antd';
// import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import DeviceName from '../../../../Common/DeviceName';

const FormItem = Form.Item;
const Option = Select.Option;

class inspectAddAbnormal extends Component {

  static propTypes={
    form: PropTypes.object,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
    loadDeviceTypeList: PropTypes.func,
    loadDeviceAreaList: PropTypes.func,
    loadDeviceList: PropTypes.func,
    inspectDetail: PropTypes.object,
  }

  static defaultProps={

  }

  constructor(props){
    super(props);
    this.state={
      showAddAbnormal: false,
      deviceAreaCode: null,
    }
    this.showAdd = this.showAdd.bind(this);
    this.hideAdd = this.hideAdd.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.loadDeviceList = this.loadDeviceList.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeArea = this.onChangeArea.bind(this);
  }

  onHandleSubmit(){
    console.log("onHandleSubmit")
  }

  onChangeType(value) {
    this.props.form.setFieldsValue({
      deviceCode: ''
    });
    this.setState({
      deviceAreaCode: null
    });
    this.props.loadDeviceAreaList({
      stationCode: this.props.inspectDetail.get('stationCode'),
      deviceTypeCode: value
    });
  }

  onChangeArea(value) {
    this.setState({
      deviceAreaCode: value
    });
  }

  getDeviceType(code) {
    let deviceType = ''
    let index = this.props.deviceTypeItems.findIndex((item) => {
      item.get('deviceTypeCode') === code
    });
    if(index !== -1) {
      deviceType = this.props.deviceTypeItems.getIn([index, 'deviceTypeName']);
    }
    return deviceType;
  }

  loadDeviceList(areaCode) {
    let params = {
      stationCode: this.props.inspectDetail.get('stationCode'),
      deviceTypeCode: this.props.form.getFieldValue('deviceTypeCode')
    };
    if(areaCode !== null) {
      params.partitionCode = areaCode;
    }
    this.props.loadDeviceList(params);
  }

  showAdd(){
    this.setState({
      showAddAbnormal: true,
    })  
    // console.log(this.props.inspectDetail.stationCode);
    let stationCode = this.props.inspectDetail.get('stationCode'); 
    this.props.loadDeviceTypeList({
      stationCodes: stationCode,
    });
  }

  hideAdd(){
    this.setState({
      showAddAbnormal: false,
    });
  } 

  render(){
    const { deviceTypeItems, inspectDetail} = this.props;
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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return(
      <div className={styles.inspectHandleForm} >
        <div>
          <Button icon="plus" onClick={this.showAdd} >添加异常</Button>
          <Button type="primary" >完成巡检</Button>
        </div>
        {this.state.showAddAbnormal &&
          <div >
            <div>添加</div>
            <Form onSubmit={this.onHandleSubmit} >
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
                    mode="combobox"
                    placeholder="必选"
                    onChange={this.onChangeType}
                  >
                  {deviceTypeItems.map((item,index) => {
                    return (
                      <Option key={item.get('deviceTypeCode')} value={item.get('deviceTypeCode')} >
                        {item.get('deviceTypeName')}
                      </Option>
                    );
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
                  <DeviceName 
                    placeholder="输入关键字快速查询" 
                    stationName={inspectDetail.get('stationName')}
                    deviceType={this.getDeviceType(getFieldValue('deviceTypeCode'))}
                    deviceAreaCode={this.state.deviceAreaCode}
                    deviceTypeItems={this.props.deviceTypeItems}
                    deviceAreaItems={this.props.deviceAreaItems}
                    deviceItems={this.props.deviceItems}
                    loadDeviceList={this.loadDeviceList}
                    onChangeArea={this.onChangeArea}
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

export default Form.create()(inspectAddAbnormal);