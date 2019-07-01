import React from "react";
import { Form, Input } from 'antd';
import StationSelect from "../../../../../../Common/StationSelect/index";
import PropTypes from "prop-types";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    stations: PropTypes.object,
    form: PropTypes.object,
    record: PropTypes.object,
    dataIndex: PropTypes.string,
    editing: PropTypes.bool,
    title: PropTypes.string,
  };

  getInput = () => {
    const { type, stations } = this.props;
    if (type === 'text') {
      return <Input maxLength={30} placeholder="仓库名称" />
    }
    return (
      <StationSelect
        data={stations.toJS()}
        style={{ width: '200px' }}
        onOK={this.selectStation}
        multiple={true}
        stationShowNumber={true}
      />
    );
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
                <FormItem help="" style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入${title}!`,
                    }],
                    initialValue: dataIndex === "warehouseName" ? record[dataIndex] : stations.toJS().filter(e => record["stationCodes"].split(",").includes(`${e.stationCode}`)),
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
