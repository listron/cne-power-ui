import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import { Tabs, Checkbox } from 'antd';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

/** 
 *  1 stationCodes 必填 选中的电站的stationCodes []
 *  2 stations 必填 该用户下所用的电站
 *  3 onChangeFilter 返回的函数
*/
class ParentFilter extends Component {
  static propTypes = {
    option: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all',
    };
  }

  onChangeEach = (checkedValues, item) => {
    const { option = {} } = this.props;
    const { checkedValue = [], rules = ['label', 'value'] } = option;
    const [label, value] = rules;
    const eachOnce = item.map(e => e[value]);
    option.checkedValue = [...new Set([...checkedValue.filter(e => !eachOnce.includes(e)), ...checkedValues])];
    this.props.onChangeFilter({ option });
  }


  onChangeParentItem = (key) => {
    const { option = {} } = this.props;
    const { typeName } = option;
    if (key === 'all') {
      this.props.onChangeFilter({ [typeName]: [] });
    }
    this.setState({
      activeKey: key,
    });
  }

  onCheckAll(e, data) { // 全部点击
    const { option = {} } = this.props;
    const { checkedValue = [], rules = ['label', 'value'] } = option;
    const [label, value] = rules;
    const newSelctData = data.map(item => item[value]);
    let newCheckedValue = [];
    if (e.target.checked) {
      newCheckedValue = Array.from(new Set([...newSelctData, ...checkedValue]));
    } else {
      newCheckedValue = checkedValue.filter(item => !newSelctData.includes(item));
    }
    option.checkedValue = newCheckedValue;
    this.props.onChangeFilter({ option });
  }

  getCheckAll(data) { // 当前是否是选中
    const { option = {} } = this.props;
    const { checkedValue = [], rules = ['label', 'value'] } = option;
    const [label, value] = rules;
    const newSelctData = data.map(item => item[value]);
    let result = true;
    newSelctData.forEach(e => {
      if (!checkedValue.includes(e)) {
        result = false;
        return;
      }
    });
    return result;
  }


  renderOnceItme(grounByData) {
    const { option = {} } = this.props;
    const { rules = ['label', 'value'], parentName = 'provinceName' } = option;
    const [label, value] = rules;
    return grounByData.map((item, index) => {
      const optionArr = item.map(e => {
        return {
          label: e[label],
          value: e[value],
        };
      });
      return (
        <TabPane tab={item[0][parentName]} key={index}>
          <Checkbox
            className={styles.allCheck}
            onChange={(e) => this.onCheckAll(e, item)}
            checked={this.getCheckAll(item)}
          >全部
          </Checkbox>
          <CheckboxGroup
            options={optionArr}
            // value={checkedValue}
            onChange={(e) => this.onChangeEach(e, item)}>
          </CheckboxGroup>
        </TabPane>
      );
    });
  }



  render() {
    const { option = {} } = this.props;
    const { data = [], parentName = 'provinceCode' } = option;
    const { activeKey } = this.state;
    const parentItem = [...new Set(data.map(e => e[parentName]))];
    const grounByData = parentItem.map(e => {
      return data.filter((item, index) => {
        if (item[parentName] === e) {
          return item;
        }
      });
    });
    return (
      <div className={styles.stationFilter}>
        <Tabs onChange={this.onChangeParentItem} activeKey={activeKey} animated={false}>
          <TabPane tab="不限" key="all">
            {null}
          </TabPane>
          {this.renderOnceItme(grounByData)}
        </Tabs>
      </div>
    );
  }
}

export default ParentFilter;
