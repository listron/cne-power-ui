import React, { Component } from 'react';
import { Popover, Checkbox } from 'antd';
import styles from './baseinfo.scss';
import PropTypes from 'prop-types';
import CneButton from '@components/Common/Power/CneButton';

export default class ResponsorCheck extends Component {

  static propTypes = {
    usernameList: PropTypes.array,
    selelctedUser: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      addVisible: false,
      checkedUserList: [],
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
    const { checkedUserList } = this.state;
    if (checkedUserList) {
      const changeObj = checkedUserList.map(e => {
        const [userId, userName] = e.split('_');
        return { userName, userId };
      });
      this.props.selelctedUser(changeObj);
    }
    this.setState({ addVisible: false, checkedUserList: [] });
  }


  render() {
    const { addVisible, checkedUserList } = this.state;
    const { disabled } = this.props;
    // const { usernameList } = this.props;
    const usernameList = [{
      'userName': '梁朝伟tony',
      'userId': 383284278591669,
    },
    {
      'userName': '梁朝伟tonyhong',
      'userId': 383285067120644,
    },
    {
      'userName': '张惠妹',
      'userId': 389099177848849,
    },
    {
      'userName': '张惠妹本妹',
      'userId': 389102063529984,
    },
    {
      'userName': '刘德华',
      'userId': 338690714173454,
    },
    {
      'userName': '柴再平',
      'userId': 328574567145472,
    },
    {
      'userName': '管理员c',
      'userId': 316696170602496,
    },
    {
      'userName': 'default',
      'userId': 323943291166720,
    },
    {
      'userName': '费灿灿',
      'userId': 329267038347264,
    },
    {
      'userName': 'hanqk',
      'userId': 388028745330688,
    },
    {
      'userName': '侯强',
      'userId': 324224850599938,
    },
    {
      'userName': 'huangb',
      'userId': 383294307172367,
    }];
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
                        <div className={styles.operatorItem} key={cur.userId}>
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
      </React.Fragment>
    );
  }
}
