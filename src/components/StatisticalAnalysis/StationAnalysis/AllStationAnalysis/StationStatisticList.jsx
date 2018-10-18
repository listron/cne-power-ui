import React from "react";
import PropTypes from "prop-types";
import styles from './stationStatisticList.scss';
import Pagination from '../../../../components/Common/CommonPagination/index';
import {  Table,  Radio } from "antd";
import moment from 'moment';


class StationStatisticList extends React.Component {
  static propTypes = {
    AllStationAvalibaData: PropTypes.array,
    dateType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }
  
  selectTime() {
    const {AllStationAvalibaData,}=this.props; 
    const currentMonth=moment().format('MM');
    return (
      <Radio.Group defaultValue={currentMonth}  buttonStyle="solid">
       {AllStationAvalibaData.map((e,index)=>{        
         if(e.isTrue==='1'){
          return   <Radio.Button value={e.year} key={index}  style={{margin:'0 5px'}}>{e.year}月</Radio.Button>
         }else{
          return   <Radio.Button value={e.year} key={index} disabled style={{margin:'0 5px'}}>{e.year}月</Radio.Button>
         }      
       }      
       )}        
      </Radio.Group>
    ) 
  }
  selectYear() {
    const {AllStationAvalibaData}=this.props;
    const currentYear=moment().format('YYYY');
    console.log(currentYear); 
    return (
      <Radio.Group defaultValue={currentYear}  buttonStyle="solid">
       {AllStationAvalibaData.map((e,index)=>{        
         if(e.isTrue==='1'){
          return   <Radio.Button value={e.year} key={index}  style={{margin:'0 5px'}}>{e.year}年</Radio.Button>
         }else{
          return   <Radio.Button value={e.year} key={index} disabled style={{margin:'0 5px'}}>{e.year}年</Radio.Button>
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
    const {dateType,AllStationAvalibaData}=this.props;
    console.log(AllStationAvalibaData);
    const columns = this.initColumn();
    return (
      <div className={styles.stationStatisticList}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div>综合指标统计表</div>
            {dateType==='month'?this.selectTime():''}
            {dateType==='year'?this.selectYear():''}
           
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