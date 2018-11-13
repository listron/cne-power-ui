import React,{Component} from "react";
import {connect} from "react-redux";
import {Icon,DatePicker,Button} from "antd";
import styles from  './generalReport.scss';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import StationSelect from '../../../../components/Common/StationSelect';
import Footer from "../../../../components/Common/Footer";

class GeneralReport extends Component{
  constructor(props){
    super(props)
  };
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
    const { MonthPicker } = DatePicker;
    const { allStationBaseInfo,stationCode } = this.props;
    const downloadHref = '';
    const breadCrumbData = {
      breadData :[
        {
          name:'通用报表'
        }
      ]
    };
    return(
      <div className={styles.generalReportBox}>
          <CommonBreadcrumb {...breadCrumbData} style={{marginLeft:'38px'}}></CommonBreadcrumb>
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
                        <DatePicker  placeholder={'选择时间'}/>
                      </div>
                      <div className={styles.downloadBtn}>
                        <Button disabled className={styles.text} href={downloadHref} download={downloadHref}>下载</Button>
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
                        <DatePicker  placeholder={'选择时间'}/>
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
                      <DatePicker placeholder={'选择时间'}/>
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
                      <MonthPicker placeholder={'选择月份'} />
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