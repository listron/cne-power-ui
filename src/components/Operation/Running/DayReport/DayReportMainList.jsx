

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayReportListSearch from './DayReportListSearch';
import Footer from '../../../Common/Footer';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './dayReportAll.scss';
import { Button, Table } from 'antd';

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
    getDayReportList: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
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
    this.props.toChangeDayReportStore({
      showPage: 'report'
    })
  }

  toReportDetail = (record, reportDate) => { // 去查看指定电站+日期日报详情 == todo
    console.log( 'to report detail !!!!')
    console.log(record);
    console.log(reportDate);
    this.props.toChangeDayReportStore({
      showPage: 'detail',
    })
  }

  toUploadReport = (record, reportDate) => { // 去上传指定电站+日期日报
    console.log( 'to upload !!!!')
    console.log(reportDate);
    console.log(record);
    this.props.toChangeDayReportStore({
      showPage: 'report',
      reportDay: reportDate,
      reportStation: [{
        stationCode: record.stationCode,
        stationName: record.stationName
      }]
    })
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
              return <span onClick={()=>this.toReportDetail(record, e.reportDate)}>查看</span>
            }else{
              return <span onClick={()=>this.toUploadReport(record, e.reportDate)}>上传</span>
            }
          }
        });
      })
    }
    return (
        <div className={styles.dayReportMain}>
          <div className={styles.contentMain}>
            <DayReportListSearch {...this.props} /> 
            <div>
              <Button onClick={this.toUploadPage}>上传日报</Button>
              <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
            </div>
            <Table
              loading={loading}
              dataSource={dayReportList.map((e, i) => { // 二维数据结构调整解析至页面
                const { dateList } = e;
                delete e.dateList;
                let dataObj = { key: i, ...e };
                dateList && dateList.length > 0 && dateList.forEach(m=>{
                  dataObj[m.reportDate] = m.isUpload;
                  dataObj.status = m.status;
                })
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
