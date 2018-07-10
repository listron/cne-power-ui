import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import FormHanleButtons from './FormHanleButtons';
import SolveTextArea from './SolveTextArea';
import { Form, Input, Button, Select, Switch } from 'antd';
import pathConfig from '../../../../../constants/path';
import styles from './createDefectForm.scss';
import DeviceName from '../../../../Common/DeviceName';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    getDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    getDevices: PropTypes.func,
    onDefectCreateNew: PropTypes.func,
    showContainer: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
    editNewDefect: PropTypes.bool,
    defectDetail: PropTypes.object,
    editDataGet: PropTypes.bool,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
  };
  constructor(props){
    super(props);
    this.state = {
      defectFinished: false,
      checked: false,
      deviceAreaCode: '',
    }
    this.onChangeArea = this.onChangeArea.bind(this);
    this.loadDeviceList = this.loadDeviceList.bind(this);
  }

  onChangeArea(value) {
    this.setState({
      deviceAreaCode: value
    });
  }

  onStationSelected = (stations) =>{
    const stationCodes = (stations && stations[0] && stations[0].stationCode) || 0;
    const tmpStationType = stations && stations[0] && stations[0].stationType;
    const stationType = tmpStationType===20?1:tmpStationType===10?0:2;
    this.props.getDeviceTypes({stationCodes})
    this.props.getDefectTypes({stationType})
  }
  onCancelCreat = () => {
    this.props.onChangeShowContainer({ container: 'list' })
  }
  onDefectFinishChange = (defectFinished) => {
    this.setState({
      defectFinished
    })
  }
  onDefectCreat = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 电站类型(0:风电，1光伏，2：全部)
        // stationType:20--光伏---10风
        let {stationCode,stationType} = values.stations[0];
        stationType = stationType/10 - 1;
        let deviceCode = values.deviceCode;
        let partitionCode = values.stations[0].zoneCode;
        let partitionName = values.stations[0].zoneName;
        let rotatePhotoArray = [];
        let photoAddress = values.imgDescribe.map(e=>{
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return e.response
        }).join(',');
        let photoSolveAddress = values.imgHandle.map(e=>{
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return  e.response
        }).join(',');
        let rotatePhoto = rotatePhotoArray.join(';');
        delete values.stations;
        delete values.imgDescribe;
        delete values.imgHandle;
        let params = {
          ...values,
          stationCode,
          stationType,
          deviceCode,
          partitionCode,
          partitionName,
          photoAddress,
          photoSolveAddress,
          rotatePhoto,
        };
        this.props.onDefectCreateNew(params);
      }
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
      stationCode: this.props.form.getFieldValue('stations')[0].stationCode,
      deviceTypeCode: this.props.form.getFieldValue('deviceTypeCode')
    };
    if(areaCode !== '') {
      params.partitionCode = areaCode;
    }
    this.props.getDevices(params);
  }

  render() {
    const { defectFinished } = this.state;
    const {stations, deviceTypes, defectTypes, defectDetail, editDataGet, editNewDefect } = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const defaultStations = editNewDefect && stations.filter(e=>e.stationCode===defectDetail.stationCode) || [] ;
    const defaultDeviceType = editNewDefect && editDataGet && deviceTypes.find(e=>e.deviceTypeCode===defectDetail.deviceTypeCode);
    const defaultDefectType = editNewDefect && editDataGet && defectTypes.find(e=>e.defectTypeCode===defectDetail.defectTypeCode) || null ;
    const imgDescribe = editNewDefect && defectDetail.photoAddress && defectDetail.photoAddress.split(',').filter(e=>!!e).map((e,i)=>({
      uid: i,    
      rotate: 0,  
      status: 'done',  
      thumbUrl: e,  
    }))
    return (
      <Form className={styles.defectCreate}>
        <h3>基本信息</h3>
        <FormItem label={'电站名称：'} {...formItemLayout}>
          {getFieldDecorator('stations', {
            rules: [{ required: true, message: '请选择电站' }],
            initialValue: defaultStations,
          })(
            <StationSelect data={stations} multiple={false} onOK={this.onStationSelected} />
          )}
        </FormItem>
        <FormItem label={'设备类型：'} {...formItemLayout}>
          {getFieldDecorator('deviceTypeCode', {
            rules: [{ required: true, message: '请选择设备类型' }],
            initialValue: defaultDeviceType && defaultDeviceType.deviceTypeCode || null,
          })(
            <Select placeholder={'请选择设备类型'} disabled={deviceTypes.length === 0}>
              {deviceTypes.map(e=>(<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label={'设备名称：'} {...formItemLayout} >
          {getFieldDecorator('deviceCode',{
            rules: [{ required: true, message: '请选择设备名称' }],
          })(
            <DeviceName  
              disabled = {!getFieldValue('deviceTypeCode')}
              placeholder = "请选择设备名称"
              stationName = {getFieldValue('stations').length > 0 ? getFieldValue('stations')[0].stationName : ""}
              deviceType = {this.getDeviceType(getFieldValue('deviceTypeCode'))}
              deviceAreaCode={this.state.deviceAreaCode}
              onChangeArea={this.onChangeArea}
              deviceTypeItems={this.props.deviceTypeItems}
              deviceAreaItems={this.props.deviceAreaItems}
              deviceItems={this.props.deviceItems}
              loadDeviceList={this.loadDeviceList}
            />
          )}
        </FormItem>
        <FormItem label={'缺陷类型：'} {...formItemLayout}>
          {getFieldDecorator('defectTypeCode', {
            rules: [{ required: true, message: '请选择缺陷类型' }],
            initialValue: defaultDefectType && defaultDefectType.defectTypeCode || null,
          })(
            <Select placeholder={'请选择缺陷类型'} disabled={defectTypes.length === 0}>
              {defectTypes.map(e=>(<Option key={e.defectTypeCode} value={e.defectTypeCode}>{e.defectTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem  label={'缺陷级别：'} {...formItemLayout}>
          {getFieldDecorator('defectLevel', {
            rules: [{ required: true, message: '请选择缺陷级别' }],
            initialValue: editNewDefect && defectDetail.defectLevel || null,
          })(
            <Select placeholder={'请选择缺陷级别'} disabled={defectTypes.length === 0}>
              <Option value={1}>一级</Option>
              <Option value={2}>二级</Option>
              <Option value={3}>三级</Option>
              <Option value={4}>四级</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label={'缺陷描述：'} {...formItemLayout}>
          {getFieldDecorator('defectDescribe', {
            rules: [{ required: true, message: '请输入缺陷描述' }],
            initialValue: editNewDefect && defectDetail.defectDescribe || null,
          })(
            <TextArea placeholder={'请输入缺陷描述'} />
          )}
        </FormItem>
        <FormItem label={'添加图片：'} {...formItemLayout}>
          {getFieldDecorator('imgDescribe', {
            rules: [{ required: false, message: '请上传图片' }],
            initialValue: imgDescribe || [],
            valuePropName:'data',
          })(
            <ImgUploader uploadPath={`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
          )}
        </FormItem>
        <h3>处理信息</h3>
        <FormItem label={'处理结果：'} {...formItemLayout}>
          {getFieldDecorator('defectSolveResult', {
            rules: [{ required: true, message: '选择处理结果' }],
            initialValue: editNewDefect && defectDetail.handleData.defectSolveResult || '1',
          })(
            <FormHanleButtons onDefectFinishChange={this.onDefectFinishChange} />
          )}
        </FormItem>
        {!defectFinished && <FormItem label={'处理建议：'} {...formItemLayout}>
          {getFieldDecorator('defectSolveInfo', {
            rules: [{ required: true, message: '请输入处理建议' }],
            initialValue: editNewDefect && defectDetail.handleData.defectSolveInfo || '',
          })(
            <TextArea placeholder={'请描述处理建议，不超过80字'} />
          )}
        </FormItem>}
        {defectFinished && <FormItem label={'处理过程：'} {...formItemLayout}>
          {getFieldDecorator('defectSolveInfo', {
            rules: [{ required: true, message: '请输入处理过程' }],
            initialValue: editNewDefect && defectDetail.handleData.defectSolveInfo || ''
          })(
            <SolveTextArea />
          )}
        </FormItem>}
        <FormItem label={'添加照片：'} {...formItemLayout}>
          {getFieldDecorator('imgHandle', {
            rules: [{ required: false, message: '请上传图片' }],
            initialValue: [],
            valuePropName:'data',
          })(
            <ImgUploader uploadPath={`${pathConfig.basePaths.newAPIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
          )}
        </FormItem>
        {defectFinished && <FormItem label={'更换部件：'} {...formItemLayout}>
          <div>
            <Switch checked={this.state.checked} onChange={this.onChangeReplace} />
            {this.state.checked && getFieldDecorator('replaceParts', {
              rules: [{ 
                required: true, 
                message: '请输入更换备件'
              }],
            })(
              <Input placeholder={'备件名称+型号'} />
            )}
          </div>
        </FormItem>}
        <div>
          <Button onClick={this.onCancelCreat}>取消</Button>
          <Button onClick={this.onDefectCreat}>提交</Button>
        </div>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;