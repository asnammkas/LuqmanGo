/**
 * Premium Loading Skeleton Components for LuqmanGo
 * 
 * Provides shimmer-animated skeleton placeholders that match
 * the exact layout of the real components.
 */

/* ─── Base Skeleton Block ─────────────────────────────────── */
const SkeletonBlock = ({ width, height, borderRadius = '12px', style = {} }) => (
  <div
    className="skeleton-shimmer"
    style={{
      width: width || '100%',
      height: height || '16px',
      borderRadius,
      backgroundColor: '#E8E3D1',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  />
);

/* ─── Product Card Skeleton ─────────────────────────────── */
export const ProductCardSkeleton = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    {/* Image placeholder */}
    <SkeletonBlock
      height="0"
      borderRadius="var(--radius-lg)"
      style={{
        aspectRatio: '4 / 5',
        paddingBottom: '125%',
        height: 'auto',
      }}
    />
    {/* Info section */}
    <div style={{ padding: '0.8rem 0.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
        <SkeletonBlock width="65%" height="14px" borderRadius="8px" />
        <SkeletonBlock width="25%" height="14px" borderRadius="8px" />
      </div>
      <SkeletonBlock width="40%" height="10px" borderRadius="6px" style={{ marginTop: '0.3rem' }} />
    </div>
  </div>
);

/* ─── Product Grid Skeleton ─────────────────────────────── */
export const ProductGridSkeleton = ({ count = 4 }) => (
  <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          animation: `cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.06}s backwards`,
        }}
      >
        <ProductCardSkeleton />
      </div>
    ))}
  </div>
);

/* ─── Hero Carousel Skeleton ────────────────────────────── */
export const HeroSkeleton = () => (
  <div
    className="skeleton-shimmer"
    style={{
      width: '100%',
      height: '55vh',
      maxHeight: '500px',
      borderRadius: '20px',
      backgroundColor: '#E8E3D1',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Fake overlay content */}
    <div
      style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
      }}
    >
      <SkeletonBlock width="180px" height="18px" borderRadius="8px" style={{ backgroundColor: '#D5CFC3' }} />
      <SkeletonBlock width="120px" height="38px" borderRadius="50px" style={{ backgroundColor: '#D5CFC3' }} />
    </div>

    {/* Dot indicators */}
    <div
      style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
      }}
    >
      {[20, 6, 6, 6, 6].map((w, i) => (
        <SkeletonBlock key={i} width={`${w}px`} height="6px" borderRadius="3px" style={{ backgroundColor: '#D5CFC3' }} />
      ))}
    </div>
  </div>
);

/* ─── Category Grid Skeleton ────────────────────────────── */
export const CategoryGridSkeleton = () => (
  <div
    className="category-grid-layout"
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
    }}
  >
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

/* ─── Order Card Skeleton ───────────────────────────────── */
export const OrderCardSkeleton = () => (
  <div
    style={{
      backgroundColor: '#EAE1D3',
      borderRadius: '24px',
      padding: '1.5rem',
      border: '1px solid rgba(0,0,0,0.02)',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <SkeletonBlock width="100px" height="12px" borderRadius="6px" />
      <SkeletonBlock width="70px" height="20px" borderRadius="100px" />
    </div>
    <SkeletonBlock width="75%" height="14px" borderRadius="8px" style={{ marginBottom: '0.5rem' }} />
    <SkeletonBlock width="50%" height="12px" borderRadius="6px" />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem' }}>
      <SkeletonBlock width="80px" height="12px" borderRadius="6px" />
      <SkeletonBlock width="60px" height="14px" borderRadius="8px" />
    </div>
  </div>
);

/* ─── Admin Product Row Skeleton ────────────────────────── */
export const AdminProductRowSkeleton = () => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '1rem 1.2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      border: '1px solid rgba(0,0,0,0.04)',
    }}
  >
    <SkeletonBlock width="70px" height="70px" borderRadius="14px" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <SkeletonBlock width="40%" height="8px" borderRadius="4px" />
      <SkeletonBlock width="65%" height="14px" borderRadius="8px" />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
        <SkeletonBlock width="60px" height="12px" borderRadius="6px" />
        <SkeletonBlock width="70px" height="16px" borderRadius="100px" />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <SkeletonBlock width="36px" height="36px" borderRadius="12px" />
      <SkeletonBlock width="36px" height="36px" borderRadius="12px" />
    </div>
  </div>
);

/* ─── Generic Text Block Skeleton ───────────────────────── */
export const TextBlockSkeleton = ({ lines = 3, width }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        width={width || (i === lines - 1 ? '60%' : '100%')}
        height="12px"
        borderRadius="6px"
      />
    ))}
  </div>
);

export default SkeletonBlock;
