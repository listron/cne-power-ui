import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAddAbnormal.scss';
import { Button, Form, Select, Modal } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import DeviceName from '../../../../Common/DeviceName';
import pathConfig from '../../../../../constants/path';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
class inspectAddAbnormal extends Component {
  static propTypes={
    form: PropTypes.object,
    onCloseInspectDetail: PropTypes.func,
    deviceTypes: PropTypes.object,
    defectTypes: PropTypes.object,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
    loadDeviceTypeList: PropTypes.func,
    loadDeviceAreaList: PropTypes.func,
    loadDeviceList: PropTypes.func,
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
      deviceAreaCode: '',
    }
    this.showAdd = this.showAdd.bind(this);
    this.hideAdd = this.hideAdd.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onFinishInspect = this.onFinishInspect.bind(this);
    this.loadDeviceList = this.loadDeviceList.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeArea = this.onChangeArea.bind(this);
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
    this.props.form.validateFields((err, values) => {
      if(!err){
        let params = {
          inspectId: this.props.inspectDetail.get('inspectId'),
          deviceTypeCode: values.deviceTypeCode,
          deviceCode: values.deviceCode,
          defectTypeCode: values.defectTypeCode,
          photoAddress: values.photoData.map((item) => (item.response)).join(','),
          rotatePhoto: values.photoData.map((item) => (item.response+';'+item.rotate)).join(','),
        }
        this.props.addInspectAbnormal(params);

      }
    })
  }

  onChangeType(value) {
    this.props.form.setFieldsValue({
      deviceCode: ''
    });
    this.setState({
      deviceAreaCode: ''
    });
    this.props.loadDeviceAreaList({
      stationCode: this.props.inspectDetail.get('stationCode'),
      deviceTypeCode: value
    });
    this.props.loadDeviceList({
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
      return item.get('deviceTypeCode') === code
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
    if(areaCode !== '') {
      params.partitionCode = areaCode;
    }
    this.props.loadDeviceList(params);
  }

  showAdd(){
    this.setState({
      showAddAbnormal: true,
    })
    let stationCode = this.props.inspectDetail.get('stationCode'); 
    let stationType = this.props.inspectDetail.get('stationType');
    this.props.loadDeviceTypeList({stationCodes: stationCode}); 
    this.props.getDefectTypes({stationType: stationType});
  }

  hideAdd(){
    this.setState({
      showAddAbnormal: false,
    })
  }

  render(){
    const { deviceTypeItems, defectTypes, inspectDetail} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
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
          <Button type="primary" onClick={this.onFinishInspect} >完成巡检</Button>
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
                    disabled={!getFieldValue('deviceTypeCode')}
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
                {getFieldDecorator('defectTypeCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select
                    placeholder="必选"
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
              <FormItem
                {...formItemLayout}
                label="添加照片"
              >
                {getFieldDecorator("photoData",{
                  rules: [{required: false,message: '请上传图片'}],
                  initialValue: [],
                  valuePropName: 'data',
                })(
                  <ImgUploader uploadPath={`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true}  />
                )}
              </FormItem>
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