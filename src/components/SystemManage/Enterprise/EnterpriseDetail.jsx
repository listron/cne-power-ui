

import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';


class EnterpriseDetail extends Component {
  static propTypes = {
    handleChangePages: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { handleChangePages } = this.props;
    return (
      <div className={styles.enterpriseDetail}>
          <span>这个是表示符</span>
          <span>现在你在详情页，开心嘛？</span>
          <Button type={'primary'} onClick={()=>handleChangePages({showPage:'list'})}>返回主页面</Button>
      </div>
    )
  }
}

export default EnterpriseDetail;
