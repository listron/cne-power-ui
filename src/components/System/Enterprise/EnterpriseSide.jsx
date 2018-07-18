


//备注： 次文件在最初产品设计时用于展示企业列表时使用。现只展示企业详情不展示企业列表。后续可能继续开发企业列表展示功能，请不要贸然删除。
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EnterpriseDetail from './EnterpriseDetail';
import EnterpriseEdit from './EnterpriseEdit';


class EnterpriseSide extends Component {
  static propTypes = {
    showDetail: PropTypes.bool,
    changeEnterpriseStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }


  render(){
    const { showDetail, changeEnterpriseStore } = this.props;
    return (
      <div className={styles.enterpriseSide}>
        {
          showDetail ?
          <EnterpriseDetail changeEnterpriseStore={changeEnterpriseStore} />:
          <EnterpriseEdit changeEnterpriseStore={changeEnterpriseStore} />
        }
      </div>
    )
  }
}

export default EnterpriseSide;
