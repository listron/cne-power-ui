import React, {Component} from 'react';
import { Table } from 'antd';
import styles from './scatterDiagram.scss';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination'
import moment from 'moment';

class ScatterDiagramList extends Component{
  static propTypes = {
    tableLoading: PropTypes.bool,
    listParam: PropTypes.object,
    getListScatterDiagram: PropTypes.func,
    queryParam: PropTypes.object,
    partScatterDiagram: PropTypes.object,
  }
  
  onPaginationChange = ({ pageSize, currentPage }) => { // 操作分页器
    const { getListScatterDiagram, queryParam, listParam } = this.props;
    getListScatterDiagram({
      queryParam,
      listParam: {
        ...listParam,
        pageSize,
        pageNum: currentPage,
      }
    })
  }

  getTitle = (title,unit) => {
    return (
      <div>
        <div className={styles.text}>{title}</div>
        <div className={styles.unit}>{unit ? `(${unit})` : ''}</div>
      </div>
    )
  }
  
  render(){
    const { listParam, partScatterDiagram, tableLoading } = this.props;
    const { totalCount, dataList = [] } = partScatterDiagram;
    const { pageNum, pageSize, } = listParam;

    const dataSource = dataList.map((e,i)=>{ // 表格数据
      let pointInfo = {};
      e.pointData.forEach(point => {
        pointInfo[point.devicePointCode] = point.pointValue
      })
      return {
        key: i,
        ...e,
        ...pointInfo,
        time: e.time ? moment(e.time).format('YYYY-MM-DD HH:mm:ss') : '--'
      }
    })
    console.log(partScatterDiagram)
    
    const columns = [{
      title: this.getTitle('设备名称'),
      dataIndex: 'deviceName',
    }, {
      title: this.getTitle('电站名称'),
      dataIndex: 'stationName',
    }, {
      title: this.getTitle('设备类型'),
      dataIndex: 'deviceTypeName',
    },{
      title: this.getTitle('型号'),
      dataIndex: 'deviceModeName',
    }, {
      title: this.getTitle('时间'),
      dataIndex: 'time',
    }, {
      title: this.getTitle('风速', 'm/s'),
      dataIndex: 'speed',
    },{
      title: this.getTitle('功率', 'kW'),
      dataIndex: 'power',
    }];

    return(
      <div className={styles.scatterDiagramList}>
        <div className={styles.pagination}>
          <CommonPagination currentPage={pageNum} pageSize={pageSize} total={totalCount} onPaginationChange={this.onPaginationChange} />
        </div>
          <Table
            loading={tableLoading}
            dataSource={dataSource} 
            columns={columns}
            pagination={false}
            locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
          />
      </div>
    )
  }
}

export default ScatterDiagramList;