import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, Icon } from 'antd';
import styles from './intelligentExpert.scss';
import FilterCondition from '../../Common/FilterConditions/FilterCondition';

const { Option } = Select;

function debounce(callback, delay) { //（防抖）
  let timerId = null;
  return function (args) {
    const that = this;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      callback.call(that, args);
    }, delay);
  };
}

class IntelligentSearch extends Component {
  static propTypes = {
    changeIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    getUserName: PropTypes.func,
    listParams: PropTypes.object,
    usernames: PropTypes.array,
    theme: PropTypes.string,
    getLostGenType: PropTypes.func,
  }

  constructor(props) {
    super(props);
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
    });
  }

  onReset = () => { // 重置缺陷描述/录入人/表格
    const { getIntelligentTable, listParams } = this.props;
    this.setState({
      defectValue: '',
      personValue: '',
    });
    getIntelligentTable({
      ...listParams,
      faultDescription: '',
      recorder: '',
      pageNum: 1,
    });
  }

  onDefect = (e) => {// 改变缺陷描述
    const { listParams } = this.props;
    this.props.changeIntelligentExpertStore({ listParams: { ...listParams, faultDescription: e.target.value } });
  }

  entryPerson = (value) => { // 输入录入人时触发
    const { changeIntelligentExpertStore, listParams, getUserName } = this.props;
    this.setState({ personValue: value });
    if (value) {
      getUserName({
        username: value,
      });
      changeIntelligentExpertStore({
        listParams: {
          ...listParams,
          recorder: value,
        },
      });
    }
  }

  changePerson = (value) => { // 选择option
    this.setState({
      personValue: value,
    });
    const { changeIntelligentExpertStore, listParams } = this.props;
    changeIntelligentExpertStore({
      listParams: {
        ...listParams,
        recorder: value,
      },
    });
  }


  filterCondition = (value) => { // 设备类型、缺陷类型筛选栏
    const { getIntelligentTable, listParams, getLostGenType, changeIntelligentExpertStore } = this.props;
    const { deviceTypeCodes } = value;
    changeIntelligentExpertStore({ listParams: { ...listParams, ...value } });
    getLostGenType({
      objectType: 1,
      deviceTypeCode: deviceTypeCodes.join(','),
    });
    getIntelligentTable({
      ...listParams,
      ...value,
    });

  }

  render() {
    const { personValue, defectValue } = this.state;
    const { usernames = [], theme, deviceTypes, defectTypes, listParams } = this.props;
    const { deviceTypeCodes, faultTypeIds, faultDescription, recorder } = listParams;
    const showResetBtn = personValue || defectValue; // 控制“重置”按钮是否出现
    const defectTypeTab = [];
    defectTypes.forEach(e => { e.list && e.list.length > 0 && defectTypeTab.push(...e.list); });
    let defectTypeList = [];
    defectTypeTab.map(e => {
      if (e.list && e.list.length > 0) {
        e.list.forEach((lastItem) => { lastItem.parentName = e.name; });
        defectTypeList = [...defectTypeList, ...e.list];
      }
    });
    console.log('deviceTypeCodes', deviceTypeCodes, faultTypeIds);
    return (
      <div className={`${styles.intelligentSearch} ${styles[theme]}`}>
        <FilterCondition
          theme={theme}
          onChange={this.filterCondition}
          option={[
            {
              name: '设备类型',
              type: 'multipleType',
              typeName: 'deviceTypeCodes',
              data: deviceTypes,
              rules: ['deviceTypeName', 'deviceTypeCode'],
            },
            {
              name: '缺陷类型',
              type: 'parentCheckBox',
              typeName: 'faultTypeIds',
              parentName: 'parentName',
              rules: ['name', 'id'],
              data: defectTypeList,
              disabled: !(deviceTypeCodes.length > 0),
            },
          ]}
          value={{ deviceTypeCodes, faultTypeIds }}
        />
        <div className={styles.partSearch}>
          <span>故障代码／故障描述</span>
          <Input className={styles.defectDescription} value={faultDescription} placeholder="请输入..." onChange={this.onDefect} />
          <span className={styles.text}>录入人</span>
          <Select
            showSearch
            placeholder="请输入..."
            className={styles.entryPerson}
            value={recorder}
            showArrow={false}
            onSearch={this.entryPerson}
            onChange={this.changePerson}
          >
            {usernames && usernames.map(e => <Option key={e} value={e}>{e}</Option>)}
          </Select>
          <Button onClick={this.onSearch}>查询</Button>
          {showResetBtn && <span className={styles.reset} onClick={this.onReset}>重置</span>}
        </div>
      </div>
    );
  }
}

export default IntelligentSearch;
