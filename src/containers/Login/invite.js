import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Button,Radio,message} from 'antd';
import {userInfo} from 'actions/common'
import moment from 'moment';
import  'moment/locale/zh-cn';
import copy from 'copy-to-clipboard';
import {getCookie} from '../utils'
import actions from '../actions/common';
moment.locale('zh-cn');
import PropTypes from 'prop-types';

@connect((state, props) => ({
  register: state.Register,
}))

export default class Invite extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      data: {},
      visible:"block",
      checked:false
    }
    // this.getUserInfo = this.getUserInfo.bind(this)
  }

  // 组件已经加载到dom中
  componentDidMount() {
    const enterpriseId = getCookie("enterpriseId");
    // const expireTime = getCookie("expireTime");
    this.props.dispatch(actions.fetchLink(enterpriseId,''));
  }
  componentWillReceiveProps(nextProps){
  }
  onClick=(e)=>{
    this.setState({
      checked:!this.state.checked,
      time:moment().add(7, 'd').format('YYYY MM DD hh:mm:ss'),
    })
    const enterpriseId = getCookie("enterpriseId");
    this.props.dispatch(actions.fetchLink(enterpriseId,'7'));
  }


  getUserInfo = () => {
    this.props.dispatch(userInfo({}, (response) => {
      console.log(response)
    }, (response) => {
      console.log(response)
      // message.warning(response)
    }))
  }
  copyLink = () => {
    copy(this.props.register.link);
    message.success('复制成功');
  };

  render() {
    console.log(moment().add(7, 'd').format('YYYY MM DD hh:mm:ss'))
    return (
      <div className="welcome">
        <div className="content">
          <p>开启后生成链接，成员可以不经过审核直接加入团队。</p>
          <span className="link">{this.props.register.link}</span>
          <Button className="copy" type="primary" onClick={this.copyLink}>复制链接</Button>
          <Radio checked={this.state.checked} onClick={this.onClick}>链接仅七天内有效</Radio>
          <span style={{display:this.state.checked?'inline-block':'none'}}>链接将在{this.state.time}失效</span>
        </div>
      </div>
    )
  }
}

Invite.propTypes = {
  dispatch:PropTypes.func,
  register:PropTypes.object,
};