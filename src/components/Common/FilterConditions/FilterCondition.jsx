import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import FilterConditionTitle from './FilterConditionTitle';
import ParentFilter from './ParentFilter';
import MultipleSelect from './MultipleSelect';
import FilteredItems from './FilteredItems';
import RangeDateFilter from './RangeDateFilter';
import DateFilter from './DateFilter';
import RadioSelect from './RadioSelect';


class FilterCondition extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.object,
    option: PropTypes.array,
    theme: PropTypes.string,
  }


  /**
   * 
   * @param {*} props 
   * 1 time 时间  开始时间-结束时间  单独的时间
   * 2 带分类的 电站类型  缺陷类型  根据分类  
   * 3 缺陷来源  缺陷级别  设备类型
   *  
   * 
   {
       name: '多选类型',
       type: 'multipleType',
       belong: 'multipleSelect',
       typeName: 'deviceTypeCode',
       data: [{ deviceTypeName: 123, deviceTypeCode: 345 }],
       rules: ['deviceTypeName', 'deviceTypeCode'],
     },
     name: 筛选的标题 默认的可以不写，但是新添加的需要自定义
     type  类型  multipleType  多选框的 
     belong  是否是支持多选  不填 默认是单选 multipleSelect 多选
     typeName  最后返回的字段  value 中的字段和这个保持一致 必须是唯一的，否则会被替换
     data []  array  数组  
     rules  显示label的是那个字段，返回的value的字段   不填 默认的是label value 
      stationCode
    {
      name: '电站名称',
      type: 'stationName',
      belong: 'multipleSelect',
      typeName: 'stationCodes',
      data: stations,
    },

    {
     name: '测试单选',
     type: 'radioSelect',
     typeName: 'radioSelect',
     data: [{ label: 123, value: 345 }, { label: 567, value: 789 }],
     },
    {
     name: '电站类型',
     type: 'stationType',
     typeName: 'stationType',
    },

     type: 'radioSelect', 是单选的内容  内置的是电站类型 ，其他可以自定义
     
     rangTime 连续一个阶段的
      {
         name: '发生时间',
         type: 'rangeTime',
         typeName: 'rangeTime',
         belong: 'timeSelect',
      },

      time 两个时间 开始时间  截止时间
       {
        name: ' 发生时间',
        type: 'time',
        typeName: 'rangeTimes',
        belong: 'timeSelect',
        },
     
     
    
    少一个带父级的
     onChange  回掉函数  你需要什么值 就会返回什么值   根据typeName的返回的值
     如 {deviceTypeCode:[201,793],stationCodes:[56,350]}
     disabled: true, 这个功能暂定
   
     3  switch 
       {
          name: '我参与的',
          type: 'switch',
          typeName: 'jionList', // isMay
          value:0/1
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



  constructor(props) {
    super(props);
    this.state = {
      optionItem: [],
      showFilter: {
        type: '',
        typeName: '',
      },
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
        name: '缺陷级别',
        data: [
          { label: 'A级', value: 1 },
          { label: 'B级', value: 2 },
          { label: 'C级', value: 3 },
        ],
      }; break;
      case 'defectSource': result = {
        type: 'defectSource',
        name: '缺陷来源',
        data: [
          { label: '告警', value: 0 },
          { label: '上报', value: 1 },
          { label: '巡检', value: 2 },
          { label: '预警', value: 3 },
        ],
      }; break;
      case 'level': result = {
        type: 'level',
        name: '级别',
        data: [
          { label: '一级', value: 1 },
          { label: '二级', value: 2 },
          { label: '三级', value: 3 },
          { label: '四级', value: 4 },
        ],
      }; break;
      case 'warningStatus': result = {
        type: 'warningStatus',
        name: '告警状态',
        data: [
          { label: '自动解除', value: 0 },
          { label: '手动解除', value: 2 },
          { label: '转工单', value: 3 },
        ],
      }; break;
      case 'stationName': result = {
        type: 'stationName',
        rules: ['stationName', 'stationCode'],
        parentName: 'provinceName',
      }; break;
      case 'stationType': result = {
        type: 'stationType',
        name: '电站类型',
        data: [
          { label: '风电', value: 0 },
          { label: '光伏', value: 1 },
        ],
      }; break;
      default: result = {}; break;
    }
    return result;
  }


  changeDataType = (value = {}, option) => { // 切换数据，如果value 变化，或者是data 发生变化
    const { optionItem } = this.state;
    const optionList = [];
    option.forEach(item => {
      const currentItem = optionItem.filter(e => e.type === item.type && e.typeName === item.typeName)[0] || {};
      if (item.belong === 'multipleSelect' || item.belong === 'timeSelect') {
        item.checkedValue = value[item['typeName']] || [];
        if (currentItem.checkedValue && currentItem.checkedValue.length > 0) {
          const valueArray = value[item['typeName']] && value[item['typeName']] || [];
          const checkedValue = currentItem.checkedValue && currentItem.checkedValue || [];
          item.checkedValue = Array.from(new Set([...checkedValue, ...valueArray]));
        }
      } else {
        item.checkedValue = '';
        if (value[item['typeName']]) {
          item.checkedValue = value[item['typeName']];
        }
      }
      optionList.push({ ...this.initOption(item.type), ...item });
    });
    this.setState({ optionItem: optionList });
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
    const { type, typeName } = value;
    optionItem.slice(optionItem.findIndex(e => (e.type === type && e.typeName === typeName)), 1, value);
    this.outPutData(optionItem);
    this.setState({ optionItem: optionItem });
  }

  onChangeFilterChecked = (value) => {
    this.outPutData(value.options);
    this.setState({ optionItem: value.options });

  }

  render() {
    const { theme = 'light' } = this.props;
    const { showFilter, optionItem } = this.state;
    const { type } = showFilter;
    const selectData = optionItem.filter(e => e.type === showFilter.type && e.typeName === showFilter.typeName);
    const rangeTime = optionItem.filter(e => e.type === 'rangeTime');
    const time = optionItem.filter(e => e.type === 'time');
    const multipleArray = ['defectLevel', 'defectSource', 'level', 'warningStatus', 'multipleType'];
    const radioArray = ['stationType', 'radioSelect'];
    const parentMultipArray = ['stationName', 'parentCheckBox'];
    return (
      <div className={`${styles.filterCondition} ${styles[theme]}`}>
        <FilterConditionTitle options={optionItem} onChange={this.showFilterChange} onChangeFilter={this.onChangeFilter} />
        <div className={styles.filterBox}>
          {parentMultipArray.includes(type) && selectData.length > 0 &&
            <ParentFilter
              onChangeFilter={this.onChangeFilter}
              option={selectData[0]}
            />
          }
          {multipleArray.includes(type) && selectData.length > 0 &&
            <MultipleSelect
              onChangeFilter={this.onChangeFilter}
              option={selectData[0]}
            />
          }
          {type === 'rangeTime' && rangeTime.length > 0 &&
            <RangeDateFilter
              onChangeFilter={this.onChangeFilter}
              option={rangeTime[0]}
            />
          }
          {type === 'time' && time.length > 0 &&
            <DateFilter
              onChangeFilter={this.onChangeFilter}
              option={time[0]}
            />
          }
          {radioArray.includes(type) && selectData.length > 0 &&
            <RadioSelect
              onChangeFilter={this.onChangeFilter}
              option={selectData[0]}
            />
          }
        </div>
        <FilteredItems options={optionItem} onChangeFilterChecked={this.onChangeFilterChecked} />
      </div>
    );
  }

}

export default FilterCondition;
