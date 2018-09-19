import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import { Form, Input, Button, Select, Switch, Radio } from 'antd';
import pathConfig from '../../../../../constants/path';
import styles from './defectCreateForm.scss';
import DeviceName from '../../../../Common/DeviceName';
import InputLimit from '../../../../Common/InputLimit';
import CommonInput from '../../../../Common/CommonInput';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    devices: PropTypes.array,
    defectTypes: PropTypes.array,
    getStationDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    getDevices: PropTypes.func,
    getStationAreas: PropTypes.func,
    onDefectCreateNew: PropTypes.func,
    submitDefect: PropTypes.func,
    showContainer: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
    defectDetail: PropTypes.object,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
    commonList: PropTypes.object,
    error: PropTypes.object,
  };
  constructor(props){
    super(props);
    this.state = {
      checked: false,
      deviceAreaCode: '',
    }
  }

  onChangeArea = (value) => {
    this.setState({
      deviceAreaCode: value
    });
  }

  onChangeReplace = (checked) => {
    this.setState({
      checked: checked,
    });
  }

  onStationSelected = (stations) =>{
    const stationCodes = (stations && stations[0] && stations[0].stationCode) || 0;
    const stationType = stations && stations[0] && stations[0].stationType;
    this.props.getStationDeviceTypes({stationCodes});
    this.props.getDefectTypes({stationType});
  }

  onChangeDeviceType = (deviceTypeCode) => {
    let params = {
      stationCode: this.props.form.getFieldValue('stations')[0].stationCode,
      deviceTypeCode
    };
    this.props.getDevices(params);
    this.props.getStationAreas(params);
  }

  onDefectCreate = (isContinueAdd) => {
    const { error, form, onDefectCreateNew, submitDefect, showContainer, defectDetail } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 电站类型(0:风电，1光伏，2：全部)
        let {stationCode,stationType} = values.stations[0];
        let deviceCode = values.deviceCode;
        let partitionCode = values.stations[0].zoneCode;
        let partitionName = values.stations[0].zoneName;
        let rotatePhotoArray = [];
        let photoAddress = values.imgDescribe.map(e=>{
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return e.response
        }).join(',');
        let photoSolveAddress = values.imgHandle&&values.imgHandle.map(e=>{
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return  e.response
        }).join(',');
        let rotatePhoto = rotatePhotoArray.join(';');
        delete values.stations;
        delete values.imgDescribe;
        delete values.imgHandle;
        let params = {
          ...values,
          isContinueAdd,
          stationCode,
          stationType,
          deviceCode,
          partitionCode,
          partitionName,
          photoAddress,
          photoSolveAddress,
          rotatePhoto,
        };
        if(showContainer === 'create') {
          onDefectCreateNew(params);
        } else if(showContainer === 'edit') {
          params.defectId = defectDetail.defectId;
          submitDefect(params);
        }
        if(isContinueAdd && error.get('code') === '') {
          this.props.form.resetFields();
        }
      }
    });
  }
  
  getDeviceType = (code) => {
    let deviceType = ''
    let index = this.props.deviceTypeItems.findIndex((item) => {
      return item.get('deviceTypeCode') === code
    });
    if(index !== -1) {
      deviceType = this.props.deviceTypeItems.getIn([index, 'deviceTypeName']);
    }
    return deviceType;
  }



  loadDeviceList = (areaCode) => {
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
    const {stations, deviceTypes, devices, defectTypes,deviceItems, defectDetail, showContainer } = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const defectFinished = getFieldValue('defectSolveResult') === '0';
    const editDefect = showContainer === 'edit';
    const defaultStations = editDefect ? stations.filter(e=>e.stationCode===defectDetail.stationCode) : [] ;
    const defaultDeviceType = editDefect ? deviceTypes.find(e=>e.deviceTypeCode===defectDetail.deviceTypeCode) : null;
    const defaultDevice = editDefect ? devices.find(e=>e.deviceCode===defectDetail.deviceCode) : null;
    const defaultDefectType = editDefect ? defectTypes.find(e=>e.defectTypeCode===defectDetail.defectTypeCode) : null ;
    const imgDescribe = editDefect && defectDetail.photoAddress && defectDetail.photoAddress.split(',').filter(e=>!!e).map((e,i)=>({
      uid: i,    
      rotate: 0,  
      status: 'done',  
      thumbUrl: e,  
    }))
    return (
      <Form className={styles.defectCreateForm}>
        <div className={styles.basicInfo}>
          <div className={styles.title}>
            基本信息
            <i className="iconfont icon-content" />
          </div>
          <FormItem label="电站名称" colon={false}>
            {getFieldDecorator('stations', {
              rules: [{ required: true, message: '请选择电站' }],
              initialValue: defaultStations,
            })(
              <StationSelect data={stations} multiple={false} onOK={this.onStationSelected} />
            )}
            <div className={styles.tipText}>(点击<i className="iconfont icon-filter" />图标可选择)</div>
          </FormItem>
          <FormItem label="设备类型" colon={false}>
            {getFieldDecorator('deviceTypeCode', {
              rules: [{ required: true, message: '请选择设备类型' }],
              initialValue: defaultDeviceType && defaultDeviceType.deviceTypeCode || undefined,
            })(
              <Select style={{width:198}} placeholder="请选择" disabled={deviceTypes.length === 0} onChange={this.onChangeDeviceType}>
                {deviceTypes.map(e=>(<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备名称" colon={false}>
            {getFieldDecorator('deviceCode',{
              rules: [{ required: true, message: '请选择设备名称' }],
              initialValue: defaultDevice && defaultDevice.deviceCode || undefined
            })(
              <DeviceName  
                disabled={deviceItems.size===0}
                placeholder="输入关键字快速查询"
                deviceAreaItems={this.props.deviceAreaItems}
                deviceItems={this.props.deviceItems}
                deviceAreaCode={this.state.deviceAreaCode}
                deviceType={this.getDeviceType(getFieldValue('deviceTypeCode'))}
                onChangeArea={this.onChangeArea}
                loadDeviceList={this.loadDeviceList}
              />
            )}
            <div className={styles.tipText}>(点击<i className="iconfont icon-filter" />图标可选择)</div>
          </FormItem>
          <FormItem label="缺陷类型" colon={false}>
            {getFieldDecorator('defectTypeCode', {
              rules: [{ required: true, message: '请选择缺陷类型' }],
              initialValue: defaultDefectType && defaultDefectType.defectTypeCode || undefined,
            })(
              <Select style={{width:198}} placeholder="请选择" disabled={defectTypes.length === 0}>
                {defectTypes.map(e=>(<Option key={e.defectTypeCode} value={e.defectTypeCode}>{e.defectTypeName}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem  label="缺陷级别" colon={false}>
            {getFieldDecorator('defectLevel', {
              rules: [{ required: true, message: '请选择缺陷级别' }],
              initialValue: editDefect && defectDetail.defectLevel || undefined,
            })(
              <Select style={{width:198}}  placeholder="请选择" disabled={defectTypes.length === 0}>
                <Option value={1}>一级</Option>
                <Option value={2}>二级</Option>
                <Option value={3}>三级</Option>
                <Option value={4}>四级</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="缺陷描述" colon={false}>
            {getFieldDecorator('defectDescribe', {
              rules: [{ required: true, message: '请输入缺陷描述' }],
              initialValue: editDefect && defectDetail.defectDescribe || null,
            })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>
          <FormItem label="添加图片" colon={false}>
            <div className={styles.addImg}>
              <div className={styles.maxTip}>最多4张</div>
              {getFieldDecorator('imgDescribe', {
                rules: [{ required: false, message: '请上传图片' }],
                initialValue: imgDescribe || [],
                valuePropName:'data',
              })(
                <ImgUploader imgStyle={{width:98,height:98}} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
              )}
            </div>
          </FormItem>
        </div>
        <div className={styles.dealInfo}>
          <div className={styles.title}>
            处理信息
            <i className="iconfont icon-content" />
          </div>
          <FormItem label="处理结果" colon={false}>
            {getFieldDecorator('defectSolveResult', {
              rules: [{ required: true, message: '选择处理结果' }],
              initialValue: editDefect && defectDetail.handleData.defectSolveResult || '1',
            })(
              <RadioGroup>
                <RadioButton value="1">未解决</RadioButton>
                <RadioButton value="0">已解决</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          {!defectFinished && <FormItem label="处理建议" colon={false}>
            {getFieldDecorator('defectSolveInfo', {
              initialValue: editDefect && defectDetail.handleData.defectProposal || '',
            })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>}
          {defectFinished && <FormItem label="处理过程" colon={false}>
            {getFieldDecorator('defectSolveInfo', {
              rules: [{ required: true, message: '请输入处理过程' }],
              initialValue: editDefect && defectDetail.handleData.defectSolveInfo || ''
            })(
              <CommonInput commonList={this.props.commonList} placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>}
          {defectFinished && <FormItem label="添加照片" colon={false}>
            <div className={styles.addImg}>
              <div className={styles.maxTip}>最多4张</div>
              {getFieldDecorator('imgHandle', {
                rules: [{ required: false, message: '请上传图片' }],
                initialValue: [],
                valuePropName:'data',
              })(
                <ImgUploader imgStyle={{width:98,height:98}} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
              )}
            </div>
          </FormItem>}
          {defectFinished && <FormItem label="更换部件" colon={false}>
            <div>
              <Switch checked={this.state.checked} onChange={this.onChangeReplace} />
              {this.state.checked && getFieldDecorator('replaceParts', {
                rules: [{ 
                  required: true, 
                  message: '请输入更换备件'
                }],
              })(
                <Input style={{marginLeft: 20}} placeholder="备件名称+型号" />
              )}
            </div>
          </FormItem>}
          <div className={styles.actionBar}>
            <Button className={styles.saveBtn} onClick={()=>this.onDefectCreate(false)}>保存</Button>
            {!editDefect&&<Button onClick={()=>this.onDefectCreate(true)}>保存并继续添加</Button>}
          </div>
          {!editDefect&&<div className={styles.addTips}>
            <span>选择“保存”按钮后将跳转到对应的列表页；</span>
            <span>选择“保存并继续添加”按钮会停留在添加页面</span>
          </div>}
        </div>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;