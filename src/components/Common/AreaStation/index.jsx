
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationCascader from './StationCascader';
import StationDropdown from './StationDropdown';
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
  3. 选填 - mode电站选择模式: 'region'(单区域多电站), 'station'(单电站), 'all'(多区域多电站), 选填，默认为region单选区域-多选电站。
  4. 选填 - 手动指定选中的电站(value)
  5. 选填todo - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，当用户未选择电站时的占位提示文字。
  7. 选填todo - disabledStation指定的不可选电站codes数组 - int[] ; 默认为[]
  8. 选填todo - disabled: bool; 默认false， 传入true值时组件为禁用状态。
  9. 选填todo - stationShowNumber:bool; 默认是false，展示具体的电站名称  传入为true时，显示的时已选电站 已选电站数量/所有电站数量

  注意: onChange与value指定的格式统一
  单选: onChange输出为: [regioNname('山东'), stationCode(56), stationName('山东平原')], 输入为value: [stationCode];
  多选: onChange输出结构为data数据子集; value输入为codes合集: [stationCode1, stationCode2, ....]
  [{
    regionName: '山东',
    stations: [{
      stationCode: 56,
      stationName: '山东平原'
    }]
  }, {
    regionName: '内蒙古',
    stations: [{
      stationCode: 360,
      stationName: '齐齐哈尔'
    }]
  }]
*/

class AreaStation extends Component {
  static propTypes = {
    mode: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.array,
    style: PropTypes.object,
    onChange: PropTypes.func,
    holderText: PropTypes.string,
  }

  static defaultProps = {
    mode: 'all',
    value: [],
    style: {},
    onChange: () => {},
    holderText: '请选择',
    data: [],
  }

  render() {
    const { mode, value, data, holderText, style, onChange } = this.props;
    // 单选模式 = 级联组件
    // 多选模式 = dropdown嵌套checkboxes
    const single = mode === 'station';
    return (
      <div>
        {single && <StationCascader
          holderText={holderText}
          data={data}
          style={style}
          value={value}
          onChange={onChange}
        />}
        {!single && <StationDropdown
          holderText={holderText}
          data={data}
          style={style}
          value={value}
          onChange={onChange}
          mode={mode}
        />}
      </div>
    );
  }
}
export default AreaStation;
