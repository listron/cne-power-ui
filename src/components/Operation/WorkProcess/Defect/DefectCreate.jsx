import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Select, Radio, Cascader, Tooltip, DatePicker } from 'antd';
import pathConfig from '@constants/path';
import styles from './defect.scss';
import StationSelect from '../../../Common/StationSelect';
import ImgUploader from '../../../Common/Uploader/ImgUploader';
import InputLimit from '../../../Common/InputLimit';
import DeviceSelect from '../../../Common/DeviceSelect/index';
import DefectProcessForm from './DefectProcessForm';
import SolutionLibrary from './SolutionLibrary';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class DefectCreate extends Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    defectDetail: PropTypes.object,
    getKnowledgebase: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    likeKnowledgebase: PropTypes.func,
    editDefect: PropTypes.bool,
    commonList: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    getLostGenType: PropTypes.func,
    theme: PropTypes.string,
    createDefect: PropTypes.func,
    history: PropTypes.object,
    knowledgebaseList: PropTypes.array,
    changeStore: PropTypes.func,

  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { defectDetail = {} } = this.props;
    const { stationCode, deviceTypeCode, defectTypeCode, stationType } = defectDetail;
    if (stationCode) {
      this.props.getStationDeviceTypes({ stationCodes: stationCode }); // 设备类型
      this.props.getKnowledgebase({ faultTypeIds: [defectTypeCode], deviceTypeCodes: [deviceTypeCode], type: +stationType });
      this.props.getLostGenType({ stationType, objectType: 1, deviceTypeCode }); // 缺陷类型
    }
  }

  componentWillReceiveProps(nextProps) {
    const { defectId, stationCode, deviceTypeCode, defectTypeCode, stationType } = nextProps.defectDetail;
    const prevDefectId = this.props.defectDetail.defectId;
    if (defectId !== prevDefectId) {
      this.props.getStationDeviceTypes({ stationCodes: stationCode }); // 设备类型
      this.props.getKnowledgebase({ faultTypeIds: [defectTypeCode], deviceTypeCodes: [deviceTypeCode], type: +stationType });
      this.props.getLostGenType({ stationType, objectType: 1, deviceTypeCode }); // 缺陷类型
    }
  }


  onStationSelected = (stations) => { // 电站的选择
    const selectedStation = stations && stations[0] || {};
    const stationCodes = selectedStation.stationCode || null;
    if (stationCodes) {
      this.props.getStationDeviceTypes({ stationCodes }); // 获取设备类型
    }
    this.props.changeStore({ knowledgebaseList: [] });
    this.props.form.setFieldsValue({ stations: stations, deviceTypeCode: null, defectTypeCode: null, deviceCodeArr: [] });
  }

  onChangeDeviceType = (deviceTypeCode) => { // 选择设备类型
    const { form } = this.props;
    const selectStation = form.getFieldValue('stations')[0];
    const { stationType } = selectStation; // 电站编码 电站类型
    this.props.form.setFieldsValue({ defectTypeCode: null, deviceCodeArr: [] }); // 设备名称和缺陷类型置空
    this.props.getLostGenType({ stationType, objectType: 1, deviceTypeCode }); // 获取缺陷类型 设备名称组件内部调取  
  }

  selectedDevice = (value) => { // 选择设备名称
    this.props.form.setFieldsValue({ deviceCodeArr: value });
  }

  defectTypeChange = (value) => { // 选择缺陷类型 deviceTypeCode  faultTypeId
    const { getFieldValue } = this.props.form;
    const faultTypeId = value.length > 0 && value[1] || '';
    const deviceTypeCode = getFieldValue('deviceTypeCode'); // 设备code
    const selectStation = getFieldValue('stations')[0] || {};
    const { stationType } = selectStation;
    this.props.getKnowledgebase({ faultTypeIds: [faultTypeId], deviceTypeCodes: [deviceTypeCode], type: stationType });
  }

  callBackTableList = () => { // 返回列表页
    const { history } = this.props;
    history.push('/operation/workProcess/view?page=list&tab=defect');
  }

  onDefectCreate = (isContinueAdd) => { // 保存的状态
    const { form, defectDetail } = this.props;
    const { defectId } = defectDetail;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { defectCategory, deviceCodeArr = [], imgDescribe, photoData, stations, defectTypeCode, createTime, ...rest } = values;
        const { stationCode, stationType } = stations[0];
        const { deviceCode = '' } = deviceCodeArr.length > 0 && deviceCodeArr[0];
        const rotatePhotoArray = [];
        let photoAddress = [];
        photoAddress = imgDescribe.map(e => { // 基本信息 照片信息列表
          rotatePhotoArray.push(`${e.response || e.thumbUrl},${e.rotate}`);
          return e.response || e.thumbUrl;
        }).join(',');
        const photoSolveAddress = photoData && photoData.map(e => { // 处理照片过程
          rotatePhotoArray.push(`${e.response},${e.rotate}`);
          return e.response;
        }).join(',');
        const rotatePhoto = rotatePhotoArray.join(';'); //  图片旋转信息
        const initDeviceCode = defectCategory === 'device' && { deviceCode } || {}; // 其他缺陷的时候不传deviceCode
        this.props.createDefect({ // 当为缺陷分类的时候 缺陷类型传0
          ...rest, defectId, stationCode, stationType, photoAddress, photoSolveAddress, rotatePhoto,
          ...initDeviceCode,
          defectTypeCode: defectCategory === 'device' && defectTypeCode[defectTypeCode.length - 1] || 0,
          createTime: moment(createTime).format('YYYY/MM/DD HH:mm'),
          func: this.callBackTableList,
        });

        if (isContinueAdd) { // 保存并继续添加
          this.props.form.resetFields();
        }
      }
    });
  }

  toolTip = () => {
    return (<div>
      <p>A级缺陷：指直接威胁设备安全运行并需理解处理的缺陷</p>
      <p>B级缺陷：指针对设备有严重威胁，暂时能坚持运行但需要尽快处理的缺陷</p>
      <p>C级缺陷：指不停止主设备运行，不影响设备和全场出力情况即可消除缺陷</p>
    </div>);
  }

  dealDefectData = (defectTypes, defectTypeCode) => { // 处理缺陷类型的数据 如果二级数据没有子类，则不显示
    const tmpGenTypes = [];
    let defaultDefectType = [];
    defectTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = [];
    tmpGenTypes.forEach(ele => {
      if (ele && ele.list && ele.list.length > 0) {
        const innerArr = { children: [] };
        innerArr.label = ele.name; innerArr.value = ele.id;
        ele && ele.list && ele.list.length > 0 && ele.list.forEach(innerInfo => {
          if (`${defectTypeCode}` === `${innerInfo.id}`) {
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

    return [defaultDefectType, groupedLostGenTypes];
  }

  disabledDate = (current) => {
    return current > moment().endOf('day');
  }


  render() {
    const { stations = [], deviceTypes, defectTypes, defectDetail, commonList, knowledgebaseList, form, editDefect = false, theme = 'light', getKnowledgebase } = this.props;
    const { stationCode, deviceCode, deviceName, defectTypeCode, processData = [], photoAddress, createTime } = defectDetail;
    const rejectDeatil = processData.filter(e => e.flowCode === 10); //获取驳回中处理信息
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defectCategory = getFieldValue('defectCategory') || []; // 缺陷分类
    const currentStations = getFieldValue('stations') || []; // 电站
    const deviceTypeCode = getFieldValue('deviceTypeCode'); // 设备code
    const currentDefectTypeCode = getFieldValue('defectTypeCode') || []; // 缺陷类型
    const imgDescribe = photoAddress && photoAddress.split(',').filter(e => !!e).map((e, i) => ({
      uid: i, rotate: 0, status: 'done', thumbUrl: e,
    }));
    const [defaultDefectType, groupedLostGenTypes] = this.dealDefectData(defectTypes, defectTypeCode);// 缺陷类型
    const initDefectDteail = {
      defectTypeCode: currentDefectTypeCode.length > 0 && currentDefectTypeCode[1] || '',
      deviceTypeCode: deviceTypeCode,
      stationType: currentStations.length > 0 && currentStations[0].stationType || null,
    };
    const initCreateTime = createTime && moment(createTime) || moment();
    const initStations = stationCode ? (stations.filter(e => e.stationCode === stationCode)) : (stations.length === 1 && stations[0] || []);
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
              initialValue: editDefect && (defectTypeCode ? 'device' : 'other') || 'device',
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
              initialValue: initStations,
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
                    style={{ width: 198 }}
                    placeholder="请选择"
                    disabled={currentStations.length === 0 || deviceTypes.length === 0}
                    onChange={this.onChangeDeviceType}>
                    {deviceTypes.filter(e => e.deviceTypeName !== '全场信息汇总').map(e => ( // 去掉全场信息汇总
                      <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="设备名称" colon={false}>
                {getFieldDecorator('deviceCodeArr', {
                  rules: [{ required: true, message: '请选择设备名称' }],
                  initialValue: defectDetail.deviceName && [{ deviceCode, deviceName }] || null,
                })(
                  <DeviceSelect
                    disabled={!deviceTypeCode}
                    stationCode={currentStations.length > 0 && currentStations[0].stationCode || null}
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
                    disabled={!deviceTypeCode}
                    style={{ width: 198 }}
                    options={groupedLostGenTypes}
                    expandTrigger="hover"
                    placeholder="请选择"
                    className={styles.lostTypeSelector}
                    onChange={this.defectTypeChange}
                  />
                )}
                {knowledgebaseList.length > 0 &&
                  <SolutionLibrary
                    knowledgebaseList={knowledgebaseList}
                    likeKnowledgebase={this.props.likeKnowledgebase}
                    defectDetail={initDefectDteail}
                    getKnowledgebase={getKnowledgebase}
                  />}
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
          <FormItem label="发生时间" colon={false}>
            {getFieldDecorator('createTime', {
              rules: [{ required: true, message: '请选择发生时间' }],
              initialValue: initCreateTime,
            })(
              <DatePicker
                showTime
                placeholder="默认当前时间"
                format="YYYY-MM-DD HH:mm"
                disabledDate={this.disabledDate}
                disabledTime={this.disabledRangeTime}
                getCalendarContainer={() => this.refs.toolTip}
              />
            )}
          </FormItem>
          <FormItem label="缺陷描述" colon={false}>
            {getFieldDecorator('defectDescribe', {
              rules: [{ required: true, message: '请输入缺陷描述' }],
              initialValue: editDefect && defectDetail.defectDescribe || null,
            })(
              <InputLimit placeholder="请描述，不超过999个汉字" width={400} size={999} />
            )}
          </FormItem>
          <FormItem label="添加照片" colon={false}>
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
          <DefectProcessForm form={form} commonList={commonList} rejectDeatil={rejectDeatil.length > 0 && rejectDeatil[0] || {}} />
          <div className={styles.actionBar}>
            <Button className={styles.saveBtn} onClick={() => this.onDefectCreate(false)}>保存</Button>
            {!editDefect && <Button onClick={() => this.onDefectCreate(true)} className={styles.addContinue}>保存并继续添加</Button>}
          </div>
        </div>
      </Form>
    );
  }
}


export default Form.create({
  onFieldsChange(props) {
    props.changeStore({ hasModify: true });
  },
})(DefectCreate);
