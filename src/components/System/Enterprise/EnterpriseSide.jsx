

import React, { Component } from 'react';
import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EnterpriseDetail from './EnterpriseDetail';
import EnterpriseEdit from './EnterpriseEdit';


class EnterpriseSide extends Component {
  static propTypes = {
    showDetail: PropTypes.bool,
    changeEnterpriseAttr: PropTypes.func,
  }

  constructor(props){
    super(props);
  }


  render(){
    const { showDetail, changeEnterpriseAttr } = this.props;
    return (
      <div className={styles.enterpriseSide}>
        {
          showDetail ?
          <EnterpriseDetail changeEnterpriseAttr={changeEnterpriseAttr} />:
          <EnterpriseEdit changeEnterpriseAttr={changeEnterpriseAttr} />
        }
      </div>
    )
  }
}

export default EnterpriseSide;
