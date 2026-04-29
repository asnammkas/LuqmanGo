import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import ProductList from '../../components/admin/ProductList';
import ProductForm from '../../components/admin/ProductForm';
import DeleteProductModal from '../../components/admin/DeleteProductModal';
import styles from './ProductManagement.module.css';

const ProductManagement = () => {
  const { adminCatalog, fetchAdminCatalog, clearAdminCatalog, deleteProduct, updateProduct } = useProducts();
  const { categories: contextCategories } = useCategories();
  const products = adminCatalog || [];

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAdminCatalog();
    return () => clearAdminCatalog();
  }, [fetchAdminCatalog, clearAdminCatalog]);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    setIsEditing(true);
  };

  const handleToggleVisibility = async (product) => {
    try {
      const newVisibility = product.visible === false ? true : false;
      await updateProduct(product.id, { visible: newVisibility });
    } catch (err) {
      console.error('Toggle visibility failed:', err);
    }
  };

  const categories = ['All', ...new Set(contextCategories.map(c => c.name).filter(Boolean))];

  return (
    <>
      {isEditing ? (
        <ProductForm 
          currentProduct={currentProduct} 
          onClose={() => setIsEditing(false)} 
        />
      ) : (
        <ProductList 
          products={products}
          categories={categories}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          handleAddNew={handleAddNew}
          handleEdit={handleEdit}
          setDeleteTarget={setDeleteTarget}
          onToggleVisibility={handleToggleVisibility}
        />
      )}

      <DeleteProductModal 
        target={deleteTarget}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deleteProduct(deleteTarget.id);
          } catch (err) {
            console.error('Delete failed:', err);
          }
          setIsDeleting(false);
          setDeleteTarget(null);
        }}
      />
    </>
  );
};

export default ProductManagement;
