import React, { PureComponent } from 'react';
import StationModal from '@components/Common/StationSelect/StationModal';
import CneButton from '@components/Common/Power/CneButton';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './workPage.scss';

class StationLists extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
    stageStations: PropTypes.array,
    stageQuery: PropTypes.func,
  };

  state = {
    stationModalShow: false,
  }

  handleOK = (stations) => {
    this.props.stageQuery(stations, true); // 第二个参数, 控制页面进行整体loading的展示
    this.setState({ stationModalShow: false });
  }

  hideStationModal = () => {
    this.setState({
      stationModalShow: false,
    });
  }

  showStationModal = () => {
    this.setState({
      stationModalShow: true,
    });
  }

  render(){
    const { stationModalShow } = this.state;
    const { stageStations, stations, theme } = this.props;
    const stationNamesTotal = stageStations.map(e => e.stationName).join(', ');
    const stationNamePartString = stageStations.length > 6 ? `${stageStations.slice(0, 6).map(e => e.stationName).join(', ')}...` : stationNamesTotal;
    return (
      <div className={`${styles.stationLists} ${styles[theme]}`}>
        <CneButton className={styles.stationHandler} onClick={this.showStationModal} lengthMode="long">
          <span>工作台设置</span>
          <Icon type="setting" />
        </CneButton>
        <span ref={(ref) => { this.stationRef = ref; }} />
        <span
          className={styles.stationNames}
          title={stationNamesTotal}
        >
          电站: {stationNamePartString || '未选择电站'}
        </span>
        <StationModal
          theme={theme}
          multiple={true}
          oneStyleOnly={false}
          checkedStations={stageStations}
          data={stations.filter(e => (e.stationType === 1 && e.isConnected === 1))}
          stationRef={this.stationRef}
          handleOK={this.handleOK}
          stationModalShow={stationModalShow}
          hideStationModal={this.hideStationModal}
        />
      </div>
    );
  }
}

export default StationLists;
