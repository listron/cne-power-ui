import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';
import FormHanleButtons from './FormHanleButtons';
import SolveTextArea from './SolveTextArea';
import ReplaceParts from './ReplaceParts';
import { Form, Icon, Input, Button, Select } from 'antd';
import pathConfig from '../../../../../constants/path';
import styles from './newDefect.scss';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    getDevieceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
  };
  constructor(props){
    super(props);
    this.state = {
      defectFinished: false
    }
  }
  onStationSelected = (stations) =>{
    const stationCodes = (stations && stations[0] && stations[0].stationCode) || 0;
    const tmpStationType = stations && stations[0] && stations[0].stationType;
    const stationType = tmpStationType===20?1:tmpStationType===10?0:2;
    this.props.getDevieceTypes({stationCodes})
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
        console.log('Received values of form: ', values);
      }
    });
  }
  
  render() {
    const { defectFinished } = this.state;
    const {stations, deviceTypes, defectTypes} = this.props;
    const {getFieldDecorator} = this.props.form;
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
    return (
      <Form>
        <h3>基本信息</h3>
        <FormItem label={'电站名称：'} {...formItemLayout}>
          {getFieldDecorator('stationCode', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <StationSelect data={stations} multiple={false} onOK={this.onStationSelected} />
          )}
        </FormItem>
        <FormItem label={'设备类型：'} {...formItemLayout}>
          {getFieldDecorator('deviceTypeCode', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <Select onChange={(value)=>console.log(value)} placeholder={'请选择设备类型'} disabled={deviceTypes.length === 0}>
              {deviceTypes.map(e=>(<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label={'缺陷类型：'} {...formItemLayout}>
          {getFieldDecorator('defectTypeCode', {
            rules: [{ required: true, message: '请选择缺陷类型' }],
          })(
            <Select onChange={(value)=>console.log(value)} placeholder={'请选择缺陷类型'} disabled={defectTypes.length === 0}>
              {defectTypes.map(e=>(<Option key={e.defectTypeCode} value={e.defectTypeCode}>{e.defectTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem  label={'缺陷级别：'} {...formItemLayout}>
          {getFieldDecorator('defectLevel', {
            rules: [{ required: true, message: '请选择缺陷级别' }],
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
          })(
            <TextArea placeholder={'请输入缺陷描述'} />
          )}
        </FormItem>
        <FormItem label={'添加图片：'} {...formItemLayout}>
          {getFieldDecorator('imgDescribe', {
            rules: [{ required: false, message: '请上传图片' }],
            initialValue: [],
            valuePropName:'data',
          })(
            <ImgUploader  imgStyle={{width:'50px',height:'50px'}} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
          )}
        </FormItem>
        <h3>处理信息</h3>
        <FormItem label={'处理结果：'} {...formItemLayout}>
          {getFieldDecorator('defectSolveResult', {
            rules: [{ required: true, message: '选择处理结果' }],
            initialValue: '1',
          })(
            <FormHanleButtons onDefectFinishChange={this.onDefectFinishChange} />
          )}
        </FormItem>
        {!defectFinished && <FormItem label={'处理建议：'} {...formItemLayout}>
          {getFieldDecorator('defectSolveInfo', {
            rules: [{ required: true, message: '请输入处理建议' }],
          })(
            <TextArea placeholder={'请描述处理建议，不超过80字'} />
          )}
        </FormItem>}
        {defectFinished && <FormItem label={'处理过程：'} {...formItemLayout}>
          {getFieldDecorator('defectSolveInfo', {
            rules: [{ required: true, message: '请输入处理过程' }],
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
            <ImgUploader imgStyle={{width:'50px',height:'50px'}} uploadPath={`${pathConfig.basePaths.APIBasePath}${pathConfig.commonPaths.imgUploads}`} editable={true} />
          )}
        </FormItem>
        {defectFinished && <FormItem label={'更换部件：'} {...formItemLayout}>
          {getFieldDecorator('replaceParts', {
            rules: [{ required: false, message: '填写更换部件信息' }],
          })(
            <ReplaceParts />
          )}
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