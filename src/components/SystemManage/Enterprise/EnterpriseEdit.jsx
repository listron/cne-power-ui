

import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';


class EnterpriseEdit extends Component {
  static propTypes = {
    changeEnterpriseAttr: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { changeEnterpriseAttr } = this.props;
    return (
      <div className={styles.enterpriseEdit} >
          这个是新增啊编辑啊的页面，是吧！！
          <Button type={'primary'} onClick={()=>changeEnterpriseAttr({showPage:'list'})}>返回主页面！！！！！</Button>
          <Button type={'primary'} onClick={()=>changeEnterpriseAttr({showPage:'detail'})}>拒绝返回，我要去看详情@</Button>
      </div>
    )
  }
}

export default EnterpriseEdit;
