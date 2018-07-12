

import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import { Link } from 'react-router-dom';

class EnterpriseDetail extends Component {
  static propTypes = {
    changeEnterpriseAttr: PropTypes.func,
    getEnterpriseDetail: PropTypes.func,
    enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.props.getEnterpriseDetail()
  }

  render(){
    const { changeEnterpriseAttr, enterpriseDetail } = this.props;
    return (
      <div className={styles.enterpriseDetail}>
        <div className={styles.topHandler}>
          <Button className={styles.editButton} onClick={()=>changeEnterpriseAttr({showPage:'edit'})}>编辑</Button>
        </div>
        <div className={styles.enterpriseName}>
          <span className={styles.text}>{enterpriseDetail.enterpriseIdName}</span>
        </div>
        <div className={styles.enterpriseInfor} >
          <div className={styles.logoPart}>
            <img src={enterpriseDetail.enterpriseLogo} />
            <div className={styles.user}><span>创建者</span>{enterpriseDetail.createUser}</div>
            <div className={styles.time}><span>创建时间</span>{enterpriseDetail.createtime}</div>
          </div>
          <div className={styles.textInfor}>
            <div className={styles.buttonGroup}>
              <Button><Link to="/system/department">查看部门</Link></Button>
              <Button><Link to="/system/user">查看成员</Link></Button>
              <Button><Link to="/system/role">查看角色</Link></Button>
            </div>
            <div>
              <span className={styles.promptTitle}>电话</span>{enterpriseDetail.enterpriseNum} 
            </div>
            <div>
              <span className={styles.promptTitle}>网址</span>{enterpriseDetail.enterpriseWebsite}
            </div>
            <div>
              <span className={styles.promptTitle}>地址</span>{enterpriseDetail.enterpriseAddress}
            </div>
            <div>
              <span className={styles.promptTitle}>简介</span>{enterpriseDetail.enterpriseProfile}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EnterpriseDetail;
