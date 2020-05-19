
import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import moment from 'moment';
import EditBaseInfo from './EditBaseInfo';
import EditStationBelong from './EditStationBelong';
import EditConnectNetInfo from './EditConnectNetInfo';
import EditOtherInfo from './EditOtherInfo';
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;
const { Option } = Select; 

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    cityData: PropTypes.array,
    countyData: PropTypes.array,
    form: PropTypes.object,
    stationBelongInfo: PropTypes.object,
    stationDetail: PropTypes.object,
    cancelEdit: PropTypes.func,
    saveStationDetail: PropTypes.func,
    confirmWarningTip: PropTypes.func,
    getStationTargetInfo: PropTypes.func,
  }

  componentDidMount(){
    const { getStationTargetInfo, stationDetail } = this.props;
    const { provinceCode, cityCode } = stationDetail;
    provinceCode && getStationTargetInfo({
      params: {dictionaryType: 4, area: provinceCode},
      resultName: 'cityData'
    })
    cityCode && getStationTargetInfo({
      params: {dictionaryType: 4, area: cityCode},
      resultName: 'countyData'
    })
  }

  cancelEdit = () => {
    this.props.cancelEdit()
  }

  saveStationInfo = () => {
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        let { stationDetail } = this.props;
        // let { stationDetail, cityData, countyData, stationBelongInfo } = this.props;
        // const { provinces } = stationBelongInfo;
        let { stationMapPosition, stationArea, ongridTime, fullOngridTime } = values;
        const [ longitude, latitude ] = stationMapPosition, [provinceCode, cityCode, countyCode] = stationArea;
        delete values.stationMapPosition;
        delete values.stationArea;
        // let provinceName,cityName,countyName
        const tmpOngridTime = ongridTime ? ongridTime.format('YYYY-MM-DD') : null;
        const tmpFullOngridTime = fullOngridTime ? fullOngridTime.format('YYYY-MM-DD') : null;
        this.props.saveStationDetail({
          stationCode: stationDetail.stationCode,
          ...values,
          ongridTime: tmpOngridTime,
          fullOngridTime: tmpFullOngridTime,
          longitude, 
          latitude,
          provinceCode, 
          cityCode, 
          countyCode,
        })
        this.props.confirmWarningTip()
      }
    })
  }

  render(){
    const { stationDetail, loading, form, stationBelongInfo, getStationTargetInfo, cityData, countyData } = this.props;
    const isPv = stationDetail.stationType === 1;
    return (
      <Form className={styles.editPart}>
        <div className={styles.title}>
          <span className={styles.titleText}>基本信息</span>
          <div className={styles.titleHandle}>
            <span className={styles.cancel} onClick={this.cancelEdit}>取消</span>
            <CneButton className={styles.save} onClick={this.saveStationInfo} loading={loading} >保存</CneButton>
          </div>
        </div>
        <EditBaseInfo 
          stationDetail={stationDetail} 
          form={form} 
          stationBelongInfo={stationBelongInfo}
          getStationTargetInfo={getStationTargetInfo}
          cityData={cityData}
          countyData={countyData}
        />
        {isPv && <EditStationBelong stationDetail={stationDetail} form={form} stationBelongInfo={stationBelongInfo} />}
        <EditConnectNetInfo stationDetail={stationDetail} form={form} stationBelongInfo={stationBelongInfo} />
        <EditOtherInfo stationDetail={stationDetail} form={form} />
      </Form>
    )
  }
}

export default Form.create()(EditForm);
