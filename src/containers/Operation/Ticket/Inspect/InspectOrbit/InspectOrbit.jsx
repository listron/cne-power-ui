import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Radio } from 'antd';
import styles from './inspectOrbit.scss';
import { ticketAction } from '../../ticketAction';
import WarningTip from '../../../../../components/Common/WarningTip';
import InspectOrbitMap from './InspectOrbitMap.jsx';
class InspectOrbit extends Component {
  static propTypes = {
    deviceTypeItems: PropTypes.array,
    onChangeShowContainer: PropTypes.func,
    createInspect: PropTypes.func,
    stations: PropTypes.object,
    getStations: PropTypes.func,
    container: PropTypes.string,
    changeInspectStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      users: 'all',
    };
  }
  componentDidMount() {
  }
  onCloseInspectCreate = () => {
    // this.setState({
    //   showWarningTip: true,
    //   warningTipText: '退出后信息无法保存!'
    // });
    this.props.onChangeShowContainer({ container: 'detail' });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.onChangeShowContainer({ container: 'detail' });
  }

  handleUser = (e) => {
    const user = e.target.value;
    this.setState({
      users: user,
    });
  }

  uniq(array) {
    //var temp =  array;
    var temp = [array[0]];
    array.map((e, i) => {
      if (e.username != temp[temp.length - 1].username) {
        temp.push(e);
      }
    });

    return temp;
  }

  selectUser() {
    const { inspectTrackData, inspectUserData } = this.props;
    var uniqInspectTrackData = this.uniq(inspectTrackData);
    const names = [];
    if (uniqInspectTrackData) {
      uniqInspectTrackData.map((any) => {
        //console.log(any);
        for (var p in any) {
          if (p == 'username') {
            names.push(any[p]);
          }
        }
      });
    }
    console.log(names);
    if (names.length > 0) {
      return (
        <Radio.Group defaultValue="all" buttonStyle="solid" style={{ position: 'absolute', left: '100px', top: '100px' }} onChange={this.handleUser} >
          <Radio.Button value="all" style={{ marginRight: '5px', zIndex: 1 }}>全部</Radio.Button>
          {names && names.map((e, index) => (
            <Radio.Button value={e} style={{ margin: '0 5px', zIndex: 1 }} key={index}>{e}</Radio.Button>
          )
          )}
        </Radio.Group>
      );
    }
  }

  render() {
    const { showWarningTip, warningTipText, users } = this.state;
    const { inspectTrackData, inspectUserData } = this.props;
    const color = ['#CB0909', '#17C5DA', '#E373FA', '#75FAC7', '#4500B2', '#CA6550', '#FFF285', '#FF0026', '#80F50A', '#DD8803', '#6F86F2', '#FFC500', '#4DB98B', '#3B9BFF', '#FD00DC', '#F57F0A', ' #E0BB3B', '#048B52', '#FF340A', '#8303B4'];
    const data = [];
    const datas = [];
    const timeArray = [];

    const userOrbit = inspectTrackData.filter(e => {
      if (users === 'all') {
        return true;
      }
      return e.username === users;

    });
    let userOrbits = [];
    userOrbits = userOrbit.map((item, index) => {
      for (var i = 0; i < item.pointData.length - 1; i++) {
        const value = item.pointData[i];
        if (value.longitude == Number.MIN_VALUE) {
          item.pointData.splice(i, 1);
          if (i > 1 || i < item.pointData.length - 1) {
            i--;
          }
          continue;
        }

      }
      return item;
    });
    userOrbits.map((item, index) => {
      const startDate = item.pointData[0].trackDate;
      const endDate = item.pointData[item.pointData.length - 1].trackDate;

      for (var i = 0; i < item.pointData.length - 1; i++) {
        const value = item.pointData[i];
        const value1 = item.pointData[i + 1];
        data.push({
          // date: [value.trackDate, value1.trackDate],
          date: [`${startDate}-${endDate}`],
          coords: [[value.longitude, value.latitude], [value1.longitude, value1.latitude]],
          name: item.username,
          lineStyle: { color: color[index] },
        });

      }
    });

    //开始时间和结束时间
    userOrbits.forEach((e, i) => {
      const startAndEndTime = e.pointData && e.pointData.map((e, i) => {
        return e.trackDate;
      });

      for (let i = 0; i < startAndEndTime.length - 1; i++) {
        const start = startAndEndTime[i];
        const end = startAndEndTime[i + 1];
        timeArray.push([start, end]);
      }

      datas.push({
        ...e,
        name: e.username,
        trackDate: timeArray,

      });
    });
    // console.log(datas, '对总数据进行筛选');
    //拿到所有轨迹（每个数组是一条轨迹），以及每条轨迹的各个点
    const pointArray = userOrbits.map((e, i) => {
      return e.pointData;
    }).map((item, i) => {
      return (item.map((e, i) => {
        return { coord: [e.longitude, e.latitude] };
      })
      );
    });

    // console.log(pointArray, '轨迹线');
    //对每一条轨迹线，进行坐标的处理，起始点于结束点练成一条小线，先后线拼凑成轨迹
    const itemOrbits = pointArray.map((e, i) => {
      const itemLines = [];
      for (let j = 0; j < e.length - 1; j++) {
        const start = e[j].coord;
        const end = e[j + 1].coord;
        const itemLine = { coords: [start, end], timeArray: timeArray[(i) * (e.length) + j] };
        itemLines.push(
          itemLine
        );
      }
      // console.log(itemLines);
      return itemLines;
    });

    const itemOrbit = itemOrbits.length > 0 ? itemOrbits.reduce(function (prev, next) {
      return prev.concat(next);
    }) : [];
    // console.log(itemOrbit, '线坐标');






    //拿取每条线的起始坐标点，以及终点坐标点；
    const startAndEndCoord = [];
    pointArray.forEach((e, i) => {
      startAndEndCoord.push({
        coord: e[0].coord,
        tooltip: {
          formatter: '起点',
        },
        symbol: 'image:///img/begin.png',
      });
      startAndEndCoord.push({
        coord: e[e.length - 1].coord,
        tooltip: {
          formatter: '终点',
        },
        symbol: 'image:///img/end.png',
      });
    });
    // console.log(startAndEndCoord);




    return (
      <div className={styles.inspectOrbit}>
        {/*  {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
         */}
        <div className={styles.createTop}>
          <span className={styles.text}>巡检轨迹</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onCloseInspectCreate} />
        </div>
        {this.selectUser()}
        <div className={styles.createContent}>
          <InspectOrbitMap testId={'inspectOrbit'} data={data} orbitList={datas} users={users} itemOrbit={itemOrbit} startAndEndCoord={startAndEndCoord} />
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  ...state.operation.inspect.toJS(),
});
const mapDispatchToProps = (dispatch) => ({
  getInspectOrbit: payload => dispatch({ type: ticketAction.getInspectOrbit, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(InspectOrbit);
  // let test = [
    //   [{ coord: ["132.214", "33.32534"] }, { coord: ["133.124", "34.352"] }],
    //   [{ coord: ['119.4543', '25.9222'] }, { coord: ['87.9236', '43.5883'] }],
    //   [{ coord: ['87.9236', '43.5883'] }, { coord: ['116.4551', '40.2539'] }],
    // ];
