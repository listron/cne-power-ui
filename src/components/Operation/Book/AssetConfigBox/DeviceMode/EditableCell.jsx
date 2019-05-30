import React from "react";
import PropTypes from "prop-types";
import { Button, Table, Form, Input, Icon, Select } from 'antd';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';


const FormItem = Form.Item;
const { Option } = Select;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  getInput = () => {
    const { devicefactorslist, type, onChange, assetlist, stationtypecount, querydatatype, record } = this.props;

    if (type === 'text') {
      return <Input onChange={this.testValue} />
    }
    if (type === 'select') {
      return (
        <Select
          onSelect={this.selectManufactor}
          style={{ width: 194 }}
          placeholder="请选择厂家" >
          {devicefactorslist.map(e => (<Option key={e.manufactorCode} value={e.manufactorId}>
            {e.manufactorName}
          </Option>))}
        </Select>)
    }
    if (type === 'modal') {
      return (
        <AssetNodeSelect
          onChange={onChange} 
          assetList={assetlist} 
          stationTypeCount={stationtypecount} 
          queryDataType={querydatatype} 
          checkedName={record.assetsName ? record.assetsName.replace(/,/g, '/') : ''}
          assetsIds={record.assetsId ? record.assetsId.split() : []}
        />
      )
    }

  };
  testValue = (e) => {


  }
  selectManufactor = (value) => {


  }
  render() {

    const {
      editing,
      dataIndex,
      title,
      // type,
      record,
      index,
      form,
      ...restProps
    } = this.props;
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
                    initialValue: dataIndex === "deviceModeName" ? record[dataIndex] : dataIndex === "assetsName" ? record['assetsId']: record['manufactorId'],
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
export default (EditableCell)