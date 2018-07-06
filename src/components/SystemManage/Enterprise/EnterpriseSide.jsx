

import React, { Component } from 'react';
import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EnterpriseDetail from './EnterpriseDetail';
import EnterpriseEdit from './EnterpriseEdit';


class EnterpriseSide extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    changeEnterpriseAttr: PropTypes.func,
  }

  constructor(props){
    super(props);
  }


  render(){
    const { showPage, changeEnterpriseAttr } = this.props;
    return (
      <div className={styles.enterpriseSide}>
        {
          showPage==='detail' || showPage === 'list' ?
          <EnterpriseDetail changeEnterpriseAttr={changeEnterpriseAttr} />:
          <EnterpriseEdit changeEnterpriseAttr={changeEnterpriseAttr} />
        }
      </div>
    )
  }
}

export default EnterpriseSide;
