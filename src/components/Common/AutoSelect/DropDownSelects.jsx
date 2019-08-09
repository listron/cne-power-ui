
import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;

class DropDownSelects extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    maxTagCount: PropTypes.number,
    holderText: PropTypes.string,
    infoLists: PropTypes.array,
    checkedList: PropTypes.array,
    onValueCheck: PropTypes.func,
  }

  handleChange = (checkedValue) => {
    const { multiple, onValueCheck, infoLists } = this.props;
    if (multiple) { // 参数value数组转为infoLists子集[{},{}]输出
      onValueCheck(infoLists.filter(e => checkedValue.includes(e.value)));
    } else { // 单选模式value为简单的value
      onValueCheck(infoLists.filter(e => checkedValue === e.value));
    }
  }

  searchFilter = (value, option) => {
    const { children = '' } = option.props || {};
    return children.includes(value);
  }

  render() {
    const { multiple, holderText, checkedList, infoLists, maxTagCount } = this.props;
    const maxTagInfo = (typeof maxTagCount === 'number') ? {
      maxTagCount,
      maxTagPlaceholder: `已选${checkedList.length}/${infoLists.length}个`,
    } : {};
    return (
      <Select
        mode={multiple ? 'multiple' : ''}
        style={{ width: '100%' }}
        placeholder={holderText}
        showSearch={true}
        onChange={this.handleChange}
        onSearch={this.searching}
        filterOption={this.searchFilter}
        value={checkedList.map(e => e.value)}
        {...maxTagInfo}
      >
        {infoLists.map(e => (
          <Option key={e.value} value={e.value}>{e.label}</Option>
        ))}
      </Select>
    );
  }
}

// mode={multiple ? 'multiple' : ''}

export default DropDownSelects;
