import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class NotFund extends Component {
  static propTypes = {
    info:PropTypes.object,
  }
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="loginpagewrap">
        {this.props.info}
        <Link  to="/login">去登录</Link>              
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  info: state.login.info,
});
export default connect(mapStateToProps)(NotFund)
