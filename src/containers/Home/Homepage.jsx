import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomepageTop from '../../components/Home/HomepageTop';
import { Button } from 'antd';
import styles from './homepage.scss';
import { Link } from 'react-router-dom';
import { homepageAction } from './homepageAction';
import PropTypes from 'prop-types';

class Homepage extends Component {
  static proptypes = {
    homepageReset: PropTypes.func,
  }

  componentWillUnmount(){
    this.props.homepageReset();
  }

  render() {
    return (
      <div className={styles.homepage}>
        <HomepageTop />
        <div className={styles.middleBox}>
          <div className={styles.leftInfo}>中-左三个</div>
          <div className={styles.mapInfo}>中心地图</div>
          <div className={styles.rightInfo}>中-右三个</div>
        </div>
        <div className={styles.bottomBox}>
          底部4个
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.homepage.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeHomepageStore: payload => dispatch({type: homepageAction.changeHomepageStore, payload}),
  homepageReset: payload => dispatch({type: homepageAction.homepageReset, payload}),
});


export default connect(mapStateToProps, mapDispatchToProps)(Homepage);