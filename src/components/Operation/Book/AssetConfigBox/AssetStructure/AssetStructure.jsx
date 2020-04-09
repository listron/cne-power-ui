import React from 'react';
import PropTypes from 'prop-types';
import styles from './assetStructure.scss';
import { Button, Tree } from 'antd';
import AddNodeFrom from './AddNodeFrom';
import EditNodeFrom from './EditNodeFrom';
import WarningTip from '../../../../Common/WarningTip';
import moment from 'moment';
import { handleRight } from '@utils/utilFunc';
import CneTable from '@components/Common/Power/CneTable';

const { TreeNode } = Tree;
class AssetStructure extends React.Component {
  static propTypes = {

    changeAssetConfigStore: PropTypes.func,
    getAssetTree: PropTypes.func,
    getNodeDetail: PropTypes.func,
    deleteAssetNode: PropTypes.func,
    stationType: PropTypes.number,
    assetsParentId: PropTypes.string,
    stationTypeCount: PropTypes.string,
    assetList: PropTypes.array,
    childrenNodeDetail: PropTypes.array,

  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      addNode: false,
      editNode: false,
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
      assetsType: null,
    };
  }
  componentDidMount() {
    const { stationType, stationTypeCount } = this.props;
    if (stationTypeCount === 'none') {
      this.props.getAssetTree({ stationType: 0 });
      setTimeout(() => { this.props.getAssetTree({ stationType: 1 }); }, 2000);
    }
    if (stationTypeCount === 'wind') {
      this.props.getAssetTree({ stationType: 0 });
    } else if (stationTypeCount === 'pv' || stationTypeCount === 'multiple') {
      this.props.getAssetTree({ stationType: 1 });
    }

    this.getTreeData();
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false,
    });
  }
  onConfirmWarningTip = () => {
    const { stationType } = this.props;
    const { tableRecord } = this.state;
    const assetsId = tableRecord.assetsId;
    this.setState({
      showWarningTip: false,
    });
    this.props.deleteAssetNode({ stationType, assetsId });
  }
  getTreeData = (value) => {

    const { stationType, assetsParentId } = this.props;
    const params = { stationType, assetsParentId };
    this.props.getNodeDetail({ ...params, ...value });
  }
  queryType = (active) => {
    const { changeAssetConfigStore } = this.props;
    changeAssetConfigStore({ stationType: active });
    this.props.getAssetTree({ stationType: active });

  }
  addDevice = () => {
    this.setState({
      addNode: true,
    });
  }
  closeAddFrom = () => {
    this.setState({
      addNode: false,
    });
  }
  closeEditFrom = () => {
    this.setState({
      editNode: false,
    });
  }
  formatAsset = (data = []) => {
    const formatAssetData = [];
    data.forEach((e, i) => {
    });
    return formatAssetData;
  }

  selectNode = (selectedKeys, e) => {
    const { node } = e;
    const { props } = node;
    const tableData = props ? props.dataRef : {};
    const assetsParentId = tableData.assetsId;
    const assetsName = tableData.assetsName;
    const assetsType = tableData.assetsType;
    const assetsUnit = tableData.assetsUnit;
    const isBuild = tableData.isBuild;
    //当前节点所处第几级
    const currentLeavel = assetsParentId.split(',').length - 1;

    //此节点下面有几级节点、()
    const childrenNum = tableData.childNodeNum;

    //保留当前节点的id和name，供编辑节点和新建节点使用

    this.props.changeAssetConfigStore({ assetsId: assetsParentId, assetsName, assetsUnit, childrenNum, isBuild });
    //请求选中节点的详情
    this.getTreeData({ assetsParentId });

    //编辑节点from显示,生产资产节点不可编辑
    const editNode = (currentLeavel !== 0 && selectedKeys.length > 0) ? true : false;
    this.setState({
      editNode,
      assetsType,
    });
    currentLeavel === 5 && this.setState({ addNode: false });
  }
  deleteNode = (record) => {
    this.setState({
      tableRecord: record,
      showWarningTip: true,
      warningTipText: '确认删除此节点吗?',
    });
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.childernNodes) {
      return (
        <TreeNode title={item.assetsName} key={item.assetsId} dataRef={item}>
          {this.renderTreeNodes(item.childernNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.assetsName} key={item.assetsId} dataRef={item} ></TreeNode>;
  })

  render() {
    const { stationType, stationTypeCount, assetList, childrenNodeDetail } = this.props;
    const { addNode, editNode, showWarningTip, warningTipText, assetsType } = this.state;
    const operateRight = handleRight('operation_book_operateAsset');
    const baseColumns = [
      {
        title: '编码',
        width: '6%',
        dataIndex: 'assetsCode',
        textAlign: 'center',
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '节点名称',
        width: '25%',
        textAlign: 'left',
        dataIndex: 'assetsName',
        render: (text) => <div className={styles.nodeName} title={text}>{text}</div>,
      }, {
        title: '节点类型',
        width: '12%',
        textAlign: 'left',
        dataIndex: 'assetsType',
        render: (text) => <span title={text}>{text === 1 ? '系统' : text === 2 ? '设备' : '部件'}</span>,
      }, {
        title: '计量单位',
        width: '14%',
        textAlign: 'left',
        dataIndex: 'assetsUnit',
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '创建时间',
        width: '21%',
        textAlign: 'center',
        dataIndex: 'createTime',
        render: (text) => <span title={moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }, {
        title: '操作人',
        width: '15%',
        textAlign: 'left',
        dataIndex: 'operateUser',
        render: (text) => <div className={styles.operateUserName} title={text ? text : '系统'}>{text ? text : '系统'}</div>,
      }
    ];
    const columns = operateRight ? baseColumns.concat({
      title: '操作',
      width: '7%',
      textAlign: 'center',
      dataIndex: 'handle',
      render: (text, record) => {
        return record.isBuild ? <span title="删除" className="iconfont icon-del" onClick={() => this.deleteNode(record)}></span> : '';
      },
    }) : baseColumns;
    const { clientHeight } = document.body;
    // footer 60; thead: 36; 添加子节点按钮: 32; 添加子节点按钮margin: 16; tabs: 40; padding 15; h:40; 添加子节点弹框: 270;
    // operateRight && editNode判断添加子节点弹框是否打开，打开多减一个270
    const tableListHeight = addNode ? clientHeight - 508 : clientHeight - 238;
    return (
      <div className={styles.box}>
        <div className={styles.titleType} >
          {(stationTypeCount === 'pv' || stationTypeCount === 'multiple') ? <div className={stationType === 1 ? styles.selectPv : styles.pv} onClick={() => { this.queryType(1); }} >光伏</div> : ''}
          {(stationTypeCount === 'wind' || stationTypeCount === 'multiple') ? <div className={stationType === 0 ? styles.selectWind : styles.wind} onClick={() => { this.queryType(0); }}>风电</div> : ''}
        </div>
        <div className={styles.container}>
          <div className={styles.leftTree}>
            <Tree
              autoExpandParent={true}
              defaultExpandedKeys={['0']}
              defaultSelectedKeys={['0']}
              onCheck={this.onCheck}
              blockNode={false}
              onSelect={this.selectNode}
            >
              <TreeNode title="生产资产" key="0" dataRef={{ 'assetsId': '0' }}>
                {this.renderTreeNodes(assetList)}
              </TreeNode>
            </Tree>
          </div>
          <div className={styles.rightNode}>
            {operateRight && <Button
              onClick={this.addDevice}
              className={addNode ? styles.disabledStyle : styles.plusButton}
              icon="plus"
              disabled={addNode}
            >添加子节点</Button>}
            {
              addNode && <AddNodeFrom {...this.props} closeFrom={this.closeAddFrom} />
            }
            {operateRight && editNode && <EditNodeFrom {...this.props} closeFrom={this.closeEditFrom} assetsType={assetsType} />}
            {
              <CneTable
                loading={false}
                dataSource={childrenNodeDetail}
                columns={columns}
                scroll={{ y: tableListHeight }}
                rowKey={(record, index) => index || 'key'}
                pagination={false}
                childrenColumnName="childrens"
                locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
              />
            }
            {showWarningTip && <WarningTip
              style={{ marginTop: '350px', width: '210px', height: '80px' }}
              onCancel={this.onCancelWarningTip}
              hiddenCancel={false}
              onOK={this.onConfirmWarningTip}
              value={warningTipText} />}

          </div>
        </div>

      </div>
    );
  }
}
export default (AssetStructure);

