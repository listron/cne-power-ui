import React, {Component} from 'react';
import { Table, Button } from 'antd';
import styles from './scatterDiagram.scss';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination'
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';


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
    const { listParam, scatterDiagramList, tableLoading, pointsInfo, queryParam } = this.props;
    const { xPoint, yPoint } = queryParam;
    const { totalSize, dataList = [], xUnit, yUnit } = scatterDiagramList;
    const { pageNum, pageSize, } = listParam;
    
    
    const xCurrentPoint = dataList.find(e =>{ 
      return e.devicePointCode === xPoint;
    }) || {};
    
    const yCurrentPoint = dataList.find(e =>{ 
      return e.devicePointCode === yPoint;
    }) || {};
    const dataSource = dataList.map((e,i) =>{
      return  ({
        key: i,
        ...e,
        xData: numWithComma(dataFormat(e.xData,'--',2)),
        yData: numWithComma(dataFormat(e.yData,'--',2)),
        time: e.time ? moment(e.time).format('YYYY-MM-DD HH:mm:ss') : '--'
      })
    })
    
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
      title: <TableColumnTitle title={xCurrentPoint.devicePointName} unit={xUnit} />,
      dataIndex: 'xData',
    },{
      title: <TableColumnTitle title={yCurrentPoint.devicePointName} unit={yUnit} />,
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