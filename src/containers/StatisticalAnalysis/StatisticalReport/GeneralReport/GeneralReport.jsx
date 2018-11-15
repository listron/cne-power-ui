import React,{Component} from "react";
import {connect} from "react-redux";
import {Icon,DatePicker,Button} from "antd";
import styles from  './generalReport.scss';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import StationSelect from '../../../../components/Common/StationSelect';
import Footer from "../../../../components/Common/Footer";
import moment from 'moment';

import path from '../../../../constants/path';
const { MonthPicker } = DatePicker;
class GeneralReport extends Component{

  constructor(props){
    super(props);
    this.state = {
      reportDate : moment().format('YYYY-MM-DD'),
      defaultDate : null,
      eleInfoDate : null,
      proOperationDate : null
    }
  }

  //日报
  ChangeReportDate = (value, dateString) => {
    this.setState({
      reportDate : dateString
    })
  }
  //故障日报
  ChangeDefaultDate = (value,dataString) => {
    this.setState({
      defaultDate : dataString
    })
  }
  //发电量信息汇总
  ChangeEleInfoDate = (value,dataString) =>{
    this.setState({
      eleInfoDate : dataString
    })
  }
  // 生产指标运行
  ChangeProOperationDate = (value,dataString) => {
    this.setState({
      proOperationDate : dataString
    })
  }

  stationSelected = (rest) => {
    const stationCodes = rest.map((item, index) => {
      return item.stationCode
    });
    this.setState({
      selectStation:rest,
      stationCodes: stationCodes
    });
  };

  render(){
    const { reportDate,defaultDate,eleInfoDate,proOperationDate } = this.state;
    const { allStationBaseInfo,stationCode } = this.props;
    const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.statisticalAnalysis.dailyreport}/${reportDate}`;
    return(
      <div className={styles.generalReportBox}>
          <CommonBreadcrumb breadData={{name:'通用报表'}} style={{marginLeft:'38px'}}></CommonBreadcrumb>
          <div className={styles.generalReportContainer}>
              <div className={styles.generalReportMain}>

                  <div className={styles.dailyBox}>
                      <div className={styles.boxTop}>
                          <div className={styles.dayReport}>
                            <Icon type="download" style={{color:'#ffffff'}} />
                          </div>
                          <span className={styles.title}>日报</span>
                      </div>
                      <div className={styles.dateSearch}>
                        <DatePicker 
                        placeholder={'选择时间'} 
                        onChange={this.ChangeReportDate} 
                        defaultValue={moment(moment(), 'YYYY-MM-DD')} 
                        />
                      </div>
                      <div className={styles.downloadBtn}>
                        <Button  className={styles.text} href={downloadHref} download={downloadHref}>下载</Button>
                      </div>
                  </div>

                  <div className={styles.dailyBox}>
                      <div className={styles.boxTop}>
                        <div className={styles.defaultReport}>
                          <Icon type="download" style={{color:'#ffffff'}} />
                        </div>
                        <span className={styles.title}>故障日报</span>
                      </div>
                      <div className={styles.dateSearch}>
                        <DatePicker 
                        placeholder={'选择时间'}
                        onChange={this.ChangeDefaultDate} 
                        defaultValue={moment(moment(), 'YYYY-MM-DD')}
                        />
                      </div>
                      <div className={styles.downloadBtn}>
                        <Button disabled className={styles.text} href={downloadHref} download={downloadHref}>下载</Button>
                      </div>
                  </div>

                  <div className={styles.dailyBox}>
                    <div className={styles.boxTop}>
                      <div className={styles.eleInfo}>
                          <Icon type="download" style={{color:'#ffffff'}} />
                      </div>
                      <span className={styles.title}>发电量信息汇总</span>
                    </div>
                    <div className={styles.dateSearch}>
                      <DatePicker 
                      placeholder={'选择时间'}
                      onChange={this.ChangeEleInfoDate}
                      defaultValue={moment(moment(), 'YYYY-MM-DD')}
                      />
                    </div>
                    <div className={styles.downloadBtn}>
                      <Button disabled className={styles.text} href={downloadHref} download={downloadHref}>下载</Button>
                    </div>
                  </div>

                  <div className={styles.dailyBox}>
                    <div className={styles.boxTop}>
                      <div className={styles.proOperation}>
                          <Icon type="download" style={{color:'#ffffff'}} />
                      </div>
                      <span className={styles.title}>生产指标运行</span>
                    </div>
                    <div className={styles.dateSearch}>
                      <MonthPicker 
                      placeholder={'选择月份'} 
                      onChange={this.ChangeProOperationDate}
                      defaultValue={moment(moment(), 'YYYY-MM')}
                      />
                    </div>
                    <div className={styles.stationSearchs}>
                      <StationSelect 
                        data={allStationBaseInfo} 
                        onOK={this.selectStation} 
                        holderText="请选择电站" 
                        disabled
                      //   value={allStationBaseInfo.filter(e=>e.stationCode === stationCode)}
                      />
                    </div>
                    <div className={styles.downloadBtn}>
                      <Button disabled className={styles.text} href={downloadHref} download={downloadHref}>下载</Button>
                    </div>
                  </div>
              </div>
             <Footer />
          </div>
      </div>
    )
  }
}

export default connect()(GeneralReport)