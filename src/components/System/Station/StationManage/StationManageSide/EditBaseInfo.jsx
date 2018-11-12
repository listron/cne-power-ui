
import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import StationMapPosition from './EditFormParts/StationMapPosition';
import StationArea from './EditFormParts/StationArea';
import styles from './stationSide.scss';
import { dataRuleFunc } from './detailInformation';
const FormItem = Form.Item;
const { Option } = Select; 

const EditBaseInfo = ({stationDetail, form, stationBelongInfo, ...restProps }) => {
  const { getFieldDecorator } = form;
  const { getStationTargetInfo, cityData, countyData } = restProps;
  const isPv =  stationDetail.stationType === 1;
  const isWind =  stationDetail.stationType === 0;
  const { coverType, oneLevelRegion, twoLevelRegion, provinces } = stationBelongInfo;
  return (<div className={styles.baseInfo}>
    <FormItem label="电站名称" >
      {getFieldDecorator('stationName',{
        initialValue: stationDetail.stationName,
        rules: [{
          required: true, message: '填写电站名称(不超过30字)', max: 30
        }]
      })(
        <Input />
      )}
    </FormItem>
    <span className={styles.textInfo}>
      <span className={styles.name}>电站类型</span>
      <span className={styles.value}>{isPv? '光伏': '风电'}</span>
    </span>
    <FormItem label="经纬度" >
      {getFieldDecorator('stationMapPosition',{
        initialValue: [stationDetail.longitude, stationDetail.latitude], // 经度，纬度
        rules: [{
          required: true,
          validator:(rule,value,callback)=>{
            const [longitude, latitude] = value;
            (!longitude && longitude!== 0) && callback('请输入经纬度');
            (!latitude && latitude!== 0) && callback('请输入经纬度');
            (isNaN(longitude) || isNaN(latitude)) && callback('经纬度需为数字');
            let longitudePoints = `${longitude}`.split('.')[1];
            let latitudePoints = `${latitude}`.split('.')[1];
            longitudePoints && longitudePoints.length > 6 && callback('经纬度不超过6位小数');
            latitudePoints && latitudePoints.length > 6 && callback('经纬度不超过6位小数');
            callback()
          }
        }]
      })(
        <StationMapPosition />
      )}
    </FormItem>
    {isPv && <FormItem label="覆盖类型" >
      {getFieldDecorator('coverType',{
        initialValue: stationDetail.coverType,
        rules: [{
          required: true, message: '选择覆盖类型',
        }]
      })(
        <Select style={{ width: '198px' }} >
          {coverType && coverType.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>}
    {isPv && <FormItem label="一级区域" >
      {getFieldDecorator('level1RegionName',{
        initialValue: stationDetail.level1RegionName
      })(
        <Select style={{ width: '198px' }} >
          {oneLevelRegion && oneLevelRegion.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>}
    <FormItem label={isPv?'二级区域':'区域'} >
      {getFieldDecorator('regionName',{
        initialValue: stationDetail.regionName
      })(
        <Select style={{ width: '198px' }} >
          {twoLevelRegion && twoLevelRegion.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label="所在省市" className={styles.stationAreaInfo} >
      {getFieldDecorator('stationArea',{
        initialValue: [stationDetail.provinceCode, stationDetail.cityCode, stationDetail.countyCode],
        rules: [{
          required: true,
          validator:(rule,value,callback)=>{
            const [provinceCode] = value; // 有省即可
            if(!provinceCode && provinceCode !== 0 ){
              callback('请选择所在省')
            }
            callback();
          }
        }]
      })(
        <StationArea 
          getStationTargetInfo={getStationTargetInfo} 
          provinces={provinces}
          cityData={cityData} 
          countyData={countyData} 
        />
      )}
    </FormItem>
    <FormItem label="所属项目公司" >
      {getFieldDecorator('affiliateProjectCompany',{
        initialValue: stationDetail.affiliateProjectCompany,
        rules: [{ max: 30, message: '不超过30字符' }] 
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="所属发电集团公司" >
      {getFieldDecorator('affiliateCompany',{
        initialValue: stationDetail.affiliateCompany,
        rules: [{ max: 30, message: '不超过30字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="集团占比" >
      {getFieldDecorator('ratio',{
        initialValue: stationDetail.ratio,
        rules: [{ 
          message: '占比在0到1之间',
          validator:(rule,value,callback)=>{
            value >= 0 && value <= 1 && callback();
            callback('请输入0到1间数字'); 
          }
        }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="合作单位" >
      {getFieldDecorator('cooperationCom',{
        initialValue: stationDetail.cooperationCom,
        rules: [{ max: 80, message: '不超过80字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="机组型号" >
      {getFieldDecorator('unitModel',{
        initialValue: stationDetail.unitModel,
        rules: [{ max: 80, message: '不超过80字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="联系电话" >
      {getFieldDecorator('stationContactNumber',{
        initialValue: stationDetail.stationContactNumber,
        rules: [{ max: 80, message: '不超过80字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="装机容量" >
      {getFieldDecorator('stationCapacity',{
        initialValue: stationDetail.stationCapacity,
        rules: [{ validator:dataRuleFunc(2,'请填写装机容量') }]
      })(
        <Input />
      )}
      <span className={styles.unit}>MW</span>
    </FormItem>
    <FormItem label="设计容量" >
      {getFieldDecorator('designCapacity',{
        initialValue: stationDetail.designCapacity,
        rules: [{ validator:dataRuleFunc(2) }]
      })(
        <Input />
      )}
      <span className={styles.unit}>MW</span>
    </FormItem>
    <FormItem label="占地面积" >
      {getFieldDecorator('floorArea',{
        initialValue: stationDetail.floorArea,
        rules: [{
          validator:dataRuleFunc(4)
        }]
      })(
        <Input />
      )}
      <span className={styles.unit}>k㎡</span>
    </FormItem>
    <FormItem label="年利用小时数" >
      {getFieldDecorator('designUtilizationHours',{
        initialValue: stationDetail.designUtilizationHours,
        rules: [{ validator:dataRuleFunc() }]
      })(
        <Input />
      )}
      <span className={styles.unit}>h</span>
    </FormItem>
    <FormItem label="是否接入" >
      {getFieldDecorator('stationStatus',{
        initialValue: stationDetail.stationStatus,
        rules: [{
          required: true, message: '请选择是否接入',
        }]
      })(
        <Select style={{ width: '198px' }} >
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
        </Select>
      )}
    </FormItem>
    {isPv && <FormItem label="组装角度" >
      {getFieldDecorator('componentAngle',{
        initialValue: stationDetail.componentAngle,
        rules: [{
          validator: dataRuleFunc(2),
        }]
      })(
        <Input />
      )}
      <span className={styles.unit}>°</span>
    </FormItem>}
    <FormItem label="是否启用" >
      {getFieldDecorator('stationEnabled',{
        initialValue: stationDetail.stationEnabled,
        rules: [{ required: true, message: '请选择是否接入' }]
      })(
        <Select style={{ width: '198px' }} >
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="排序号" >
      {getFieldDecorator('sort',{
        initialValue: stationDetail.sort,
      })(
        <Input />
      )}
    </FormItem>
    {isWind && <FormItem label="可研报告轮毂高度年平均风速" className={styles.windSpeedQuota}>
        {getFieldDecorator('hubAnnualAverageSpeed',{
          initialValue: stationDetail.hubAnnualAverageSpeed,
          rules: [{ validator: dataRuleFunc(2) }]
        })(
          <Input />
        )}
        <span className={styles.unit}>m/s</span>
    </FormItem>}
    {isWind && <FormItem label="可研报告轮毂高度年平均功率密度" className={styles.windPowerQuota} >
      {getFieldDecorator('hubAnnualAveragePower',{
        initialValue: stationDetail.hubAnnualAveragePower,
        rules: [{ validator: dataRuleFunc(2) }]
      })(
        <Input />
      )}
      <span className={styles.unit}>W/㎡</span>
    </FormItem>}
  </div>)
}

export default EditBaseInfo;
