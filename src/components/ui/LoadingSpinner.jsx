import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 40, color = '#00C853', label = '', className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.spinner} style={{ width: size, height: size }}>
        <svg
          className={styles.spinAnimation}
          viewBox="0 0 50 50"
          style={{ width: size, height: size }}
        >
          <circle
            className={styles.circle}
            cx="25"
            cy="25"
            r="20"
            style={{ stroke: `${color}1A` }} // 10% opacity version of the color for the background track
          />
          <circle
            className={styles.path}
            cx="25"
            cy="25"
            r="20"
            style={{ stroke: color }}
          />
        </svg>
      </div>
      {label && <span className={styles.text}>{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
