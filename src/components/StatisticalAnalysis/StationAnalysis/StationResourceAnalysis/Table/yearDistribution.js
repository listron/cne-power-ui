import React from "react";
import styles from './styles.scss';
import { Table } from 'antd';

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  onMouseEnter = (record) => {

    return (
      <div>xuanfukuang</div>
    )
  }
  render() {
    const { column,dataArray } = this.props
    const children = column.map((item) => {
      return {
        title: item,
        dataIndex: item,
        key: item,
        sorter: (a, b) => a.item - b.item,
        width: 90,
        render: text => (text || text === 0) ? text : '--'
      }
    })
    const columns = [
      {
        title: '瞬时辐射区间',
        dataIndex: 'radiationInterval',
        key: 'radiationInterval',
        width: 120,
        // fixed: 'left',
        sorter: (a, b) => a.lastYearData - b.lastYearData,
        render: text => (text || text === 0) ? text : '--'
      }, {
        title: '辐射总量',
        children: children
      },];
    const data = dataArray && dataArray.map((e, i) => ({ ...e, key: i,}));
    return (
      <div className={styles.TableGraphContainer} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            光资源分布排名
          </div>
          <div>
            瞬时辐射区间:w/㎡ ,辐射总量:MJ/㎡
          </div>
        </div>
        <Table 
        className={styles.tableList} 
        columns={columns} 
        bordered 
        dataSource={data} 
        pagination={false} 
        scroll={{ x:'150%' , y: 151 }}
        size="small" 
        onRow={(record) => { return { onMouseEnter: this.onMouseEnter } }} />
      </div>
    )
  }
}
export default (TableGraph)