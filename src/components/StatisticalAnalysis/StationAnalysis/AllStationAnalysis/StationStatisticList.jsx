import React from "react";
import styles from './stationStatisticList.scss';
import Pagination from '../../../../components/Common/CommonPagination/index';
import {  Table,  Radio } from "antd";


class StationStatisticList extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  //时间选择按钮
      //这里可以判断是否是空数据
      //要先判断筛选的时间，如果是2014-2018，用for循环从2014年开始到2018年结束
      //如果是2018年，直接12个月，或者取当年月份，从1月循环到本月
  selectTime() {
    return (
      <Radio.Group defaultValue="4"  buttonStyle="solid">
       {["1","2","3","4","5","6","7","8","9"].map((e,index)=>{
         if(e<7){
          return   <Radio.Button value={e} key={index}  style={{margin:'0 5px'}}>{e}月</Radio.Button>
         }else{
          return   <Radio.Button value={e} key={index} disabled style={{margin:'0 5px'}}>{e}月</Radio.Button>
         }      
       }       
       )}        
      </Radio.Group>
    )
  }
  selectYear() {
    return (
      <Radio.Group defaultValue="2019"  buttonStyle="solid">
       {['2014','2015','2016','2017','2018','2019'].map((e,index)=>{
         if(true){
          return   <Radio.Button value={e} key={index}  style={{margin:'0 5px'}}>{e}年</Radio.Button>
         }else{
          return   <Radio.Button value={e} key={index} disabled style={{margin:'0 5px'}}>{e}月</Radio.Button>
         }      
       }       
       )}        
      </Radio.Group>
    )
  }




  //table表
  initColumn = () => {
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",

        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,

        render: (value, record, index) => {
          if (record.currentStation !== '900') {
            return {
              children: (
                <a href={`#/monitor/singleStation/${record.key}`}>
                  <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
                </a>
              )
            }
          } else {
            return <div title={record.stationName} className={styles.stationName} onClick={record.currentStation === '900' ? this.showTip : null}>{record.stationName}</div>
          }
        }
      },
      {
        title: "区域",
        dataIndex: "stationrovince",
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.stationrovince}>{record.stationrovince}</div>
            )
          }
        }
      }, {
        title: "月计划发电量(万kWh)",
        dataIndex: "monthOutput",
        sorter: true,
      },
      {
        title: "月实际发电量(万kWh)",
        dataIndex: "yearOutput",
        sorter: true,
      },
      {
        title: "计划完成率",
        dataIndex: "stationPower",
        sorter: true,
      },
      {
        title: "发电量环比(MW)",
        dataIndex: "stationCapacity",
        sorter: true,

      },
      {
        title: "辐值总量(MJ/m²)",
        dataIndex: "windSpeed",
        sorter: true,
      },

      {
        title: "资源环比",
        dataIndex: "planOutput",
        sorter: true,
      },
      {
        title: "等效利用小时数 (h)",
        dataIndex: "equipmentNum",
        sorter: true,
      },
      {
        title: "PR",
        dataIndex: "alarmNum",
        sorter: true,
      }, {
        title: "损失电量(万kWh)",
        dataIndex: "dayOutput",
        sorter: true,
      },
      {
        title: "损失电量等效时",
        dataIndex: "currentStation",
        sorter: true,

      }
    ];
    return columns
  }

  render() {
    const {timeSelect}=this.props;
    const columns = this.initColumn();
    return (
      <div className={styles.stationStatisticList}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div>综合指标统计表</div>
            {timeSelect==='month'?this.selectTime():''}
            {timeSelect==='year'?this.selectYear():''}
          </div>
          <Pagination />
        </div>
        <div>
          <Table columns={columns} dataSource={[]} onChange={this.ontableSort} pagination={false} />
        </div>



      </div>
    )
  }
}
export default (StationStatisticList)