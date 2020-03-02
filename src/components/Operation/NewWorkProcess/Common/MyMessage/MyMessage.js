import React from 'react';
import PropTypes from 'prop-types';
import styles from './myMessage.scss';


export const MyMessage = ({message}) => {
  return (
    <div className={styles.myMessageBox}>
      {message || ''}
    </div>
  );
};

MyMessage.propTypes = {
  message: PropTypes.string,
};
