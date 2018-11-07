




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import styles from './stationSide.scss';
const FormItem = Form.Item;
const { Option } = Select; 


const EditBaseInfo = ({stationDetail, form, ...restProps}) => {
  const { getFieldDecorator } = form;
  const isPv =  stationDetail.stationType === 1;
  const isWind =  stationDetail.stationType === 0;

  return (<div>
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
    <span>
      <span>电站类型</span>
      <span>{isPv? '风电': '光伏'}</span>
    </span>
    <FormItem label="经纬度" >
      {getFieldDecorator('stationMapPosition',{
        initialValue: [stationDetail.longitude, stationDetail.latitude], // 经度，纬度
        rules: [{
          required: true, message: '填写经纬度',
        }]
      })(
        <Input />
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
          <Option value="商用屋顶">商用屋顶</Option>
          <Option value="家用屋顶">家用屋顶</Option>      
          <Option value="地面">地面</Option>
        </Select>
      )}
    </FormItem>}
    {isPv && <FormItem label="一级区域" >
      {getFieldDecorator('level1RegionName',{
        initialValue: stationDetail.level1RegionName
      })(
        <Select style={{ width: '198px' }} >
          <Option value="东区">东区</Option>
          <Option value="西区">西区</Option> 
        </Select>
      )}
    </FormItem>}
    <FormItem label={isPv?'二级区域':'区域'} >
      {getFieldDecorator('regionName',{
        initialValue: stationDetail.regionName
      })(
        <Select style={{ width: '198px' }} >
          <Option value="二区">二区</Option>
          <Option value="三区">三区</Option> 
        </Select>
      )}
    </FormItem>
    <FormItem label="所在省市" >
      {getFieldDecorator('stationArea',{
        initialValue: [stationDetail.provinceCode, stationDetail.cityCode, stationDetail.countyCode],
        rules: [{
          required: true, message: '选择所在省市',
        }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="所属项目公司" >
      {getFieldDecorator('affiliateProjectCompany',{
        initialValue: stationDetail.affiliateProjectCompany,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="所属发电集团公司" >
      {getFieldDecorator('affiliateCompany',{
        initialValue: stationDetail.affiliateCompany,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="集团占比" >
      {getFieldDecorator('ratio',{
        initialValue: stationDetail.ratio,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="合作单位" >
      {getFieldDecorator('cooperationCom',{
        initialValue: stationDetail.cooperationCom,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="机组型号" >
      {getFieldDecorator('unitModel',{
        initialValue: stationDetail.unitModel,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="联系电话" >
      {getFieldDecorator('stationContactNumber',{
        initialValue: stationDetail.stationContactNumber,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="装机容量" >
      {getFieldDecorator('stationCapacity',{
        initialValue: stationDetail.stationCapacity,
        rules: [{
          required: true, message: '选择所在省市',
        }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="设计容量" >
      {getFieldDecorator('designCapacity',{
        initialValue: stationDetail.designCapacity,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="占地面积" >
      {getFieldDecorator('floorArea',{
        initialValue: stationDetail.floorArea,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="年利用小时数" >
      {getFieldDecorator('designUtilizationHours',{
        initialValue: stationDetail.designUtilizationHours,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="是否接入" >
      {getFieldDecorator('stationStatus',{
        initialValue: stationDetail.stationStatus,
        rules: [{
          required: true, message: '选择所在省市',
        }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="组装角度" >
      {getFieldDecorator('componentAngle',{
        initialValue: stationDetail.componentAngle,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="是否启用" >
      {getFieldDecorator('stationEnabled',{
        initialValue: stationDetail.stationEnabled,
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="排序号" >
      {getFieldDecorator('sort',{
        initialValue: stationDetail.sort,
      })(
        <Input />
      )}
    </FormItem>

  </div>)
}

export default EditBaseInfo;
