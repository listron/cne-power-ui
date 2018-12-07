import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class DefectSourceFilter extends Component {
  static propTypes = {
    defectSource: PropTypes.array,
    onChangeFilter: PropTypes.func,
    defectSourceName: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  onLevelSelect = (defectSource) => {
    this.props.onChangeFilter({
      defectSource
    });
  }

  resetLevel = () => {
    this.props.onChangeFilter({
      defectSource: []
    });
  }

  render() {
    const { defectSource,defectSourceName } = this.props;
    const levels =defectSourceName ? defectSourceName: ['上报','巡检','告警', '预警',];
    const levelOptions = levels.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }));
    const levelArr = defectSource;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={defectSource.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={levelOptions} value={levelArr} onChange={this.onLevelSelect} />
      </div>
    );
  }

}

export default DefectSourceFilter;