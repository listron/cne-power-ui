




import React, { Component } from 'react';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';


class EditForm extends Component {
  static propTypes = {
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.enterpriseEdit} >
          <div>企业名称： 
            <Input />
          </div>
          <div>企业电话： 
            <Input />
          </div>
          <div>域名设置： 
            <Input />
          </div>
          <div>网址： 
            <Input />
          </div>
          <div>地址： 
            <Input />
          </div>
          <div>简介： 
            <Input />
          </div>
      </div>
    )
  }
}

export default EditForm;
