import styles from './Skeleton.module.css';

/**
 * Modern Skeleton Loader for Product Cards.
 */
export const ProductSkeleton = () => {
  return (
    <div className={styles.productCard}>
      <div className={`${styles.skeleton} ${styles.productImage}`} />
      <div className={`${styles.skeleton} ${styles.productTitle}`} />
      <div className={`${styles.skeleton} ${styles.productPrice}`} />
    </div>
  );
};

/**
 * Modern generic Skeleton block.
 */
export const SkeletonBlock = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={{ width, height, borderRadius }} 
    />
  );
};
