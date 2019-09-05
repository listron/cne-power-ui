import React from 'react';
import styles from '../pointSide.scss';

/*
  格式： infoArray: [{name: '', value: '',}].
*/

function detailInfoPart({ data }) {
  return (
    <div className={styles.infoBox}>
      {data.map((e, i) => {
        let value;
        if (e.value || e.value === 0) {
          value = e.value;
        } else {
          value = '--';
        }
        return (
          <div key={e.name} className={styles.infocontainer}>
            <div className={styles.name}>{e.name}</div>
            <div className={styles.value} title={`${value}`}>{value}</div>
          </div>
        );
      })}

    </div>
  );
}

export default detailInfoPart;
