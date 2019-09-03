import React from 'react';
import styles from './contactAgreement.scss';
import { Link } from 'react-router-dom';


const agreementHTML = "<div>  <h4 style=\" color:#666666; font-size:18px;margin-bottom:20px;height:27px;line-height:27px; text-align: center;font-family:MicrosoftYaHei; \">联系我们</h4><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666; font-size:14px;line-height:28px; \">联系我们</span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666;line-height:28px; font-size:14px\">售前：</span><span style=\" color:#666; font-size:14px\">010-88317707</span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666;line-height:28px; font-size:14px\">售后：</span><a style=\" color:#666;color:#000000\" href=\"mailto:support@cnecloud.com\"><span style=\" color:#666; font-size:14px; text-decoration:underline\">support@cnecloud.com</span></a></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify;display:flex; widows:0\"><span style=\" color:#666;line-height:28px;margin-right:44px; font-size:14px\">微信公众号：</span><span style=\" color:#666;ba font-size:14px\"><img src=\"/img/agreement2.png\" width=\"160\" height=\"210\" alt=\"\" /> </span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666; font-size:14px\">&nbsp;</span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666; font-size:14px; font-weight:bold\">关于</span><span style=\" color:#666; font-size:14px; font-weight:bold\">POWER+</span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666; font-size:14px\">POWER+</span><span style=\" color:#666; font-size:14px\">人工智能监控运维分析系统是针对目前新能源光伏和风机电站所遇到电站日常运维难、维修巡检不及时、人力和沟通成本高等痛点，结合集团自身多年的新能源电站生产管理和运维经验，运用物联网</span><span style=\" color:#666; font-size:14px\">IOT</span><span style=\" color:#666; font-size:14px\">、数据边缘计算和网络通讯传输技术、大数据平台数据汇聚、清洗和海量数据存储、机器学习算法、数据可视化、智能语音等多种互联网技术，通过与传统的新能源行业专业业务知识以及流程管理相结合，创造性地整合创建出的一套智能电子化监控和管理系统。</span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666; font-size:14px\">&nbsp;</span></p><p style=\" color:#666;margin:0pt; orphans:0; text-align:justify; widows:0\"><span style=\" color:#666; font-size:14px\">&nbsp;</span></p></div>";

function Contact() {
  return (
    <div className={styles.loginLayout}>
      <div className={styles.right}>
        <div className={styles.rightContent}>
          <div className={styles.contactAgreement}>
            <div className={styles.innerContent}>

              <div className={styles.content} dangerouslySetInnerHTML={{ __html: agreementHTML }}></div>
              <Link to="/login" className={styles.goBackLogin}>返回登录页面</Link>
              <div className={styles.footerTitle}>
                京ICP备12030847号-2 © 2017-2019 北京动力协合科技有限公司        
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;



