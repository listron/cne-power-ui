

import React, { Component } from '../../../../../node_modules/_@types_react@16.4.7@@types/react';
import { Button } from '../../../../../node_modules/_antd@3.8.0@antd';
import PropTypes from 'C:/Users/admin/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/prop-types';
import styles from './enterprise.scss';
import { Link } from 'C:/Users/admin/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/react-router-dom';
import moment from '../../../../../node_modules/_moment@2.22.2@moment';

class EnterpriseDetail extends Component {
  static propTypes = {
    changeEnterpriseStore: PropTypes.func,
    ignoreEnterpirseEdit: PropTypes.func,
    enterpriseDetail: PropTypes.object,
    history: PropTypes.object
  }

  constructor(props){
    super(props);
    this.state ={
      showInforTip: false
    }
  }
  // ignoreEdit = () => {//
  //   this.props.ignoreEnterpirseEdit({id:'1122'});
  //   this.setState({
  //     showInforTip: false
  //   })
  // }
  componentWillReceiveProps(nextProps){//获取到详情数据后当详情存在且logo不存在时提示完善企业信息
    const { enterpriseDetail } = nextProps;
    if(Object.keys(enterpriseDetail).length > 0 && !enterpriseDetail.enterpriseLogo){
      this.setState({
        showInforTip: true
      })
    }
  }

  render(){
    const { changeEnterpriseStore, enterpriseDetail } = this.props;
    const { showInforTip } = this.state;
    return (
      <div className={styles.enterpriseDetail}>
        <div className={styles.detailTop}>
          <Button className={styles.editButton} onClick={()=>changeEnterpriseStore({showPage:'edit'})}>编辑</Button>
          {showInforTip && <span className={styles.infoTip} >
            <span className={styles.toEdit} >请编辑完善企业信息!</span>
            {/* <span className={styles.ignore} onClick={this.ignoreEdit}>不再提醒 <Icon type="close" /></span> */}
          </span>}
        </div>
        <div className={styles.enterpriseName}>
          <span className={styles.text}>{enterpriseDetail.enterpriseName}</span>
        </div>
        <div className={styles.enterpriseInfor} >
          <div className={styles.logoPart}>
            <img src={enterpriseDetail.enterpriseLogo} />
            <div className={styles.user}>
              <span>创建者</span>
              {enterpriseDetail.createUser || ' -- ' }
            </div>
            <div className={styles.time}>
              <span>创建时间</span>
              {moment(enterpriseDetail.createTime) ? moment(enterpriseDetail.createTime).format('YYYY年MM月DD日'): '--'}
            </div>
          </div>
          <div className={styles.textInfo}>
            <div className={styles.buttonGroup}>
              <Button><Link to="/system/department">查看部门</Link></Button>
              <Button><Link to="/system/user">查看成员</Link></Button>
              <Button><Link to="/system/role">查看角色</Link></Button>
            </div>
            <div>
              <span className={styles.promptTitle}>用户名</span>
              {enterpriseDetail.username || ' -- ' } 
            </div>
            <div>
              <span className={styles.promptTitle}>注册手机</span>
              {enterpriseDetail.createPhone || ' -- ' } 
            </div>
            <div>
              <span className={styles.promptTitle}>企业域名</span>
              {enterpriseDetail.enterpriseDomain || ' -- ' } 
            </div>
            <div>
              <span className={styles.promptTitle}>企业电话</span>
              {enterpriseDetail.enterpriseNum || ' -- ' } 
            </div>
            <div>
              <span className={styles.promptTitle}>网址</span>
              {enterpriseDetail.enterpriseWebsite || ' -- ' }
            </div>
            <div>
              <span className={styles.promptTitle}>地址</span>
              {enterpriseDetail.enterpriseAddress || ' -- ' }
            </div>
            <div>
              <span className={styles.promptTitle}>简介</span>
              {enterpriseDetail.enterpriseProfile || ' -- ' }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EnterpriseDetail ;
