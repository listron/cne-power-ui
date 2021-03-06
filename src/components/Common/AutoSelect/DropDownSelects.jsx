import React, { Component } from 'react';
import { Select, message } from 'antd';
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
    max: PropTypes.number,
    disabled: PropTypes.bool,
  }

  handleChange = (checkedValue) => {
    const { multiple, onValueCheck, infoLists, max } = this.props;
    if (!max) {
      if (multiple) { // 参数value数组转为infoLists子集[{},{}]输出
        onValueCheck(infoLists.filter(e => checkedValue.includes(e.value)));
      } else { // 单选模式value为简单的value
        onValueCheck(infoLists.filter(e => checkedValue === e.value));
      }
      return false;
    }
    if (checkedValue.length > max) {
      return message.error(`最多选择${max}个设备`);
    }
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
    const { multiple, holderText, checkedList, infoLists, maxTagCount, disabled } = this.props;
    const maxTagInfo = (typeof maxTagCount === 'number') ? {
      maxTagCount,
      maxTagPlaceholder: `已选${checkedList.length}/${infoLists.length}个`,
    } : {};
    return (
      <span ref={(ref) => { this.dropRef = ref; }}>
        <Select
          mode={multiple ? 'multiple' : ''}
          style={{ width: '100%' }}
          placeholder={holderText}
          showSearch={true}
          onChange={this.handleChange}
          onSearch={this.searching}
          filterOption={this.searchFilter}
          value={checkedList.map(e => e.value)}
          getPopupContainer={() => this.dropRef}
          showArrow={false}
          {...maxTagInfo}
          disabled={disabled}
        >
          {infoLists.map(e => (
            <Option key={e.value} value={e.value}>{e.label}</Option>
          ))}
        </Select>
      </span>
    );
  }
}

// mode={multiple ? 'multiple' : ''}

export default DropDownSelects;
