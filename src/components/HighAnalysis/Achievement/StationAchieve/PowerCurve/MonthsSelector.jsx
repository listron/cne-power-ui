import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import uiColors from '@constants/ui';
import styles from './curve.scss';

class MonthsSelector extends Component {

  static propTypes = {
    changeStore: PropTypes.func,
    curveCheckedMonths: PropTypes.array, // 环比分析各月选中时间
    curveMonths: PropTypes.object,
    curveAllMonths: PropTypes.array, // 环比分析所有月
  }

  monthColors = [
    'rgb(80,227,194)', 'rgb(126,211,33)', 'rgb(184,233,134)', 'rgb(160,255,235)',
    'rgb(255,108,238)', 'rgb(159,152,255)', 'rgb(255,120,120)', 'rgb(255,0,128)',
    'rgb(255,0,0)', 'rgb(255,144,0)', 'rgb(255,197,129)', 'rgb(255,253,0)',
  ]

  monthCheck = (month) => {
    const { curveCheckedMonths } = this.props;
    const isMonthHide = curveCheckedMonths.includes(month);
    if (isMonthHide) {
      this.props.changeStore({ curveCheckedMonths: curveCheckedMonths.filter(e => e !== month) });
    } else {
      this.props.changeStore({ curveCheckedMonths: [...curveCheckedMonths, month] });
    }
  }

  onAllChange = (checked) => {
    const { curveAllMonths } = this.props;
    this.props.changeStore({ curveCheckedMonths: checked ? curveAllMonths : [] });
  }

  getColorStyle = (index, curveAllMonths, curveCheckedMonths) => {
    const colorIndex = index % this.monthColors.length;
    const active = curveCheckedMonths.includes(curveAllMonths[index]);
    return {
      backgroundColor: active ? this.monthColors[colorIndex] : '#fff',
      border: active ? `1px solid ${this.monthColors[colorIndex]}` : '1px solid rgb(238,238,238)',
    };
  }

  render() {
    const { curveCheckedMonths, curveAllMonths, curveMonths } = this.props;
    const { actual = [] } = curveMonths;
    const actualMonths = curveAllMonths.filter(e => actual.find(item => item.calcDate === e));
    const actualchecked = curveCheckedMonths.filter(e => actual.find(item => item.calcDate === e));
    return (
      <section className={styles.timeSelector}>
        <h3 className={styles.timeTitle}>显示月份</h3>
        <ul className={styles.monthList}>
          {actualMonths.map((e, index) => {
            const monthIndex = curveAllMonths.indexOf(e);
            const monthColor = uiColors.outputColors[monthIndex];
            const active = curveCheckedMonths.includes(e);
            const backgroundColor = active ? monthColor : '#fff';
            const border = active ? `1px solid ${monthColor}` : '1px solid rgb(238,238,238)';
            const color = active ? '#353535' : '#d4d4d4';
            return (<li
              className={styles.month}
              key={e}
              onClick={() => this.monthCheck(e)}
            >
              <span className={styles.round} style={{ backgroundColor, border }} />
              <span className={styles.monthText} style={{ color }}>{e}</span>
            </li>);
          })}
        </ul>
        <div className={styles.allHandler}>
          <Switch
            onChange={this.onAllChange}
            checked={actualchecked.length > 0}
          />
          <span className={styles.allHandlerText}>
            全部{actualchecked.length === 0 ? '隐藏' : '显示'}
          </span>
        </div>
      </section>
    );
  }
}

export default MonthsSelector;
