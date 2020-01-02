import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, message } from 'antd';
import moment from 'moment';
import styles from './intelligentExpert.scss';
import path from '../../../constants/path';
import { handleRight } from '@utils/utilFunc';

class ShowIntelligent extends Component {
  static propTypes = {
    changeIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    getLike: PropTypes.func,
    intelligentDetail: PropTypes.object,
    listParams: PropTypes.object,
    downLoadFile: PropTypes.func,
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.scroll(0, 0);
  }

  componentWillUnmount() {
    this.props.changeIntelligentExpertStore({});
  }


  onWarningTipShow = () => {
    const { changeIntelligentExpertStore, getIntelligentTable, listParams } = this.props;
    changeIntelligentExpertStore({
      showPage: 'list',
    });
    getIntelligentTable(listParams);
  }

  likeBtn = () => { // 点赞
    const { getLike, intelligentDetail } = this.props;
    getLike({ knowledgeBaseId: intelligentDetail.knowledgeBaseId });
  }

  editBtn = () => { // 编辑按钮
    const { changeIntelligentExpertStore } = this.props;
    changeIntelligentExpertStore({ showPage: 'edit' });
  }

  changeAnnexsform = (annexs = []) => {
    const test = annexs.map(e => {
      const arr = e.split('/');
      return {
        url: `${e}`,
        urlName: arr[arr.length - 1],
      };
    });
    return test;
  };

  downFile = (file, fileName) => {
    const { downLoadFile } = this.props;
    const downloadTemplet = `${path.basePaths.APIBasePath}${path.APISubPaths.operation.downloadFile}`; // 下载文件
    downLoadFile({
      url: downloadTemplet,
      method: 'post',
      params: { filePath: file },
      fileName: fileName,
      defineOriginName: true,
    });
  }

  render() {
    const { intelligentDetail = {} } = this.props;
    const editRight = handleRight('operation_experience_edit');
    const href = this.changeAnnexsform(intelligentDetail.annexs).map(e => <div className={styles.link} onClick={() => this.downFile(e.url, e.urlName)}>{e.urlName}</div>);
    return (
      <div className={styles.showIntelligent}>
        <div className={styles.titleTop}>
          <span className={styles.text}>查看解决方案</span>
          <div>
            {editRight && <Button onClick={this.editBtn} className={styles.editBtn}>编辑</Button>}
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
          </div>
        </div>
        <div className={styles.detailContent}>
          <div className={styles.detailText}>
            <div className={styles.title}>
              <span className={styles.name}>设备类型</span><span className={styles.required}>*</span> </div>
            <div>{intelligentDetail.deviceTypeName || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}>
              <span className={styles.name}>设备型号</span>{`${intelligentDetail.type}` === '0' && <span className={styles.required}>*</span>}
            </div>
            <div>{intelligentDetail.modeName || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}>
              <span className={styles.name}>缺陷类型</span>
              <span className={styles.required}>*</span></div>
            <div>{intelligentDetail.faultName || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}>
              <span className={styles.name}>故障代码</span>
              {`${intelligentDetail.type}` === '0' && <span className={styles.required}>*</span>}
            </div>
            <div>{intelligentDetail.faultCode || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}>
              <span className={styles.name}>故障描述</span><span className={styles.required}>*</span></div>
            <div>{intelligentDetail.faultDescription || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}> <span className={styles.name}>故障原因</span>
              {`${intelligentDetail.type}` === '0' && <span className={styles.required}>*</span>}</div>
            <div>{intelligentDetail.checkItems || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}> <span className={styles.name}>处理方法</span><span className={styles.required}>*</span></div>
            <div>{intelligentDetail.processingMethod || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}><span className={styles.name}>所需工具</span></div>
            <div>{intelligentDetail.requiredTools || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}><span className={styles.name}>备注</span></div>
            <div>{intelligentDetail.remark || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}><span className={styles.name}>附件</span></div>
            <div>{href.length > 0 ? href : '无'}</div>

          </div>
          <div className={styles.detailText}>
            <div className={styles.title}><span className={styles.name}>录入人</span></div>
            <div>{intelligentDetail.recorder || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}><span className={styles.name}>更新时间</span></div>
            <div>{moment(intelligentDetail.updateTime).format('YYYY-MM-DD HH:mm:ss') || '无'}</div>
          </div>
          <div className={styles.detailText}>
            <div className={styles.title}><span className={styles.name}>点赞数</span></div>
            <div>{intelligentDetail.likeCount || 0}</div>
          </div>
          <div className={styles.detailText}>
            {intelligentDetail.liked === 0 &&
              <Button className={styles.likeBtn} onClick={this.likeBtn} type="primary">点赞<Icon type="like" /></Button> ||
              <Button className={styles.likedBtn} disabled>已点赞</Button>}
          </div>
        </div>
      </div>
    );
  }
}

export default ShowIntelligent;
