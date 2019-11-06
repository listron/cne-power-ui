
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Input } from 'antd';
import styles from './listSearch.scss';

const { Option } = Select;

class ContentSearch extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    inspectUserList: PropTypes.array,
    changeStore: PropTypes.func,
    getWorkPlanList: PropTypes.func,
  };

  state = {
    content: '',
    // user: '',
    userId: null,
  }

  contentChange = ({ target = {} }) => {
    this.setState({ content: target.value });
  }

  userChange = (userId) => {
    // this.setState({ user });
    this.setState({ userId });
  }

  toSearch = () => { // 执行搜索
    const { content, userId } = this.state;
    this.planListQuery({ // 重置
      planContent: content,
      createUser: userId,
    });
  }

  toReset = () => {
    this.setState({ content: '', userId: null });
    this.planListQuery({ // 重置
      planContent: '',
      createUser: '',
    });
  };

  planListQuery = (values) => {
    const { planParams, planListPageParams } = this.props;
    const newPlanParams = {
      ...planParams,
      ...values,
    };
    const newPageParams = {
      ...planListPageParams,
      pageNum: 1,
      pageSize: 10,
    };
    this.props.changeStore({ // 修改参数
      planParams: newPlanParams,
      planListPageParams: newPageParams,
    });
    this.props.getWorkPlanList({ // 请求列表
      ...newPlanParams,
      ...newPageParams,
    });
  }

  render(){
    const { content, userId } = this.state;
    const { inspectUserList, planParams, theme } = this.props;
    const { planContent, createUser } = planParams;
    return (
      <div className={`${styles.contentSearch} ${styles[theme]}`}>
        <span className={styles.searchText}>内容</span>
        <Input
          value={content}
          onChange={this.contentChange}
          style={{ width: '360px', marginRight: '40px' }}
          placeholder="请输入..."
        />
        <span className={styles.searchText}>制定人</span>
        <span ref={(ref) => { this.userRef = ref; }} />
        <Select
          style={{ width: '160px', marginRight: '12px' }}
          placeholder="请输入..."
          value={userId}
          onChange={this.userChange}
          getPopupContainer={() => this.userRef}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {/* {inspectUserList.map(e => (
            <Option key={e} value={e}>{e}</Option>
          ))} */}
          {inspectUserList.map(e => {
            const { username, userFullname } = e || {};
            // 同时存在两个名字以 里昂(liang) 方式展示, 否则展示存在项;
            const userText = (username && userFullname) ? `${userFullname}(${username})` : (username || userFullname);
            return <Option key={`${e.userId}`} value={`${e.userId}`}>{userText}</Option>;
          })}
        </Select>
        <Button onClick={this.toSearch} className={styles.search}>查询</Button>
        {(planContent || createUser) && <span onClick={this.toReset} className={styles.reset}>重置</span>}
      </div>
    );
  }
}

export default ContentSearch;
