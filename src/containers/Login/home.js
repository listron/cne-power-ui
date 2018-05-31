import React, {Component} from 'react'
import {connect} from 'react-redux'
import { withRouter} from 'react-router-dom';
import {Link} from 'react-router'
import {getCookie} from '../index'
import { GET_SHOW_STATUS_SAGA, CHANGE_SHOW_STATUS_SAGA } from '../../constants/actionTypes/Login';
import PropTypes from 'prop-types';

class Home extends Component {
  static propTypes = {
    getShowStatus:PropTypes.func,
    changeShowStatus: PropTypes.func,
    status: PropTypes.bool
  }
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      showTips: true
    };
    this.neverShowTip = this.neverShowTip.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  // 组件已经加载到dom中
  componentDidMount() {
    const userId = getCookie('userId');
    const enterpriseId = getCookie('enterpriseId');
    this.props.getShowStatus({
      userId: userId,
      enterpriseId: enterpriseId
    });
  }
  
  onClose() {
    this.setState({
      showTips: false,
    });
  }
  
  neverShowTip() {
    const userId = getCookie('userId');
    const enterpriseId = getCookie('enterpriseId');
    this.props.changeShowStatus({
      userId: userId,
      enterpriseId: enterpriseId
    });
  }
  render() {
    return (
      <div className="welcome">
        <div className="content">
          {
            this.state.showTips&&this.props.status&&
            <div className="ant-alert ant-alert-warning ant-alert-no-icon ant-alert-banner topTip">
              <span className="ant-alert-message">企业内还没有用户，可以通过用户管理-&gt;邀请注册 添加用户</span>
              <Link to="/invite" style={{diplay:this.state.visible}} className="tipLink">去邀请</Link>
              <span className="tip" onClick={this.neverShowTip}>不再提醒</span>
              <a className="ant-alert-close-icon">
              <i className="anticon anticon-cross" onClick={this.onClose}></i>
              </a>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  status: state.login.get('status'),
});
const mapDispatchToProps = (dispatch) => ({
  getShowStatus: (parmas) => dispatch({ type: GET_SHOW_STATUS_SAGA,parmas:parmas }),
  changeShowStatus: (parmas) => dispatch({ type: CHANGE_SHOW_STATUS_SAGA,parmas:parmas })
});
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Home))