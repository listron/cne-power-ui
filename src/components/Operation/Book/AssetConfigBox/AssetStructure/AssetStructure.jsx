import React from "react";
import PropTypes from "prop-types";
import styles from "./assetStructure.scss";
import { Radio, Button, Table, Tree } from 'antd';
import AddNodeFrom from "./AddNodeFrom";
import EditNodeFrom from "./EditNodeFrom";
import WarningTip from '../../../../Common/WarningTip';

const { TreeNode } = Tree;
class AssetStructure extends React.Component {
  static propTypes = {

    changeAssetConfigStore: PropTypes.func,
    deleteAssetNode: PropTypes.func,
    stationType: PropTypes.number,
    stationTypeCount: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      addNode: false,
      editNode: false,
      showWarningTip: false,
      warningTipText: '',
      tableData: [],
      tableRecord: {},
    }
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
  queryType = (active) => {
    const { changeAssetConfigStore, } = this.props;
    changeAssetConfigStore({ stationType: active, });
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
    // 
    // 
    const { node } = e;
    const { props } = node;
    const tableData = props ? props.children : [];
    // 
    const childrenNodeData = tableData.map((e, i) => (e.props.dataRef))
    this.setState({ tableData: childrenNodeData })
    selectedKeys.length > 0 && this.setState({ editNode: true })


  }
  deleteNode = (record) => {
    
    this.setState({
      tableRecord: record,
      showWarningTip: true,
      warningTipText: '确认删除此节点吗?',
    })

  }



  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.assetsName} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })


  render() {
    const { stationType, stationTypeCount, assetList } = this.props;
    // 
    // const formatAssetData = this.formatAsset(assetList);
    const { addNode, tableData, editNode, showWarningTip,warningTipText } = this.state;
    
    const treeData = [
      {
        assetsCode: "9864.809819432794",
        assetsId: "9653.49028310135",
        key: "9653.49028310135",
        assetsName: "一级1",
        assetsType: "1",
        assetsUnit: "一级单位",
        createTime: "2019-01-08",
        isBuild: 0,
        operatorUser: "一级操作人1",
        currentNode: 1,
        childrenLevel: 4,
        children: [{
          assetsCode: "1820.4978840255137",
          assetsId: "1687.016740582481",
          key: "1687.016740582481",
          assetsName: "二级1",
          assetsType: "2",
          assetsUnit: "二级单位",
          createTime: "2019-02-04",
          isBuild: 0,
          operatorUser: "二级操作人1",
          currentNode: 2,
          childrenLevel: 3,
          children: [{
            assetsCode: "6773.066036048228",
            assetsId: "4008.492038053555",
            key: "4008.492038053555",
            assetsName: "三级1",
            assetsType: "3",
            assetsUnit: "三级单位",
            createTime: "2019-03-02",
            isBuild: 1,
            operatorUser: "三级操作人1",
            currentNode: 3,
            childrenLevel: 2,
            children: [{
              assetsCode: "5261.709938621577",
              assetsId: "7742.204190493658",
              key: "7742.204190493658",
              assetsName: "四级1",
              assetsType: "3",
              assetsUnit: "四级单位",
              createTime: "2019-04-04",
              isBuild: 1,
              operatorUser: "四级操作人1",
              currentNode: 4,
              childrenLevel: 1,
              children: [{
                assetsCode: "6630.461230880327",
                assetsId: "9772.589513979095",
                key: "9772.589513979095",
                assetsName: "五级1",
                assetsType: "3",
                assetsUnit: "五级单位",
                createTime: "2019-05-07",
                isBuild: 1,
                operatorUser: "五级操作人1",
                currentNode: 5,
                childrenLevel: 0,
                children: []
              }]
            }]
          }]
        }]
      }
    ];

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
        dataIndex: 'operatorUser',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        render: (text, record, index) => <span title="删除" className="iconfont icon-del" onClick={() => this.deleteNode(record)}></span>
      },

    ];
    return (
      <div className={styles.box}>
        <div className={styles.titleType} >
          <div className={stationType === 1 ? styles.selectPv : styles.pv} onClick={() => { this.queryType('pv') }} >{(stationTypeCount === 'pv' || stationTypeCount === 'multiple') ? '光伏' : ''}</div>
          <div className={stationType === 0 ? styles.selectWind : styles.wind} onClick={() => { this.queryType('wind') }}>{(stationTypeCount === 'wind' || stationTypeCount === 'multiple') ? '风电' : ''}</div>
        </div>
        <div className={styles.container}>
          <div className={styles.leftTree}>

            <Tree
              autoExpandParent={true}
              onCheck={this.onCheck}
              blockNode={false}
              onSelect={this.selectNode}
            >
              <TreeNode title="生产资产" key="0">
                {this.renderTreeNodes(treeData)}
              </TreeNode>

            </Tree>
          </div>
          <div className={styles.rightNode}>
            <Button onClick={this.addDevice} className={addNode ? styles.disabledStyle : styles.plusButton} icon="plus" disabled={addNode} >添加子节点</Button>
            {
              addNode && <AddNodeFrom closeFrom={this.closeAddFrom} />
            }
            {editNode && <EditNodeFrom closeFrom={this.closeEditFrom} />}
            {
              <Table
                loading={false}
                dataSource={tableData}
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
