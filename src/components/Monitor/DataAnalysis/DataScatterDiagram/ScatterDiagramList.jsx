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
    changeScatterDiagramStore: PropTypes.func,
  }
  
  onPaginationChange = ({ pageSize, currentPage }) => { // 操作分页器
    const { getListScatterDiagram, changeScatterDiagramStore, queryParam, listParam } = this.props;
    changeScatterDiagramStore({
      pageSize,
      pageNum: currentPage,
    });
    getListScatterDiagram({
      queryParam,
      listParam: {
        ...listParam,
        pageSize,
        pageNum: currentPage,
      }
    });
  }
  
  render(){
    const { listParam, scatterDiagramList, tableLoading } = this.props;
    const { totalSize, dataList = [] } = scatterDiagramList;
    const { pageNum, pageSize, } = listParam;
    // const dataSource = dataList.map((e,i) => ({
    //   key: i,
    //   ...e,
    //   time: e.time ? moment(e.time).format('YYYY-MM-DD HH:mm:ss') : '--'
    // }))
    const dataSource = [1,2,3,4,5,6,7,7,8,9,10].map((e,i) => ({
      key: e * i,
      deviceName: `设备名${e * i}`,
      stationName: `电站${e * e * i}`,
      deviceTypeName: `类型${e}`,
      deviceModeName: `${i}`,
      time: moment().add(e * i * i *e ,'s').format('YYYY-MM-DD'),
      xData: e*e*i,
      yData: i*i*e*e*e
    }))
    
    const columns = [{
      title: '设备名称',
      dataIndex: 'deviceName',
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
    }, {
      title: '设备类型',
      dataIndex: 'deviceTypeName',
    },{
      title: '型号',
      dataIndex: 'deviceModeName',
    }, {
      title: '时间',
      dataIndex: 'time',
    }, {
      title: 'X轴测点',
      dataIndex: 'xData',
    },{
      title: 'X轴测点',
      dataIndex: 'yData',
    }];

    return(
      <div className={styles.scatterDiagramList}>
        <div className={styles.pagination}>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={totalSize}
            onPaginationChange={this.onPaginationChange}
          />
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