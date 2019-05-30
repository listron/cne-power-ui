import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Select, TreeSelect, DatePicker, Button } from 'antd';
import moment from 'moment';
import styles from "./stockRecords.scss";
import path from '../../../../constants/path';

const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
const { RangePicker } = DatePicker;

class StockSearch extends Component {
  static propTypes = {
    stockRecordsStore: PropTypes.func,
    getWarehouseName: PropTypes.func,
    warehouseNames: PropTypes.array,
    goodsType: PropTypes.string,
    manufactorCode: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  componentDidMount () {
    const { getWarehouseName } = this.props;
    getWarehouseName();
  }

  onWarehouseName = () => { // 选择仓库名称
    const { stockRecordsStore, warehouseNames } = this.props;
    stockRecordsStore(warehouseNames)
  }

  onManufactor = value => { // 选择库存类型
    this.setState({ value: value })
    this.props.stockRecordsStore({ goodsType: value }); 
  }
  
  timeChange = (time) => { // 选择时间
    const startTime = moment(time[0]).startOf('day').format('YYYY-MM-DD');
    let endTime = moment(time[1]).endOf('day').format('YYYY-MM-DD');
    const isToday = moment(endTime).isSame(moment(), 'd');
    isToday ? endTime = moment().format('YYYY-MM-DD') : endTime;
    this.props.stockRecordsStore({
      startTime,
      endTime
    })
  }

  render() {
    const { warehouseNames } = this.props;
    const inImportBtn = `${path.basePaths.originUri}${path.APISubPaths.operation.inRecordExport}`; // 入库导出
    const outImportBtn = `${path.basePaths.originUri}${path.APISubPaths.operation.outRecordExport}`; // 入库导出

    return (
      <div className={styles.stockSearch}>
        {/* <div className={styles.searchLeft}>
          <span className={styles.text}>条件查询</span>
          <Select 
            // mode="multiple"
            placeholder="请选择仓库名称" 
            className={styles.warehouseName}
            onChange={this.onWarehouseName}
          >
            {warehouseNames.map(e => {
              return <Option key={e.warehouseId} value={e.warehouseId}>{e.warehouseName}</Option>
            })}
          </Select>

          <TreeSelect
            showSearch={false} // 是否显示搜索框
            // multiple // 是否多选
            style={{ width: 180 }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择库存类型"
            allowClear // 显示清除按钮
            treeDefaultExpandAll // 默认展开所有树节点
            className={styles.inventory}
            onChange={this.onManufactor}
          >
            <TreeNode value="备品备件" title="备品备件" key="101" />
            <TreeNode value="工器具" title="工器具" key="200">
              <TreeNode value="安全工器具" title="安全工器具" key="201" />
              <TreeNode value="检修工器具" title="检修工器具" key="202" />
              <TreeNode value="仪器仪表" title="仪器仪表" key="203" />
            </TreeNode>
            <TreeNode value="物资管理" title="物资管理" key="300">
              <TreeNode value="生活物资" title="生活物资" key="301" />
              <TreeNode value="办公物资" title="办公物资" key="302" />
            </TreeNode>
          </TreeSelect>

          <RangePicker
            allowClear={false}
            format="YYYY-MM-DD"
            onChange={this.timeChange}
          />
        </div> */}
        {/* <div className={styles.searchRight}> */}
          {/* <Button href={inImportBtn} download={inImportBtn} target="_blank" className={styles.inImportBtn}>导出</Button> */}
          {/* <Button href={outImportBtn} download={outImportBtn} target="_blank" className={styles.outImportBtn}>导出</Button>  */}{/* 出库 */}
          
        {/* </div> */}
      </div>
    )
  }
}

export default StockSearch;