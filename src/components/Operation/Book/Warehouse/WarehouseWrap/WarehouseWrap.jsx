import React, { Component } from "react";
import PropTypes from 'prop-types';
import {Input, Form, Col, Row, Button} from 'antd';
import CommonPagination from "../../../../Common/CommonPagination";
import StationSelect from "../../../../Common/StationSelect/index";
import WarehouseWrapTable from "./WarehouseWrapTable/WarehouseWrapTable";

const Search = Input.Search;
const FormItem = Form.Item;
import styles from "./warehouseWrap.scss";

class WarehouseWrap extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    form: PropTypes.object,
    stations: PropTypes.object
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

  render() {
    const { form, stations } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.warehouseWrap}>
        <div className={styles.warehouseSearch}>
          <Form onSubmit={this.handleSend} layout="inline">
            <Row>
              <Col>
                <FormItem label="添加仓库名称">
                  {getFieldDecorator('warehouseName', {
                    rules: [{ required: true, message: '请输入仓库名称'}],
                  })(
                    <Input placeholder="30字以内" />
                  )}
                </FormItem>
                <FormItem label="电站名称">
                  {getFieldDecorator('stationName', {
                    rules: [{ required: true, message: '请输入电站名称'}],
                  })(
                    <StationSelect
                      data={stations.toJS().filter(e => e.stationType === 0)}
                      style={{ width: '200px' }}
                      onOK={this.selectStation}
                      multiple={true}
                      stationShowNumber={true}
                      disabledStation={stations.toJS().filter(e => e.isConnected === 0).map(e => e.stationCode)}
                    />
                  )}
                </FormItem>
                <Button style={{ width: '68px', marginTop: "4px" }} htmlType="submit">
                  添加
                </Button>
              </Col>
            </Row>
          </Form>
          <Search
            placeholder="请输入仓库名称"
            onSearch={value => console.log(value)}
            style={{ width: 200, height: 32, marginTop: "4px" }}
          />
        </div>
        <div className={styles.warehouseHandle}>
          <Button style={{ width: '90px' }}>
            批量删除
          </Button>
          <CommonPagination pageSize={10} currentPage={1} total={1} onPaginationChange={this.onPaginationChange} />
        </div>
        <WarehouseWrapTable {...this.props} />
      </div>
    )
  }
}

export default Form.create()(WarehouseWrap);
