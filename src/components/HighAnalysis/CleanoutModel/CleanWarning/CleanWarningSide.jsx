
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanStyle.scss';
import { Button } from 'antd';
// import StationManageDetail from './StationManageDetail';
// import StationManageEdit from './StationManageEdit';
import { DustEffectStation, DustBaseInfo } from './DustEffectTop';
import Footer from '../../../Common/Footer';

class CleanWarningSide extends Component {
  static propTypes = {
    stations: PropTypes.array,
    dustEffectInfo: PropTypes.object,
    getCleanWarningDetail: PropTypes.func,
    getTotalDustEffect: PropTypes.func,
    getMatrixDustEffect: PropTypes.func,
    changeCleanWarningStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCheckActive: false,
    }
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);
  }

  hiddenStationList = () => { // 隐藏电站切换框
    this.setState({
      stationCheckActive: false,
    });
  }

  showStationList = () => { // 显示电站切换框
    this.setState({
      stationCheckActive: true,
    });
  }

  changeStation = () => { // 切换电站并隐藏切换框
    this.setState({
      stationCheckActive: false,
    });
  }

  backToList = () => { // 返回列表页
    this.props.changeCleanWarningStore({showPage: 'list'});
  }

  changeEffectDay = () => { // 切换时间并请求灰尘影响数据。

  }

  render(){
    const { stations, dustEffectInfo } = this.props;
    const { stationCheckActive } = this.state;
    return (
      <div className={styles.clearWarningSide}>
        <div>
          <DustEffectStation
            dustEffectInfo={dustEffectInfo}
            stations={stations.filter(e => e.stationType === 1)}
            stationChange={this.changeStation}
            showStationList={this.showStationList}
            stationCheckActive={stationCheckActive}
            backToList={this.backToList}
          />
          <Button onClick={this.backToList}>返回主页面</Button>
        </div>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningSide;
