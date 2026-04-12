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
export const SkeletonBlock = ({ width = '100%', height = '20px', borderRadius = '4px', className = '', style = {} }) => {
  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={{ width, height, borderRadius, ...style }} 
    />
  );
};

export const ProductGridSkeleton = ({ count = 4 }) => (
  <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          animation: `cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.06}s backwards`,
        }}
      >
        <ProductSkeleton />
      </div>
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className={styles.hero}>
    <div style={{
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.8rem',
    }}>
      <SkeletonBlock width="180px" height="18px" borderRadius="8px" />
      <SkeletonBlock width="120px" height="38px" borderRadius="50px" />
    </div>

    <div style={{
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '6px',
    }}>
      {[20, 6, 6, 6, 6].map((w, i) => (
        <SkeletonBlock key={i} width={`${w}px`} height="6px" borderRadius="3px" />
      ))}
    </div>
  </div>
);

export const CategoryGridSkeleton = () => (
  <div className={styles.categoryGrid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.04}s backwards`,
        }}
      >
        <SkeletonBlock
          height="0"
          borderRadius="18px"
          style={{
            aspectRatio: '1',
            paddingBottom: '100%',
            height: 'auto',
          }}
        />
        <SkeletonBlock
          width="60%"
          height="10px"
          borderRadius="6px"
          style={{ marginTop: '10px' }}
        />
      </div>
    ))}
  </div>
);
