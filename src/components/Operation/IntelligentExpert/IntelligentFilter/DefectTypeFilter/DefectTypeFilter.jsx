import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Tabs } from 'antd';
import styles from './../filterCondition.scss';

const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;

class DefectTypeFilter extends Component {
  static propTypes = {
    defectTypes: PropTypes.array,
    defectTypeCode: PropTypes.array,
    onChangeFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all'
    };
  }

  onDefectTabChange = (key) => { // tab切换。
    if (key === 'all') {
      this.props.onChangeFilter({
        defectTypeCode: []
      });
    }
    this.setState({ activeKey: key })
  };

  onCheckAll = (event, ids) => { // 选择tab中的全部
    const { defectTypeCode } = this.props;
    let tmpTypeCodeArr = defectTypeCode.filter(e => {// 移除所有正在操作的同级子选项
      return !!e && !ids.includes(e);
    });
    let newTypeCodeArr = tmpTypeCodeArr;
    if (event.target.checked) {
      newTypeCodeArr = [...tmpTypeCodeArr, ...ids];
    }
    this.props.onChangeFilter({
      defectTypeCode: newTypeCodeArr
    })
  };

  defectCheck = (values, ids) => { // 选中-取消某类型。
    const { defectTypeCode } = this.props;
    let tmpTypeCodeArr = defectTypeCode.filter(e => {// 移除所有正在操作的同级子选项
      return !!e && !ids.includes(e);
    });
    const newTypeCodeArr = [...tmpTypeCodeArr, ...values];
    this.props.onChangeFilter({
      defectTypeCode: newTypeCodeArr
    })
  };

  render() {
    const { defectTypes, defectTypeCode, theme } = this.props; // defectTypeCode选中的缺陷类型字符串。
    const { activeKey } = this.state;
    const defectTypeTab = [];
    defectTypes.forEach(e => {
      e.list && e.list.length > 0 && defectTypeTab.push(...e.list)
    });
    const selectDefectArr = defectTypeCode.filter(e => !!e);
    return (
      <div className={`${styles.stationFilter} ${styles[theme]}`}>
        <Tabs onChange={this.onDefectTabChange} activeKey={activeKey} animated={false}>
          <TabPane tab="不限" key={'all'}>
            {null}
          </TabPane>
          {defectTypeTab.filter(e => e.list && e.list.length > 0).map(e => {
            const options = [];
            e.list && e.list.length > 0 && e.list.forEach((lastItem) => {
              options.push({
                label: lastItem.name,
                value: lastItem.id,
              })
            });
            const allIds = options.map(e => e.value);
            const allChecked = allIds.every(id => selectDefectArr.includes(id));
            return (
              <TabPane tab={e.name} key={e.id}>
                <Checkbox
                  className={styles.allCheck}
                  onChange={event => this.onCheckAll(event, allIds)}
                  checked={allChecked}
                >
                  全部
                </Checkbox>
                <CheckboxGroup
                  options={options}
                  value={selectDefectArr}
                  onChange={(values) => this.defectCheck(values, allIds)}
                >
                </CheckboxGroup>
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    );
  }
}

export default DefectTypeFilter;
