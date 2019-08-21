import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import FilterConditionTitle from './FilterConditionTitle';
import StationFilter from './StationFilter';
import MultipleSelect from './MultipleSelect';
import FilteredItems from './FilteredItems';
import RangeDateFilter from './RangeDateFilter';
import DateFilter from './DateFilter';


class FilterCondition extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.object,
    option: PropTypes.array,
  }


  /**
   * 
   * @param {*} props 
   * 1 time 时间  开始时间-结束时间  单独的时间
   * 2 带分类的 电站类型  缺陷类型  根据分类  
   * 3 缺陷来源  缺陷级别  设备类型
   *   
    rules  label  value   选择框  默认是label  value 

     onChange  回掉函数  你需要什么值 就会返回什么值   根据typeName的返回的值
     如 {deviceTypeCode:[201,793],stationCodes:[56,350]}

     typeName 必须是唯一的，否则会被替换


     disabled: true, 这个功能暂定
     1  time   
        rangTime [2019.7.12,2019,9.12]
        {
          name:'发生时间'，
          type:'rangTime',
          typeName:'rangTimes',
          belong:'multipleSelect',
          value:[2019.7.12,2019,9.12] 暂定
        }
        startTime:2019.7.12,
         {
          name:'开始时间'，
          type:'startTime',
          typeName:'startTime',
          value:2019.7.12
        }
        endTime:2019.9.12
        {
          name:'结束时间'，
          type:'endTime',
          typeName:'enDTimes',
          value:2019.7.12
        }

        
     2  复选框 
        {
          name: '设备类型',
          type: 'checkBox',
          typeName: 'deviceTypeCode',
          data: deviceTypes,
          rules: ['deviceTypeName', 'deviceTypeCode'],
         },

     3  switch 
       {
          name: '我参与的',
          type: 'switch',
          typeName: 'jionList', // isMay
          value:0/1
         },
     4  单选框  stationType 
        {
          name: '电站类型',  // 目前为止就是这一个
          type: 'radio',
          typeName: 'stationType', // 0 1 2 全部  风电 光伏
          value: 0 1 2
         },

     5  带父级   电站名称 缺陷类型  这两个都单独写  value  checkedValue 是可以接受的
          {
          name: '电站名称',  // 目前为止就是这一个
          type: 'parentCheckBox',
          typeName: 'stationCodes', // 0 1 2 全部  风电 光伏
          rules:[stationName,stationCode]，
          parentName:'provinceName'
          data:stations
          value:[350,360]
         },

   */

  /** 
   
    option={[
            {
              name: '告警级别',
              type: 'level',
              typeName: 'warnLevel',
              belong: 'multipleSelect',
            },
            {
              name: '缺陷类型',
              type: 'defectSource',
              typeName: 'defectSource',
              belong: 'multipleSelect',
            },
            {
              name: '工单类型',
              type: 'warningStatus',
              typeName: 'defectSource',
              belong: 'multipleSelect',
            },
            {
              name: '电站类型',
              type: 'stationType',
              typeName: 'stationType',
              belong: 'multipleSelect',
            },
            {
              name: '电站名称',
              type: 'stationName',
              belong: 'multipleSelect',
              typeName: 'stationCodes',
              data: stations,
            },
            {
              name: '设备类型',
              type: 'deviceType',
              belong: 'multipleSelect',
              typeName: 'deviceTypeCode',
              data: deviceTypes,
              disabled: true,
              rules: ['deviceTypeName', 'deviceTypeCode'],
            },
            {
              name: '发生时间',
              type: 'rangeTime',
              typeName: 'rangeTime',
              belong: 'timeSelect',
            },
            {
              name: ' 发生时间',
              type: 'time',
              typeName: 'rangeTimes',
              belong: 'timeSelect',
            },
          ]}
  */



  constructor(props) {
    super(props); // 这个props.[paramsName] && .... 这个写法有点差啊····反复读取props还做两次计算~
    this.state = {
      optionItem: [],
    };
  }



  componentDidMount() {
    const { value, option } = this.props;
    this.changeDataType(value, option);

  }


  componentWillReceiveProps(nextProps) {
    const { value, option } = nextProps;
    this.changeDataType(value, option);
  }

  initOption = (type) => { //匹配
    let result = {};
    switch (type) {
      case 'defectLevel': result = {
        type: 'defectLevel',
        data: [
          { label: 'A级', value: 1 },
          { label: 'B级', value: 2 },
          { label: 'C级', value: 3 },
        ],
      }; break;
      case 'defectSource': result = {
        type: 'defectSource',
        data: [
          { label: '告警', value: 0 },
          { label: '上报', value: 1 },
          { label: '巡检', value: 2 },
          { label: '预警', value: 3 },
        ],
      }; break;
      case 'level': result = {
        type: 'level',
        data: [
          { label: '一级', value: 1 },
          { label: '二级', value: 2 },
          { label: '三级', value: 3 },
          { label: '四级', value: 4 },
        ],
      }; break;
      case 'warningStatus': result = {
        type: 'warningStatus',
        data: [
          { label: '自动解除', value: 0 },
          { label: '手动解除', value: 2 },
          { label: '转工单', value: 3 },
        ],
      }; break;
      case 'stationName': result = {
        type: 'stationName',
        rules: ['stationName', 'stationCode'],
      }; break;
      default: result = {}; break;
    }
    return result;
  }


  changeDataType = (value = {}, option) => { // 切换数据，如果value 变化，或者是data 发生变化
    const { optionItem } = this.state;
    const optionList = [];
    option.forEach(item => {
      const currentItem = optionItem.filter(e => e.type === item.type)[0] || {};
      if (item.belong === 'multipleSelect' || item.belong === 'timeSelect') {
        item.checkedValue = value[item['typeName']] || [];
        if (currentItem.checkedValue && currentItem.checkedValue.length > 0) {
          item.checkedValue = Array.from(new Set([...currentItem.checkedValue, ...value[item['typeName']]]));
        }
      } else {
        if (value[item['typeName']]) {
          item.checkedValue = value[item['typeName']];
        }
        item.checkedValue = '';
      }
      optionList.push({ ...this.initOption(item.type), ...item });
    });
    console.log('item', optionList);
    this.setState({ optionItem: optionList });
  }

  getDefaultName = (type) => { //匹配
    let result = '';
    switch (type) {
      case 'time': result = '发生时间'; break;
      case 'stationType': result = '电站类型'; break;
      case 'stationName': result = '电站名称'; break;
      case 'deviceType': result = '设备类型'; break;
      case 'defectLevel': result = '缺陷级别'; break;
      case 'defectType': result = '缺陷类型'; break;
      case 'defectSource': result = '缺陷来源'; break;
      case 'belongMatrixs': result = '所属方阵'; break;
      case 'alarmLevel': result = '告警级别'; break;
      case 'warningLevel': result = '预警级别'; break;
      case 'warningStatus': result = '处理结果'; break;
      case 'alarmType': result = '告警类型'; break;
      case 'myJoin': result = '参与的'; break;
      case 'rangeTime': result = '发生时间'; break;
      case 'endTime': result = '结束时间'; break;
      case 'docketType': result = '两票类型'; break;
      default: result = ''; break;
    }
    return result;
  }


  outPutData = (optionItem) => {
    const obj = {};
    optionItem.forEach(item => { // 如果没有指定字段返回的是什么，则返回的是type 字段
      //  1typeName 存在  则显示 如果不存在 则不显示
      if (item['typeName']) {
        obj[item['typeName']] = item['checkedValue'];
      } else {
        obj[item['type']] = item['checkedValue'];
      }
    });
    this.props.onChange(obj);
  }

  showFilterChange = (type) => { // 改变筛选类型
    this.setState(type);
  }

  onChangeFilter = (value) => { // 改变其中一项的数据
    const { optionItem } = this.state;
    const { type } = value;
    optionItem.slice(optionItem.findIndex(e => e.type === type), 1, value);
    console.log('value', value, optionItem);
    this.outPutData(optionItem);
    this.setState({ optionItem: optionItem });

  }

  onChangeFilterChecked = (value) => {
    this.outPutData(value.options);
    this.setState({ optionItem: value.options });

  }

  render() {
    const { theme = 'light', option } = this.props;
    const { showFilter, optionItem } = this.state;
    const stationName = optionItem.filter(e => e.type === 'stationName').length > 0 && optionItem.filter(e => e.type === 'stationName')[0] || {};
    const deviceType = optionItem.filter(e => e.type === showFilter);
    const rangeTime = optionItem.filter(e => e.type === 'rangeTime');
    const time = optionItem.filter(e => e.type === 'time');
    console.log('deviceType', deviceType, optionItem);
    return (
      <div className={`${styles.filterCondition} ${styles[theme]}`}>
        <FilterConditionTitle options={optionItem} onChange={this.showFilterChange} />
        <div className={styles.filterBox}>
          {showFilter === 'stationName' &&
            <StationFilter
              onChangeFilter={this.onChangeFilter}
              option={stationName}
            />
          }
          {/* {deviceType.length > 0 &&
            <MultipleSelect
              onChangeFilter={this.onChangeFilter}
              option={deviceType[0]}
            />
          } */}
          {/* {
            rangeTime.length > 0 &&
            <RangeDateFilter
              onChangeFilter={this.onChangeFilter}
              option={rangeTime[0]}
            />
          } */}
          {
            time.length > 0 &&
            <DateFilter
              onChangeFilter={this.onChangeFilter}
              option={time[0]}
            />
          }




        </div>
        {/* 删选条件 */}
        <FilteredItems options={optionItem} onChangeFilterChecked={this.onChangeFilterChecked} />
      </div>
    );
  }

}

export default FilterCondition;
