import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Select, TreeSelect, DatePicker, Button } from 'antd';
import path from '../../../../constants/path';
import styles from "./record.scss";
import moment from 'moment';

const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
const { RangePicker } = DatePicker;

class StockSearch extends Component {
  static propTypes = {
    stockRecordsStore: PropTypes.func,
    getWarehouseName: PropTypes.func,
    getOutRecordList: PropTypes.func,
    getInRecordList: PropTypes.func,
    downLoadFile: PropTypes.func,
    warehouseNames: PropTypes.array,
    goodsType: PropTypes.string,
    manufactorCode: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    tableType: PropTypes.string,
    listParams: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  componentDidMount () {
    this.props.getWarehouseName();
  }

  onWarehouseName = (warehouseId = null) => { // 选择仓库名称
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams } = this.props;
    const newParams = {
      ...listParams,
      warehouseId
    }
    stockRecordsStore({
      ...newParams
    })
    getInRecordList({
      ...newParams
    })
    getOutRecordList({
      ...newParams
    })
  }

  onManufactor = (goodsType = null) => { // 选择库存类型
    const { listParams, stockRecordsStore, getInRecordList, getOutRecordList } = this.props;
    this.setState({ value: goodsType })
    const newParams = {
      ...listParams,
      goodsType
    }
    stockRecordsStore({ 
      ...newParams
    }); 
    getInRecordList({
      ...newParams
    })
    getOutRecordList({
      ...newParams
    })
  }
  
  timeChange = (time) => { // 选择时间
    const timeLength = time.length > 0;
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams } = this.props;
    let startTime = timeLength ? moment(time[0]).startOf('day').format('YYYY-MM-DD') : null;
    let endTime = timeLength ? moment(time[1]).endOf('day').format('YYYY-MM-DD') : null;
    let isToday = moment(endTime).isSame(moment(), 'd');
    isToday ? endTime = moment().format('YYYY-MM-DD') : endTime;
    const newParams = {
      ...listParams,
      startTime,
      endTime,
    }
    stockRecordsStore({
      ...newParams
    })
    getInRecordList({
      ...newParams
    })
    getOutRecordList({
      ...newParams
    })
  }

  inImport = () => { // 入库导出
    const { downLoadFile, listParams } = this.props;
    const url = `${APIBasePath}${operation.inRecordExport}`;
    const { warehouseId, goodsType, startTime, endTime } = listParams;
    const timeZone = moment().zone() / (-60);
    downLoadFile({
      url,
      fileName: `入库表`,
      params: {
        warehouseId,
        goodsType,
        startTime: startTime ? moment(startTime).utc().format() : null, 
        endTime: endTime ? moment(endTime).utc().format() : null, 
        timeZone
      }
    })
  }

  outImport = () => { // 出库导出
    const { downLoadFile, listParams } = this.props;
    const url = `${APIBasePath}${operation.outRecordExport}`;
    const { warehouseId, goodsType, startTime, endTime } = listParams;
    const timeZone = moment().zone() / (-60);
    downLoadFile({
      url,
      fileName: `出库表`,
      params: {
        warehouseId,
        goodsType,
        startTime: startTime ? moment(startTime).utc().format() : null, 
        endTime: endTime ? moment(endTime).utc().format() : null,
        timeZone
      }
    })
  }

  render() {
    const { warehouseNames, tableType, listParams } = this.props;
    const { warehouseId, goodsType, startTime, endTime } = listParams;
    return (
      <div className={styles.stockSearch}>
        <div className={styles.searchLeft}>
          <span className={styles.text}>条件查询</span>
          <Select 
            allowClear
            placeholder="请选择仓库名称" 
            className={styles.warehouseName}
            onChange={this.onWarehouseName}
          >
            {warehouseNames.map(e => {
              return <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
            })}
          </Select>

          <TreeSelect
            showSearch={false}
            style={{ width: 180 }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择库存类型"
            allowClear
            treeDefaultExpandAll
            className={styles.inventory}
            onChange={this.onManufactor}
          >
            <TreeNode value="101" title="备品备件" key="101" />
            <TreeNode value="200" title="工器具" key="200">
              <TreeNode value="201" title="安全工器具" key="201" />
              <TreeNode value="202" title="检修工器具" key="202" />
              <TreeNode value="203" title="仪器仪表" key="203" />
            </TreeNode>
            <TreeNode value="300" title="物资" key="300" >
              <TreeNode value="301" title="生活物资" key="301" />
              <TreeNode value="302" title="办公物资" key="302" />
              <TreeNode value="303" title="其他" key="303" />
            </TreeNode>
          </TreeSelect>

          <RangePicker
            allowClear
            format="YYYY-MM-DD"
            onChange={this.timeChange}
          />
        </div>
        <div className={styles.searchRight}>
          {tableType === 'inRecord' ? <Button onClick={this.inImport} className={styles.inImportBtn} disabled={!warehouseId && !goodsType && !startTime && !endTime}>导出</Button> : 
          <Button onClick={this.outImport} className={styles.outImportBtn} disabled={!warehouseId && !goodsType && !RangePicker && !endTime}>导出</Button>}
        </div>
      </div>
    )
  }
}

export default StockSearch;