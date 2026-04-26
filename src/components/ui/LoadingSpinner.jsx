import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 40, color = '#436132', label = '', className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        className={styles.premiumSpinner} 
        style={{ 
          width: size, 
          height: size, 
          '--spinner-color': color 
        }}
      >
        <div className={styles.ring1}></div>
        <div className={styles.ring2}></div>
        <div className={styles.dot}></div>
      </div>
      {label && <span className={styles.text}>{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
