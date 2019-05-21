import React from "react";
import { Form, Input } from 'antd';
import StationSelect from "../../../../../../Common/StationSelect/index";
import PropTypes from "prop-types";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    type: PropTypes.string,
    stations: PropTypes.object,
    form: PropTypes.object,
    record: PropTypes.object,
    dataIndex: PropTypes.string,
    editing: PropTypes.bool,
    title: PropTypes.string,
  };

  getInput = () => {
    const { data, type, stations } = this.props;
    if (type === 'text') {
      return <Input onChange={this.testValue} />
    }
    return (
      <StationSelect
        data={stations.toJS().filter(e => e.stationType === 0)}
        style={{ width: '200px' }}
        onOK={this.selectStation}
        multiple={true}
        stationShowNumber={true}
        disabledStation={stations.toJS().filter(e => e.isConnected === 0).map(e => e.stationCode)}
      />
    );
  };

  testValue = (e) => {
    console.log('设备型号的编辑', e.target.value);
  };

  selectManufactor = (value) =>{
    console.log('value: ', value);

  };
  render() {

    const {
      editing,
      dataIndex,
      title,
      record,
      form,
      stations,
      ...restProps
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <EditableContext.Consumer>
        {() => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入${title}!`,
                    }],
                    initialValue: dataIndex === "warehouseName" ? record[dataIndex] : stations.toJS().filter(e => [82, 76].includes(e.stationCode)),
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
