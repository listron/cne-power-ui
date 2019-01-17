import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class WarningStatusFilter extends Component {
  static propTypes = {
    warningStatus: PropTypes.array,
    onChangeFilter: PropTypes.func,
    warningStatusName: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  onWarningStatusSelect = (warningStatus) => {
    this.props.onChangeFilter({ warningStatus });
  }

  resetLevel = () => {
    this.props.onChangeFilter({
      warningStatus: []
    });
  }

  render() {
    const { warningStatus,warningStatusName } = this.props;
    const warningStatusType =warningStatusName ? warningStatusName: ['自动解除','手动解除','转工单'];
    const warningStatusOptions = warningStatusType.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }));
    const warningStatusArr = warningStatus;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.resetLevel} className={warningStatus.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={warningStatusOptions} value={warningStatusArr} onChange={this.onWarningStatusSelect} />
      </div>
    );
  }

}

export default WarningStatusFilter;