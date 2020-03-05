import React, { Component } from 'react';
import {Popover, Checkbox} from 'antd';
import styles from './baseinfo.scss';

export default class ResponsorCheck extends Component {

  static propTypes = {

  };

  handleVisibleChange = () => {
    console.log('handleVisibleChange');
  }

  cancelAdd = () => {
    console.log('cancelAdd');
  }

  addUsername = () => {
    console.log('addUsername');
  }

  render() {
    const checkedUserList = [];
    const usernameList = [];
    const addVisible = false;
    return (
      <Popover
        placement="rightTop"
        visible={addVisible}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName={styles.operatorWrap}
        content={(
          <div className={styles.operatorCenter}>
            <div className={styles.operatorList}>
              <Checkbox.Group
                style={{width: '100%'}}
                value={checkedUserList}
                onChange={this.onChange}
              >
                {usernameList.map((cur, index) => {
                  return (
                    <div className={styles.operatorItemBox} key={index.toString()}>
                      {cur.map(item => {
                        return (
                          <div className={styles.operatorItem} key={item.userId}>
                            <Checkbox value={item.userId}>{item.userName}</Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </Checkbox.Group>
            </div>
            <div className={styles.operatorBtn}>
              <div className={styles.cancelBtn} onClick={this.cancelAdd}>取消</div>
              <div className={`${styles.btnGreen} ${styles.am} ${styles.amGreenScale}`} onClick={this.addUsername}>
                <span>确定</span>
              </div>
            </div>
          </div>
        )} trigger="hover">
        <i className="iconfont icon-addman" />
      </Popover>
    );
  }
}
