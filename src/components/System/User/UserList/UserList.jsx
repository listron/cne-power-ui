import React, { Component } from "react";
import {
  Table,
  Button,
  Select,
  Icon,
  Radio,
  Popover,
  Menu,
  Dropdown,
  Checkbox,
  Input
} from "antd";
import CommonPagination from "../../../Common/CommonPagination";
import PropTypes from "prop-types";
import styles from "./userList.scss";
import UserSearch from "./UserSearch";

const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class UserList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    totalNum: PropTypes.number,
    userData: PropTypes.object,
    selectedUser: PropTypes.object, //勾选的数组
    getUserList: PropTypes.func,
    getUserDetail: PropTypes.func,
    changeUserAttr: PropTypes.func,
    onChangeSort: PropTypes.func, //排序
    onChangePageSize: PropTypes.func,
    onChangePage: PropTypes.func,
    roleData: PropTypes.object,
    userStatus: PropTypes.number,
    userName: PropTypes.string,
    userPhone: PropTypes.string,
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    onChangeStatus: PropTypes.func,
    onUserSearch: PropTypes.func,
    onShowSideChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: []
    };
  }
  // onCheckboxChange = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  //   console.log(e.target);
  //   if(e.target.checked){
  //     this.state.selectedRoles.push
  //     this.setState({
  //       // selectedRoles.filter
  //     })

  //   }
  // }

  getUserStaion = text => {
    switch (text) {
      case 0:
        return "全部";
      case 1:
        return "激活";
      case 2:
        return "未激活";
      case 3:
        return "启用";
      case 4:
        return "禁用";
      case 5:
        return "待审核";
      case 5:
        return "审核不通过";
      case 6:
        return "移除";
      default:
        return;
    }
  };

  showUserDetail = record => {
    const { userId } = record;
    this.props.changeUserAttr({
      showPage: "detail"
    });
    this.props.getUserDetail({
      userId
    });
  };
  tableChange = (pagination, filters, sorter) => {
    if (Object.keys(sorter).length !== 0) {
      let sortRules = "0,1";
      this.props.onChangeSort(sortRules);
    } else {
      this.props.onChangeSort("");
    }
  };

  tableColumn = () => {
    const columns = [
      {
        title: "用户名",
        dataIndex: "userName",
        key: "userName",
        render: (text, record, index) => (
          <a
            href={"javascript:void(0)"}
            onClick={() => this.showUserDetail(record)}
          >
            {text}
          </a>
        )
      },
      {
        title: "真实姓名",
        dataIndex: "trueName",
        key: "trueName",
        render: (text, record, index) => <span>{text}</span>
      },
      {
        title: "电话",
        dataIndex: "phoneNum",
        key: "phoneNum",
        render: (text, record) => <span>{text}</span>
      },
      {
        title: "角色",
        dataIndex: "roleName",
        key: "roleName",
        render: (text, record) => <span>{text}</span>,
        sorter: true
      },
      {
        title: "特殊权限",
        dataIndex: "spcialRoleName",
        key: "spcialRoleName",
        render: (text, record) => <span>{text}</span>,
        sorter: true
      },
      {
        title: "所在企业",
        dataIndex: "enterpriseId",
        key: "enterpriseId",
        render: (text, record) => <span>{text}</span>,
        sorter: true
      },
      {
        title: "负责电站",
        dataIndex: "stationName",
        key: "stationName",
        render: (text, record, index) => (
          <div>
            <span>{text.split(",")[0]}</span>
            <Popover
              content={text.split(",").map((item, i) => {
                return <p key={i}>{item}</p>;
              })}
              title={"负责电站"}
              placement="right"
              trigger="hover"
            >
              <Icon type="ellipsis" />
            </Popover>
          </div>
        )
      },
      {
        title: "状态",
        dataIndex: "userStation",
        key: "userStation",
        render: (text, record, index) => (
          <span>{this.getUserStaion(text)}</span>
        ),
        sorter: true
      }
    ];
    return columns;
  };

  cancelRowSelect = () => {
    this,
      this.setState({
        selectedRowKeys: []
      });
  };
  handleMenuClick = e => {
    // console.log(e);
    // console.log(e.target)
    // this.state.selectedRoles.push(e.target.value);
    // this.setState({ selectedRoles: this.state.selectedRoles})
  };

  render() {
    const { userData, totalNum, loading, currentPage, pageSize } = this.props;
    const { selectedRowKeys, selectedRoles } = this.state;
    console.log(selectedRoles);
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      }
    };
    const pagination = {
      defaultCurrent: 1,
      position: "top",
      total: totalNum,
      showSizeChanger: true,
      current: currentPage,
      pageSize: pageSize,
      onShowSizeChange: (current, pageSize) => {
        this.props.onChangePageSize(pageSize);
      },
      onChange: current => {
        this.props.onChangePage(current);
      }
    };

    return (
      <div className={styles.userList}>
        <UserSearch {...this.props} />
        <Table
          loading={loading}
          rowSelection={rowSelection}
          dataSource={userData.toJS().map((e, i) => ({ ...e, key: i }))}
          columns={this.tableColumn()}
          onChange={this.tableChange}
          pagination={pagination}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>
            当前选中<span className={styles.totalNum}>
              {selectedRowKeys.length}
            </span>项
          </span>
          <a
            className={styles.cancel}
            href="javascript:void(0)"
            onClick={this.cancelRowSelect}
          >
            取消选择
          </a>
        </div>
      </div>
    );
  }
}

export default UserList;
