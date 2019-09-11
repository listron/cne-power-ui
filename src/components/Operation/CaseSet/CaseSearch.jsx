import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import FilterCondition from '../../../components/Common/FilterConditions/FilterCondition';
import { Input, Button, Select, Icon } from 'antd';
const { Option } = Select;
class CaseSearch extends React.Component {
  static propTypes = {
    stations: PropTypes.array,
    deviceModeData: PropTypes.array,
    questionTypeList: PropTypes.array,
    userData: PropTypes.array,
    changeCasePartStore: PropTypes.func,
    getCasePartList: PropTypes.func,
    queryUseName: PropTypes.func,
    faultDescription: PropTypes.string,
    userName: PropTypes.string,
    userId: PropTypes.number,
    questionTypeCodes: PropTypes.array,
    deviceModeList: PropTypes.array,
    stationCodes: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);

  }
  filterCondition = (e) => {
    console.log('e: ', e);
    const { changeCasePartStore } = this.props;
    changeCasePartStore(e);
    this.getList(e);
  }
  searchDesc = (e) => {
    console.log('e:', e.target.value);
    this.props.changeCasePartStore({
      faultDescription: e.target.value,
    });
  }
  searchFeedback = (e) => {
    console.log('e:', e.target.value);
    this.props.changeCasePartStore({
      userName: e.target.value,
    });
  }
  entryPerson = (value) => {
    console.log('value: ', value);
    this.props.queryUseName({
      userName: value,
    });

  }

  changePerson = (value) => {
    console.log('改变提交人');
    this.props.changeCasePartStore({
      userId: value,
    });
  }
  onReset = () => {
    this.props.changeCasePartStore({
      faultDescription: '',
      userName: '',
      userId: null,
    });
  }
  getList = (value) => {
    const { getCasePartList, faultDescription, userName, userId, questionTypeCodes, deviceModeList, stationCodes } = this.props;
    const params = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId };
    getCasePartList({
      ...params,
      ...value,
    });
  }


  render() {
    const { stations, deviceModeData, questionTypeList, userData, faultDescription, userName, userId } = this.props;
    const showResetBtn = faultDescription || userName;
    return (
      <div className={styles.caseSearch}>
        <FilterCondition
          onChange={this.filterCondition}
          option={[
            {
              //此处需要更换类型，变成厂家下的型号，需要处理数据结构
              name: ' 机型',
              type: 'multipleType',
              typeName: 'questionTypeCodes',
              rules: ['deviceModeName', 'deviceModeCode'],
              data: deviceModeData,
              // data: stations,
            },
            {
              name: '问题类别',
              type: 'multipleType',
              typeName: 'deviceModeList',
              rules: ['questionTypeName', 'questionTypeCode'],
              data: questionTypeList,
              // data: stations,
            },
            {
              name: '风场',
              type: 'multipleType',
              typeName: 'stationCodes',
              rules: ['stationName', 'stationCode'],
              data: stations.filter((e) => (e.stationType === 0)),
            },

          ]}
        />
        <div className={styles.partSearch}>
          <span className={styles.textDesc}>问题描述</span>
          <Input className={styles.searchDesc} value={faultDescription} placeholder="请输入..." onChange={this.searchDesc} />
          <span>反馈人</span>
          <Input className={styles.searchFeedback} value={userName} placeholder="请输入..." onChange={this.searchFeedback} />
          <span className={styles.text}>填报人</span>
          <Select
            showSearch
            placeholder="请输入..."
            className={styles.entryPerson}
            value={userId}
            showArrow={false}
            onSearch={this.entryPerson}
            onChange={this.changePerson}
          >
            {userData && userData.map(e => {
              return <Option key={e} value={e.userId}>{e.userName}</Option>;
            })}
          </Select>
          <Button className={styles.searchBtn} onClick={this.onSearch}>查询</Button>
          {showResetBtn && <span className={styles.reset} onClick={this.onReset}>重置</span>}
        </div>


      </div>
    );
  }
}
export default (CaseSearch);
