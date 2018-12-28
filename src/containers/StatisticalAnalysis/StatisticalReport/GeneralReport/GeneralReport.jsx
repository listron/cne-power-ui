import React,{ Component } from "react";
import { connect } from "react-redux";
import { Icon, DatePicker, Button, message } from "antd";
import styles from  './generalReport.scss';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import StationSelect from '../../../../components/Common/StationSelect';
import Footer from "../../../../components/Common/Footer";
import moment from 'moment';
import path from '../../../../constants/path';
import axios from 'axios';
const { APIBasePath } = path.basePaths;
const { 
  dailyreport, faultReport, genReport, indicatorReport
} = path.APISubPaths.statisticalAnalysis;
const { MonthPicker } = DatePicker;

class GeneralReport extends Component{
  constructor(props){
    super(props);
    this.state = {
      reportDate : moment().subtract(1,'day'),
      faultDate : moment().subtract(1,'day'),
      eleInfoDate : moment().subtract(1,'day'),
      proOperationDate : moment().subtract(1,'month'),
      selectedStation: []
    }
  }

  ChangeReportDate = value => { // 日报
    this.setState({
      reportDate : value
    })
  }
 
  ChangeFaultDate = value => { //故障日报
    this.setState({
      faultDate : value
    })
  }
  
  ChangeEleInfoDate = value =>{//发电量信息汇总
    this.setState({
      eleInfoDate : value
    })
  }
 
  ChangeProOperationDate = value => { // 生产指标运行
    this.setState({
      proOperationDate : value
    })
  }

  
  disabledDate = (current) => { //日期不可选
    return current && current > moment().startOf('day');
  }

  selectStation = selectedStation => {
    this.setState({ selectedStation });
  };

  downloadReport = () => { // 日报下载
    let { reportDate } = this.state;
    reportDate = reportDate.format('YYYY-MM-DD');
    const downloadHref = `${APIBasePath}/${dailyreport}/${reportDate}`;
    const fileName = `${reportDate}日报.xlsx`;
    this.downLoadFun(downloadHref, fileName, reportDate);
  }

  downloadFault = () => { // 故障日报
    let { faultDate } = this.state;
    faultDate = faultDate.format('YYYY-MM-DD');
    const downloadHref = `${APIBasePath}/${faultReport}/${faultDate}`;
    const fileName = `${faultDate}故障日报.xlsx`;
    this.downLoadFun(downloadHref, fileName, faultDate);
  }

  downloadGenInfo = () => { // 发电量信息下载
    let { eleInfoDate } = this.state;
    eleInfoDate = eleInfoDate.format('YYYY-MM-DD');
    const downloadHref = `${APIBasePath}/${genReport}/${eleInfoDate}`;
    const fileName = `${eleInfoDate}发电量信息汇总.xlsx`;
    this.downLoadFun(downloadHref, fileName, eleInfoDate);
  }

  downloadIndicator = () => { // 生产运营指标下载
    let { proOperationDate, selectedStation } = this.state;
    const { stationCode } = selectedStation[0];
    const indicatorYear = proOperationDate.format('YYYY');
    const indicatorMonth = proOperationDate.format('MM');
    const downloadHref = `${APIBasePath}/${indicatorReport}/${stationCode}/${indicatorYear}/${indicatorMonth}`;
    const fileName = `${proOperationDate}生产指标运行.xlsx`;
    this.downLoadFun(downloadHref, fileName, proOperationDate);
  }

  downLoadFun = (url, fileName, date) => { // 根据路径，名称，日期，通用下载函数。
    axios.post(url,{},{responseType:'blob'}).then(response=>{
      const fileContent = response.data;
      const fileNameInfo = response.headers['content-disposition'];
      let newFileName = fileName;
      if(fileNameInfo){
        const fileString = fileNameInfo.split(';')[1];
        const fileNameCode = fileString? fileString.split('=')[1]: '';
        const fileResult = fileNameCode?decodeURIComponent(fileNameCode): '';
        fileResult && (newFileName = fileResult)
      }
      if(fileContent) {
        const blob = new Blob([fileContent]);
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = newFileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, newFileName);
        }   
      }
    }).catch(warning=>{
      message.warning(`下载失败！请重新尝试`)
      console.log(warning)
    })
  }
  
  render(){
    const {
      reportDate, faultDate, eleInfoDate, proOperationDate, selectedStation
    } = this.state;
    const { stations } = this.props;
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
                disabledDate={this.disabledDate}
                placeholder={'选择时间'} 
                onChange={this.ChangeReportDate} 
                value={reportDate} 
                />
              </div>
              <div className={styles.downloadBtn}>
                <Button className={styles.text} onClick={this.downloadReport} disabled={!reportDate}>下载</Button>
              </div>
            </div>
           {/** <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.defaultReport}>
                  <Icon type="download" style={{color:'#ffffff'}} />
                </div>
                <span className={styles.title}>故障日报</span>
              </div>
              <div className={styles.dateSearch}>
                <DatePicker 
                disabledDate={this.disabledDate}
                placeholder={'选择时间'}
                onChange={this.ChangeFaultDate} 
                value={faultDate} 
                />
              </div>
              <div className={styles.downloadBtn}>
                <Button disabled={!faultDate} onClick={this.downloadFault} className={styles.text}>下载</Button>
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
                  disabledDate={this.disabledDate}
                  placeholder={'选择时间'}
                  onChange={this.ChangeEleInfoDate}
                  value={eleInfoDate} 
                />
              </div>
              <div className={styles.downloadBtn}>
                <Button disabled={!eleInfoDate} className={styles.text} onClick={this.downloadGenInfo}>下载</Button>
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
                  disabledDate={this.disabledDate}
                  placeholder={'选择月份'} 
                  onChange={this.ChangeProOperationDate}
                  value={proOperationDate}
                />
              </div>
              <div className={styles.stationSearchs}>
                <StationSelect 
                  data={stations}
                  onOK={this.selectStation}
                  value={selectedStation}
                  holderText="请选择电站"
                />
              </div>
              <div className={styles.downloadBtn}>
                <Button
                  disabled={ selectedStation.length === 0 || !proOperationDate}
                  className={styles.text}
                  onClick={this.downloadIndicator}
                >下载</Button>
              </div>
            </div>
          */} </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stations: state.common.get('stations').toJS(),
});

export default connect(mapStateToProps)(GeneralReport)