
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationCascader from './StationCascader';
import StationDropdown from './StationDropdown';
/*
  组件功能；由自动选择 + 弹框选择两个构成, 可进行输入搜索或弹框选择
  传入固定层级格式数据，自动解析生成, 支持单选/多选模式, 输入由props.value控制, 输出由props.onChange函数控制
  要求传入的数据格式: 

  参数:
  1. 必填 - 传入前，请自行构造一个简单的高阶组件处理数据结构: 本组件所需基本数据数组(data),包含信息如下：
  [{
    value: 1001123142,
    label: '金风科技',
    children: [{
      value: 'M12011M221M13',
      label: 'SD-13',
      children: [{
        ...可无限嵌套
      }]
    }, {
      value: 'M12011M221M11',
      label: 'SD-11',
    }]	
  },{
    value: 10011231445,
    label: '湘电',
    children: [{
      value: 'M35011M221M221',
      label: 'XD-221',
    }, {
      value: 'M35011M221M222',
      label: 'XD-222',
    }]
  }]
  2. 必填 - this.props.onChange输出函数: 输出参数为最底层级的value数组[value1, value2, value3];
  3. 选填 - 选择模式: multiple, 选填，默认为单选(false)。
  4. 选填 - 手动指定选中项(value)为最底层级的value数组[value1, value2, value3];
  5. 选填todo - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，占位提示文字。
  7. 选填todo - disabledInfo 不可选数组; 默认为[]
  8. 选填todo - disabled: bool; 默认false， 传入true值时组件为禁用状态。
  9. 选填todo - stationShowNumber:bool; 默认是false

  注意: onChange与value指定的格式统一;
  输入输出均为最底层级的value集合: [value1, value2];
*/

class AutoSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.array,
    style: PropTypes.object,
    onChange: PropTypes.func,
    holderText: PropTypes.string,
  }

  static defaultProps = {
    multiple: true,
    value: [],
    style: {},
    onChange: () => {},
    holderText: '请选择',
    data: [{
      value: 1001123142,
      label: '金风科技',
      children: [{
        value: 'M12011M221M13',
        label: 'SD-13',
        children: [{
          value: 'M12#1',
          label: 'M12#1',
        }],
      }, {
        value: 'M12011M221M11',
        label: 'SD-11',
      }],
    }, {
      value: 10011231445,
      label: '湘电',
      children: [{
        value: 'M35011M221M221',
        label: 'XD-221',
      }, {
        value: 'M35011M221M222',
        label: 'XD-222',
      }],
    }],
  }

  constructor(props){
    super(props);
    this.state = {
      checkedList: props.value,
    };
  }

  componentWillReceiveProps(nextProps){
    const { value } = this.props;
    const nextValue = nextProps.value;
    const needUpdateValue = this.isSetDiff(value, nextValue);
    needUpdateValue && this.setState({ // value变化时, state同步
      checkedList: nextValue,
    });
  }

  isSetDiff = (a, b) => { // 比价两个简单值构成的数组
    const setA = new Set(a);
    const setB = new Set(b);
    if(setA.size !== setB.size) {
      return true;
    }
    return Array.from(setA).find(value => !setB.has(value));
  }

  onValueCheck = (checkedList) => { // 输出
    this.setState({ checkedList });
    this.props.onChange(checkedList);
  }

  render() {
    const { checkedList } = this.state;
    return (
      <div>
        {<div {...this.props} checkedList={checkedList} onValueCheck={this.onValueCheck} />}
        {<div {...this.props} checkedList={checkedList} onValueCheck={this.onValueCheck} />}
      </div>
    );
  }
}
export default AutoSelect;
