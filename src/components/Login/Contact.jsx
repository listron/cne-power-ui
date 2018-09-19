import React from 'react';
import styles from './contactAgreement.scss';
import { Link } from 'react-router-dom';


const agreementHTML = "<div><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt; font-weight:bold\">联系我们</span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">售前：</span><span style=\" color:#999999; font-size:12pt\">010-88317707</span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">售后：</span><a style=\" color:#999999;color:#000000\" href=\"mailto:support@cnecloud.com\"><span style=\" color:#999999; font-size:12pt; text-decoration:underline\">support@cnecloud.com</span></a></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">微信公众号：</span><span style=\" color:#999999; font-size:12pt\"> </span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><img src=\"/img/agreement.png\" width=\"276\" height=\"361\" alt=\"\" /></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">&nbsp;</span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt; font-weight:bold\">关于</span><span style=\" color:#999999; font-size:12pt; font-weight:bold\">POWER+</span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">POWER+</span><span style=\" color:#999999; font-size:12pt\">人工智能监控运维分析系统是针对目前新能源光伏和风机电站所遇到电站日常运维难、维修巡检不及时、人力和沟通成本高等痛点，结合集团自身多年的新能源电站生产管理和运维经验，运用物联网</span><span style=\" color:#999999; font-size:12pt\">IOT</span><span style=\" color:#999999; font-size:12pt\">、数据边缘计算和网络通讯传输技术、大数据平台数据汇聚、清洗和海量数据存储、机器学习算法、数据可视化、智能语音等多种互联网技术，通过与传统的新能源行业专业业务知识以及流程管理相结合，创造性地整合创建出的一套智能电子化监控和管理系统。</span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">&nbsp;</span></p><p style=\" color:#999999;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#999999; font-size:12pt\">&nbsp;</span></p></div>";

function Contact(){
  return (
    <div className={styles.loginLayout}>
      <div className={styles.left}>
        <div className={styles.logoImg}>
          <div className={styles.loginImg}>
            <div className={styles.logo}>
              <div className={styles.pic}><img src={require('../../../assets/img/logo_power.png')} alt="" /></div>
              <h3>智慧能源运维平台</h3>
            </div>
            <img className={styles.bgPic} src={require('../../../assets/img/bg_01.png')} />
            <span className={styles.comRegisterInfo}>京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司</span>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.rightContent}>
          <div className={styles.contactAgreement}>
            <div className={styles.innerContent}>
              <Link to="/login" >返回登录页面</Link>
              <h4 className={styles.contentTitle}>联系我们</h4>
              <div className={styles.content} dangerouslySetInnerHTML={{ __html:agreementHTML }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;

  

