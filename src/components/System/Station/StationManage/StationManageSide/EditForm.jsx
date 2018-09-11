




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import EditInfoPart from './EditInfoPart';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    stationDetail: PropTypes.object,
    backToDetail: PropTypes.func,
    saveStationDetail: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  cancelEdit = () => {
    this.props.backToDetail()
  }

  saveStationInfo = () => {
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        const { stationDetail } = this.props;
        this.props.saveStationDetail({
          ...stationDetail,
          ...values,
        })
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { stationDetail, loading } = this.props;
    const baseArrayFir = [
      { name: '电站位置', value: `纬度${stationDetail.longitude}经度${stationDetail.longitude}` }, // 特殊组合
      { name: '所在省市', value: stationDetail.provinceName },
      { name: '所属公司', value: stationDetail.affiliateCompany },
    ]
    const baseArraySec = [
      { name: '联系电话', value: stationDetail.stationContactNumber },
    ]
    const connectionPriceArray = [ // 并网信息及电价
      { name: '通过并网测验', value: stationDetail.gridConnectionDetection?'是':'否' }, // 实际调整
      { name: '调度机构名称', value: stationDetail.dispatchingAgency },
      { name: '调度机构性质', value: stationDetail.agencyType },
      { name: '并网点电站名称', value: stationDetail.gridSubstationName }, 
      { name: '首次并网时间', value: stationDetail.ongridTime }, 
      { name: '全部并网时间', value: stationDetail.fullOngridTime }, 
      { name: '并网电压等级', value: stationDetail.gridVoltageLevel },
      { name: '发电单元个数', value: stationDetail.stationUnitCount },
    ];
    const otherArray = [ // 其他信息
      { name: '自动有功控制能力', value: stationDetail.automaticActiveControl?'是':'否', }, // 实际调整
      { name: '监控系统厂家', value: stationDetail.monitoringSystemName, },
      { name: '创建人', value: '未定关键字', }, // 未知
      { name: '自动无功控制能力', value: stationDetail.automaticAeactiveContro?'是':'否', }, // 实际调整
      { name: '监控系统个数', value: stationDetail.monitoringSystemCount, },
      { name: '创建时间', value: '未定关键字', }, // 未知
      { name: '低压穿越(LVRT)', value: stationDetail.lowPressureCrossing, },  // 未知
    ];
    return (
      <Form className={styles.editPart}>
        <div className={styles.baseEdit}>
          <div className={styles.title}>
            <span className={styles.titleText}>基本信息</span>
            <div className={styles.titleHandle}>
              <span className={styles.cancel} onClick={this.cancelEdit}>取消</span>
              <Button className={styles.save} onClick={this.saveStationInfo}>保存</Button>
            </div>
          </div>
          {baseArrayFir.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}
          <FormItem label="所属区域" >
            {getFieldDecorator('regionName',{
              initialValue: stationDetail.regionName,
              rules: [{
                required: true, message: '所属区域',
              }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="并网容量" >
            {getFieldDecorator('stationCapacity',{
              initialValue: stationDetail.stationCapacity,
              rules: [{
                required: true, message: '请输入并网容量',
              }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="设计容量" >
            {getFieldDecorator('designCapacity',{
              initialValue: stationDetail.designCapacity,
              rules: [{
                required: true, message: '请输入设计容量',
              }]
            })(
              <Input />
            )}
          </FormItem>
          {baseArraySec.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}
          <FormItem label="占地面积" >
            {getFieldDecorator('floorArea',{
              initialValue: stationDetail.floorArea,
              rules: [{
                required: true, message: '请输入占地面积',
              }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="电站类型" >
            {getFieldDecorator('stationType',{
              initialValue: stationDetail.stationType
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="覆盖类型" >
            {getFieldDecorator('coverType',{
              initialValue: stationDetail.coverType
            })(
              <Input />
            )}
          </FormItem>
        </div>
        <div className={styles.connectionPriceEdit}>
          <div className={styles.title}>
            <span className={styles.titleText}>并网信息及电价情况</span>
          </div>
          {connectionPriceArray.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}
        </div>
        <div className={styles.otherEdit}>
          <div className={styles.title}>
            <span className={styles.titleText}>其他信息</span>
          </div>
          {otherArray.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}
          <FormItem label="电站时区" >
            {getFieldDecorator('timeZone',{
              initialValue: stationDetail.timeZone
            })(
              <Input />
            )}
          </FormItem>
        </div>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
