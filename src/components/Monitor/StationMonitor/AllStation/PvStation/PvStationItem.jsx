import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Progress, Tabs, Icon, Button, Radio, Switch, Table } from "antd";

class PvStationItem extends React.Component{
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div>
              <div className={styles.stationCardContainer}>
              <div className={styles.stationCard}>
                <div className={styles.stationCardTitle}>圣经山</div>
                <div className={styles.stationCardProgress}>
                  <Progress percent={50} showInfo={false} />
                </div>
                <div className={styles.stationCardValue}>
                  <div className={styles.stationMark}>7.42MW</div>
                  <div>48MW</div>
                </div>
                <div className={styles.stationCardWindSpeed}>4.69m/s</div>
                <div className={styles.stationCardEquipmentNum}>
                  <div>24台</div>
                  <div className={styles.stationWarning}>⚠10</div>
                </div>
              </div>
              <div className={styles.stationCard}>
                <div className={styles.stationCardTitle}>圣经山</div>
                <div className={styles.stationCardProgress}>
                  <Progress percent={50} showInfo={false} />
                </div>
                <div className={styles.stationCardValue}>
                  <div className={styles.stationMark}>7.42MW</div>
                  <div>48MW</div>
                </div>
                <div className={styles.stationCardWindSpeed}>4.69m/s</div>
                <div className={styles.stationCardEquipmentNum}>
                  <div>24台</div>
                  <div className={styles.stationWarning}>⚠10</div>
                </div>
              </div>
              <div className={styles.stationCard}>
                <div className={styles.stationCardTitle}>圣经山</div>
                <div className={styles.stationCardProgress}>
                  <Progress percent={50} showInfo={false} />
                </div>
                <div className={styles.stationCardValue}>
                  <div className={styles.stationMark}>7.42MW</div>
                  <div>48MW</div>
                </div>
                <div className={styles.stationCardWindSpeed}>4.69m/s</div>
                <div className={styles.stationCardEquipmentNum}>
                  <div>24台</div>
                  <div className={styles.stationWarning}>⚠10</div>
                </div>
              </div>
              <div className={styles.stationCard}>
                <div className={styles.stationCardTitle}>圣经山</div>
                <div className={styles.stationCardProgress}>
                  <Progress percent={50} showInfo={false} />
                </div>
                <div className={styles.stationCardValue}>
                  <div className={styles.stationMark}>7.42MW</div>
                  <div>48MW</div>
                </div>
                <div className={styles.stationCardWindSpeed}>4.69m/s</div>
                <div className={styles.stationCardEquipmentNum}>
                  <div>24台</div>
                  <div className={styles.stationWarning}>⚠10</div>
                </div>
              </div>
              <div className={styles.stationCard}>
                <div className={styles.stationCardTitle}>圣经山</div>
                <div className={styles.stationCardProgress}>
                  <Progress percent={50} showInfo={false} />
                </div>
                <div className={styles.stationCardValue}>
                  <div className={styles.stationMark}>7.42MW</div>
                  <div>48MW</div>
                </div>
                <div className={styles.stationCardWindSpeed}>4.69m/s</div>
                <div className={styles.stationCardEquipmentNum}>
                  <div>24台</div>
                  <div className={styles.stationWarning}>⚠10</div>
                </div>
              </div>
            </div>

            </div>
        )
    }
}
export default (PvStationItem)
