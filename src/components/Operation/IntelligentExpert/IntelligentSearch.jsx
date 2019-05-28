import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Input, Button, Select, Icon} from 'antd';
import styles from './intelligentExpert.scss';
import DeviceTypeFilter from "./IntelligentFilter/DeviceTypeFilter/DeviceTypeFilter";
import DefectTypeFilter from "./IntelligentFilter/DefectTypeFilter/DefectTypeFilter";
import FilteredItems from "./IntelligentFilter/FilteredItems/FilteredItems";

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
    deviceTypeCode: PropTypes.array,
    defectTypeCode: PropTypes.array,
    usernames: PropTypes.array,
    defectValue: PropTypes.string,
    personValue: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    sortMethod: PropTypes.string,
  }

  constructor( props ) {
    super( props );
    this.state = {
      defectValue: '',
      personValue: '',
      showFilter: ""
    };
    this.entryPerson = debounce(this.entryPerson, 800);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { deviceTypeCode: deviceTypeCodeCurrent } = this.props;
    const { deviceTypeCode: deviceTypeCodeNext } = nextProps;
    if (deviceTypeCodeCurrent !== deviceTypeCodeNext && deviceTypeCodeNext.length === 0) {
      this.setState({
        showFilter: ""
      });
    }
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

  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if(showFilter === filterText){
      this.setState({
        showFilter: ''
      })
    }else{
      this.setState({
        showFilter: filterText
      })
    }
  };

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
    if (value) {
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
  }

  changePerson = (value) => { // 选择option
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
  }

  filterCondition = (changeValue) => { // 设备类型、缺陷类型筛选栏
    const { getIntelligentTable, listParams } = this.props;
    const { deviceTypeCodes, defectTypeCode, faultDescription, recorder, pageNum, pageSize, orderField, sortMethod } = listParams;
    const params = { deviceTypeCodes, defectTypeCode, faultDescription, recorder, pageNum, pageSize, orderField, sortMethod };
    // if(changeValue.deviceTypeCode){
    //   this.props.getLostGenType({ // 获取所有损失缺陷类型
    //     objectType: 1,
    //     stationType:1,
    //     ...changeValue,
    //   })
    // }
    getIntelligentTable({
      ...params,
      ...changeValue,
    })
  }

  render() {
    const { personValue, defectValue, showFilter } = this.state;
    const { usernames = [], deviceTypeCode } = this.props;
    const showResetBtn = personValue || defectValue; // 控制“重置”按钮是否出现
    return (
      <div className={styles.intelligentSearch}>
        <div className={styles.topSearch}>
          <span>筛选条件</span>
          <Button onClick={()=>this.onFilterShowChange('deviceTypes')}>
            设备类型<Icon type={showFilter ==='deviceTypes' ? "up" : "down"} />
          </Button>
          <Button disabled={!deviceTypeCode || deviceTypeCode.length === 0} onClick={()=>this.onFilterShowChange('defectTypes')}>
            缺陷类型<Icon type={showFilter ==='defectTypes' ? "up" : "down"} />
          </Button>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='deviceTypes' && <DeviceTypeFilter {...this.props} />}
          {showFilter==='defectTypes' && <DefectTypeFilter {...this.props} />}
        </div>
        <div className={styles.filterWrap}>
          <FilteredItems {...this.props} />
        </div>
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
              onSearch={this.entryPerson}
              onChange={this.changePerson}
            >
              {usernames && usernames.map(e => {
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
