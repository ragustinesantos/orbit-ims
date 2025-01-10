'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import UpdateItem from '@/components/UpdateItem/UpdateItem';
import { defaultItem, defaultSupplier, Item, Supplier } from '@/app/_utils/schema';
import { fetchCategories, fetchInventory, fetchSuppliers } from '@/app/_utils/utility';
import { useEffect, useState } from 'react';

export default function UpdateItemPage() {
  const [inventory, setInventory] = useState<Item[]>([{ ...defaultItem }]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([{ ...defaultSupplier }]);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    fetchInventory(setInventory);
    fetchSuppliers(setSupplierList);
    fetchCategories(setCategoryList);
  }, [refresh]);

  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minWidth: '50vw',
          //height: '100vh',
          padding: 10,
        }}
      >
        <UpdateItem inventory={inventory} supplierList={supplierList} categoryList={categoryList} setRefresh={setRefresh} />
      </div>
    </main>
  );
}