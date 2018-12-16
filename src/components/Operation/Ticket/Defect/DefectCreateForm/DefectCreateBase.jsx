import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import { Form, Input, Button, Select, Switch, Radio, Cascader } from 'antd';
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
    stationName: PropTypes.string,//电站名称
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
    changeCommonStore: PropTypes.func,
    defectDetail: PropTypes.object,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
    commonList: PropTypes.object,
    error: PropTypes.object,
    getSliceDevices: PropTypes.func,
    getLostGenType: PropTypes.func,
    allSeries: PropTypes.object,
    firstPartitionCode: PropTypes.string,
  };
  constructor(props) {
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

  onStationSelected = (stations) => {
    const selectedStation = stations && stations[0] || {};
    const stationCodes = selectedStation.stationCode || 0;
    const stationType = selectedStation.stationType;
    this.props.getStationDeviceTypes({ stationCodes });
    this.props.getLostGenType({
      stationType,
      objectType: 1
    });
    this.props.changeCommonStore({ devices: [] });
    this.props.form.setFieldsValue({ deviceTypeCode: null, defectTypeCode: null });
  }

  onChangeDeviceType = (deviceTypeCode) => { // 设备
    const { stations, form } = this.props;
    const stationCode = form.getFieldValue('stations')[0].stationCode;
    const selectedStationInfo = stations.find(e => e.stationCode === stationCode) || {};
    const stationType = selectedStationInfo.stationType;
    let params = {
      stationCode,
      deviceTypeCode
    };

    if (deviceTypeCode === 509) { //组串时，请求调整
      this.props.getSliceDevices(params);
      this.props.getLostGenType({
        stationType,
        objectType: 1,
        deviceTypeCode
      })
    } else {
      this.props.getDevices(params);
      this.props.getStationAreas(params);
      this.props.getLostGenType({
        stationType,
        objectType: 1,
        deviceTypeCode
      })
    }

  }

  onDefectCreate = (isContinueAdd) => {
    const { error, form, onDefectCreateNew, submitDefect, showContainer, defectDetail, changeCommonStore } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 电站类型(0:风电，1光伏，2：全部)
        let { stationCode, stationType } = values.stations[0];
        let deviceCode = values.deviceCode;
        let partitionCode = values.stations[0].zoneCode;
        let partitionName = values.stations[0].zoneName;
        let rotatePhotoArray = [];
        let photoAddress = [];
        if (showContainer === 'create') {
          photoAddress = values.imgDescribe.map(e => {
            rotatePhotoArray.push(`${e.response},${e.rotate}`);
            return e.response;
          }).join(',');
        } else if (showContainer === 'edit') {
          photoAddress = values.imgDescribe.map(e => {
            rotatePhotoArray.push(`${e.thumbUrl},${e.rotate}`);
            return e.thumbUrl;
          }).join(',');
        }
        let photoSolveAddress = values.imgHandle && values.imgHandle.map(e => {
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return e.response
        }).join(',');
        let rotatePhoto = rotatePhotoArray.join(';');
        delete values.stations;
        delete values.imgDescribe;
        delete values.imgHandle;
        let params = {
          ...values,
          defectTypeCode: values.defectTypeCode[1],
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
        if (showContainer === 'create') {
          onDefectCreateNew(params);
          changeCommonStore({
            stationDeviceTypes: [],
            devices: [],
          })
        } else if (showContainer === 'edit') {
          params.defectId = defectDetail.defectId;
          submitDefect(params);
        }
        if (isContinueAdd && error.get('code') === '') {
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
    if (index !== -1) {
      deviceType = this.props.deviceTypeItems.getIn([index, 'deviceTypeName']);
    }
    return deviceType;
  }

  loadDeviceList = (areaCode) => {
    const { form, getDevices, getSliceDevices } = this.props;
    const deviceTypeCode = form.getFieldValue('deviceTypeCode');
    let params = {
      stationCode: form.getFieldValue('stations')[0].stationCode,
      deviceTypeCode,
    };
    areaCode && (params.partitionCode = areaCode);
    if (deviceTypeCode === 509 && !areaCode) { // 光伏组件卸载。
      getSliceDevices(params);
    } else {
      getDevices(params);
    }
  }


  render() {
    let { stations, stationName, deviceTypes, devices, defectTypes, deviceItems, defectDetail, showContainer, allSeries, firstPartitionCode } = this.props;
    console.log('stations', this.props)
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defectFinished = getFieldValue('defectSolveResult') === '0';
    const editDefect = showContainer === 'edit';
    const stationCode = getFieldValue('stations') && getFieldValue('stations')[0] && getFieldValue('stations')[0].stationCode || [];
    // 所需要的
    const defaultStations = editDefect && stations.filter(e => e.stationCode === defectDetail.stationCode) || [];
    const defaultDeviceType = editDefect && deviceTypes.find(e => e.deviceTypeCode === defectDetail.deviceTypeCode) || null;
    const defaultDevice = editDefect && devices.find(e => e.deviceCode === defectDetail.deviceCode) || null;
    // 缺陷类型
    const canSelectDefectType = getFieldValue('stations') && getFieldValue('deviceTypeCode');
    let tmpGenTypes = [];
    let defaultDefectType = [];
    defectTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = tmpGenTypes.map(ele => {
      let innerArr = { children: [] };
      innerArr.label = ele.name;
      innerArr.value = ele.id;
      ele && ele.list && ele.list.length > 0 && ele.list.forEach(innerInfo => {
        if (editDefect && `${defectDetail.defectTypeCode}` === `${innerInfo.id}`) {
          defaultDefectType = [ele.id, innerInfo.id];
        }
        innerArr.children.push({
          label: innerInfo.name,
          value: innerInfo.id,
        });
      })
      return innerArr;
    })
    const imgDescribe = editDefect && defectDetail.photoAddress && defectDetail.photoAddress.split(',').filter(e => !!e).map((e, i) => ({
      uid: i,
      rotate: 0,
      status: 'done',
      thumbUrl: e,
    }));


    return (
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
            <Select style={{ width: 198 }} placeholder="请选择" disabled={deviceTypes.length === 0} onChange={this.onChangeDeviceType}>
              {deviceTypes.map(e => (<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="设备名称" colon={false}>
          {getFieldDecorator('deviceCode', {
            rules: [{ required: true, message: '请选择设备名称' }],
            initialValue: defaultDevice && defaultDevice.deviceCode || undefined
          })(
            <DeviceName
              stationName={stationName}
              allSeries={allSeries}
              disabled={deviceItems.size === 0}
              placeholder="输入关键字快速查询"
              deviceAreaItems={this.props.deviceAreaItems}
              deviceItems={deviceItems}
              stationCode={stationCode}
              deviceAreaCode={this.state.deviceAreaCode}
              deviceTypeCode={getFieldValue('deviceTypeCode')}
              deviceType={this.getDeviceType(getFieldValue('deviceTypeCode'))}
              onChangeArea={this.onChangeArea}
              loadDeviceList={this.loadDeviceList}
              firstPartitionCode={firstPartitionCode}
            />
          )}
          <div className={styles.tipText}>(点击<i className="iconfont icon-filter" />图标可选择)</div>
        </FormItem>
        <FormItem label="缺陷类型" colon={false}>
          {getFieldDecorator('defectTypeCode', {
            rules: [{ required: true, message: '请选择缺陷类型' }],
            initialValue: defaultDefectType,
          })(
            <Cascader
              disabled={!canSelectDefectType}
              style={{ width: 198 }}
              options={groupedLostGenTypes}
              expandTrigger="hover"
              placeholder="请选择"
              className={styles.lostTypeSelector}
            />
          )}
        </FormItem>
        <FormItem label="缺陷级别" colon={false}>
          {getFieldDecorator('defectLevel', {
            rules: [{ required: true, message: '请选择缺陷级别' }],
            initialValue: editDefect && defectDetail.defectLevel || undefined
          })(
            <Select style={{ width: 198 }} placeholder="请选择" disabled={defectTypes.length === 0}>
              <Option value={1}>A级</Option>
              <Option value={2}>B级</Option>
              <Option value={3}>C级</Option>
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
              valuePropName: 'data',
            })(
              <ImgUploader imgStyle={{ width: 98, height: 98 }}
                uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`}
                editable={true} />
            )}
          </div>
        </FormItem>
      </div>

    );
  }
}


export default Form.create()(TmpForm);