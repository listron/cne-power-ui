
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationCascader from './StationCascader';
import StationDropdown from './StationDropdown';
/*
  组件功能；由自动选择 + 弹框选择两个构成, 可进行输入搜索或弹框选择
  传入固定层级格式数据，自动解析生成, 支持单选/多选模式, 输入由props.value控制, 输出由props.onChange函数控制
  要求传入的数据格式: 

  参数:
  1. 必填 - 基本数据数组(data),包含信息如下：
  [{
    value: 1001123142,
    label: '金风科技',
    children: [{
      value: 'M12011M221M13',
      label: 'SD-13',
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
  2. 必填 - this.props.onChange (选中电站/区域时触发输出)
  3. 选填 - 选择模式: multiple, 选填，默认为单选(false)。
  4. 选填 - 手动指定选中项(value)
  5. 选填todo - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，占位提示文字。
  7. 选填todo - disabledInfo 不可选数组; 默认为[]
  8. 选填todo - disabled: bool; 默认false， 传入true值时组件为禁用状态。
  9. 选填todo - stationShowNumber:bool; 默认是false

  注意: onChange与value指定的格式统一
  单选: 输入输出均为: [regioNname('山东'), stationCode(56), stationName('山东平原')];
  多选: 输入输出结构为data数据子集 
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
      regionName: '山东',
      stations:	[{
        stationCode: 56,
        stationName: '山东平原',
      }, {
        stationCode: 560,
        stationName: '烟台电站',
      }],
    }, {
      regionName: '河北',
      stations:	[{
        stationCode: 360,
        stationName: '阳光',
      }],
    }],
  }

  render() {
    const { multiple, value, data, holderText, style, onChange } = this.props;
    // 单选模式 = 级联组件
    // 多选模式 = dropdown嵌套checkboxes
    return (
      <div>
        {!multiple && <StationCascader
          holderText={holderText}
          data={data}
          style={style}
          value={value}
          onChange={onChange}
        />}
        {multiple && <StationDropdown
          holderText={holderText}
          data={data}
          style={style}
          value={value}
          onChange={onChange}
        />}
      </div>
    );
  }
}
export default AreaStation;
