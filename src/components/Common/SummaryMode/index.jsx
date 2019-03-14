
import React from "react";
import PropTypes from "prop-types";
import { Radio, Button, Select } from 'antd';
import styles from './styles.scss';
import SelectModal from './Modal'
const Option = Select.Option;
/* 
时间选择共用控件。可自由选择按年，按月，按日，自定义。
参数：
1.组件接收参数
  modeStyle: ,
  list
2.接收必填的组件输出函数onChange = (modeObj)=>{}输出modeObj格式同上;
3.可选参数输入showArea(默认true) , showStation(默认true), showModal(默认true),showWind(默认true); 均为bool
4.可选展示参数timerText: string; 默认'统计时间选择'
*/

class TimeSelectReport extends React.Component {

  static propTypes = {
    modeText: PropTypes.string,
    modeStyle: PropTypes.string,
    showArea: PropTypes.bool,
    showStation: PropTypes.bool,
    showModal: PropTypes.bool,
    showWind: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    list: PropTypes.array,
    stations: PropTypes.array,
  }

  static defaultProps = {
    modeText: '汇总方式',
    showArea: true,
    showStation: true,
    showModal: true,
    showWind: true,
    modeStyle: 'wind',
    list: [],
    visiableModal:false,
  }

  constructor(props) {
    super(props);
    this.state = {
      modeStyle: props.modeStyle,
      list: props.list,
    }
  }
  componentDidMount() {
  }
  onModeChange = (e) => {
    const modeStyle = e.target.value;
    const params = { modeStyle, list: [] };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }
  onSearch = () => {
    const params = { modeStyle: this.state.modeStyle, list: [] };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }
  onModalHandelOK=(v)=>{
    console.log(v)
    this.setState({ visiableModal: false })
  }
  hideModal = () => {
    this.setState({ visiableModal: false })
  }

  showModal = () => {
    this.setState({ visiableModal: true });
  }
  maxTagPlaceholder = (v) => {
    return <div>已选{this.state.list.length}/{this.props.stations.length}</div>
  }
 
  handleChange = (v) => {
    this.setState({ list: v });
  }

  render() {
    const { modeText, showArea, showStation, showModal, showWind, style, stations } = this.props;
    const { modeStyle, list ,visiableModal} = this.state;
    return (
      <div className={styles.timeSelect} style={style}>
        <div className={styles.textStyle}>{modeText}</div>
        <div className={styles.buttonStyle}>
          <Radio.Group buttonStyle="solid" onChange={this.onModeChange} value={modeStyle} >
            {showModal && <Radio.Button value="area" >区域</Radio.Button>}
            {showStation && <Radio.Button value="station">电站</Radio.Button>}
            {showArea && <Radio.Button value="modal">型号</Radio.Button>}
            {showWind && <Radio.Button value="wind">风机</Radio.Button>}
          </Radio.Group>
        </div>
        {modeStyle === 'area' && <Select
          mode="multiple"
          placeholder="选择区域"
          value={list}
          onChange={this.handleChange}
          style={{ width: '200px' }}
          maxTagCount={0}
          maxTagPlaceholder={this.maxTagPlaceholder}
        >
          {stations && stations.map((e) => {
            return <Option key={e.stationCode}>{e.stationName}</Option>
          })}
        </Select>}
        {modeStyle === 'station' && <div style={{position:'relative'}}>
        <Select
          mode="multiple"
          placeholder="选择电站"
          value={list}
          onChange={this.handleChange}
          style={{ width: '200px' }}
          maxTagCount={0}
          maxTagPlaceholder={this.maxTagPlaceholder}
        >
          {stations && stations.map((e) => {
            return <Option key={e.stationCode}>{e.stationName}</Option>
          })}
        </Select>
        <SelectModal
          {...this.props}
          list = {list}
          handleOK={this.onModalHandelOK}
          visiable={visiableModal}
          hideModal={this.hideModal}
          showModal={this.showModal}
        />
      </div>
      }
        {modeStyle === 'modal' && <div style={{position:'relative'}}>
        <Select
          mode="multiple"
          placeholder="选择型号"
          value={list}
          onChange={this.handleChange}
          style={{ width: '200px' }}
          maxTagCount={0}
          maxTagPlaceholder={this.maxTagPlaceholder}
        >
          {stations && stations.map((e) => {
            return <Option key={e.stationCode}>{e.stationName}</Option>
          })}
        </Select>
        <SelectModal
          {...this.props}
          list = {list}
          handleOK={this.onModalHandelOK}
          visiable={visiableModal}
          hideModal={this.hideModal}
          showModal={this.showModal}
        />
      </div>}
        {modeStyle === 'wind' && <div style={{position:'relative'}}>
        <Select
          mode="multiple"
          placeholder="选择风机"
          value={list}
          onChange={this.handleChange}
          style={{ width: '200px' }}
          maxTagCount={0}
          maxTagPlaceholder={this.maxTagPlaceholder}
        >
          {stations && stations.map((e) => {
            return <Option key={e.stationCode}>{e.stationName}</Option>
          })}
        </Select>
        <SelectModal
          {...this.props}
          list = {list}
          handleOK={this.onModalHandelOK}
          visiable={visiableModal}
          hideModal={this.hideModal}
          showModal={this.showModal}
        />
      </div>}
        <Button className={styles.btn} onClick={this.onSearch}>查询</Button>
        <Button onClick={this.onSearch}>导出</Button>
      </div>
    )
  }
}
export default TimeSelectReport

