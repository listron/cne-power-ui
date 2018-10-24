




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import EditInfoPart from './EditInfoPart';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select; 

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    stationDetail: PropTypes.object,
    cancelEdit: PropTypes.func,
    saveStationDetail: PropTypes.func,
    confirmWarningTip: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  cancelEdit = () => {
    this.props.cancelEdit()
  }

  saveStationInfo = () => {
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        const { stationDetail } = this.props;
        this.props.saveStationDetail({
          ...stationDetail,
          ...values,
          
        })
        this.props.confirmWarningTip()
      }
      
      
     
    })
  
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { stationDetail, loading } = this.props;
  

    const longitude = (stationDetail.longitude || parseFloat(stationDetail.longitude) === 0)? `${parseFloat(stationDetail.longitude).toFixed(2)}°` : '--';
    const latitude = (stationDetail.latitude || parseFloat(stationDetail.latitude) === 0)? `${parseFloat(stationDetail.latitude).toFixed(2)}°` : '--';
    const ongridTime = stationDetail.ongridTime?moment(stationDetail.ongridTime).format('YYYY-MM-DD'):'';
    const fullOngridTime = stationDetail.fullOngridTime?moment(stationDetail.fullOngridTime).format('YYYY-MM-DD'):'';
    
    const baseArrayFir = [
      { name: '电站类型', value: `${stationDetail.stationType === 0?'风电':'光伏'}` }, // 特殊组合
      { name: '电站位置', value: `${longitude}, ${latitude}` }, // 特殊组合
    ];
    // stationDetail.stationType === 1 && baseArrayFir.push({
    //   name: '覆盖类型', value: stationDetail.coverType
    // })
    const baseArraySec = [
      { name: '所在省市', value: `${stationDetail.provinceName||'--'}${stationDetail.cityName||'--'}${stationDetail.countyName||'--'}` },
      { name: '所属公司', value: stationDetail.affiliateCompany },
      { name: '联系电话', value: stationDetail.stationContactNumber },
    ]
    const baseArrayThi = [
      { name: '上报类型', value: stationDetail.reportType },
      { name: '安装方式', value: stationDetail.assemblyType },
      { name: '组装角度', value: stationDetail.componentAngle },
      { name: '新的分类', value: stationDetail.buildType },
      { name: '消纳方式', value: stationDetail.consumptionType },
      { name: '所属类型', value: stationDetail.belongType },
      { name: '电站主线图', value: stationDetail.mainWiringDiagram },
    ]
    const connectionPriceArray = [ // 并网信息及电价
      { name: '通过并网测验', value: stationDetail.gridConnectionDetection?'是':'否' }, // 实际调整
      { name: '调度机构名称', value: stationDetail.dispatchingAgency },
      { name: '调度机构性质', value: stationDetail.agencyType },
      { name: '并网点电站名称', value: stationDetail.gridSubstationName }, 
      { name: '首次并网时间', value: ongridTime, }, 
      { name: '全部并网时间', value: fullOngridTime}, 
      { name: '并网电压等级', value: stationDetail.gridVoltageLevel },
      { name: '发电单元个数', value: stationDetail.stationUnitCount },
    ];
    const otherArray = [ // 其他信息
      { name: '自动有功控制能力', value: stationDetail.automaticActiveControl?'是':'否', }, // 实际调整
      { name: '监控系统厂家', value: stationDetail.monitoringSystemName, },
      { name: '创建人', value: stationDetail.createUser, }, // 
      { name: '自动无功控制能力', value: stationDetail.automaticAeactiveContro?'是':'否', }, // 实际调整
      { name: '监控系统个数', value: stationDetail.monitoringSystemCount, },
      { name: '创建时间', value: stationDetail.createTime?moment((stationDetail.createTime)).format('YYYY-MM-DD HH:mm'):'--',}, // 
      { name: '低压穿越(LVRT)', value: stationDetail.lowPressureCrossing?'是':'否', },  // 未知0,1
      { name: '电站时区', value:stationDetail.timeZone?(stationDetail.timeZone>0&&stationDetail.timeZone<10?`UTC+0${stationDetail.timeZone}:00`:`UTC${stationDetail.timeZone}:00`):'--', },  // 未知
    ];
    return (
      <Form className={styles.editPart}>
        <div className={styles.baseEdit}>
          <div className={styles.title}>
            <span className={styles.titleText}>基本信息</span>
            <div className={styles.titleHandle}>
              <span className={styles.cancel} onClick={this.cancelEdit}>取消</span>
              <Button className={styles.save} onClick={this.saveStationInfo} loading={loading}>保存</Button>
            </div>
          </div>
          <FormItem label="电站名称" >
            {getFieldDecorator('stationName',{
              initialValue: stationDetail.stationName,
              rules: [{
                required: true, message: '选择电站名称',
              }]
            })(
              <Input />
            )}
          </FormItem>
          {baseArrayFir.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}

          <FormItem label="覆盖类型" >
          {getFieldDecorator('coverType',{
            initialValue: stationDetail.coverType,
            rules: [{
              required: true, message: '选择覆盖类型',
            }]
          })(
            <Select
          style={{ width: '198px' }}
          //onChange={this.handleCurrencyChange}
        >
          <Option value="商用屋顶">商用屋顶</Option>
          <Option value="家用屋顶">家用屋顶</Option>      
          <Option value="地面">地面</Option>
        </Select>
            
          )}
        </FormItem>


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
          {baseArraySec.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}
          <FormItem label="并网容量" >
            {getFieldDecorator('stationCapacity',{
              initialValue: stationDetail.stationCapacity,
              rules: [{
                required: true, message: '请输入并网容量',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '并网容量必须是数字'
              }]
            })(
              <Input className={styles.capacity} />
            )}
            <span>MW</span>
          </FormItem>
          <FormItem label="设计容量" >
            {getFieldDecorator('designCapacity',{
              initialValue: stationDetail.designCapacity,
              rules: [{
                required: true, message: '请输入设计容量',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '设计容量必须是数字'
              }]
            })(
              <Input className={styles.capacity} />
            )}
            <span>MW</span>
          </FormItem>
          <FormItem label="占地面积" >
            {getFieldDecorator('floorArea',{
              initialValue: stationDetail.floorArea,
              rules: [{
                required: true, message: '请输入占地面积',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '占地面积必须是数字'
              }]
            })(
              <Input className={styles.floorArea} />
            )}
            <span>平方公里</span>
          </FormItem>
          <FormItem label="年利用小时数" >
            {getFieldDecorator('designUtilizationHours',{
              initialValue: stationDetail.designUtilizationHours,
              rules: [{
                required: true, message: '请输入年利用小时数',
              },{
                pattern: /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, message: '年利用小时数必须是数字'
              }]
            })(
              <Input className={styles.designUtilizationHours} />
            )}
            <span>小时</span>
          </FormItem>
          <FormItem label="是否接入" >
            {getFieldDecorator('stationStatus',{
              initialValue: stationDetail.stationStatus===1?1:0,
              rules: [{
                required: true, message: '选择是否接入',
              }]
            })(
              <Select style={{width:'145px'}}>
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            )}
          </FormItem>
          {baseArrayThi.map((e,i)=>(<EditInfoPart key={i} eachInfo={e} />))}
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
        </div>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
