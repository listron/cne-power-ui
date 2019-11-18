

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HandlePersonnelInfo from './HandlePersonnelInfo';
import DetailPersonnel from './DetailPersonnel';
import styles from './side.scss';

class PersonnelManageSides extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
  }

  state={
    sideTranslateX: 'translateX(100%)',
  }

  componentWillReceiveProps(nextProps){
    const { pageKey } = nextProps;
    const prePageKey = this.props.pageKey;
    if (['addPersonnel', 'editPersonnel', 'detailPersonnel'].includes(pageKey) && prePageKey === 'list') { // 主页到侧边页
      this.setState({ sideTranslateX: 'translateX(0%)' });
    }
    if (['addPersonnel', 'editPersonnel', 'detailPersonnel'].includes(prePageKey) && pageKey === 'list') { // 侧边页回主页
      this.setState({ sideTranslateX: 'translateX(100%)' });
    }
  }

  render(){
    const { sideTranslateX } = this.state;
    return (
      <div className={styles.personnelManageSides} style={{ transform: sideTranslateX }}>
        <HandlePersonnelInfo {...this.props} />
        <DetailPersonnel {...this.props} />
      </div>
    );
  }
}

export default PersonnelManageSides;
