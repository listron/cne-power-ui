import React from "react";
import PropTypes from "prop-types";
import { Button, Table, Form, Input, Icon } from 'antd';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  getInput = () => {
    const { type,onChange,assetlist,stationtypecount,querydatatype,record } = this.props;
    if (type === 'text') {
      return record.isBuild? <span>{record.manufactorName}</span> :<Input onChange={this.testValue} />;
    }
    return (
      <AssetNodeSelect 
      onChange={onChange} assetList={assetlist} stationTypeCount={stationtypecount} queryDataType={querydatatype} multiple={true}
      assetsIds={record.assetsIds.split()}
      />
      )
  };
  testValue = (e) => {
    console.log('e', e.target.value);

  }
  render() {

    const {
      editing,
      dataIndex,
      title,
      // inputType,
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
                    initialValue: dataIndex === "manufactorName" ? record[dataIndex] : record['assetsIds'].split()
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