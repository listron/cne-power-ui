

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayReportListSearch from './DayReportListSearch';
import Footer from '../../../Common/Footer';
import DayReportListHandle from './DayReportListHandle';
import styles from './dayReportAll.scss';
import { Table, Icon } from 'antd';
import { handleRight } from '@utils/utilFunc';
import moment from 'moment';
import CneTable from '@components/Common/Power/CneTable';

class DayReportMainList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationType: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    totalNum: PropTypes.number,
    stationNameSort: PropTypes.number,
    regionName: PropTypes.string,
    startTime: PropTypes.string,
    dayReportList: PropTypes.array,
    stations: PropTypes.array,
    getDayReportList: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
    getStationBaseReport: PropTypes.func,
    dayReportDetail: PropTypes.func,
    getReportUploadedStation: PropTypes.func,
  }

  tableChange = (pagination, filter, sorter) => { // 部门排序
    const { order } = sorter;
    const stationNameSort = order ? (order === 'ascend' ? 1 : 0) : 0;
    const { getDayReportList, pageSize, pageNum, stationType, startTime, regionName } = this.props;
    const params = { pageSize, pageNum, stationType, startTime, regionName};
    getDayReportList({ ...params, stationNameSort });
  }

  toReportDetail = (record, reportDate) => { // 去查看指定电站+日期日报详情
    this.props.dayReportDetail({ // 去查看详情
      stationCode: record.stationCode,
      // reportDate: `${this.props.startTime}-${reportDate}`,
      reportDate,
    });
  }

  toUploadReport = (record, reportDay) => { // 去上报指定电站+日期日报
    // const reportDay = `${this.props.startTime}-${reportDay}`;
    const { stations } = this.props;
    this.props.getStationBaseReport({
      reportDay,
      reportStation: [stations.find(e=>e.stationCode === record.stationCode)],
    });
  }

  render() {
    const { dayReportList, loading, startTime } = this.props;
    const columns = [{
      title: '电站名称',
      dataIndex: 'stationName',
      className: styles.stationName,
      sorter: true,
    }];
    if(dayReportList.length > 0 && dayReportList[0].dataList){ // 有数据
      const { dataList } = dayReportList[0];
      dataList && dataList.length > 0 && dataList.forEach(e=>{
        columns.push({
          title: moment(e.reportDate).format('DD'),
          dataIndex: e.reportDate,
          render: (text, record) => { // available是否展示图表, isUpload是否已上报日报, status是否有异常信息未填。
            const stationDayInfo = record.dataList.find(info => info.reportDate === e.reportDate);
            const { /* available, */ isUpload, status} = stationDayInfo;
            const afterToday = moment(e.reportDate) > moment();
            const reportRight = handleRight('daily_report');
            /*
              available: true可以进行日报上报/查看, false不可进行任何操作-->直到选中日前一天日报数据上报
              status: false未上报日报，true已上传。
              isUpload: false正常,true有未上报损失异常, 
              // 2018-12-20决定，以上规则废弃，
              available无用，已发生的日期内，只有已上报/待上报(status区分)两种状态,未发生日期不可上报。
            */
            if (afterToday) { // 未发生日期 不可上传日报
              return <span />;
            } else if (status) { // 已上报
              return (<span onClick={()=>this.toReportDetail(record, e.reportDate)}>
                <i className="iconfont icon-look">
                  {isUpload && <i className="iconfont icon-alert_01" />}
                </i>
              </span>);
            }
            return ( // 未上报
              reportRight ? <span onClick={()=>this.toUploadReport(record, e.reportDate)}>
                <Icon type="plus-circle" theme="outlined" />
              </span> : <span />
            );
          },
        });
      });
    }else{ // 无数据
      const dayLength = startTime? moment(startTime).daysInMonth(): 0;
      const daysArr = [];
      daysArr.length = dayLength;
      daysArr.fill(0);
      const emptyDateArr = daysArr.map((e, i) => ({
        title: i > 8 ? `${i+1}` : `0${i+1}`,
        dataIndex: `${i+1}`,
      }));
      columns.push(...emptyDateArr);
    }
    return (
        <div className={styles.dayReportMain}>
          <div className={styles.contentMain}>
            <DayReportListSearch {...this.props} />
            <DayReportListHandle {...this.props} />
            <CneTable
              loading={loading}
              dataSource={dayReportList.map((e, i) => { // 二维数据结构调整解析至页面
                const { dateList } = e;
                const dataObj = { key: i, ...e };
                dateList && dateList.length > 0 && dateList.forEach(m=>{
                  dataObj[m.reportDate] = m.isUpload;
                  dataObj.status = m.status;
                });
                delete dataObj.dateList;
                return dataObj;
              })}
              locale={{emptyText: <img width="223" height="164" src="/img/nodata.png" />}}
              columns={columns}
              onChange={this.tableChange}
              pagination={false}
              className={styles.tableStyle}
            />
          </div>
          <Footer />
        </div>
    );
  }
}

export default DayReportMainList;
