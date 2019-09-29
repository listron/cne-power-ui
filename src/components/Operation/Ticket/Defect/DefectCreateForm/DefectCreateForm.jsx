import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import { Form, Input, Button, Select, Switch, Radio, Cascader, Modal, Icon } from 'antd';
import pathConfig from '../../../../../constants/path';
import styles from './defectCreateForm.scss';
import InputLimit from '../../../../Common/InputLimit';
import CommonInput from '../../../../Common/CommonInput/index1';
import DeviceSelect from '../../../../Common/DeviceSelect/index';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stationName: PropTypes.string, //电站名称
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
    container: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
    changeCommonStore: PropTypes.func,
    defectDetail: PropTypes.object,
    deviceTypes: PropTypes.array,
    commonList: PropTypes.array,
    error: PropTypes.object,
    getSliceDevices: PropTypes.func,
    getLostGenType: PropTypes.func,
    changeDefectStore: PropTypes.func,
    knowledgebaseList: PropTypes.array,
    getKnowledgebase: PropTypes.func,
    likeKnowledgebase: PropTypes.func,
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
    const { defectId, stationCode, deviceTypeCode, defectTypeCode } = nextProps.defectDetail;
    const prevDefectId = this.props.defectDetail.defectId;
    if (defectId !== prevDefectId) {
      this.props.getStationDeviceTypes({ stationCodes: stationCode });
      this.props.getKnowledgebase({ faultTypeIds: [defectTypeCode], deviceTypeCodes: [deviceTypeCode], type: '' });
    }
  }


  componentWillUnmount() {
    this.props.changeDefectStore({ defectDetail: {}, knowledgebaseList: [] });
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
    this.props.changeCommonStore(params);
    this.props.form.setFieldsValue({ defectTypeCode: null, deviceCode: null });
    this.props.getLostGenType({
      stationType,
      objectType: 1,
      deviceTypeCode,
    });
  }

  onDefectCreate = (isContinueAdd) => { // 保存的状态
    const { error, form, onDefectCreateNew, submitDefect, container, defectDetail, changeCommonStore } = this.props;
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
          changeCommonStore({
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

  showModal = () => { // 查看解决方案
    this.setState({ dealVisible: true });
  }

  modalCancle = () => { // 关闭解决方案
    this.setState({ dealVisible: false });
  }

  knowledegeBask = (knowledgeBaseId) => { // 点赞智能专家库
    this.props.likeKnowledgebase({ knowledgeBaseId });
  }


  render() {
    const { stations, deviceTypes, defectTypes, defectDetail, container, commonList, knowledgebaseList } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const currentStations = getFieldValue('stations'); // 电站
    const stationCode = currentStations && currentStations[0] && currentStations[0].stationCode || null;
    const deviceTypeCode = getFieldValue('deviceTypeCode'); // 设备code
    const defectFinished = getFieldValue('defectSolveResult') === '0';
    const editDefect = container === 'edit';
    const defaultStations = editDefect ? stations.filter(e => e.stationCode === defectDetail.stationCode) : [];
    const imgDescribe = editDefect && defectDetail.photoAddress && defectDetail.photoAddress.split(',').filter(e => !!e).map((e, i) => ({
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
    const { handleData = {} } = defectDetail;
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
              initialValue: defectDetail.deviceTypeCode || null,
            })(
              <Select style={{ width: 198 }} placeholder="请选择" disabled={deviceTypes.length === 0} onChange={this.onChangeDeviceType}>
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
            {knowledgebaseList.length > 0 && <Button type="default" onClick={this.showModal} className={styles.dealMethod}>查看解决方案</Button>}
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
              initialValue: editDefect && handleData.defectSolveResult || '1',
            })(
              <RadioGroup>
                <RadioButton value="1">未解决</RadioButton>
                <RadioButton value="0">已解决</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          {!defectFinished && <FormItem label="处理建议" colon={false}>
            {getFieldDecorator('defectSolveInfo', {
              initialValue: editDefect && handleData.defectProposal || '',
            })(
              <InputLimit placeholder="请描述，不超过80个汉字" />
            )}
          </FormItem>}
          {
            defectFinished &&
            <React.Fragment>
              <FormItem label="产生原因" colon={false}>
                {getFieldDecorator('reasonDesc', {
                  rules: [{ required: true, message: '请输入产生原因' }],
                  initialValue: '',
                })(
                  <InputLimit placeholder="请描述，不超过80个汉字" />
                )}
              </FormItem>
              <FormItem label="处理过程" colon={false}>
                {getFieldDecorator('defectSolveInfo', {
                  rules: [{ required: true, message: '请输入处理过程' }],
                  initialValue: editDefect && handleData.defectSolveInfo || '',
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
                      message: '请输入更换备件',
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
        <div ref="dealMethod" className={styles.dealModal}> </div>
        <Modal
          title="解决方案查看"
          visible={this.state.dealVisible}
          onCancel={this.modalCancle}
          getContainer={() => this.refs.dealMethod}
          footer={null}
          mask={false}
          centered={true}
          wrapClassName={styles.deatilLike}
          width={800}
        >
          <div className={styles.modalbody}>
            {knowledgebaseList.map(list => {
              return (<div key={list.faultTypeId} className={styles.dealBox}>
                <div className={styles.column}>
                  <div className={styles.text}>故障描述</div>  <div> {list.faultDescription}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>故障原因</div>  <div> {list.checkItems}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>处理方法</div>  <div> {list.processingMethod}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>所需工具</div>  <div> {list.requiredTools}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>备注</div>  <div> {list.remark}</div>
                </div>
                <div className={styles.column}>
                  <div className={styles.text}>点赞数</div>  <div> {list.likeCount}</div>
                </div>
                {list.liked ?
                  <div className={`${styles.disabled}`} >已点赞</div> :
                  <div className={styles.like} onClick={() => { this.knowledegeBask(list.knowledgeBaseId); }}>
                    点赞 <Icon type="like" />
                  </div>
                }
              </div>
              );
            })}
          </div>

        </Modal>

      </Form>
    );
  }
}


export default Form.create()(TmpForm);
