import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import ImgUploader from '../../../Common/Uploader/ImgUploader';


class BasicInfo extends Component {
    static propTypes = {
        distributionInfo: PropTypes.array,
        docketInfo: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { distributionInfo = [], docketInfo = {}, type } = this.props;
        const { annexImg = [], otherImg = [] } = docketInfo;
        const testName = type === 'work' ? '工作票' : '操作票';
        return (
            <div className={styles.basicInfo}>
                <div className={styles.title}>
                    <div className={styles.text}> 基本信息  <i className="iconfont icon-content" /> </div>
                </div>
                <div className={styles.basicContent}>
                    <div className={styles.basicItem}><div>{testName}编号</div><span>{docketInfo.docketCode || '--'}</span></div>
                    {type === 'work' && <div className={styles.basicItem}><div>工作票类型</div><span>{docketInfo.docketTypeName || '--'}</span></div>}
                    <div className={styles.basicItem}><div>电站名称</div><span>{docketInfo.stationName || '--'}</span></div>
                    <div className={styles.basicItem}><div>{testName}名称</div><span>{docketInfo.docketName || '--'}</span></div>
                    <div className={styles.basicItem}><div>关联工单</div><span>{docketInfo.defectId || '--'}</span></div>
                    <div className={styles.basicItem}><div>{testName}附件</div>
                        <span>
                            <ImgUploader editable={false} data={annexImg.map(item => ({
                                uid: item.imgUrl,
                                rotate: item.rotate,
                                thumbUrl: `${item.imgUrl}`,
                            }))}
                            />
                        </span>
                    </div>
                    <div className={styles.basicItem}><div>其他附件</div>
                        <span>
                            <ImgUploader editable={false} data={otherImg.map(item => ({
                                uid: item.imgUrl,
                                rotate: item.rotate,
                                thumbUrl: `${item.imgUrl}`,
                            }))}
                            />
                        </span>
                    </div>
                    {
                        distributionInfo.map(e => {
                            return (<div className={styles.basicItem} key={e.nodeCode}><div>{e.nodeName}</div><span>{e.userNames || '--'}</span></div>);
                        })
                    }
                </div>

            </div>
        );
    }
}

export default BasicInfo;
