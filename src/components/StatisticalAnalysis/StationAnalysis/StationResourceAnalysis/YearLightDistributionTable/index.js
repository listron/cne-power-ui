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
      title: '瞬时辐射区间',
      dataIndex: 'Interval',
      key: 'Interval',
      sorter: true,
      width: 180,
    }, {
      title: '辐射总量',
      children: [{
        title: '2014',
        dataIndex: 'year2014',
        key: 'year2014',
        sorter: true,
         width: 80,
      }, {
        title: '2015',
        dataIndex: 'year2015',
        key: 'year2015',
        sorter: true,
         width: 80,
      },{
        title: '2016',
        dataIndex: 'year2016',
        key: 'year2016',
        sorter: true,
         width: 80,
      }, {
        title: '2017',
        dataIndex: 'year2017',
        key: 'year2017',
        sorter: true,
         width: 80,
      },{
        title: '2018',
        dataIndex: 'year2018',
        key: 'year2018',
        sorter: true,
         width: 80,
      }, {
        title: '2019',
        dataIndex: 'year2019',
        key: 'year2019',
        sorter: true,
         width: 80,
      }],
    }, ];
    const data = [];
    const Interval=['1-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-1000', '1000以上'];
    for (let i = 0; i < 12; i++) {
      data.push({
        key: i,
        Interval: Interval[i],
      
        year2014: `${100+i}`,
       
        year2015: `${i}%`,
        year2016:`${200+i}`,
        year2017: `${i+3}%`,
        year2018: `${i}`,
        year2019: `${i+1}`,
      });
    }
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
        <Table className={styles.tableList} columns={columns}  bordered dataSource={data} pagination={false} scroll={{ y: 260 }} size="small" onRow={(record) => { return { onMouseEnter:this.onMouseEnter} }} />
      </div>
    )
  }
}
export default (TableGraph)