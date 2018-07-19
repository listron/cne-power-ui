import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Exception extends Component {
  static propTypes = {
  }
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Link to="/login">去登录</Link>              
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
});
export default connect(mapStateToProps)(Exception)
