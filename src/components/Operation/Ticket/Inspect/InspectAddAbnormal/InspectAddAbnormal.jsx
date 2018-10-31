import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectAddAbnormal.scss';
import { Button, Form, Select, Modal } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import DeviceName from '../../../../Common/DeviceName';
import pathConfig from '../../../../../constants/path';
import InputLimit from '../../../../Common/InputLimit';

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
    getStationDeviceTypes: PropTypes.func,
    loadDeviceAreaList: PropTypes.func,
    loadDeviceList: PropTypes.func,
    inspectDetail: PropTypes.object,
    getDefectTypes: PropTypes.func,
    finishInspect: PropTypes.func,
    addInspectAbnormal: PropTypes.func,
    getSliceDevices: PropTypes.func,
    allSeries: PropTypes.array, 
    firstPartitionCode: PropTypes.string, 
  }

  static defaultProps={
    showAddAbnormal: false,
  }

  constructor(props){
    super(props);
    this.state={
      showAddAbnormal: false,
      deviceAreaCode: '',
    }
  }

  onFinishInspect = () => {
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
      },
    })
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        let params = {
          inspectId: this.props.inspectDetail.get('inspectId'),
          deviceTypeCode: values.deviceTypeCode,
          deviceCode: values.deviceCode,
          defectTypeCode: values.defectTypeCode,
          photoAddress: values.photoData.map((item) => (item.response)).join(','),
          rotatePhoto: values.photoData.map((item) => (item.response+','+item.rotate)).join(';'),
          abnormalDescribe: values.abnormalDescribe,
        }
        this.props.addInspectAbnormal(params);
        this.setState({
          showAddAbnormal: false,
        })
      }
    })
  }

  onChangeDeviceType = (deviceTypeCode) => {
    this.props.form.setFieldsValue({
      deviceCode: ''
    });
    this.setState({
      deviceAreaCode: ''
    });
    let params = {
      stationCode: this.props.inspectDetail.get('stationCode'),
      deviceTypeCode
    };
    console.log(params)
    if(deviceTypeCode === 509){ //组串时，请求调整
       this.props.getSliceDevices(params);
     }else{
       this.props.loadDeviceList(params);
       this.props.loadDeviceAreaList(params);
     }
  }

  onChangeArea = (value) => {
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

  // loadDeviceList = (areaCode) => {
  //   let params = {
  //     stationCode: this.props.inspectDetail.get('stationCode'),
  //     deviceTypeCode: this.props.form.getFieldValue('deviceTypeCode')
  //   };
  //   if(areaCode !== '') {
  //     params.partitionCode = areaCode;
  //   }
  //   this.props.loadDeviceList(params);
  // }
  loadDeviceList = (areaCode) => {
    const { form, getSliceDevices } = this.props;
    const deviceTypeCode = form.getFieldValue('deviceTypeCode');
    let params = {
      stationCode:  this.props.inspectDetail.get('stationCode'),
      deviceTypeCode,
    };
    areaCode && (params.partitionCode = areaCode);
    if(deviceTypeCode === 509 && !areaCode){ // 光伏组件卸载。
      getSliceDevices(params);
    }else{
      this.props.loadDeviceList(params);
    }
  }

  showAdd = () => {
    this.setState({
      showAddAbnormal: true,
    })
    let stationCode = this.props.inspectDetail.get('stationCode'); 
    let stationType = this.props.inspectDetail.get('stationType');
    this.props.getStationDeviceTypes({stationCodes: stationCode}); 
    this.props.getDefectTypes({stationType: stationType});
  }

  hideAdd = () => {
    this.setState({
      showAddAbnormal: false,
    })
  }

  render(){
    const { deviceTypeItems, defectTypes, deviceItems, deviceAreaItems, inspectDetail, allSeries, firstPartitionCode } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { stationName, stationCode } = inspectDetail;
    console.log(this.props)
    console.log(inspectDetail.toJS())
    return(
      <div className={styles.inspectHandleForm}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>巡检处理</div>
          <div className={styles.border}></div>
        </div>
        <div className={styles.actionBar}>
          <Button icon="plus" onClick={this.showAdd} className={styles.addAbnormal}>添加异常</Button>
          <Button onClick={this.onFinishInspect} className={styles.finishInspect}>完成巡检</Button>
        </div>
        {this.state.showAddAbnormal &&
          <div className={styles.addAbnormalForm}>
            <Form onSubmit={this.onHandleSubmit} >
              <FormItem label="设备类型" colon={false}>
                {getFieldDecorator('deviceTypeCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select 
                    placeholder="请选择"
                    onChange={this.onChangeDeviceType}
                    style={{width: 200}}
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
              <FormItem label="设备名称" colon={false}>
                {getFieldDecorator('deviceCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <DeviceName
                    disabled={deviceItems.size===0}
                    stationName={stationName}
                    stationCode={stationCode}
                    placeholder="输入关键字快速查询" 
                    deviceType={this.getDeviceType(getFieldValue('deviceTypeCode'))}
                    deviceTypeCode={getFieldValue('deviceTypeCode')}
                    deviceAreaCode={this.state.deviceAreaCode}
                    deviceAreaItems={deviceAreaItems}
                    deviceItems={deviceItems}
                    loadDeviceList={this.loadDeviceList}
                    onChangeArea={this.onChangeArea}
                    allSeries={allSeries}
                    firstPartitionCode={firstPartitionCode}
                  />
                )}
              </FormItem>
              <FormItem label="缺陷类型" colon={false}>
                {getFieldDecorator('defectTypeCode',{
                  rules:[{
                    required: true,
                  }]
                })(
                  <Select
                    placeholder="请选择"
                    style={{width: 200}}
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
              <FormItem label="异常描述" colon={false}>
                {getFieldDecorator('abnormalDescribe',{
                  rules: [{required: true, message: '请填写异常描述'}],
                })(
                  <InputLimit placeholder="请描述，不超过80个汉字" />
                )}
              </FormItem>
              <FormItem label="添加照片" colon={false}>
                <div className={styles.addImg}>
                  <div className={styles.maxTip}>最多4张</div>
                  {getFieldDecorator('photoData',{
                    rules: [{required: false,message: '请上传图片'}],
                    initialValue: [],
                    valuePropName: 'data',
                  })(
                    <ImgUploader uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true}  />
                  )}
                </div>
              </FormItem>
              <div className={styles.formAction}>
                <Button htmlType="reset" onClick={this.hideAdd} className={styles.cancel}>取消</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </div>
            </Form>
          </div>
        }
        <div className={styles.addTips}>
          <span>（添加异常：记录巡检过程中发现的异常）</span>
          <span>（完成巡检：确定此工单已经完成，请点击按钮）</span>
        </div>
      </div>
    )

  }
}

export default Form.create()(inspectAddAbnormal);