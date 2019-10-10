
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isSetDiff, getRoots } from './selectUtil.js';
import DropDownSelects from './DropDownSelects';
import AutoModal from './AutoModal';
import styles from './style.scss';
/*
  组件功能；由自动选择 + 弹框选择两个构成, 可进行输入搜索或弹框选择
  传入固定层级格式数据，自动解析生成, 支持单选/多选模式, 输入由props.value控制, 输出由props.onChange函数控制
  要求传入的数据格式:

  参数:
  1. 必填 - 传入前，请自行构造一个简单的高阶组件处理数据结构: 本组件所需基本数据数组(data),至少包含信息如下：
  [{
    value: 1001123142,
    label: '金风科技',
    children: [{
      value: 'M12011M221M13',
      label: 'SD-13',
      children: [{
        ...后续可考虑变为无限嵌套
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
  3. 选填 - 选择模式: multiple, 选填，默认为多选(true)。
  4. 选填 - 手动指定选中项(value)为最底层级的value数组[value1, value2, value3];
  5. 选填todo - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，占位提示文字。
  7. 选填todo - disabledInfo 不可选数组; 默认为[]
  8. 选填todo - disabled: bool; 默认false， 传入true值时组件为禁用状态。
  9. 选填 - maxTagCount: number; 默认是null - 不开启
  10. 选填todo - onlyModal: false; 当不需要下拉框, 只需要筛选弹框时启用.
  11. 选填 - max: number; 0 - 不开启 限制选中个数

  注意:
  多选时；
    value输入为[value1, value2, value3]数组
    onChange输出为最底层级的value集合: [{value1: 1, label1: 'bala'}, {value2: 20, label2: 'gaga'}];
  单选时: 输出为[{value: 123, lable: '112'}], 输入为[value, value], 因暂无单选模式ui及交互，暂不实现
*/

class AutoSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.array,
    style: PropTypes.object,
    onChange: PropTypes.func,
    holderText: PropTypes.string,
    max: PropTypes.number,
    disabled: PropTypes.bool,
    theme: PropTypes.string,
  }

  static defaultProps = {
    multiple: true,
    value: [],
    style: {},
    max: 0,
    onChange: () => { },
    holderText: '请选择',
    data: [],
    theme: 'light',
  }

  constructor(props) {
    super(props);
    const { value, data } = props;
    const infoLists = getRoots(data) || [];
    const checkedList = infoLists.filter(e => value.includes(e.value));
    this.state = {
      checkedList,
      infoLists,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, data } = this.props;
    const { infoLists } = this.state;
    const nextValue = nextProps.value || [];
    const nextData = nextProps.data;
    const nextInfoList = getRoots(nextData);
    const dataChange = nextData.length !== data.length || isSetDiff(
      new Set(nextInfoList.map(e => e.value)),
      new Set(infoLists.map(e => e.value)),
    );
    const isValueChange = nextData.length > 0 && isSetDiff(
      new Set(nextValue),
      new Set(value),
    );
    if (dataChange) { // 数据源发生变化 => 重新判断checkedlist, 基于新的data生成新的infolists
      const checkedList = nextValue.length > 0 ? nextInfoList.filter(e => nextValue.includes(e.value)) : [];
      this.setState({
        infoLists: nextInfoList,
        checkedList,
      });
    }
    if (isValueChange) { // 选中项发生变化 => state同步改变checkedlist;
      const infoLists = getRoots(nextData) || [];
      const checkedList = nextValue.length > 0 ? infoLists.filter(e => nextValue.includes(e.value)) : [];
      this.setState({ checkedList });
    }
  }

  onValueCheck = (checkedList) => { // 输出
    this.setState({ checkedList });
    this.props.onChange(checkedList);
  }

  render() {
    const { style, disabled } = this.props;
    const { checkedList, infoLists } = this.state;
    return (
      <div className={styles.autoSelect} style={{ ...style }}>
        <DropDownSelects
          {...this.props}
          infoLists={infoLists}
          checkedList={checkedList}
          onValueCheck={this.onValueCheck}
          disabled={disabled}
        />
        <AutoModal
          {...this.props}
          infoLists={infoLists}
          checkedList={checkedList}
          onValueCheck={this.onValueCheck}
        />
      </div>
    );
  }
}
export default AutoSelect;
