import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import { Form, Icon, Select, Button } from 'antd';
import StationSelect from '../../../Common/StationSelect/index';
import InputLimit from '../../../Common/InputLimit/index';
import ImgUploader from '../../../Common/Uploader/ImgUploader';
import pathConfig from '../../../../constants/path';
import DefectLIst from './DefectLIst';
const FormItem = Form.Item;
const Option = Select.Option;

class CreateFlow extends Component {
  static propTypes = {
    stations: PropTypes.array,
    form: PropTypes.object,
    docketList: PropTypes.array,
    getDocketTypeList: PropTypes.func,
    noDistributionList: PropTypes.func,
    noDistributeList: PropTypes.array,
    addDockect: PropTypes.func,
    docketTypeList: PropTypes.array,
    docketDetail: PropTypes.object,
    type: PropTypes.string,
    reject: PropTypes.bool,
    docketId: PropTypes.number,
  }

  constructor() {
    super();
    this.state = {
      defectVisible: false,
      selectedRows: {},
    };
  }

  componentDidMount() {
    if (this.props.type === 'work') {
      this.props.getDocketTypeList();
    }
    this.props.noDistributionList();
  }

  onDefectCreate = (isContinueAdd) => { // 保存的状态
    const { form, docketId, type } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { stationCode } = values.stations[0];
        const { docketType, docketCode, docketName, defectList = {} } = values;
        const annexImg = values.annexImg.map(e => {
          return {
            imgUrl: e.thumbUrl,
            rotate: e.rotate,
          };
        });
        const otherImg = values.otherImg.map(e => {
          return {
            imgUrl: e.thumbUrl,
            rotate: e.rotate,
          };
        });
        const { defectId = '' } = defectList;
        const params = {
          templateType: type === 'work' ? 1 : 2,
          stationCode,
          docketType,
          docketCode,
          docketName,
          defectId, // 缺陷工单ID
          annexImg,
          otherImg,
          isContinueAdd,
          docketId,
          func: () => {
            this.props.form.resetFields();
          },
        };
        this.props.addDockect(params);
      }
    });
  }

  linkDefectData = (value) => { // 关联工单之后的数据
    const { defectVisible, selectedRows = {} } = value;
    this.setState({ defectVisible, selectedRows });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { stations, docketTypeList, noDistributeList, docketDetail, reject, type } = this.props;
    const { docketInfo = {}, defectInfo, distributionInfo = [] } = docketDetail;
    const currentStations = getFieldValue('stations'); // 电站
    const stationCode = currentStations && currentStations[0] && currentStations[0].stationCode || null;
    const { annexImg = [], otherImg = [] } = docketInfo;
    const imgDescribe = annexImg.map((item, i) => {
      return {
        uid: `${item.imgUrl}_${i}`,
        rotate: item.rotate,
        thumbUrl: `${item.imgUrl}`,
      };
    });
    const otherImgDescribe = otherImg.map((item, i) => {
      return {
        uid: `${item.imgUrl}_${i}`,
        rotate: item.rotate,
        thumbUrl: `${item.imgUrl}`,
      };
    });
    const textName = type === 'work' ? '工作票' : '操作票';
    return (
      <div className={styles.workflow}>
        {reject && <div className={styles.title}>
          <div className={styles.text}> 基本信息  <i className="iconfont icon-content" /> </div>
        </div>}
        <Form className={`${styles.flowForm}  ${reject && styles.rejectFlowForm}`}>
          <FormItem label="电站名称" colon={false}>
            {getFieldDecorator('stations', {
              rules: [{ required: true, message: '请选择电站' }],
              initialValue: [{ stationCode: docketInfo.stationCode, stationName: docketInfo.stationName }],
            })(
              <StationSelect
                data={stations}
                disabledStation={noDistributeList.map(e => e.stationCode)}
                onOK={this.onStationSelected} />
            )}
          </FormItem>
          {type === 'work' && <FormItem label="工作票类型" colon={false}>
            {getFieldDecorator('docketType', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: docketInfo.docketType,
            })(
              <Select placeholder={'请选择'} style={{ width: 198 }} >
                {docketTypeList.map((e, index) => {
                  return (<Option value={e.code} key={index}>{e.name}</Option>);
                })}
              </Select>
            )}
          </FormItem>}
          <FormItem label={`${textName}编号`} colon={false}>
            {getFieldDecorator('docketCode', {
              rules: [{
                required: true, message: `请输入${textName}编号(数字、字母及组合)`,
                pattern: /^[a-zA-Z0-9]+$/g,
              }],
              initialValue: docketInfo.docketCode,
            })(
              <InputLimit placeholder="请输入数字、字母及组合" size={30} height={64} width={300} />
            )}
          </FormItem>
          <FormItem label={`${textName}名称`} colon={false}>
            {getFieldDecorator('docketName', {
              rules: [{ required: false, message: '请输入', max: 50 }],
              initialValue: docketInfo.docketName,
            })(
              <InputLimit placeholder="不超过50个汉字" size={50} height={64} width={300} />
            )}
          </FormItem>
          <FormItem label="关联工单" colon={false}>
            {getFieldDecorator('defectList', {
              rules: [{ required: false, message: '请输入' }],
              valuePropName: 'selectedData',
              initialValue: { ...defectInfo, defectId: docketInfo.defectId },
            })(
              <DefectLIst
                stationCode={stationCode}
                {...this.props} />
            )}
          </FormItem>
          <FormItem label={`${textName}附件`} colon={false}>
            <div className={styles.addImg}>
              <div className={styles.maxTip}>最多4张</div>
              {getFieldDecorator('annexImg', {
                rules: [{ required: true, message: '请上传图片' }],
                initialValue: imgDescribe || [],
                valuePropName: 'data',
              })(
                <ImgUploader
                  imgStyle={{ width: 100, height: 100 }}
                  uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`}
                  editable={true} />
              )}
            </div>
          </FormItem>
          <FormItem label="其他附件" colon={false}>
            <div className={styles.addImg}>
              <div className={styles.maxTip}>最多4张</div>
              {getFieldDecorator('otherImg', {
                rules: [{ required: false, message: '请上传图片' }],
                initialValue: otherImgDescribe || [],
                valuePropName: 'data',
              })(
                <ImgUploader
                  imgStyle={{ width: 100, height: 100 }}
                  uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`}
                  editable={true}
                />
              )}
            </div>
          </FormItem>
          <React.Fragment>
            {
              distributionInfo.map(e => {
                return (<div className={styles.basicItem} key={e.nodeCode}>
                  <div className={styles.nodeName}>{e.nodeName}</div>
                  <span className={styles.userNames}>{e.userNames || '--'}</span>
                </div>);
              })
            }
          </React.Fragment>
          <div className={styles.actionBar}>
            <Button className={styles.saveBtn} onClick={() => this.onDefectCreate(false)}>保存</Button>
            {!reject && <Button onClick={() => this.onDefectCreate(true)}>保存并继续添加</Button>}
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CreateFlow);
