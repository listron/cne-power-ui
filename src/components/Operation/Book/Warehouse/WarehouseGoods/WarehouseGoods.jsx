import React, { Component } from "react";
import PropTypes from 'prop-types';
import {Button, Icon, Tree, Form, Row, Col, Input} from 'antd';
import CommonBreadcrumb from '../../../../../components/Common/CommonBreadcrumb';
import CommonPagination from "../../../../Common/CommonPagination";
import WarehouseGoodsTable from "./WarehouseGoodsTable/WarehouseGoodsTable";

import styles from "./warehouseGoods.scss";

const { TreeNode } = Tree;
const FormItem = Form.Item;
const Search = Input.Search;

class WarehouseGoods extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    getGoodsList:PropTypes.func,
    form: PropTypes.object,
    goodsData: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    goodsType: PropTypes.string,
    goodsName: PropTypes.string,
    getGoodsAddList: PropTypes.func,
    goodsAddLoading: PropTypes.bool,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      addFlag: false
    };
  }

  componentDidMount() {
    const { getGoodsList } = this.props;
    const params = {
      goodsType: "",
      goodsName: "",
      pageNum: 1,
      pageSize: 10,
      sortField: "",
      sortMethod: "",
    };
    getGoodsList(params);
  }

  onSelect = (selectedKeys) => {
    const { getGoodsList } = this.props;
    // 判断如果为空不发送请求
    if (selectedKeys.join("") !== "") {
      // 参数
      const params = {
        goodsType: selectedKeys.join("") === "100" ? "" : selectedKeys.join(""),
        goodsName: "",
        pageNum: 1,
        pageSize: 10,
        sortField: "",
        sortMethod: "",
      };
      getGoodsList(params);
    }
  };

  onAddFunc = () => {
    this.setState({
      addFlag: true
    })
  };

  // 分页
  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      getGoodsList,
      goodsType,
      goodsName,
      sortField,
      sortMethod,
    } = this.props;
    const params = {
      goodsType,
      goodsName,
      pageNum: currentPage,
      pageSize,
      sortField,
      sortMethod,
    };
    getGoodsList(params);
  };

  closeFunc = () => {
    this.setState({
      addFlag: false
    })
  };

  handleSend = event => {
    event.preventDefault();
    const {
      form,
      getGoodsAddList,
      goodsType,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        goodsUnit,
        goodsName,
      } = fieldsValue;
      const params = {
        goodsUnit,
        goodsName,
        goodsType,
        func: () => {
          form.setFieldsValue({
            goodsName: "",
            goodsUnit: ""
          });
        }
      };
      getGoodsAddList(params);
    });
  };

  // 搜索
  searchGoodsFunc = (value) => {
    const {
      getGoodsList,
      pageNum,
      pageSize,
      goodsType,
      sortField,
      sortMethod,
    } = this.props;
    const params = {
      goodsType,
      goodsName: value,
      pageNum,
      pageSize,
      sortField,
      sortMethod,
    };
    getGoodsList(params);
  };

  render() {
    const {
      form,
      goodsData: {
        isAbleOper,
        pageData: {
          pageCount
        }
      },
      pageNum,
      pageSize,
      goodsAddLoading
    } = this.props;
    const { addFlag } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.warehouseGoods}>
        <CommonBreadcrumb breadData={[{name:'目录'}]} style={{marginLeft:'38px'}} />
        <div className={styles.warehouseGoodsCenter}>
          <div className={styles.goodsLeft}>
            <Tree
              defaultExpandedKeys={['100', '100']}
              defaultSelectedKeys={['100', '100']}
              defaultCheckedKeys={['100', '100']}
              onSelect={this.onSelect}
            >
              <TreeNode title="仓库资产" key="100">
                <TreeNode title="备品备件" key="101" />
                <TreeNode title="工器具" key="200">
                  <TreeNode title="安全工器具" key="201" />
                  <TreeNode title="检修工器具" key="202" />
                  <TreeNode title="仪器仪表" key="203" />
                </TreeNode>
                <TreeNode title="物资管理" key="300">
                  <TreeNode title="生活物资" key="301" />
                  <TreeNode title="办公物资" key="302" />
                </TreeNode>
              </TreeNode>
            </Tree>
          </div>
          <div className={styles.goodsRight}>
            {(isAbleOper === 0) && (
              <div className={styles.goodsBtn}>
                <Button className={styles.addControl} onClick={() => {return this.onAddFunc()}}>
                  <Icon type="plus" />
                  <span className={styles.text}>添加</span>
                </Button>
              </div>
            )}
            {(isAbleOper === 1 ? false : addFlag) && (
              <div className={styles.goodsAdd}>
                <div className={styles.goodsTitle}>
                  <span>添加</span><Icon onClick={() => this.closeFunc()} type="close" />
                </div>
                <div className={styles.goodsCenter}>
                  <Form onSubmit={this.handleSend} layout="inline">
                    <Row>
                      <Col>
                        <FormItem label="物品名称">
                          {getFieldDecorator('goodsName', {
                            rules: [{ required: true, message: '请输入物品名称'}],
                          })(
                            <Input maxLength={30} placeholder="30字以内" />
                          )}
                        </FormItem>
                        <FormItem label="计量单位">
                          {getFieldDecorator('goodsUnit', {
                            rules: [{ required: true, message: '请输入计量单位'}],
                          })(
                            <Input maxLength={6} placeholder="6字以内" />
                          )}
                        </FormItem>
                        <Button loading={goodsAddLoading} style={{ minWidth: '68px', marginTop: "4px" }} htmlType="submit">
                          添加
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            )}
            <div className={styles.goodsSearch}>
              <Search
                allowClear
                placeholder="请输入物品名称"
                onSearch={(value) => {return this.searchGoodsFunc(value)}}
                style={{ width: 200, height: 32, marginTop: "4px" }}
              />
              <CommonPagination pageSize={pageSize} currentPage={pageNum} total={pageCount} onPaginationChange={this.onPaginationChange} />
            </div>
            <WarehouseGoodsTable {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(WarehouseGoods);
