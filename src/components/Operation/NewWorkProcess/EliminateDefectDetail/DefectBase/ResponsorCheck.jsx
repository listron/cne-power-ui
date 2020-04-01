import React, { Component } from 'react';
import { Popover, Checkbox } from 'antd';
import styles from './baseinfo.scss';
import PropTypes from 'prop-types';
import CneButton from '@components/Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';

export default class ResponsorCheck extends Component {

  static propTypes = {
    usernameList: PropTypes.array,
    selelctedUser: PropTypes.func,
    disabled: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      addVisible: false,
      checkedUserList: [],
      showTip: false,
      tipText: '添加后不可删除，确认添加。',
    };
  }

  handleVisibleChange = () => {
    this.setState({ addVisible: true });
  }

  cancelAdd = () => {
    this.setState({ addVisible: false });
  }

  addUsername = (value) => {
    this.setState({ checkedUserList: value });
  }

  confirm = () => {
    this.setState({ showTip: true });
  }

  onConfirmTip = () => { // 提示框的提示
    const { checkedUserList } = this.state;
    if (checkedUserList) {
      const changeObj = checkedUserList.map(e => {
        const [userId, userName] = e.split('_');
        return { userName, userId };
      });
      this.props.selelctedUser(changeObj);
    }
    this.setState({ addVisible: false, showTip: false, checkedUserList: [] });
  }



  render() {
    const { addVisible, checkedUserList, showTip, tipText } = this.state;
    const { disabled, usernameList } = this.props;
    return (
      <React.Fragment>
        <span ref={(ref) => { this.userRef = ref; }} />
        <Popover
          placement="rightTop"
          visible={addVisible}
          onVisibleChange={this.handleVisibleChange}
          overlayClassName={styles.operatorWrap}
          getPopupContainer={() => this.userRef}
          content={(
            <div className={styles.operatorCenter}>
              <div className={styles.operatorList}>
                <Checkbox.Group
                  value={checkedUserList}
                  onChange={this.addUsername}
                  className={styles.checkboxGroup}
                >
                  {usernameList.map((cur, index) => {
                    return (
                      <div className={styles.operatorItemBox}>
                        <div className={styles.operatorItem} key={cur.userId} title={cur.userName}>
                          <Checkbox value={`${cur.userId}_${cur.userName}`}>{cur.userName}</Checkbox>
                        </div>
                      </div>
                    );
                  })}
                </Checkbox.Group>

              </div>
              <div className={styles.operatorBtn}>
                <div className={styles.cancelBtn} onClick={this.cancelAdd}>取消</div>
                <CneButton onClick={this.confirm} >确定</CneButton>
              </div>
            </div>
          )} trigger="hover">
          <i className={`iconfont icon-addman ${disabled && styles.disabled}`} />
        </Popover>
        <CneTips
          visible={showTip}
          width={260}
          onCancel={() => this.setState({ showTip: false })}
          onConfirm={this.onConfirmTip}
          confirmText={'确认'}
          tipText={tipText}
        />
      </React.Fragment>
    );
  }
}
