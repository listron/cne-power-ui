import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportStationBox.scss';
import { Radio, DatePicker, Button } from 'antd';
import StationSelect from '../../Common/StationSelect';
const { RangePicker } = DatePicker;

class ReportSeach extends React.Component {
  static propTypes = {
    changeStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  timeChange = (e) => {
    const value = e.target.value;
    this.props.changeStore({
      type: value
    });
  }
  render() {
    const { type, stations } = this.props;
    const data = [{
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
    return (
      <div className={styles.topSearch}>
        <div className={styles.timeStyle}>
          <label >时间范围</label>  &nbsp;&nbsp;
          <Radio.Group value={type} buttonStyle="solid" onChange={this.timeChange}>
            <Radio.Button value={'3'}>按年</Radio.Button>
            <Radio.Button value={'2'}>按月</Radio.Button>
            <Radio.Button value={'1'}>按日</Radio.Button>
          </Radio.Group>
          {type === '1' && (
            <RangePicker
              onChange={this.changeDay}
            />
          )
          }
          {type === '2' && (
            <RangePicker
              mode={['month', 'month']}
              onChange={this.changeMonth}
            />
          )
          }
          {type === '3' && (
            <div>
              <DatePicker
                mode='year'
                onChange={this.changeStartTime}
              />
              <span>-</span>
              <DatePicker
                mode='year'
                onChange={this.changeEndTime}
              />
            </div>
          )
          }
          <label >电站名称</label>  &nbsp;&nbsp;
          <StationSelect data={stations} onChange={this.changeStation} />

          <Button type="primary" >查询</Button>


        </div>
        <div className={styles.stationStyle}></div>

      </div>
    );
  }
}
export default (ReportSeach);
