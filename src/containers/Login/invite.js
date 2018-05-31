import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { Button,Radio,message} from 'antd';
import moment from 'moment';
import { CREATE_REGISTER_SAGA } from '../../constants/actionTypes/Login';
import copy from 'copy-to-clipboard';
import {getCookie} from '../utils';
import PropTypes from 'prop-types';

class Invite extends Component {
  static propTypes = {
    createRegister:PropTypes.func,
    link: PropTypes.string
  }
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      sevenChecked: true,
      time: moment().add(7, 'd').format('YYYY年M月DD日 HH:mm:ss')
    };
    this.onClickSeven = this.onClickSeven.bind(this);
    this.onClickLong = this.onClickLong.bind(this);
    this.copyLink = this.copyLink.bind(this);
  }

  // 组件已经加载到dom中
  componentDidMount() {
    const enterpriseId = getCookie("enterpriseId");
    this.props.createRegister({
      enterpriseId: enterpriseId,
      expireTime: '7'
    });
  }

  onClickSeven() {
    this.setState({
      sevenChecked: true,
      time: moment().add(7, 'd').format('YYYY年M月DD日 HH:mm:ss'),
    });
    const enterpriseId = getCookie("enterpriseId");
    this.props.createRegister({
      enterpriseId: enterpriseId,
      expireTime: '7'
    });
  }

  onClickLong() {
    this.setState({
      sevenChecked: false
    });
    const enterpriseId = getCookie("enterpriseId");
    this.props.createRegister({
      enterpriseId: enterpriseId,
      expireTime: ''
    });
  }

  copyLink() {
    copy(this.props.link);
    message.success('复制成功');
  }

  render() {
    return (
      <div className="welcome">
        <div className="content">
          <p>开启后生成链接，成员可以不经过审核直接加入团队。</p>
          <span className="link">{this.props.link}</span>
          <Button className="copy" type="primary" onClick={this.copyLink}>复制链接</Button>
          <Radio checked={this.state.sevenChecked} onClick={this.onClickSeven}>链接仅七天内有效</Radio>
          {this.state.sevenChecked?<span>链接将在{this.state.time}失效</span>:null}
          <Radio checked={!this.state.sevenChecked} onClick={this.onClickLong}>链接永久有效</Radio>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  link: state.login.get('link')
});
const mapDispatchToProps = (dispatch) => ({
  createRegister: (parmas) => dispatch({ type: CREATE_REGISTER_SAGA,parmas:parmas })
});

Invite.propTypes = {
  dispatch:PropTypes.func,
  register:PropTypes.object,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Invite));