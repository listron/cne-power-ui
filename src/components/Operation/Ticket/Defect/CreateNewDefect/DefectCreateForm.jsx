import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect'
import { Form, Icon, Input, Button, Select } from 'antd';
import styles from './newDefect.scss';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

class TmpForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    devieceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    getDevieceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,

  };
  constructor(props){
    super(props);
  }
  onStationSelected = (stations) =>{
    const stationCodes = (stations && stations[0] && stations[0].stationCode) || 0;
    const tmpStationType = stations && stations[0] && stations[0].stationType;
    const stationType = tmpStationType===20?1:tmpStationType===10?0:2;
    this.props.getDevieceTypes({stationCodes})
    this.props.getDefectTypes({stationType})
  }
  
  render() {
    const {stations, devieceTypes, defectTypes} = this.props;
    console.log(this.props);
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>基本信息</h3>
        <FormItem>
          {getFieldDecorator('stationCode', {
            rules: [{ required: true, message: '请选择电站' }],
          })(
            <StationSelect data={stations} multiple={false} onOK={this.onStationSelected} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('deviceTypeCode', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <Select onChange={(value)=>console.log(value)} placeholder={'请选择设备类型'} disabled={devieceTypes.length === 0}>
              {devieceTypes.map(e=>(<Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('defectTypeCode', {
            rules: [{ required: true, message: '请选择缺陷类型' }],
          })(
            <Select onChange={(value)=>console.log(value)} placeholder={'请选择缺陷类型'} disabled={defectTypes.length === 0}>
              {defectTypes.map(e=>(<Option key={e.defectTypeCode} value={e.defectTypeCode}>{e.defectTypeName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('defectLevel', {
            rules: [{ required: true, message: '请选择缺陷级别' }],
          })(
            <Select onChange={(value)=>console.log(value)} placeholder={'请选择缺陷级别'} disabled={defectTypes.length === 0}>
              <Option value={1}>一级</Option>
              <Option value={2}>二级</Option>
              <Option value={3}>三级</Option>
              <Option value={4}>四级</Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('defectDescribe', {
            rules: [{ required: true, message: '请输入缺陷描述' }],
          })(
            <TextArea onChange={(value)=>console.log(value)} placeholder={'请输入缺陷描述'} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('imgDescribe', {
            rules: [{ required: true, message: '请上传图片' }],
          })(
            <div />
          )}
        </FormItem>
        <h3>处理信息</h3>
        <FormItem>
          {getFieldDecorator('defectSolveResult', {
            rules: [{ required: true, message: '选择处理结果' }],
          })(
            <ButtonGroup>
              <Button onClick={()=>console.log('未解决')}>未解决</Button>
              <Button onClick={()=>console.log('已经解决')}>已解决</Button>
            </ButtonGroup>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('defectSolveInfo', {
            rules: [{ required: true, message: '请输入处理建议' }],
          })(
            <TextArea onChange={(value)=>console.log(value)} placeholder={'请描述处理建议，不超过80字'} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('imgHandle', {
            rules: [{ required: true, message: '请上传图片' }],
          })(
            <div />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('defectSolveInfo', {
            rules: [{ required: true, message: '请输入处理过程' }],
          })(
            <TextArea onChange={(value)=>console.log(value)} placeholder={'请描述处理过程，不超过80字'} />
          )}
        </FormItem>
        <div>
          <Button>取消</Button>
          <Button>提交</Button>
        </div>
      </Form>
    );
  }
}

const DefectCreateForm = Form.create()(TmpForm);

export default DefectCreateForm;