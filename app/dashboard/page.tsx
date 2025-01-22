'use client';

import DashboardTitle from "@/components/DashboardTitle/DashboardTitle";
import InventoryOverview from "@/components/InventoryOverview/InventoryOverview";
import { NavbarNested } from "@/components/NavbarNested/NavbarNested";
import RequisitionProcessTable from "@/components/RequisitionProcessTableE1/RequisitionProcessTable";

export default function DashBoard(){

    return(
        <main style={{ display: 'flex', width: '100vw'}}>
              <NavbarNested /> 
              <div style={{margin:'auto',justifyContent:'center'}}>
              <DashboardTitle/>
                  <InventoryOverview/>
                  <RequisitionProcessTable/>
                </div>
        </main>      
    );
}