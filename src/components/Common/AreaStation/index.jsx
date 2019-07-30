
import React, { Component } from 'react';
import { Select } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

const Option = Select.Option;
/*
  区域 - 电站二级选择组件：
  参数:
  1. 必填 - 电站基本信息数组(data),包含信息如下：
  [{
    regionName	string	区域名称
    stations	object[{ 电站列表
      stationCode	integer	电站编号
      stationName	string	电站名称
    }]	
  }]
  2. 必填 - this.props.onChange (选中电站/区域时触发输出)
  3. 选填 - 电站选择是否多选: multiple, 选填，默认为单选(false)。
  4. 选填 - 手动指定选中的电站(value)(value为stationCode集合的数组)
  5. 选填 - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，当用户未选择电站时的占位提示文字。
  7. 选填 - disabledStation指定的不可选电站codes数组 - int[] ; 默认为[]
  8. 选填 - disabled: bool; 默认false， 传入true值时组件为禁用状态。
  9. 选填 - stationShowNumber:bool; 默认是false，展示具体的电站名称  传入为true时，显示的时已选电站 已选电站数量/所有电站数量
*/

class AreaStation extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    multiple: false,
    data: [],
  }

  render() {
    const { multiple, data, value, onChange } = this.props;
    // 单选模式 = 级联组件
    // 多选模式 = dropdown嵌套
    return (
      <div className={styles.areaStation} style={{width: '200px'}}>
        <Select onChange={(a,b) => console.log(a,b)} style={{width: '200px'}}>
          <Option value='1' label='试一下'>
            <div>试试看</div>
          </Option>
          <Option value='2' label='这个不知道'>
            <div>这个是啥</div>
          </Option>
        </Select>
      </div>
    )

  }
}
export default AreaStation;
