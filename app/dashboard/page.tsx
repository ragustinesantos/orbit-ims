'use client';

import InventoryOverview from "@/components/InventoryOverview/InventoryOverview";
import { NavbarNested } from "@/components/NavbarNested/NavbarNested";

export default function DashBoard(){

    return(
        <main style={{ display: 'flex', width: '100vw',backgroundColor: '#f5f7fa',  }}>
              <NavbarNested />
              <div>
                <InventoryOverview/>
              </div>
        </main>      
    );

}