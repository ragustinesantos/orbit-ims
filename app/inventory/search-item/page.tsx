'use client';

import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import SearchItem from '../../../components/SearchItem/SearchItem';
import { defaultItem, Item} from '@/app/_utils/schema';
import { fetchInventory} from '@/app/_utils/utility';
import { useEffect, useState } from 'react';

export default function SearchItemPage() {
    const [inventory, setInventory] = useState<Item[]>([{ ...defaultItem }]);
    const [refresh, setRefresh] = useState<number>(0);
  
    useEffect(() => {
      fetchInventory(setInventory);
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
          height: '100vh',
          padding: 10,
        }}
      >
        <SearchItem inventory={inventory} />
      </div>
    </main>
  );
}