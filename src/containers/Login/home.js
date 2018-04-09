import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert} from 'antd';
import {userInfo} from 'actions/common'
import {hashHistory,Link} from 'react-router'
import {getCookie,setCookie} from '../utils'
import axios from 'axios';
const api = "http://10.10.24.56:8080";
@connect((state, props) => ({
  config: state.config,
}))

export default class Home extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      tips:true,
      data: {},
      visible: "block",
    }
    // this.getUserInfo = this.getUserInfo.bind(this)
  }

  // 组件已经加载到dom中
  componentDidMount() {
    const userId = getCookie('userId');
    const enterpriseId = getCookie('enterpriseId');
    axios.post(api+'/api/v3/relation/queryShowStatus',`userId=${userId}&enterpriseId=${enterpriseId}`)
    .then((response)=>{
      if(response.data.success){
        if(response.data.result.status){
           this.setState({
            tips: true,
          })
        }else{
          this.setState({
            tips: false,
          })
        }
      }else{

      }
    })
    .catch((error)=>{
      message.error(error)
    })
  }
  neverTip = (e) => {
    const userId = getCookie('userId');
    const enterpriseId = getCookie('enterpriseId');
    axios.post(api+'/api/v3/relation/changeShowStatus',`userId=${userId}&enterpriseId=${enterpriseId}`)
    .then((response)=>{
      if(response.data.success){
        this.setState({
          tips: false,
        })
      }else{
        message.error(response.data.error)
      }
    })
    .catch((error)=>{
      message.error(error)
    })
    this.setState({
      tips: false,
    })
  }
  onClose = ()=>{
    this.setState({
      tips: false,
    })
  }

  getUserInfo = () => {
    this.props.dispatch(userInfo({}, (response) => {
      console.log(response)
    }, (response) => {
      console.log(response)
      // message.warning(response)
    }))
  }

  render() {
    return (
      <div className="welcome">
        <div className="content">
          {
            this.state.tips&&
            <div style={{display:this.state.tips?'block':'none'}} className="ant-alert ant-alert-warning ant-alert-no-icon ant-alert-banner topTip">
              <span className="ant-alert-message">企业内还没有用户，可以通过用户管理-&gt;邀请注册 添加用户</span>
              <Link to="/invite" style={{diplay:this.state.visible}} className="tipLink">去邀请</Link>
              <span style={{diplay:this.state.visible}} className="tip" onClick={this.neverTip}>不再提醒</span>
              <a className="ant-alert-close-icon">
              <i className="anticon anticon-cross" onClick={this.onClose}></i></a>
            </div>
          }
        </div>
      </div>
    )
  }
}