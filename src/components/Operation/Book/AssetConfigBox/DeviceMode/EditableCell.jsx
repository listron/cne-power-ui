import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Form, Input, Icon, Select } from 'antd';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';


const FormItem = Form.Item;
const { Option } = Select;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  onChangeAssets = (data) => {

    this.props.changeNode(data);
    this.props.form.setFieldsValue({ manufactorName: '' });
  }
  getInput = () => {
    const { devicefactorslist, type, onChange, assetlist, stationtypecount, querydatatype, record } = this.props;
    console.log('record: ', record);
    // const pv = record.assetsDatas.filter((e) => (e.stationType === 1)).assetsIds;
    // console.log('pv: ', pv);
    // const wind = record.assetsDatas.filter((e) => (e.stationType === 0));
    const assetsIds = { pv: ['0,3'], wind: [] };
    // const assetsIds = { pv: pv, wind: wind };
    // console.log('assetlist: ', assetlist);
    if (type === 'text') {
      return <Input onChange={this.testValue} />;
    }
    if (type === 'select') {
      return (
        <Select
          onSelect={this.selectManufactor}
          style={{ width: 194 }}
          placeholder="请选择厂家" >
          <Option key={'请选择厂家'} value={''}>请选择厂家</Option>
          {devicefactorslist.map(e => (<Option key={e.manufactorCode} value={e.manufactorId}>
            {e.manufactorName}
          </Option>))}
        </Select>);
    }
    if (type === 'modal') {
      return (
        <AssetNodeSelect
          onChange={this.onChangeAssets}
          assetList={assetlist}
          stationTypeCount={stationtypecount}
          queryDataType={querydatatype}
          checkedName={this.props.checkedName}
          assetsIds={assetsIds}
        // assetsIds={this.props.checkedAssetId}
        // checkedName={record.assetsName ? record.assetsName.replace(/,/g, '/') : ''}
        // assetsIds={record.assetsId ? record.assetsId.split() : []}
        />
      );
    }

  };
  testValue = (e) => {
  }
  selectManufactor = (value) => {
    this.props.changeAssetConfigStore({
      checkedManufactor: value,
    });

  }
  render() {

    const { editing, dataIndex, title, record, index, form, checkedManufactor, ...restProps } = this.props;
    // const { getFieldDecorator, getFieldValue } = this.props.form;
    const { getFieldDecorator } = form;
    return (
      <EditableContext.Consumer>
        {(form) => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入 ${title}!`,
                    }],
                    initialValue: dataIndex === 'deviceModeName' ? record['deviceModeName'] : dataIndex === 'assetsName' ? record['assetsId'] : checkedManufactor,
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
export default (EditableCell);
