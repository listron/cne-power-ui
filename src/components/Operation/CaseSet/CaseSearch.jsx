import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import FilterCondition from '../../../components/Common/FilterConditions/FilterCondition';
import { Input, Button, Select, Icon } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
const { Option } = Select;
class CaseSearch extends React.Component {
  static propTypes = {
    stations: PropTypes.array,
    deviceModeData: PropTypes.array,
    questionTypeList: PropTypes.array,
    userData: PropTypes.array,
    changeCasePartStore: PropTypes.func,
    getQuestionList: PropTypes.func,
    getDeviceMode: PropTypes.func,
    getCasePartList: PropTypes.func,
    queryUseName: PropTypes.func,
    faultDescription: PropTypes.string,
    userName: PropTypes.string,
    userId: PropTypes.number,
    questionTypeCodes: PropTypes.array,
    deviceModeList: PropTypes.array,
    stationCodes: PropTypes.array,
    orderFiled: PropTypes.string,
    orderType: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      userValue: '',
      userId: null,
    };
  }
  componentDidMount() {
    this.getList();
    this.props.getDeviceMode({
      stationCodes: [],
      regionName: [],
      deviceTypeCode: 101,
      stationType: 0,
    });
    this.props.getQuestionList({});
  }
  filterCondition = (data) => {
    const { deviceModeList } = data;
    const deviceModeData = deviceModeList.map((e) => ({
      manufactorId: e.split('-')[0],
      deviceMode: e.split('-')[1],
    }));
    const { changeCasePartStore } = this.props;
    changeCasePartStore({ ...data, deviceModeList: deviceModeData });
    this.getList({ ...data, deviceModeList: deviceModeData });
  }
  searchDesc = (e) => {
    this.props.changeCasePartStore({
      faultDescription: e.target.value,
    });
  }
  searchFeedback = (e) => {
    this.props.changeCasePartStore({
      userName: e.target.value,
    });
  }
  entryPerson = (value) => {
    if (value) {
      this.props.queryUseName({
        userName: value,
      });
    }
  }
  changePerson = (value) => {
    this.setState({
      userValue: value,
    });
    if (value) {
      const userId = value.split('__')[1];
      this.setState({
        userId,
      });
      // this.props.changeCasePartStore({
      //   userId,
      // });
    } else {
      this.props.changeCasePartStore({
        userId: null,
      });
    }
  }
  onReset = () => {
    const initValue = {
      faultDescription: '',
      userName: '',
      userId: null,
    };
    this.props.changeCasePartStore(initValue);
    this.setState({
      userValue: null,
    });
    this.getList(initValue);
  }
  onSearch = () => {
    const { userId } = this.state;
    this.props.changeCasePartStore({
      userId,
    });
    this.getList({ userId });
  }
  getList = (value) => {
    const { getCasePartList, faultDescription, userName, userId, questionTypeCodes, deviceModeList, stationCodes, orderFiled, orderType, pageSize, pageNum } = this.props;
    const params = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, orderFiled, orderType, pageSize, pageNum };
    getCasePartList({
      ...params,
      pageSize: 10,
      pageNum: 1,
      ...value,
    });
  }

  render() {
    const { stations, deviceModeData, questionTypeList, userData, faultDescription, userName, userId } = this.props;
    const { userValue } = this.state;
    const stationsData = stations ? stations.filter(e => (e.stationType === 0)) : [];
    const showResetBtn = faultDescription || userName || userValue;
    return (
      <div className={styles.caseSearch}>
        <FilterCondition
          onChange={this.filterCondition}
          option={[
            {
              //此处需要更换类型，变成厂家下的型号，需要处理数据结构
              name: ' 机型',
              type: 'parentCheckBox',
              typeName: 'deviceModeList',
              rules: ['deviceModeName', 'deviceModeCode'],
              data: deviceModeData,
              parentName: 'manufactorName',
            },
            {
              name: '问题类别',
              type: 'multipleType',
              typeName: 'questionTypeCodes',
              rules: ['questionTypeName', 'questionTypeCode'],
              data: questionTypeList,
            },
            {
              name: '风场',
              type: 'multipleType',
              typeName: 'stationCodes',
              rules: ['stationName', 'stationCode'],
              data: stationsData,
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
            allowClear
            placeholder="请输入..."
            className={styles.entryPerson}
            value={userValue}
            showArrow={false}
            optionFilterProp="children"
            onSearch={this.entryPerson}
            onChange={this.changePerson}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {userData && userData.map(e => {
              return <Option key={e.userId} value={e.userId}>{e.userName}</Option>;
            })}
          </Select>
          <CneButton lengthMode="short" className={styles.searchBtn} onClick={this.onSearch}>查询</CneButton>
          {showResetBtn && <span className={styles.reset} onClick={this.onReset}>重置</span>}
        </div>


      </div>
    );
  }
}
export default (CaseSearch);
