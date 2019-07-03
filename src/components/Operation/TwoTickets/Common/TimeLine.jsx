import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import moment from 'moment';
import ImgListModal from '../../../Common/Uploader/ImgListModal';
import path from '../../../../constants/path';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程信息progressData
 */

class TimeLine extends Component {
    static propTypes = {
        status: PropTypes.string,
        processData: PropTypes.array,
        handleData: PropTypes.object,
        nodeImg: PropTypes.array,
        getNodeImg: PropTypes.func,
        downLoadFile: PropTypes.func,
        taskId: PropTypes.number,
        docketId: PropTypes.number,
    }

    constructor(props) {
        super(props);
        this.state = {
            showImgModal: false,
            currentImgIndex: 0,
            images: [],
            taskId: null,
        };
    }


    showImgs = (docketId, taskId) => { // 查看图片详情
        this.props.getNodeImg({ docketId, taskId });
        this.setState({ showImgModal: true, taskId });
    }

    closeImgs = () => { // 关闭图片
        this.setState({ showImgModal: false, currentImgIndex: 0 });
    }

    changeCurrentImgIndex = (index) => { //  改变图片的大小
        this.setState({
            currentImgIndex: index,
        });
    }

    download = (docketId, taskId) => {
        const { downLoadFile } = this.props;
        const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.operation.downloadImgs}/${docketId}/${taskId}`;
        downLoadFile({
            url: downloadHref,
            fileName: '票据附件',
            method: 'get',
        });
    }

    renderItem = (docketId, item, length, index) => {
        const { operWinType } = this.props;
        return (
            <div className={styles.processItem} key={index}>
                <img src={item.iconImg} className={styles.iconImg} />
                <div className={`${styles.line} ${operWinType && length - 1 === index && styles.dashedLine} ${!operWinType && length - 1 === index && styles.noLine}`} ></div>
                <div className={styles.linebox}>
                    <div className={styles.flowName}>{item.nodeName}</div>
                    {/* 什么鬼设计  先去判断是否有子集 没有子集，且当前操作已完成的状态 */}
                    {!item.childProcess && item.handleResult &&
                        <div className={styles.lineBasic}>
                            <div className={styles.operateTime}>{item.handleTime && moment(item.handleTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                            <div className={styles.operateUser}>{item.handleUser}</div>
                            {item.isUploadImg &&
                                <div className={styles.imgDownLoad}>
                                    <div onClick={() => this.showImgs(docketId, item.taskId)} className={styles.imgList}> 票据附件</div>
                                    <div onClick={() => this.download(docketId, item.taskId)} className={styles.imgList}> 下载</div>
                                </div>
                            }
                        </div>
                        || ''
                    }
                    {item.childProcess &&
                        <div className={styles.advise}>
                            {item.childProcess.map((e, index) => {
                                return (<div key={index}>
                                    {e.handleResult &&
                                        <React.Fragment>
                                            <div className={styles.bottomCont}>
                                                <div className={styles.operateTime}>{e.handleTime && moment(e.handleTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                <div className={styles.operateUser}>{e.nodeName} : {e.handleUser}</div>
                                                {e.isUploadImg &&
                                                    <div className={styles.imgDownLoad}>
                                                        <div onClick={() => this.showImgs(docketId, e.taskId)} className={styles.imgList}> 票据附件</div>
                                                        <div onClick={() => this.download(docketId, e.taskId)} className={styles.imgList}> 下载</div>
                                                    </div>
                                                    || ''
                                                }
                                            </div>
                                            <div className={styles.topCont}>
                                                <div className={styles.status}>{e.handleResult === 1 ? '通过' : '驳回'}</div>
                                                <div>处理建议:{e.handleDesc}</div>
                                            </div>
                                        </React.Fragment>
                                        || ''}
                                </div>);
                            })}
                        </div>
                    }
                </div>
            </div>);
    }

    render() {
        const { processData, nodeImg, docketId } = this.props;
        const { currentImgIndex, showImgModal } = this.state;
        const images = nodeImg.map((item, index) => {
            return {
                uid: `${item.imgUrl}_${index}`,
                rotate: item.rotate,
                thumbUrl: `${item.imgUrl}`,
            };
        });
        return (
            <div className={styles.timeLineWrap}>
                <ImgListModal
                    data={images}
                    imageListShow={showImgModal}
                    hideImg={this.closeImgs}
                    currentImgIndex={currentImgIndex}
                    changeCurrentImgIndex={this.changeCurrentImgIndex} />
                <div className={styles.title}>
                    <div className={styles.border}></div>
                    <div className={styles.text}>流程信息</div>
                    <div className={styles.border}></div>
                </div>
                <div className={styles.timeLines}>
                    {processData.map((item, index) => {
                        return (
                            this.renderItem(docketId, item, processData.length, index)
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TimeLine;
