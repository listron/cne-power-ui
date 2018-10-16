

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayReportListSearch from './DayReportListSearch';
import Footer from '../../../Common/Footer';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './dayReportAll.scss';
import { Button, Table,Icon } from 'antd';

class DayReportMainList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationType: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number, 
    totalNum: PropTypes.number,
    stationNameSort: PropTypes.number, 
    regionCode: PropTypes.number,
    startTime: PropTypes.string,
    dayReportList: PropTypes.array,
    stations: PropTypes.array,
    getDayReportList: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
    getStationBaseReport: PropTypes.func,
    dayReportDetail: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }
  
  onPaginationChange = ({ currentPage, pageSize }) => { // 分页器
    const { getDayReportList, stationType, stationNameSort, startTime, regionCode  } = this.props;
    getDayReportList({
      startTime,
      pageSize, 
      pageNum: currentPage,
      regionCode,
      stationType,
      stationNameSort,
    });
  }

  tableChange = (pagination, filter, sorter) => { // 部门排序
    const { order } = sorter;
    const stationNameSort = order ? (order === 'ascend' ? 1 : 0) : 0;
    const { getDayReportList, pageSize, pageNum, stationType, startTime, regionCode  } = this.props;
    getDayReportList({
      startTime,
      pageSize, 
      pageNum,
      regionCode,
      stationType,
      stationNameSort,
    });
  }

  toUploadPage = () => { // 去上传页面
    console.log('report页面');
    this.props.toChangeDayReportStore({
      showPage: 'report',
    })
  }

  toReportDetail = (record, reportDate) => { // 去查看指定电站+日期日报详情
    this.props.dayReportDetail({ // 去查看详情
      stationCode: record.stationCode,
      reportDate: `${this.props.startTime}-${reportDate}`,
    })
  }

  toUploadReport = (record, reportDate) => { // 去上传指定电站+日期日报
    const { reportDay } = `${this.props.startTime}-${reportDate}`;
    const { stations } = this.props;
    this.props.getStationBaseReport({
      reportDay,
      reportStation: stations.find(e=>e.stationCode === record.stationCode),
    });
  }

  render() {
    const { pageSize, pageNum, totalNum, dayReportList, loading } = this.props;
    let columns = [{
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
    }]
    if(dayReportList.length > 0 && dayReportList[0].dateList){
      const { dateList } = dayReportList[0];
      dateList && dateList.length > 0 && dateList.forEach((e,i)=>{
        columns.push({
          title: e.reportDate,
          dataIndex: e.reportDate,
          render: (text, record, index) => {
            const showWarningIcon = text && record.status; // 展示黄色图标提示未完成损失电量的填写。true展示，false不展示。
            if(text){
              return <span onClick={()=>this.toReportDetail(record, e.reportDate)}><i className="iconfont icon-look">{showWarningIcon && <i className="iconfont icon-alert_01" ></i>}</i></span>
            }else{
              return <span onClick={()=>this.toUploadReport(record, e.reportDate)}><Icon type="plus-circle" theme="outlined" /></span>
            }
          }
        });
      })
    }
    return (
        <div className={styles.dayReportMain}>
          <div className={styles.contentMain}>
            <DayReportListSearch {...this.props} /> 
            <div className={styles.operateDayReport} >
              <Button onClick={this.toUploadPage} icon="plus" className={styles.uploadReport} ><span>上传日报</span></Button>
              <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
            </div>
            <Table
              loading={loading}
              dataSource={dayReportList.map((e, i) => { // 二维数据结构调整解析至页面
                const { dateList } = e;
                let dataObj = { key: i, ...e };
                dateList && dateList.length > 0 && dateList.forEach(m=>{
                  dataObj[m.reportDate] = m.isUpload;
                  dataObj.status = m.status;
                })
                delete dataObj.dateList;
                return dataObj;
              })}
              columns={columns}
              onChange={this.tableChange}
              pagination={false}
            />
          </div>
          <Footer />
        </div>
    )
  }
}

export default DayReportMainList;
