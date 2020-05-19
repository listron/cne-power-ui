

import React, { Component } from 'react';
// import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';
// import { Link } from 'react-router-dom';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';

class EnterpriseDetail extends Component {
  static propTypes = {
    changeEnterpriseStore: PropTypes.func,
    ignoreEnterpirseEdit: PropTypes.func,
    enterpriseDetail: PropTypes.object,
    history: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      showInforTip: false
    }
  }
  // ignoreEdit = () => {//
  //   this.props.ignoreEnterpirseEdit({id:'1122'});
  //   this.setState({
  //     showInforTip: false
  //   })
  // }
  componentWillReceiveProps(nextProps) {//获取到详情数据后当详情存在且logo不存在时提示完善企业信息
    const { enterpriseDetail } = nextProps;
    if (Object.keys(enterpriseDetail).length > 0 && !enterpriseDetail.enterpriseLogo && !enterpriseDetail.enterpriseNum && !enterpriseDetail.enterpriseAddress && !enterpriseDetail.enterpriseProfile) {
      this.setState({
        showInforTip: true
      })
    }
  }

  render() {
    const { changeEnterpriseStore, enterpriseDetail } = this.props;
    const { showInforTip } = this.state;
    const defaultLogo = '/img/nopic.png';
    const rightHandler = localStorage.getItem('rightHandler');
    const enterpriseUpdateRight = rightHandler && rightHandler.split(',').includes('account_enterprise_update');
    return (
      <div className={styles.enterpriseDetail}>
        <div className={styles.detailTop}>
          {enterpriseUpdateRight && <CneButton onClick={() => changeEnterpriseStore({ showPage: 'edit' })} lengthMode="short">编辑</CneButton>}
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
            <img src={enterpriseDetail.enterpriseLogo || defaultLogo} width="240px" height="240px" />
            {/* <div className={styles.user}>
              <span>创建者</span>
              {enterpriseDetail.createUser || ' -- ' }
            </div> */}
            <div className={styles.time}>
              <span>创建时间</span>
              {moment(enterpriseDetail.createTime) ? moment(enterpriseDetail.createTime).format('YYYY年MM月DD日') : '--'}
            </div>
          </div>
          <div className={styles.textInfo}>
            {/* <div className={styles.buttonGroup}>
              <Button>
                <Link to="/system/account/department" target="_blank" ><i className="iconfont icon-department" />查看部门</Link>
              </Button>
              <Button>
                <Link to="/system/account/user" target="_blank"><i className="iconfont icon-member" />查看成员</Link>
              </Button>
              <Button>
                <Link to="/system/account/role" target="_blank"><i className="iconfont icon-role" />查看角色</Link>
              </Button>
            </div> */}
            <div>
              <span className={styles.promptTitle}>用户名</span>
              {enterpriseDetail.createUser || ' -- '}
            </div>
            <div>
              <span className={styles.promptTitle}>注册手机</span>
              {enterpriseDetail.phoneNum || ' -- '}
            </div>
            <div>
              <span className={styles.promptTitle}>企业域名</span>
              {enterpriseDetail.enterpriseDomain || ' -- '}
            </div>
            <div>
              <span className={styles.promptTitle}>企业电话</span>
              {enterpriseDetail.enterpriseNum || ' -- '}
            </div>
            <div>
              <span className={styles.promptTitle}>网址</span>
              {enterpriseDetail.enterpriseWebsite || ' -- '}
            </div>
            <div>
              <span className={styles.promptTitle}>地址</span>
              {enterpriseDetail.enterpriseAddress || ' -- '}
            </div>
            <div>
              <span className={styles.promptTitle}>简介</span>
              {enterpriseDetail.enterpriseProfile || ' -- '}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EnterpriseDetail;
