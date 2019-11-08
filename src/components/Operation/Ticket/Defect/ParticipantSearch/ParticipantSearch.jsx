import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Button } from 'antd';
import styles from './participantSearch.scss';

const { Option } = Select;

class ParticipantSearch extends Component {
  static propTypes = {
    tab: PropTypes.string,
    theme: PropTypes.string,
    participantList: PropTypes.array,
    onChange: PropTypes.func,
    handleUserList: PropTypes.array,
  }

  constructor(props){
    super(props);
    const { handleUserList } = props;
    this.state = {
      users: handleUserList.length > 0 ? handleUserList : [],
    };
  }

  componentWillReceiveProps(nextProps){
    const { tab } = nextProps;
    const preTab = this.props.tab;
    if (tab !== 'defect' && preTab === 'defect') { // tab切换 => 选中参与人重置
      this.setState({ users: [] });
    }
  }

  handleParticipant = (users) => {
    this.setState({ users });
  }

  toSearch = () => {
    const { users } = this.state;
    this.props.onChange({ handleUserList: users });
  }

  toReset = () => {
    this.setState({ users: [] });
    this.props.onChange({ handleUserList: [] });
  }

  render() {
    const { users } = this.state;
    const { participantList, handleUserList, theme } = this.props;
    const tagInfo = users.length > 1 ? {
      maxTagCount: 0,
      maxTagPlaceholder: () => (
        <span>已选{users.length} / {participantList.length}</span>
      ),
    } : {};
    return (
      <div className={`${styles.participantSearch} ${styles[theme]}`}>
        <span className={styles.participantTip}>参与人</span>
        <span ref={(ref) => { this.userRef = ref; }} />
        <Select
          mode="multiple"
          style={{ width: '240px' }}
          placeholder="请选择"
          value={users}
          onChange={this.handleParticipant}
          {...tagInfo}
          getPopupContainer={() => this.userRef}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          className={styles.searchSelect}
        >
          {/* {participantList.map(e => (
            <Option key={e} value={e}>{e}</Option>
          ))} */}
          {participantList.map(e => {
            const { username, userFullname } = e || {};
            const userText = (username && userFullname) ? `${userFullname}(${username})` : (username || userFullname);
            return <Option key={`${username}`} value={`${username}`}>{userText}</Option>;
          })}
        </Select>
        <Button onClick={this.toSearch} className={styles.search}>查询</Button>
        {handleUserList.length > 0 && <Button onClick={this.toReset} className={styles.search}>重置</Button>}
      </div>
    );
  }

}

export default ParticipantSearch;

// {/* <Select
//   style={{ width: '160px', marginRight: '12px' }}
//   placeholder="请输入..."
//   value={userId}
//   onChange={this.userChange}
//   getPopupContainer={() => this.userRef}
//   showSearch
//   optionFilterProp="children"
//   filterOption={(input, option) =>
//     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//   }
// >
//   {inspectUserList.map(e => {
//     const { username, userFullname } = e || {};
//     // 同时存在两个名字以 里昂(liang) 方式展示, 否则展示存在项;
//     const userText = (username && userFullname) ? `${userFullname}(${username})` : username;
//     return <Option key={`${username}`} value={`${username}`}>{userText}</Option>;
//   })}
// </Select> */}

