/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Pagination, Table, TableData, Text } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { Employee, OrderRequisition, PurchaseOrder } from '@/app/_utils/schema';
import { fetchEmployees, fetchOrderRequisition, fetchPurchaseOrders } from '@/app/_utils/utility';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import PoModal from '../PoModal/PoModal';
import classnames from './P2Access.module.css';

export default function P2AccessPage() {
  const [allPo, setAllPo] = useState<PurchaseOrder[] | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderRequisitions, setOrderRequisitions] = useState<Record<string, OrderRequisition>>({});
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  // State to trigger data refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to format date
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-us');
  };

  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const toggleModalState = (id: string) => {
    setModalStateTracker((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Function to handle approval activity from PoModal
  const handleApprovalActivity = (message: string, poId: string, status: string) => {
    // Show notification
    setNotificationMessage(
      CustomNotification(
        message,
        'PO Status Updated',
        `PO ID ${poId} was ${status}.`,
        setShowNotification
      )
    );
    revealNotification();

    // Trigger a refresh of the data
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch purchase orders and employees
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchPurchaseOrders(setAllPo);
        const employeeData = await fetchEmployees();
        setEmployees(employeeData || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // Fetch order requisitions for each purchase order
  useEffect(() => {
    const fetchOrderRequisitions = async () => {
      if (allPo && allPo.length > 0) {
        const requisitionsMap: Record<string, OrderRequisition> = {};

        // Fetch requisitions
        for (const po of allPo) {
          try {
            const requisition = await fetchOrderRequisition(po.requisitionId);
            if (requisition) {
              requisitionsMap[po.requisitionId] = requisition;
            }
          } catch (error) {
            console.error(`Error fetching requisition for ${po.requisitionId}:`, error);
          }
        }

        setOrderRequisitions(requisitionsMap);
      }
    };

    if (allPo) {
      fetchOrderRequisitions();
    }
  }, [allPo]);

  // Map purchase orders to table rows
  const mappedPo =
    allPo
      ?.filter((po) => po.isSubmitted)
      .map((po) => {
        // Get the order requisition for the purchase order
        const orderRequisition = orderRequisitions[po.requisitionId];

        // Find the employee who submitted the purchase order
        const submittingEmployee =
          orderRequisition &&
          employees.find((emp) => emp.employeeId === orderRequisition.employeeId);

        return [
          <Text key={`req-${po.requisitionId}`}>{po.requisitionId}</Text>,
          <Text key={`emp-${po.purchaseOrderId}`}>
            {submittingEmployee
              ? `${submittingEmployee.firstName} ${submittingEmployee.lastName}`
              : ''}
          </Text>,
          <Text key={`date-${po.purchaseOrderId}`}>{formatDate(po.purchaseOrderDate)}</Text>,
          <>
            <Text
              key={`po-${po.purchaseOrderId}`}
              onClick={() => toggleModalState(po.purchaseOrderId)}
              className={classnames.rootPoId}
            >
              {po.purchaseOrderId}
            </Text>
            <PoModal
              key={`modal-${po.purchaseOrderId}`}
              purchaseOrder={po}
              isOpened={!!modalStateTracker[po.purchaseOrderId]}
              isClosed={() =>
                setModalStateTracker((prev) => ({ ...prev, [po.purchaseOrderId]: false }))
              }
              handleApprovalActivity={handleApprovalActivity}
            />
          </>,
          <ApprovalBadge key={`status-${po.purchaseOrderId}`} isApproved={po.isApproved} />,
        ];
      }) || [];

  // Size for pagination
  const pageSize = 5;

  // PO Pagination
  const poTotalPages = Math.ceil(mappedPo.length / pageSize);
  const poPagination = usePagination({ total: poTotalPages, initialPage: 1 });
  const paginatedPo = mappedPo.slice(
    (poPagination.active - 1) * pageSize,
    poPagination.active * pageSize
  );

  const poTableData: TableData = {
    head: ['Requisition ID', 'Employee', 'Date Submitted', 'PO ID', 'PO Status'],
    body: paginatedPo,
  };

  return (
    <main>
      <Text classNames={{ root: classnames.rootText }}>P2 Access</Text>
      <div className={classnames.rootMainGroup}>
        <div className={classnames.rootSectionGroup}>
          <div style={{ width: '100%', marginBottom: '16px' }}>
            <Text classNames={{ root: classnames.rootSectionText }}>Purchase Orders</Text>
          </div>
          {loading ? (
            <Group classNames={{ root: classnames.loadingContainer }}>
              <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
            </Group>
          ) : (
            <div style={{ width: '100%' }}>
              <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
                <Table
                  stickyHeader
                  striped
                  data={poTableData}
                  classNames={{
                    table: classnames.rootRequisitionTable,
                    td: classnames.rootRequisitionTd,
                    thead: classnames.rootRequisitionThead,
                  }}
                />
                {mappedPo.length > 0 && (
                  <Pagination
                    value={poPagination.active}
                    onChange={poPagination.setPage}
                    total={poTotalPages}
                  />
                )}
              </Group>
            </div>
          )}
        </div>
      </div>
      {showNotification && notificationMessage}
    </main>
  );
}
