import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button, Switch, DatePicker } from 'antd';
import DateFilter from './DateFilter';
import styles from './defectFilter.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectTable extends Component {
  static propTypes = {
    
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      createTimeStart: '',//string: （0：全部，1：今天，2：近三天，3：一周内，4：一个月）
      createTimeEnd: '',//string:
      stationType:'',//(string:0:风电，1光伏，2：全部)
      stationCodes:'',//(string:逗号隔开)--全部时使用''
      deviceTypeCode: '',//string设备类型
      defectLevel:'',//string（0：全部，1：一级，2：二级，3：三级，4：四级） 缺陷级别
      handleUser:'',//string 用户名
    };
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
  }
  

  render() {
    const { showFilter } = this.state;
    return (
      <div className={styles.defectFilter}>
        <div className={styles.topSearch}>
          <span>筛选条件</span>
          <Button onClick={()=>this.onFilterShowChange('time')}>发生时间</Button>
          <Button onClick={()=>this.onFilterShowChange('stationType')}>电站类型</Button>
          <Button onClick={()=>this.onFilterShowChange('stationName')}>电站名称</Button>
          <Button onClick={()=>this.onFilterShowChange('deviceType')}>设备类型</Button>
          <Button onClick={()=>this.onFilterShowChange('defectLevel')}>缺陷级别</Button>
          <span>
            <Switch /><span>我参与的</span>
          </span>
        </div>
        <div>
          {showFilter==='time' && <DateFilter {...this.props} />}

        </div>
        <div className={styles.selectedItems}>
          <span>已选条件</span>
        </div>
      </div>
    );
  }

}

export default DefectTable;