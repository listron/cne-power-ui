import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Button } from 'antd';
import styles from './participantSearch.scss';

const { Option } = Select;

class ParticipantSearch extends Component {
  static propTypes = {
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

  handleParticipant = (users) => {
    this.setState({ users });
  }

  toSearch = () => {
    const { users } = this.state;
    this.props.onChange({ handleUserList: users });
  }

  render() {
    const { users } = this.state;
    const { participantList } = this.props;
    const tagInfo = users.length > 2 ? {
      maxTagCount: 0,
      maxTagPlaceholder: () => (
        <span>已选{users.length} / {participantList.length}</span>
      ),
    } : {};
    return (
      <div className={styles.participantSearch}>
        <span className={styles.participantTip}>参与人</span>
        <span ref={(ref) => { this.userRef = ref; }} />
        <Select
          mode="multiple"
          style={{ width: '240px' }}
          placeholder="请选择"
          onChange={this.handleParticipant}
          {...tagInfo}
          getPopupContainer={() => this.userRef}
        >
          {participantList.map(e => (
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
        <Button onClick={this.toSearch} className={styles.search}>查询</Button>
      </div>
    );
  }

}

export default ParticipantSearch;
