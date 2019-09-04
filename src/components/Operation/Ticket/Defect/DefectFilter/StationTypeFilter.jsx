import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectFilter.scss';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

class StationTypeFilter extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    onChangeFilter: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      stationType: value,
    });
  }

  render() {
    //	电站类型(0:风电，1光伏，2：全部)
    const { stationType, theme } = this.props;
    return (
      <div className={`${styles.filterItem} ${styles[theme]}`}>
        <Tabs activeKey={stationType} onChange={this.onChange}>
          <TabPane tab="不限" key="2"></TabPane>
          <TabPane tab="风电" key="0"></TabPane>
          <TabPane tab="光伏" key="1"></TabPane>
        </Tabs>
      </div>
    );
  }

}

export default StationTypeFilter;
