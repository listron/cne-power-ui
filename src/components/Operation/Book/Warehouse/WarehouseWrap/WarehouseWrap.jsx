import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Col, Row, Button } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import StationSelect from '../../../../Common/StationSelect/index';
import WarehouseWrapTable from './WarehouseWrapTable/WarehouseWrapTable';
import WarningTip from '../../../../Common/WarningTip';

const Search = Input.Search;
const FormItem = Form.Item;
import styles from './warehouseWrap.scss';

class WarehouseWrap extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    form: PropTypes.object,
    stations: PropTypes.object,
    getWarehouseList: PropTypes.func,
    onChangeFilter: PropTypes.func,
    warehouseData: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    warehouseName: PropTypes.string,
    getWarehouseAddList: PropTypes.func,
    getWarehouseDelList: PropTypes.func,
    warehouseAddLoading: PropTypes.bool,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: '',
      selectData: '',
      showWarningTip: false,
      warningTipText: '',
    };
  }

  componentDidMount() {
    const { getWarehouseList } = this.props;
    const params = {
      warehouseName: '',
      pageNum: 1,
      pageSize: 10,
      sortField: '',
      sortMethod: '',
    };
    getWarehouseList(params);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      getWarehouseList,
      warehouseName,
      sortField,
      sortMethod,
    } = this.props;
    const params = {
      warehouseName,
      pageNum: currentPage,
      pageSize,
      sortField,
      sortMethod,
    };
    getWarehouseList(params);
  };

  // 批量选中的数据
  onSelectedRowKeys = data => {
    this.setState({
      selectedRowKeys: data.join(','),
      selectData: data.join(','),
    });
  };

  // 取消删除
  onCancelWarningTip = () => {
    // 判断selectData有没有数据
    const { selectData } = this.state;
    if (selectData) {
      this.setState({
        showWarningTip: false,
        selectedRowKeys: selectData,
      });
    }
    if (!selectData) {
      this.setState({
        showWarningTip: false,
        selectedRowKeys: '',
      });
    }
  };

  // 单个删除
  onDeleteMode = data => {
    const {
      showWarningTip,
      warningTipText,
      tableRecord: { warehouseId },
    } = data;
    this.setState({
      showWarningTip,
      warningTipText,
      selectedRowKeys: `${warehouseId}`,
    });
  };

  // 确认删除
  onConfirmWarningTip = () => {
    const { selectedRowKeys, selectData } = this.state;
    const {
      warehouseName,
      pageNum,
      pageSize,
      sortField,
      sortMethod,
      getWarehouseDelList,
    } = this.props;
    const params = {
      warehouseIds: `${selectedRowKeys}` || selectData,
      warehouseName,
      pageNum,
      pageSize,
      sortField,
      sortMethod,
      func: () => {
        // 点击的table后面的删除按钮
        if (selectedRowKeys) {
          return this.setState({
            selectedRowKeys: '',
          });
        }
        // 点击的批量删除
        return this.setState({
          selectData: '',
        });
      },
    };
    this.setState({
      showWarningTip: false,
    }, () => {
      getWarehouseDelList(params);
    });
  };

  // 添加
  handleSend = event => {
    event.preventDefault();
    const { form, getWarehouseAddList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { warehouseName, stationName } = fieldsValue;
      const stationCodes = stationName.map(cur => {
        return cur.stationCode;
      });
      const params = {
        warehouseName,
        stationCodes: stationCodes.join(','),
        func: () => {
          form.setFieldsValue({
            warehouseName: '',
            stationName: [],
          });
        },
      };
      getWarehouseAddList(params);
    });
  };

  // 搜索
  searchFunc = value => {
    const { pageSize, pageNum, getWarehouseList } = this.props;
    const params = {
      warehouseName: value,
      pageSize,
      pageNum,
    };
    getWarehouseList(params);
  };

  // 批量删除
  selectDelFunc = () => {
    const { selectData } = this.state;
    if (selectData) {
      this.setState({
        showWarningTip: true,
        warningTipText: '确认删除?',
      });
    }
  };

  render() {
    const {
      form,
      stations,
      warehouseData: { pageCount },
      pageSize,
      pageNum,
      warehouseAddLoading,
    } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.warehouseWrap}>
        <div className={styles.warehouseSearch}>
          <Form onSubmit={this.handleSend} layout="inline">
            <Row>
              <Col>
                <FormItem label="添加仓库名称">
                  {getFieldDecorator('warehouseName', {
                    rules: [{ required: true, message: '请输入仓库名称' }],
                  })(<Input placeholder="30字以内" maxLength={30} />)}
                </FormItem>
                <FormItem label="电站名称">
                  {getFieldDecorator('stationName', {
                    rules: [{ required: true, message: '请输入电站名称' }],
                  })(
                    <StationSelect
                      data={stations.toJS()}
                      style={{ width: '200px' }}
                      onOK={this.selectStation}
                      multiple={true}
                      oneStyleOnly={true}
                      stationShowNumber={true}
                    />
                  )}
                </FormItem>
                <Button
                  loading={warehouseAddLoading}
                  style={{ minWidth: '68px', marginTop: '4px' }}
                  htmlType="submit"
                >
                  添加
                </Button>
              </Col>
            </Row>
          </Form>
          <div className={styles.rightSeach}>
            <Search
              allowClear
              placeholder="请输入仓库名称"
              onSearch={value => {
                return this.searchFunc(value);
              }}
              style={{ width: 200, height: 32, marginTop: '4px' }}
            />
          </div>
        </div>
        <div className={styles.warehouseHandle}>
          <Button
            style={{ width: '90px' }}
            onClick={() => {
              return this.selectDelFunc();
            }}
          >
            批量删除
          </Button>
          <CommonPagination
            pageSize={pageSize}
            currentPage={pageNum}
            total={pageCount}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <WarehouseWrapTable
          onSelectedRowKeys={this.onSelectedRowKeys}
          onDeleteMode={this.onDeleteMode}
          {...this.props}
        />
        {showWarningTip && (
          <WarningTip
            style={{ marginTop: '350px', width: '240px', height: '88px' }}
            onCancel={this.onCancelWarningTip}
            hiddenCancel={false}
            onOK={this.onConfirmWarningTip}
            value={warningTipText}
          />
        )}
      </div>
    );
  }
}

export default Form.create()(WarehouseWrap);
