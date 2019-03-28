import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';


const getDuration = (seconds) => {
    const milliseconds = seconds * 1000;
    let time=moment.duration(milliseconds);
    return `${time.get('day')}天${time.get('hour')}小时${time.get('minutes')}分钟`;
}

export const AllStationTableColumn = () => {
    return [
        {
            title: '电站名称',
            dataIndex: 'stationName',
            key: 'stationName',
            sorter: true,
        }, {
            title: '告警总数',
            dataIndex: 'alarmNum',
            key: 'alarmNum',
            render: value => numWithComma(value),
            sorter: true,
        }, {
            title: '一级总数',
            dataIndex: 'oneWarningNum',
            key: 'oneWarningNum',
            render: value => numWithComma(value),
            sorter: true,
        }, {
            title: '二级总数',
            dataIndex: 'twoWarningNum',
            key: 'twoWarningNum',
            render: value => numWithComma(value),
            sorter: true,
        }, {
            title: '三级总数',
            dataIndex: 'threeWarningNum',
            key: 'threeWarningNum',
            render: value => numWithComma(value),
            sorter: true,
        }, {
            title: '四级总数',
            dataIndex: 'fourWarningNum',
            key: 'fourWarningNum',
            render: value => numWithComma(value),
            sorter: true,
        }, {
            title: '平均处理时间',
            dataIndex: 'handleAvgTime',
            key: 'handleAvgTime',
            render: text=> getDuration(text),
            sorter: true,
        }, {
            title: '一级处理时间',
            dataIndex: 'oneHandleAvgTime',
            key: 'oneHandleAvgTime',
            render: text=> getDuration(text),
            sorter: true,
        }, {
            title: '二级处理时间',
            dataIndex: 'twoHandleAvgTime',
            key: 'twoHandleAvgTime',
            render: text=> getDuration(text),
            sorter: true,
        }, {
            title: '三级处理时间',
            dataIndex: 'threeHandleAvgTime',
            key: 'threeHandleAvgTime',
            render: text=> getDuration(text),
            sorter: true,
        }, {
            title: '四级处理时间',
            dataIndex: 'fourHandleAvgTime',
            key: 'fourHandleAvgTime',
            render: text=> getDuration(text),
            sorter: true,
        },
    ]
}

export const SigleStationTableColumn = () => {
    return [
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            sorter: true,
            render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '告警总数',
            dataIndex: 'alarmNum',
            key: 'alarmNum',
            sorter: true,
            render: value => numWithComma(value),
        },
        {
            title: '转工单数',
            dataIndex: 'transferWorkAlarmNum',
            key: 'transferWorkAlarmNum',
            sorter: true,
            render: value => numWithComma(value),
        },
        {
            title: '未转工单数',
            dataIndex: 'noTransferWorkAlarmNum',
            key: 'noTransferWorkAlarmNum',
            sorter: true,
            render: value => numWithComma(value),
        },
        {
            title: <TableColumnTitle title="转工单率" unit="%" />,
            dataIndex: 'transferWorkRate',
            render: value => numWithComma(value),
            sorter: true,
        }
    ]
}