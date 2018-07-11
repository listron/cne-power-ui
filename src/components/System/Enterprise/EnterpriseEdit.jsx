

import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import EditEnterprise from './EditEnterprise';


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
          <div>
            <span>新建</span>
            <Button type="primary" onClick={()=>changeEnterpriseAttr({showPage:'list'})}>返回主页面！！！！！</Button>
          </div>
          <div>
            <div>图片上传组件</div>
            <EditEnterprise />
          </div>
          这个是新增啊编辑啊的页面，是吧！！
          
          <Button type="primary" onClick={()=>changeEnterpriseAttr({showPage:'detail'})}>拒绝返回，我要去看详情@</Button>
      </div>
    )
  }
}

export default EnterpriseEdit;
