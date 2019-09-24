import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

class RadioSelect extends Component {
  static propTypes = {
    option: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    const { option = {} } = this.props;
    option.checkedValue = value;
    this.props.onChangeFilter({ option });
  }

  render() {
    const { option } = this.props;
    const { checkedValue = '', data, rules = ['label', 'value'] } = option;
    const [label, value] = rules;
    return (
      <div className={styles.filterItem}>
        <Tabs activeKey={`${checkedValue}`} onChange={this.onChange}>
          <TabPane tab="不限" key={''}></TabPane>
          {data.map(e => {
            return <TabPane tab={e[label]} key={e[value]} />;
          })}
        </Tabs>
      </div>
    );
  }

}

export default RadioSelect;
