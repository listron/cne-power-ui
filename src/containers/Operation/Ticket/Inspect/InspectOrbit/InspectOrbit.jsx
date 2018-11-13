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
    showContainer: PropTypes.string,
    changeInspectStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      users: 'all'
    }
  }
  componentDidMount() {
  }
  onCloseInspectCreate = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!'
    });
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
  getOrbitList() {
    const { users } = this.state;
    const { inspectTrackData, inspectUserData } = this.props;
    let data=[]
    let userOrbit =  inspectTrackData.filter(e => {
      if (users === 'all') {
        return true
      } else {
        return e.username === users
      }
    })
   
    userOrbit.forEach(e => {
      data.push({
        ...userOrbit,
        name:e.username,
        trackDate:e.trackDate,
        value:[e.longitude,e.latitude]
      })
      
    });
    return data

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
    const { showWarningTip, warningTipText,users } = this.state;
    return (
      <div className={styles.inspectOrbit}>
        {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>巡检轨迹</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCloseInspectCreate} />
        </div>
        {this.selectUser()}
        <div className={styles.createContent}>
          <InspectOrbitMap testId={'inspectOrbit'} users={users} orbitList={this.getOrbitList()} />
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