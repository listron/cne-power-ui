




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import { dataRuleFunc } from './detailInformation';
import styles from './stationSide.scss';
const FormItem = Form.Item;
const { Option } = Select; 


const EditStationBelong = ({stationDetail, form, stationBelongInfo }) => {
  const { getFieldDecorator } = form;
  const { belongType, progressType, installType, newClassType, absorptiveMethod } = stationBelongInfo;
  return (<section className={styles.stationBelong}>
    <h3 className={styles.titleText}> 电站分类 </h3>
    <FormItem label="所属类型" >
      {getFieldDecorator('belongType',{
        initialValue: stationDetail.belongType,
      })(
        <Select style={{ width: '198px' }} >
          {belongType && belongType.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label="项目类型" >
      {getFieldDecorator('reportType',{
        initialValue: stationDetail.reportType,
      })(
        <Select style={{ width: '198px' }} >
          {progressType && progressType.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label="安装方式" >
      {getFieldDecorator('assemblyType',{
        initialValue: stationDetail.assemblyType,
      })(
        <Select style={{ width: '198px' }} >
          {installType && installType.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label="新的分类" >
      {getFieldDecorator('buildType',{
        initialValue: stationDetail.buildType
      })(
        <Select style={{ width: '198px' }} >
          {newClassType && newClassType.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label={'消纳方式'} >
      {getFieldDecorator('consumptionType',{
        initialValue: stationDetail.consumptionType
      })(
        <Select style={{ width: '198px' }} >
          {absorptiveMethod && absorptiveMethod.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
  </section>)
}

export default EditStationBelong;
