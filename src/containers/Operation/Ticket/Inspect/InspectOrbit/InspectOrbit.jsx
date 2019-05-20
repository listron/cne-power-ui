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
      users: 'all'
    }
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
    const { inspectTrackData, inspectUserData } = this.props;
    const { users } = this.state;
    let user = e.target.value;
    this.setState({
      users: user,
    })

  }
  selectUser() {
    const { inspectTrackData, inspectUserData } = this.props;
    if (inspectUserData.length > 0) {
      return (
        <Radio.Group defaultValue="all" buttonStyle="solid" style={{ position: 'absolute', left: '100px', top: '100px' }} onChange={this.handleUser} >
          <Radio.Button value="all" style={{ marginRight: '5px', zIndex: 1 }}>全部</Radio.Button>
          {inspectUserData && inspectUserData.map((e, i) => (
            <Radio.Button value={e.name} style={{ margin: '0 5px', zIndex: 1 }} key={i}>{e.name}</Radio.Button>
          ))}
        </Radio.Group>
      )
    }
  }

  render() {
    const { showWarningTip, warningTipText, users } = this.state;
    const { inspectTrackData, inspectUserData } = this.props;
    let color=['#CB0909','#17C5DA', '#E373FA', '#75FAC7', '#4500B2','#CA6550', '#FFF285', '#FF0026', '#80F50A', '#DD8803', '#6F86F2', '#FFC500','#4DB98B', '#3B9BFF', '#FD00DC', '#F57F0A',' #E0BB3B', '#048B52', '#FF340A', '#8303B4'];
    let data = [];
    let datas = [];
    let timeArray = [];
    let name=[];
    let pointArray2=[];
    let userOrbit = inspectTrackData.filter(e => {
      if (users === 'all') {
        return true
      } else {
        return e.username === users
      }
    })
   
    userOrbit.map((item, index) => {
      let startDate=item.pointData[0].trackDate
      let endDate=item.pointData[item.pointData.length-1].trackDate
    
      for (var i = 0; i < item.pointData.length - 1; i++) {
        let value = item.pointData[i]
        let value1 = item.pointData[i + 1]
      
        data.push({
          // date: [value.trackDate, value1.trackDate],
           date: [`${startDate}-${endDate}`],
          coords: [[value.longitude,value.latitude], [ value1.longitude,value1.latitude]],
          name: item.username,
          lineStyle:{color:color[index]}
        })
      }
    })
  



    //开始时间和结束时间
    userOrbit.forEach((e,i) => {
      let startAndEndTime = e.pointData && e.pointData.map((e, i) => {
        return e.trackDate
      });
      
      for (let i = 0; i < startAndEndTime.length - 1; i++) {
        let start = startAndEndTime[i];
        let end = startAndEndTime[i + 1];
        timeArray.push([start, end])
      }
     

      //此处是
      let test=(e.pointData).map((e, i) => {
        return  { coord: [e.longitude, e.latitude] }
      })
      pointArray2.push(test)
      // console.log(pointArray2,'1111');  
      datas.push({
        ...e,
        name: e.username,
        trackDate: timeArray,

      })
    });
    // console.log(datas, '对总数据进行筛选');
    //拿到所有轨迹（每个数组是一条轨迹），以及每条轨迹的各个点
    let pointArray = userOrbit.map((e, i) => {
      return e.pointData
    }).map((item, i) => {
      return (item.map((e, i) => {
        return { coord: [e.longitude, e.latitude] }
      })
      )
    })
    // console.log(pointArray, '轨迹线');
    //对每一条轨迹线，进行坐标的处理，起始点于结束点练成一条小线，先后线拼凑成轨迹
    let itemOrbits = pointArray.map((e, i) => {
      let itemLines = [];
      for (let j = 0; j < e.length-1; j++) {
        let start = e[j].coord;
        let end = e[j + 1].coord;
        let itemLine = { coords: [start, end] ,timeArray:timeArray[(i)*(e.length)+j]};
        itemLines.push(
          itemLine
        )
      }
      // console.log(itemLines);
      return itemLines
    })
    let itemOrbit = itemOrbits.length > 0 ? itemOrbits.reduce(function (prev, next) {
      return prev.concat(next);
    }) : [];
    // console.log(itemOrbit, '线坐标');

   
     

     

    //拿取每条线的起始坐标点，以及终点坐标点；
    let startAndEndCoord = [];
    pointArray.forEach((e, i) => {
      startAndEndCoord.push({
        coord: e[0].coord,
        tooltip: {
          formatter: '起点'
        },
        symbol: 'image:///img/begin.png',
      })
      startAndEndCoord.push({
        coord: e[e.length - 1].coord,
        tooltip: {
          formatter: '终点'
        },
        symbol: 'image:///img/end.png',
      })
    })
    // console.log(startAndEndCoord);




    return (
      <div className={styles.inspectOrbit}>
      {/*  {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
         */}
         <div className={styles.createTop}>
          <span className={styles.text}>巡检轨迹</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCloseInspectCreate} />
        </div>
        {this.selectUser()}
        <div className={styles.createContent}>
          <InspectOrbitMap testId={'inspectOrbit'} data={data}  orbitList={datas} users={users} itemOrbit={itemOrbit} startAndEndCoord={startAndEndCoord} />
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  ...state.operation.inspect.toJS()
})
const mapDispatchToProps = (dispatch) => ({
  getInspectOrbit: payload => dispatch({ type: ticketAction.getInspectOrbit, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(InspectOrbit);
  // let test = [
    //   [{ coord: ["132.214", "33.32534"] }, { coord: ["133.124", "34.352"] }],
    //   [{ coord: ['119.4543', '25.9222'] }, { coord: ['87.9236', '43.5883'] }],
    //   [{ coord: ['87.9236', '43.5883'] }, { coord: ['116.4551', '40.2539'] }],
    // ];