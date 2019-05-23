import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import moment from 'moment';
import styles from './intelligentExpert.scss';

class ShowIntelligent extends Component {
  static propTypes = {
    getIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    onShowSideChange: PropTypes.func, 
    getLike: PropTypes.func,
    intelligentDetail: PropTypes.object, 
    knowledgeBaseId: PropTypes.string, 
    listParams: PropTypes.object,
  }

  onWarningTipShow = () => { 
   const { getIntelligentExpertStore, getIntelligentTable, listParams } = this.props;
    getIntelligentExpertStore({
      showPage: 'list',
    });
    getIntelligentTable(listParams)
  }
  
  likeBtn = () => { // 点赞
    const { getLike, knowledgeBaseId } = this.props;
    getLike({
      knowledgeBaseId,
    })
  }

  editBtn = () => { // 编辑按钮
    const { getIntelligentExpertStore, onShowSideChange } = this.props;
    getIntelligentExpertStore({
      showPage: 'edit',
    });
    onShowSideChange('edit'); // 跳转到编辑页面
  }

  render(){
    const { intelligentDetail = {} } = this.props;
    let { deviceTypeName, faultName, faultDescription, checkItems, processingMethod, requiredTools, remark, recorder, updateTime, likeCount } = intelligentDetail
    return (
      <div className={styles.showIntelligent}>
        <div className={styles.titleTop}>
          <Button onClick={this.editBtn} className={styles.editBtn}>编辑</Button>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.detailContent}> 
          <div className={styles.detailText}>
            <span className={styles.title}>设备类型</span>
            <span>{deviceTypeName || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>缺陷类型</span>
            <span>{faultName || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>缺陷描述</span>
            <span>{faultDescription || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>检查项目</span>
            <span>{checkItems || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>处理方法</span>
            <span>{processingMethod || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>所需工具</span>
            <span>{requiredTools || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>备注</span>
            <span>{remark || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>录入人</span>
            <span>{recorder || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>更新时间</span>
            <span>{moment(updateTime).format('YYYY-MM-DD') || '无'}</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.title}>点赞数：</span>
            <span>{likeCount || '无'}</span>
          </div>
          <Button className={styles.likeBtn} onClick={this.likeBtn}>点赞<Icon type="like" /></Button>
        </div>
      </div>
    )
  }
}

export default ShowIntelligent;