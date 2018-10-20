

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayReportListSearch from './DayReportListSearch';
import Footer from '../../../Common/Footer';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './dayReportAll.scss';
import { Button, Table, Icon, Tooltip } from 'antd';
import moment from 'moment';

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
    this.props.toChangeDayReportStore({
      showPage: 'report',
    })
  }

  toReportDetail = (record, reportDate) => { // 去查看指定电站+日期日报详情
    this.props.dayReportDetail({ // 去查看详情
      stationCode: record.stationCode,
      // reportDate: `${this.props.startTime}-${reportDate}`,
      reportDate
    })
  }

  toUploadReport = (record, reportDay) => { // 去上传指定电站+日期日报
    // const reportDay = `${this.props.startTime}-${reportDay}`;
    const { stations } = this.props;
    this.props.getStationBaseReport({
      reportDay,
      reportStation: [stations.find(e=>e.stationCode === record.stationCode)],
    });
  }

  render() {
    const { pageSize, pageNum, totalNum, dayReportList, loading } = this.props;
    let columns = [{
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
    }]
    if(dayReportList.length > 0 && dayReportList[0].dataList){
      const { dataList } = dayReportList[0];
      dataList && dataList.length > 0 && dataList.forEach(e=>{
        columns.push({
          title: moment(e.reportDate).format('DD'),
          dataIndex: e.reportDate,
          render: (text, record) => { // available是否展示图表, isUpload是否已上传日报, status是否有异常信息未填。
            const stationDayInfo = record.dataList.find(info=>info.reportDate === e.reportDate);
            const { available, isUpload, status} = stationDayInfo;
            /*
              available: true可以进行日报上传/查看, false不可进行任何操作-->直到选中日前一天日报数据上传
              status: false未上传日报，true已上传。
              isUpload: false正常,true有未上报损失异常, 
            */  
            const showWarningIcon = status && isUpload; // 展示黄色图标提示未完成损失电量的填写。true展示，false不展示。
            if(!available){ // 不可上传
              return <span></span>
            }else if(status){ // 已上传日报=>查看详情
            // if(status){ // 已上传日报=>查看详情
              return (<span onClick={()=>this.toReportDetail(record, e.reportDate)}>
                <i className="iconfont icon-look">
                  {showWarningIcon && <i className="iconfont icon-alert_01" ></i>}
                </i>
              </span>)
            }else{ // 未上传日报 => 点击上传
              return <span onClick={()=>this.toUploadReport(record, e.reportDate)}><Icon type="plus-circle" theme="outlined" /></span>
            }
          }
        });
      })
    }
    const content = (<ul>
      <li>1. 支持单日批量和单个电站上传日报;</li>
      <li>2. 单个电站的日报必须按照时间顺序逐一上传;</li>
      <li>3. 单个电站当日日报只能上传一次;</li>
      <li>4. 没发生的日期不支持上传日报;</li>
      <li>5. 在日报详情页面中支持编辑修改。</li>
    </ul>)
    return (
        <div className={styles.dayReportMain}>
          <div className={styles.contentMain}>
            <DayReportListSearch {...this.props} /> 
            <div className={styles.operateDayReport} >
              <span>
                <Button onClick={this.toUploadPage} icon="plus" className={styles.uploadReport} >
                  <span>上传日报</span>
                </Button>
                <Tooltip placement="topLeft" title={content} overlayClassName={styles.toolInfo}>
                  <Icon type="exclamation-circle" theme="outlined" className={styles.infoTooltip} />
                </Tooltip>
              </span>
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
