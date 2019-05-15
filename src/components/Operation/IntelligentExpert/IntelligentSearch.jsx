import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, message } from 'antd';
import styles from './intelligentExpert.scss';
import FilterCondition from '../../../components/Common/FilterCondition/FilterCondition';

const { Option } = Select;

function debounce(callback, delay) { // 录入人（防抖）
  let timerId = null;
  return function (args) {
      let that = this;
      clearTimeout(timerId);
      timerId = setTimeout(function () {
          callback.call(that, args);
      }, delay);
  }
}

class IntelligentSearch extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getDefectType: PropTypes.func,
    getIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    getUserName: PropTypes.func,
    listParams: PropTypes.object,
    deviceTypeCodes: PropTypes.array,
    defectTypeCodes: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    usernames: PropTypes.array,
    stations: PropTypes.array,
    defectValue: PropTypes.string,
    personValue: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    sortMethod: PropTypes.string,
  }
  
  constructor( props ) {
    super( props )
    this.state = {
      defectValue: '',
      personValue: '',
    };
    this.entryPerson = debounce(this.entryPerson, 800);
  }

  onSearch = () => { // 查询缺陷描述/录入人
    const { getIntelligentTable, listParams } = this.props;
    const { defectValue, personValue } = this.state;
    getIntelligentTable({
        ...listParams,
        faultDescription: defectValue,
        recorder: personValue,
        pageNum: 1,
    })
  }
  
  onReset = () => { // 重置缺陷描述/录入人/表格
    const { getIntelligentTable, listParams } = this.props;
    this.setState({
      defectValue: '',
      personValue: '',
    })
    getIntelligentTable({
      ...listParams,
      faultDescription: '',
      recorder: '',
      pageNum: 1,
    })
  }

  onDefect = (e) => {// 改变缺陷描述
    this.setState({
      defectValue: e.target.value,
    })
  }

  entryPerson = (value) => { // 输入录入人时触发
    const { getIntelligentExpertStore, listParams, getUserName } = this.props;
    this.setState({
      personValue: value
    });
    getUserName({
      username: value,
    })
    getIntelligentExpertStore({
      listParams: {
        ...listParams,
        recorder: value
      }
    })
  }

  changePerson = (value) => { // 选择option
    console.log('value: ', value);
    this.setState({
      personValue:value
    })
    const { getIntelligentExpertStore, listParams } = this.props;
    getIntelligentExpertStore({
      listParams: {
        ...listParams,
        recorder: value
      }
    })
    console.log(132);
  }
  
  filterCondition = (changeValue) => { // 设备类型、缺陷类型筛选栏
    const { getIntelligentTable, listParams } = this.props;
    const { deviceTypeCodes, defectTypeCodes, faultDescription, recorder, pageNum, pageSize, orderField, sortMethod } = listParams;
    const params = { deviceTypeCodes, defectTypeCodes, faultDescription, recorder, pageNum, pageSize, orderField, sortMethod };
    getIntelligentTable({
      ...params,
      ...changeValue,
    })
  }

  render() {
    const { personValue, defectValue } = this.state;
    const { stations, deviceTypes, defectTypes, listParams, usernames = [] } = this.props;
    const { faultDescription, recorder } = listParams;
    const showResetBtn = personValue || defectValue; // 控制“重置”按钮是否出现
    return (
      <div className={styles.intelligentSearch}>
        <FilterCondition
          option={['deviceType', 'defectType']}
          stations={stations.filter(e => e.stationType === 1)}
          defectTypes={defectTypes || []}
          deviceTypes={deviceTypes.filter(e => e.stationType !== 0) || []}
          onChange={this.filterCondition}
        />

        <div className={styles.partSearch}>
            <span>缺陷描述</span>
            <Input className={styles.defectDescription} value={defectValue} placeholder="请输入..." onChange={this.onDefect} />
            <span className={styles.text}>录入人</span>
            <Select
              showSearch
              placeholder="请输入..."
              className={styles.entryPerson}
              value={personValue}
              showArrow={false}
              // personValue="children"
              onSearch={this.entryPerson}
              onChange={this.changePerson}
              // filterOption={(text, option) => option.props.children.toLowerCase().indexOf(text.toLowerCase()) >= 0}
            >
              {usernames.map(e => {
                  return <Option key={e} value={e}>{e}</Option>
              })}
            </Select>
            <Button onClick={this.onSearch}>查询</Button>
            {showResetBtn && <span className={styles.reset} onClick={this.onReset}>重置</span>}
        </div>
      </div>
      )
    }
  }

export default IntelligentSearch;