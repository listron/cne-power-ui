import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectStatus.scss';
import { Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectStatus extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    defectStatusStatistics: PropTypes.object,
    defaultValue: PropTypes.string,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      status: props.defaultValue || '',
    };
  }


  onChangeTab = (e) => {
    this.setState({ status: e.target.value });
    this.props.onChange({ status: e.target.value });
  }

  render() {
    const { defectStatusStatistics, theme } = this.props;
    const waitSubmitNum = defectStatusStatistics.submitNum || 0;
    const waitReviewNum = defectStatusStatistics.examineNum || 0;
    const inProcessNum = defectStatusStatistics.executeNum || 0;
    const waitCheckNum = defectStatusStatistics.checkNum || 0;
    return (
      <div className={`${styles.statusGroup} ${styles[theme]}`}>
        <div className={styles.text}><span>状</span><span>态</span></div>
        <RadioGroup onChange={this.onChangeTab} defaultValue="" value={this.state.status}>
          <RadioButton value="">全部</RadioButton>
          <RadioButton value="0">{`待提交  ${waitSubmitNum}`}</RadioButton>
          <RadioButton value="1">{`待审核  ${waitReviewNum}`}</RadioButton>
          <RadioButton value="2">{`执行中  ${inProcessNum}`}</RadioButton>
          <RadioButton value="3">{`待验收  ${waitCheckNum}`}</RadioButton>
          <RadioButton value="4">{'已完成'}</RadioButton>
        </RadioGroup>
      </div>
    );
  }

}

export default DefectStatus;
