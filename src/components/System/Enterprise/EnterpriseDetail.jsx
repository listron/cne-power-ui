

import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
import { Link } from 'react-router-dom';

class EnterpriseDetail extends Component {
  static propTypes = {
    changeEnterpriseStore: PropTypes.func,
    ignoreEnterpirseEdit: PropTypes.func,
    enterpriseDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state ={
      showInforTip: true
    }
  }
  ignoreEdit = () => {
    this.props.ignoreEnterpirseEdit({id:'1122'});
    this.setState({
      showInforTip: false
    })
  }

  render(){
    const { changeEnterpriseStore, enterpriseDetail } = this.props;
    //todo: 首次进入企业，提示点击编辑的小提示框的enterpriseDetail.showTips判断
    const { showInforTip } = this.state;
    return (
      <div className={styles.enterpriseDetail}>
        <div className={styles.detailTop}>
          <Button className={styles.editButton} onClick={()=>changeEnterpriseStore({showPage:'edit'})}>编辑</Button>
          {showInforTip && <span className={styles.infoTip} >
            <span className={styles.toEdit} onClick={()=>changeEnterpriseStore({showPage:'edit'})} >完善企业信息,请点击编辑</span>
            <span className={styles.ignore} onClick={this.ignoreEdit}>不再提醒 <Icon type="close" /></span>
          </span>}
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

export default EnterpriseDetail ;
