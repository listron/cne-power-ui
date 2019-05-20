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
    form: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      addFlag: false
    };
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  handleSend = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        warehouseName,
        stationName,
      } = fieldsValue;
    });
  };

  closeFunc = () => {
    this.setState({
      addFlag: false
    })
  };

  onAddFunc = () => {
    this.setState({
      addFlag: true
    })
  };

  render() {
    const { form } = this.props;
    const { addFlag } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.warehouseGoods}>
        <CommonBreadcrumb breadData={[{name:'目录'}]} style={{marginLeft:'38px'}} />
        <div className={styles.warehouseGoodsCenter}>
          <div className={styles.goodsLeft}>
            <Tree
              defaultExpandedKeys={['0-0', '0-0']}
              defaultSelectedKeys={['0-0', '0-0']}
              defaultCheckedKeys={['0-0', '0-0']}
              onSelect={this.onSelect}
            >
              <TreeNode title="仓库资产" key="0-0">
                <TreeNode title="备品备件" key="0-0-2" />
                <TreeNode title="工器具" key="0-0-0">
                  <TreeNode title="安全工器具" key="0-0-0-0" />
                  <TreeNode title="检修工器具" key="0-0-0-1" />
                  <TreeNode title="仪器仪表" key="0-0-0-2" />
                </TreeNode>
                <TreeNode title="物资管理" key="0-0-1">
                  <TreeNode title="生活物资" key="0-0-1-0" />
                  <TreeNode title="办公物资" key="0-0-1-1" />
                </TreeNode>
              </TreeNode>
            </Tree>
          </div>
          <div className={styles.goodsRight}>
            <div className={styles.goodsBtn}>
              <Button className={styles.addControl} onClick={() => {return this.onAddFunc()}}>
                <Icon type="plus" />
                <span className={styles.text}>添加备品备件</span>
              </Button>
            </div>
            {(addFlag) && (
              <div className={styles.goodsAdd}>
                <div className={styles.goodsTitle}>
                  <span>添加</span><Icon onClick={() => this.closeFunc()} type="close" />
                </div>
                <div className={styles.goodsCenter}>
                  <Form onSubmit={this.handleSend} layout="inline">
                    <Row>
                      <Col>
                        <FormItem label="物品名称">
                          {getFieldDecorator('warehouseName', {
                            rules: [{ required: true, message: '请输入物品名称'}],
                          })(
                            <Input placeholder="30字以内" />
                          )}
                        </FormItem>
                        <FormItem label="计量单位">
                          {getFieldDecorator('stationName', {
                            rules: [{ required: true, message: '请输入计量单位'}],
                          })(
                            <Input placeholder="6字以内" />
                          )}
                        </FormItem>
                        <Button style={{ width: '68px', marginTop: "4px" }} htmlType="submit">
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
                placeholder="请输入物品名称"
                onSearch={value => console.log(value)}
                style={{ width: 200, height: 32, marginTop: "4px" }}
              />
              <CommonPagination pageSize={10} currentPage={1} total={1} onPaginationChange={this.onPaginationChange} />
            </div>
            <WarehouseGoodsTable {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(WarehouseGoods);
