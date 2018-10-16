import React from "react";
import styles from './styles.scss';
import { Table } from 'antd';

class TableGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  onMouseEnter=(record)=>{
   
    return(
      <div>xuanfukuang</div>
    )
  }
  render() {
    const columns =[{
      title: '日期',
      dataIndex: 'time',
      key: 'time',
      sorter: true,
      width: 80,
    }, {
      title: '2017',
      children: [{
        title: '限电损失',
        dataIndex: 'limitPower',
        key: 'limitPower',
        sorter: true,
         width: 80,
      }, {
        title: '限电率',
        dataIndex: 'limitPowerRate',
        key: 'limitPowerRate',
        sorter: true,
         width: 80,
      }],
    }, {
      title: '2018',
      children: [{
        title: '限电损失',
        dataIndex: 'currentlimitPower',
        key: 'currentlimitPower',
        sorter: true,
         width: 80,
      }, {
        title: '限电率',
        dataIndex: 'currentlimitPowerRate',
        key: 'currentlimitPowerRate',
        sorter: true,
         width: 80,
      }],
    }, {
      title: '限电率同比',
      dataIndex: 'limitPowerContrast',
      key: 'limitPowerContrast',
      sorter: true,
      width: 80,
    
    }];
    const data = [];
    for (let i = 0; i < 14; i++) {
      data.push({
        key: i,
        time: `${i+1}月`,
      
        limitPower: `${100+i}`,
       
        limitPowerRate: `${i}%`,
        currentlimitPower:`${200+i}`,
        currentlimitPowerRate: `${i+3}%`,
        limitPowerContrast: `${i}`,
      });
    }
    return (
      <div className={styles.TableGraphContainer} >
        <div className={styles.TableGraphContainerTitle}>
          <div>
            限电率同比升幅排名
          </div>
          <div>
            限电损失：万kWh
          </div>
        </div>
        <Table className={styles.tableList} columns={columns}  bordered dataSource={data} pagination={false} scroll={{ y: 260 }} size="small" onRow={(record) => { return { onMouseEnter:this.onMouseEnter} }} />
      </div>
    )
  }
}
export default (TableGraph)