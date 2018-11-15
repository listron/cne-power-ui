import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomepageTop from '../../components/Home/HomepageTop';
import StationGeneral from '../../components/Home/HomeParts/StationGeneral';
import MonthGenChart from '../../components/Home/HomeParts/MonthGenChart';
import { CompleteRate, OperationInfo } from '../../components/Home/HomeParts/HomeFuncParts';
import styles from './homepage.scss';
import { loginAction } from '../Login/loginAction';
import { homepageAction } from './homepageAction';
import PropTypes from 'prop-types';

class Homepage extends Component {

  static propTypes = {
    stations: PropTypes.array,
    changeLoginStore: PropTypes.func,
    homepageReset: PropTypes.func,
  }

  constructor(props){
    super(props);
    const stationTypeSet = new Set(props.stations.map(e=>e.stationType));
    this.state = {
      hasMultipleType: stationTypeSet.size > 1, // 用户有多种类型电站。
    }
  }

  componentDidMount(){
    const { stations } = this.props;
    stations.length > 0 && console.log('一开始就有电站信息') && this.getOriginData();
  }

  componentWillReceiveProps(nextProps){
    const { stations } = nextProps;
    const preStations = this.props.stations;
    if(preStations.length === 0 && stations.length > 0){ // 拿到
      const stationTypeSet = new Set(stations.map(e=>e.stationType));
      this.setState({ hasMultipleType: stationTypeSet.size > 1 });
      console.log('现在拿到电站信息了。')
      this.getOriginData()
    }
  }

  componentWillUnmount(){
    this.props.homepageReset();
  }

  getOriginData = () => { // 获取所有页面内数据。
    console.log('获取所有数据了哈！')
  }

  render() {
    const { changeLoginStore } = this.props;
    const { hasMultipleType } = this.state;
    return (
      <div className={styles.homepage}>
        <div className={styles.innerContent}>
          <HomepageTop changeLoginStore={changeLoginStore} />
          <div className={styles.middleBox}>
            <div className={styles.leftInfo}>
              <StationGeneral hasMultipleType={hasMultipleType} />
              <CompleteRate />
              <MonthGenChart hasMultipleType={hasMultipleType} />
            </div>
            <div className={styles.mapInfo}>中心地图</div>
            <div className={styles.rightInfo}>
              <OperationInfo />
            </div>
          </div>
          <div className={styles.bottomBox}>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.homepage.toJS(),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeLoginStore: params => dispatch({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params }),
  changeHomepageStore: payload => dispatch({type: homepageAction.changeHomepageStore, payload}),
  homepageReset: payload => dispatch({type: homepageAction.homepageReset, payload}),
});


export default connect(mapStateToProps, mapDispatchToProps)(Homepage);