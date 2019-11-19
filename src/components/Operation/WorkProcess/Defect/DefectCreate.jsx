import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, Switch, Radio, Cascader, Modal, Icon, Tooltip } from 'antd';
import pathConfig from '@constants/path';
import styles from './defect.scss';
import StationSelect from '../../../Common/StationSelect';
import ImgUploader from '../../../Common/Uploader/ImgUploader';
import InputLimit from '../../../Common/InputLimit';
import DeviceSelect from '../../../Common/DeviceSelect/index';
import DefectProcessForm from './DefectProcessForm';
import SolutionLibrary from './SolutionLibrary';
const FormItem = Form.Item;
const Option = Select.Option;

class DefectCreate extends Component {
  static propTypes = {
    form: PropTypes.object,
    stationName: PropTypes.string, //电站名称
    stations: PropTypes.array,
    defectDetail: PropTypes.object,
    getKnowledgebase: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    changeStore: PropTypes.func,
    likeKnowledgebase: PropTypes.func,
    editDefect: PropTypes.bool,
    commonList: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,

  };

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      deviceAreaCode: '',
      deviceTypeCode: '',
      dealVisible: false,
    };
  }



  componentWillReceiveProps(nextProps) {
    const { stationCode, defectTypeCode, deviceTypeCode, stationType } = nextProps.defectDetail;
    if (stationCode) {
      this.props.getKnowledgebase({ deviceTypeCodes: [deviceTypeCode], faultTypeIds: [defectTypeCode], type: +stationType });
      this.props.getStationDeviceTypes({ stationCodes: stationCode });
    }
  }


  componentWillUnmount() {
    this.props.changeStore({ defectDetail: {}, knowledgebaseList: [] });
  }


  onStationSelected = (stations) => { // 电站的选择
    const selectedStation = stations && stations[0] || {};
    const stationCodes = selectedStation.stationCode || null;
    this.props.getStationDeviceTypes({ stationCodes });
    this.props.changeStore({ devices: [] });
    this.props.form.setFieldsValue({ stations: stations, deviceTypeCode: null, defectTypeCode: null, deviceCode: null });
  }

  onChangeDeviceType = (deviceTypeCode) => { // 选择设备类型
    const { form } = this.props;
    const selectStation = form.getFieldValue('stations')[0];
    const stationCode = selectStation.stationCode; // 电站编码
    const stationType = selectStation.stationType; // 电站类型
    const params = {
      stationCode,
      deviceTypeCode,
    };
    this.setState({ deviceTypeCode: deviceTypeCode });
    this.props.changeStore(params);
    this.props.form.setFieldsValue({ defectTypeCode: null, deviceCode: null });
    this.props.getLostGenType({
      stationType,
      objectType: 1,
      deviceTypeCode,
    });
  }

  selectedDevice = (value) => { // 选择设备
    this.props.form.setFieldsValue({ deviceCode: value });
  }

  defectTypeChange = (value) => { // 选择缺陷类型 deviceTypeCode  faultTypeId
    const { getFieldValue } = this.props.form;
    const faultTypeId = value.length > 0 && value[1] || '';
    const deviceTypeCode = getFieldValue('deviceTypeCode'); // 设备code
    const selectStation = getFieldValue('stations')[0] || {};
    const stationType = selectStation.stationType; // 电站类型
    this.props.getKnowledgebase({ faultTypeIds: [faultTypeId], deviceTypeCodes: [deviceTypeCode], type: stationType });
  }

  onDefectCreate = (isContinueAdd) => { // 保存的状态
    const { error, form, onDefectCreateNew, submitDefect, container, defectDetail, changeStore } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 电站类型(0:风电，1光伏，2：全部)
        const { stationCode, stationType } = values.stations[0];
        const deviceCode = values.deviceCode[0].deviceCode;
        const partitionCode = values.stations[0].zoneCode;
        const partitionName = values.stations[0].zoneName;
        const rotatePhotoArray = [];
        let photoAddress = [];
        const reasonDesc = values.reasonDesc || '';
        if (container === 'create') {
          photoAddress = values.imgDescribe.map(e => {
            rotatePhotoArray.push(`${e.response},${e.rotate}`);
            return e.response;
          }).join(',');
        }
        if (container === 'edit') {
          photoAddress = values.imgDescribe.map(e => {
            rotatePhotoArray.push(`${e.thumbUrl},${e.rotate}`);
            return e.thumbUrl;
          }).join(',');
        }
        const photoSolveAddress = values.imgHandle && values.imgHandle.map(e => {
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return e.response;
        }).join(',');
        const rotatePhoto = rotatePhotoArray.join(';');
        delete values.stations;
        delete values.imgDescribe;
        delete values.imgHandle;
        const params = {
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
          reasonDesc,
        };
        if (container === 'create') {
          onDefectCreateNew(params);
          changeStore({
            stationDeviceTypes: [],
            devices: [],
          });
        }
        if (container === 'edit') {
          params.defectId = defectDetail.defectId;
          submitDefect(params);
        }
        if (isContinueAdd) {
          this.props.form.resetFields();
        }
      }
    });
  }



  toolTip = () => {
    return (<div>
      <p>A类缺陷：指发生了直接威胁设备安全运行并需理解处理的缺陷</p>
      <p>B类缺陷：指针对设备有严重威胁，暂时能坚持运行但需要尽快处理的缺陷</p>
      <p>C类缺陷：指不停止主设备运行，不影响设备和全场出力情况即可消缺缺陷</p>
    </div>);
  }


  render() {
    const { stations, deviceTypes, defectTypes, defectDetail, commonList, knowledgebaseList, form, editDefect = false, theme = 'light' } = this.props;
    const { stationCode } = defectDetail;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defectCategory = getFieldValue('defectCategory'); // 缺陷分类
    const currentStations = getFieldValue('stations'); // 电站
    const deviceTypeCode = getFieldValue('deviceTypeCode'); // 设备code
    const imgDescribe = defectDetail.photoAddress && defectDetail.photoAddress.split(',').filter(e => !!e).map((e, i) => ({
      uid: i,
      rotate: 0,
      status: 'done',
      thumbUrl: e,
    }));
    // 缺陷类型
    const tmpGenTypes = [];
    let defaultDefectType = [];
    defectTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = [];
    tmpGenTypes.forEach(ele => {
      if (ele && ele.list && ele.list.length > 0) {
        const innerArr = { children: [] };
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
        });
        groupedLostGenTypes.push(innerArr);
      }
    });
    const canSelectDefectType = currentStations && deviceTypeCode;
    return (
      <Form className={`${styles.defectCreateForm} ${styles[theme]}`} >
        <span ref="toolTip"></span>
        <div className={styles.basicInfo}>
          <div className={styles.title}>
            基本信息  <i className="iconfont icon-content" />
          </div>
          <FormItem label="缺陷分类" colon={false}>
            {getFieldDecorator('defectCategory', {
              rules: [{ required: true, message: '选择验收结果' }],
              initialValue: 'device',
            })(
              <Radio.Group>
                <Radio.Button value="device">设备缺陷</Radio.Button>
                <Radio.Button value="other">其他缺陷</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="电站名称" colon={false}>
            {getFieldDecorator('stations', {
              rules: [{ required: true, message: '请选择电站' }],
              initialValue: stations.filter(e => e.stationCode === stationCode),
            })(
              <StationSelect data={stations} multiple={false} onOK={this.onStationSelected} />
            )}
            <div className={styles.tipText}>(点击<i className="iconfont icon-filter" />图标可选择)</div>
          </FormItem>
          {defectCategory === 'device' &&
            <React.Fragment>
              <FormItem label="设备类型" colon={false}>
                {getFieldDecorator('deviceTypeCode', {
                  rules: [{ required: true, message: '请选择设备类型' }],
                  initialValue: defectDetail.deviceTypeCode || null,
                })(
                  <Select
                    style={{ width: 198 }} placeholder="请选择" disabled={deviceTypes.length === 0}
                    onChange={this.onChangeDeviceType}>
                    {deviceTypes.map(e => (<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="设备名称" colon={false}>
                {getFieldDecorator('deviceCode', {
                  rules: [{ required: true, message: '请选择设备名称' }],
                  initialValue: defectDetail.deviceName && [{ deviceCode: defectDetail.deviceCode, deviceName: defectDetail.deviceName }] || null,
                })(
                  <DeviceSelect
                    disabled={deviceTypeCode ? false : true}
                    stationCode={stationCode}
                    deviceTypeCode={deviceTypeCode}
                    style={{ width: 'auto', minWidth: '198px' }}
                    onChange={this.selectedDevice}
                    holderText={'请选择'}
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
                    onChange={this.defectTypeChange}
                  />
                )}
                {knowledgebaseList.length > 0 && <SolutionLibrary knowledgebaseList={knowledgebaseList} likeKnowledgebase={this.props.likeKnowledgebase} />}
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
                <Tooltip overlayClassName={styles.overlay} placement="top" title={this.toolTip} getPopupContainer={() => this.refs.toolTip}>
                  <i className="iconfont icon-help" />
                </Tooltip>
              </FormItem>
            </React.Fragment>}
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
          <div className={styles.title}> 处理信息<i className="iconfont icon-content" /> </div>
          <DefectProcessForm form={form} commonList={commonList} />
          <div className={styles.actionBar}>
            <Button className={styles.saveBtn} onClick={() => this.onDefectCreate(false)}>保存</Button>
            {!editDefect && <Button onClick={() => this.onDefectCreate(true)}>保存并继续添加</Button>}
          </div>
        </div>
      </Form>
    );
  }
}


export default Form.create()(DefectCreate);
