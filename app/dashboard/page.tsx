'use client';

import { Group } from '@mantine/core';
import DashboardTitle from '@/components/DashboardTitle/DashboardTitle';
import InventoryOverview from '@/components/InventoryOverview/InventoryOverview';
import { NavbarNested } from '@/components/NavbarNested/NavbarNested';
import RecentStockInOutTable from '@/components/RecentStockInOutTable/RecentStockInOutTable';
import RequisitionProcessTable from '@/components/RequisitionProcessTableE1/RequisitionProcessTable';
import classnames from './page.module.css';

export default function DashBoard() {
  return (
    <main style={{ display: 'flex', width: '100vw' }}>
      <NavbarNested />
      <div
        className="content-container"
        style={{
          margin: 'auto',
          height: '100vh',
          width: '100vw',
          overflowY: 'scroll',
          background: '#fafbfd',
        }}
      >
        <DashboardTitle />
        <Group classNames={{ root: classnames.responsiveLayout }}>
          <div className={classnames.sectionContainer}>
            <InventoryOverview />
          </div>
          <div className={classnames.sectionContainer}>
            <RequisitionProcessTable />
          </div>
          <div className={classnames.sectionContainer}>
            <RecentStockInOutTable />
          </div>
        </Group>
      </div>
    </main>
  );
}
