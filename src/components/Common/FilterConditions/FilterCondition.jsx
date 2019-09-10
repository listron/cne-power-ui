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
   * 1 theme 主题 light  dark  默认为light
   * 2 onChange  必填 回掉函数
   * 3 value 选填 支持两种方式，一种是外界的value值，一种可以不传，使用内部选中的值 {stationCodes:[],stationType:[]} 必须和typeName保持一致
   * 4 option array  []
   *   {}
   *   1 name: 选填 筛选的标题  默认的可以不写，但是新添加的需要自定义
   *   2 type: 必填 类型  multipleType radioSelect rangeTime time switch parentCheckBox 六种方式
   *     multipleType 多选类型  内置 defectLevel,defectSource,level,warningStatus
   *     radioSelect  单选类型  内置 stationType
   *     rangeTime    连续时间 
   *     time         时间段  开始时间 结束时间
   *     switch       开关 我参与的
   *     parentCheckBox  带有分类的多选框   内置 stationCode
   *   3  typeName 必填 必须是唯一的 返回的字段
   *   4  data 传入的数据  multipleType radioSelect parentCheckBox 必填
   *   5  rules 匹配的规则  rules=[stationName,stationCode]， 默认为label value
   *   6  disabled 不能选泽 联动的时候使用 true false
   *   7  parentName 根据什么分组 parentCheckBox 使用 默认为parentName
   * 
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
        typeName: 'stationCodes',
        rules: ['stationName', 'stationCode'],
        parentName: 'provinceName',
        name: '电站名称',
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
    const singleType = ['radioSelect', 'stationType', 'switch'];
    option.forEach(item => {
      const currentItem = optionItem.filter(e => e.type === item.type && e.typeName === item.typeName)[0] || {};
      if (!(singleType.includes(item.type))) {
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
