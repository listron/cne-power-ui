import React from "react";
import styles from './styles.scss';
import { Table } from 'antd';

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  onMouseEnter=(record)=>{
    console.log('record');
    return(
      <div>xuanfukuang</div>
    )
  }
  render() {
    const columns = [{
      title: '月份',
      dataIndex: 'month',
      width: 150,
      sorter: true,
    }, {
      title: '2017',
      dataIndex: 'startTime',
      width: 150,
      sorter: true,
    }, {
      title: '2018',
      dataIndex: 'endTime',
      width: 150,
      sorter: true,
    }, , {
      title: '同比',
      dataIndex: 'compare',
      width: 150,
      sorter: true,
    }];
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        key: i,
        month: ` ${i}月`,
        startTime: 32,
        endTime: `London ${i}`,
        compare: `London ${i}`
      });
    }
    return (
      <div className={styles.TableGraphContainer} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            损失电量同比降幅排名
          </div>
          <div>
            损失电量：万kWh
          </div>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 260 }} size="small" onRow={(record) => { return { onMouseEnter:(record)=>{
         
        }} }} />
      </div>
    )
  }
}
export default (TableGraph)