import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class NotFund extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="loginpagewrap">
        {this.props.info.msg}
        <Link  to="/login">去登录</Link>              
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  info: state.login.info,
});
NotFund.propTypes = {
  info:PropTypes.object,
};
export default connect(mapStateToProps)(NotFund)
