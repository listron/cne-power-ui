import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import { Form, Input, Button, Select, Switch, Radio, Cascader } from 'antd';
import pathConfig from '../../../../../constants/path';
import styles from './defectCreateForm.scss';
import DeviceName from '../../../../Common/NewDeviceName';
import InputLimit from '../../../../Common/InputLimit';
// import CommonInput from '../../../../Common/CommonInput';
import CommonInput from '../../../../Common/CommonInput/index1';
import DeviceSelect from '../../../../Common/DeviceSelect/index';
import Immutable from 'immutable';
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
    deviceTypes: PropTypes.array,
    partitions: PropTypes.array,
    devices: PropTypes.array,
    commonList: PropTypes.array,
    error: PropTypes.object,
    getSliceDevices: PropTypes.func,
    getLostGenType: PropTypes.func,
    // allSeries: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      deviceAreaCode: '',
    }
  }

  onChangeArea = (value) => { // 改变
    this.setState({
      deviceAreaCode: value
    });
  }

  onChangeReplace = (checked) => { // 更换部件
    this.setState({
      checked: checked,
    });
  }

  onStationSelected = (stations) => { // 电站的选择
    const selectedStation = stations && stations[0] || {};
    const stationCodes = selectedStation.stationCode || null;
    this.props.getStationDeviceTypes({ stationCodes });
    this.props.changeCommonStore({ devices: [] });
    this.props.form.setFieldsValue({ deviceTypeCode: null, defectTypeCode: null });
  }

  onChangeDeviceType = (deviceTypeCode) => { // 选择设备类型
    const { form } = this.props;
    const selectStation = form.getFieldValue('stations')[0];
    const stationCode = selectStation.stationCode; // 电站编码
    const stationType = selectStation.stationType;  // 电站类型
    let params = {
      stationCode,
      deviceTypeCode
    };
    this.props.changeCommonStore(params)
    this.props.getLostGenType({
      stationType,
      objectType: 1,
      deviceTypeCode
    })
  }

  onDefectCreate = (isContinueAdd) => { // 保存的状态
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
        }
        if (showContainer === 'edit') {
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
        }
        if (showContainer === 'edit') {
          params.defectId = defectDetail.defectId;
          submitDefect(params);
        }
        if (isContinueAdd && error.get('code') === '') {
          this.props.form.resetFields();
        }
      }
    });
  }

  getDeviceType = (code) => { //  获取设备类型
    let deviceType = ''
    const { deviceTypes } = this.props;
    let index = deviceTypes.findIndex((item) => {
      return item.deviceTypeCode === code
    });
    if (index !== -1) {
      deviceType = deviceTypes[index].deviceTypeName;
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
    let { stations, stationName, deviceTypes, devices, defectTypes, defectDetail, showContainer, allSeries, commonList, deviceTypeCode} = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defectFinished = getFieldValue('defectSolveResult') === '0';
    const editDefect = showContainer === 'edit';
    const stationCode = getFieldValue('stations') && getFieldValue('stations')[0] && getFieldValue('stations')[0].stationCode || [];

    const defaultStations = editDefect ? stations.filter(e => e.stationCode === defectDetail.stationCode) : [];
    const defaultDeviceType = editDefect ? deviceTypes.find(e => e.deviceTypeCode === defectDetail.deviceTypeCode) : null;
    const defaultDevice = editDefect ? devices.find(e => e.deviceCode === defectDetail.deviceCode) : null;
    const imgDescribe = editDefect && defectDetail.photoAddress && defectDetail.photoAddress.split(',').filter(e => !!e).map((e, i) => ({
      uid: i,
      rotate: 0,
      status: 'done',
      thumbUrl: e,
    }));
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
    const canSelectDefectType = getFieldValue('stations') && getFieldValue('deviceTypeCode');

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
              <Select style={{ width: 198 }} placeholder="请选择" disabled={deviceTypes.length === 0} onChange={this.onChangeDeviceType}>
                {deviceTypes.map(e => (<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备名称" colon={false}>
            {/* {getFieldDecorator('deviceCode', {
              rules: [{ required: true, message: '请选择设备名称' }],
              initialValue: defaultDevice && defaultDevice.deviceCode || undefined
            })(
              <DeviceName
                stationName={stationName}
                // allSeries={Immutable.fromJS(allSeries)}
                allSeries={allSeries}
                disabled={devices.length === 0}
                placeholder="输入关键字快速查询"
                deviceAreaItems={this.props.partitions}
                deviceItems={devices}
                stationCode={stationCode}
                deviceAreaCode={this.state.deviceAreaCode}
                deviceTypeCode={getFieldValue('deviceTypeCode')}
                deviceType={this.getDeviceType(getFieldValue('deviceTypeCode'))}
                onChangeArea={this.onChangeArea}
                loadDeviceList={this.loadDeviceList}
                firstPartitionCode={firstPartitionCode}
              />
            )} */}

            {getFieldDecorator('deviceCode', {
              rules: [{ required: true, message: '请选择设备名称' }],
              initialValue: [],
            })(
              <DeviceSelect
                // disabled={disableDevice}
                stationCode={stationCode}
                deviceTypeCode={deviceTypeCode}
                multiple={true}
                style={{ width: 'auto', minWidth: '198px' }}
              // onChange={this.selectedDevice}
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
              initialValue: editDefect && defectDetail.defectLevel || undefined,
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
              <InputLimit placeholder="请描述，不超过80个汉字" width={400} />
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
                <ImgUploader imgStyle={{ width: 98, height: 98 }} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
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
          {
            defectFinished &&
            <React.Fragment>
              <FormItem label="处理过程" colon={false}>
                {getFieldDecorator('defectSolveInfo', {
                  rules: [{ required: true, message: '请输入处理过程' }],
                  initialValue: editDefect && defectDetail.handleData.defectSolveInfo || ''
                })(
                  <CommonInput commonList={commonList} placeholder="请描述，不超过80个汉字" />
                )}
              </FormItem>
              <FormItem label="添加照片" colon={false}>
                <div className={styles.addImg}>
                  <div className={styles.maxTip}>最多4张</div>
                  {getFieldDecorator('imgHandle', {
                    rules: [{ required: false, message: '请上传图片' }],
                    initialValue: [],
                    valuePropName: 'data',
                  })(
                    <ImgUploader imgStyle={{ width: 98, height: 98 }} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
                  )}
                </div>
              </FormItem>
              <FormItem label="更换部件" colon={false}>
                <div>
                  <Switch checked={this.state.checked} onChange={this.onChangeReplace} />
                  {this.state.checked && getFieldDecorator('replaceParts', {
                    rules: [{
                      required: true,
                      message: '请输入更换备件'
                    }],
                  })(
                    <Input style={{ marginLeft: 20 }} placeholder="备件名称+型号" />
                  )}
                </div>
              </FormItem>
            </React.Fragment>
          }
          <div className={styles.actionBar}>
            <Button className={styles.saveBtn} onClick={() => this.onDefectCreate(false)}>保存</Button>
            {!editDefect && <Button onClick={() => this.onDefectCreate(true)}>保存并继续添加</Button>}
          </div>
          {!editDefect && <div className={styles.addTips}></div>}
        </div>
      </Form>
    );
  }
}


export default Form.create()(TmpForm);