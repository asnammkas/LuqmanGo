import React from 'react';
import { Trash2 } from 'lucide-react';
import styles from '../../pages/admin/ProductManagement.module.css';

const DeleteProductModal = ({ target, isDeleting, onCancel, onConfirm }) => {
  if (!target) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => { if (!isDeleting) onCancel(); }}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Warning Icon */}
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
          <Trash2 size={24} color="#EF4444" />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#001d04', textAlign: 'center', margin: '0 0 0.5rem' }}>
          Delete Product?
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#706F65', textAlign: 'center', lineHeight: 1.6, margin: '0 0 0.3rem' }}>
          You are about to permanently remove:
        </p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#001d04', textAlign: 'center', margin: '0 0 1.5rem' }}>
          "{target.title}"
        </p>
        <p style={{ fontSize: '0.75rem', color: '#B91C1C', textAlign: 'center', margin: '0 0 1.5rem', fontWeight: 500 }}>
          This action cannot be undone. The product image will also be removed from storage.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} disabled={isDeleting} style={{
              flex: 1, padding: '0.85rem', borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'white',
              color: '#706F65', fontWeight: 600, fontSize: '0.88rem',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
            }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} style={{
              flex: 1, padding: '0.85rem', borderRadius: '14px',
              border: 'none', backgroundColor: '#EF4444',
              color: 'white', fontWeight: 700, fontSize: '0.88rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
              opacity: isDeleting ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}>
            {isDeleting ? (
              <>
                <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Deleting...
              </>
            ) : (
              <><Trash2 size={15} /> Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
