import React, { Component } from 'react';
import EliminateDefectsHandler from './EliminateDefectsHandler';
import EliminateDefectsList from './EliminateDefectsList';
import styles from './listPage.scss';

export default class EliminateDefectsListPage extends Component {

  render() {
    return (
      <div className={`${styles.listPage} ${styles.light}`}>
        <div style={{height: '60px'}}>筛选部分</div>
        <EliminateDefectsHandler />
        <EliminateDefectsList />
      </div>
    );
  }
}
