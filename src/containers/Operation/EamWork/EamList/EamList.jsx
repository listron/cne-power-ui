import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {eamListAction} from './eamListAction';
import CneFooter from '@components/Common/Power/CneFooter';
import EamSearch from '@components/Operation/EamWork/EamList/EamSearch';
import EamTable from '@components/Operation/EamWork/EamList/EamTable';
import styles from './eamList.scss';

class EamList extends Component {

  static propTypes = {
    theme: PropTypes.string,
  };

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.eamListBox} ${styles[theme]}`}>
        <div className={styles.eamListContent}>
          <div className={styles.eamListWrap}>
            <EamSearch {...this.props} />
            <EamTable {...this.props} />
          </div>
        </div>
        <CneFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.eamList.toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: eamListAction.resetStore }),
  changeStore: payload => dispatch({ type: eamListAction.changeStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EamList);
