import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";
import { Radio, Button, Table, Tree } from 'antd';
import AddNodeFrom from "./AddNodeFrom";
import EditNodeFrom from "./EditNodeFrom";
import WarningTip from '../../../../Common/WarningTip';
import moment from 'moment';

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

  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      addNode: false,
      editNode: false,
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
    }
  }
  componentDidMount() {
    const { stationType } = this.props;
    this.props.getAssetTree({ stationType});
    this.getTreeData();
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
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
  getTreeData = (value) => {assetsParentId
    const { stationType, assetsParentId } = this.props;
    const params = { stationType,assetsParentId  }
    this.props.getNodeDetail({ ...params, ...value })
  }
  queryType = (active) => {
    const { changeAssetConfigStore, } = this.props;
    changeAssetConfigStore({ stationType: active, });
    this.props.getAssetTree({ stationType:active});

  }
  addDevice = () => {
    this.setState({
      addNode: true
    })
  }
  closeAddFrom = () => {
    this.setState({
      addNode: false
    })
  }
  closeEditFrom = () => {
    this.setState({
      editNode: false
    })
  }
  formatAsset = (data = []) => {
    const formatAssetData = [];
    data.forEach((e, i) => {
    })
    return formatAssetData
  }

  selectNode = (selectedKeys, e) => {
    console.log('e: ', e);
    console.log('selectedKeys: ', selectedKeys);
    const { node } = e;
    const { props } = node;
    const tableData = props ? props.dataRef : {};
    console.log('tableData: ', tableData);
    const assetsParentId = tableData.assetsId;
    const assetsName = tableData.assetsName;
    console.log('assetsName: ', assetsName);
    const isBuild=tableData.isBuild;

    //当前节点所处第几级
    const currentLeavel = assetsParentId.split(',').length - 1;
    console.log('currentLeavel: ', currentLeavel);
    //此节点下面有几级节点、()
    const childrenNum = tableData.childNodeNum;
    console.log('assetsParentId: ', assetsParentId);
    //保留当前节点的id和name，供编辑节点和新建节点使用

    this.props.changeAssetConfigStore({ assetsId: assetsParentId, assetsName, childrenNum ,isBuild})
    //请求选中节点的详情
    this.getTreeData({ assetsParentId });

    //编辑节点from显示,生产资产节点不可编辑
    let editNode = (currentLeavel !== 0 && selectedKeys.length > 0) ? true : false;
    this.setState({
      editNode
    })
    currentLeavel===5&&this.setState({addNode:false})
  }
  deleteNode = (record) => {
    this.setState({
      tableRecord: record,
      showWarningTip: true,
      warningTipText: '确认删除此节点吗?',
    })
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
    const { stationType, stationTypeCount, assetList, childrenNodeDetail ,childrenNum,} = this.props;
    console.log('assetList: ', assetList);
    // const formatAssetData = this.formatAsset(assetList);
    const { addNode, editNode, showWarningTip, warningTipText } = this.state;
    const columns = [
      {
        title: '编码',
        dataIndex: 'assetsCode',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '节点名称',
        dataIndex: 'assetsName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '节点类型',
        dataIndex: 'assetsType',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '计量单位',
        dataIndex: 'assetsUnit',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: 'operateUser',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        render: (text, record, index) => {
          return record.isBuild ? <span title="删除" className="iconfont icon-del" onClick={() => this.deleteNode(record)}></span> : ''
        }
      },

    ];
    return (
      <div className={styles.box}>
        <div className={styles.titleType} >
          <div className={stationType === 1 ? styles.selectPv : styles.pv} onClick={() => { this.queryType(1) }} >{(stationTypeCount === 'pv' || stationTypeCount === 'multiple') ? '光伏' : ''}</div>
          <div className={stationType === 0 ? styles.selectWind : styles.wind} onClick={() => { this.queryType(0) }}>{(stationTypeCount === 'wind' || stationTypeCount === 'multiple') ? '风电' : ''}</div>
        </div>
        <div className={styles.container}>
          <div className={styles.leftTree}>
            <Tree
              autoExpandParent={true}
              defaultExpandedKeys={["0"]}
              defaultSelectedKeys={["0"]}
              onCheck={this.onCheck}
              blockNode={false}
              onSelect={this.selectNode}
            >
              <TreeNode title="生产资产" key="0" dataRef={{ "assetsId": '0' }}>
                {this.renderTreeNodes(assetList)}
              </TreeNode>
            </Tree>
          </div>
          <div className={styles.rightNode}>
            <Button onClick={this.addDevice} className={addNode ? styles.disabledStyle : styles.plusButton} icon="plus" disabled={addNode} >添加子节点</Button>
            {
              addNode && <AddNodeFrom {...this.props} closeFrom={this.closeAddFrom} />
            }
            {editNode && <EditNodeFrom {...this.props} closeFrom={this.closeEditFrom} />}
            {
              <Table
                loading={false}
                dataSource={childrenNodeDetail}
                columns={columns}
                pagination={false}
                childrenColumnName={['childrens']}
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
    )
  }
}
export default (AssetStructure)

