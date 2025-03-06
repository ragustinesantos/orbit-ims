/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Pagination, Table, TableData, Text } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import {
  Employee,
  OnDemandOrder,
  OrderRequisition,
  PurchaseOrder,
  RecurringOrder,
} from '@/app/_utils/schema';
import {
  fetchEmployees,
  fetchOnDemandOrderRequisitions,
  fetchOrderRequisitions,
  fetchPurchaseOrders,
  fetchRecurringOrderRequisitions,
  patchOrderRequisitionPo,
  postPurchaseOrder,
} from '@/app/_utils/utility';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import RorModal from '@/components/RorModal/RorModal';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import OdorModal from '../OdorModal/OdorModal';
import PoModal from '../PoModal/PoModal';
import StockOutModal from '../StockOutModal/StockOutModal';
import classnames from './P1Access.module.css';

export default function P1AccessPage() {
  // Required State to Keep Track of all modal states
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});

  // Sample states to store sample data to generate modals from
  const [allOrs, setAllOrs] = useState<OrderRequisition[] | null>(null);
  const [allRor, setAllRor] = useState<RecurringOrder[] | null>(null);
  const [allOdor, setAllOdor] = useState<OnDemandOrder[] | null>(null);
  const [allPo, setAllPo] = useState<PurchaseOrder[] | null>(null);
  const [employeeWithRequisitions, setEmployeeWithRequisitions] = useState<Employee[]>([]);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string | null>(null);

  // Show notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  // State for PO modal
  const [poModalOpen, setPoModalOpen] = useState<{ [key: string]: boolean }>({});

  //State for StockOutModal
  const [openedStockOutModal, setOpenedStockOutModal] = useState(false);

  //open StockOutModal
  const handleStockOutModalOpen = (requisitionId: string) => {
    setSelectedRequisitionId(requisitionId);
    setOpenedStockOutModal(true);
  };

  // close StockOutModal
  const handleStockOutModalClose = () => {
    setOpenedStockOutModal(false);
    setSelectedRequisitionId(null);
  };

  // Every time an ID is clicked this should run and set the state of modal visibility to the opposite of its previous value
  // Toggling a modal for the first time will generate a key-value pair within the state tracker
  const toggleModalState = (id: string) => {
    setModalStateTracker((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Function for formatting the date to be persisted
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-us');
  };

  // Function that should be passed to the modal to trigger the notification on the page it will be implemented on
  const handleApprovalActivity = (message: string, rorId: string, status: string) => {
    if (message === 'success') {
      setNotificationMessage(
        CustomNotification(
          'success',
          'ROR Approval',
          `ROR ID ${rorId} was ${status}.`,
          setShowNotification
        )
      );
    } else if (message === 'error') {
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          `Unexpected Error encountered. ROR ID ${rorId} was not ${status}. Please try again.`,
          setShowNotification
        )
      );
    }
    revealNotification();
  };

  // Function to reveal any triggered notification
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Sample use effect to store order requisitions and ror's for mapping
  useEffect(() => {
    const retrieveRequisition = async () => {
      try {
        await fetchOrderRequisitions(setAllOrs);
        await fetchRecurringOrderRequisitions(setAllRor);
        await fetchOnDemandOrderRequisitions(setAllOdor);
        await fetchPurchaseOrders(setAllPo);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveRequisition();
  }, []);

  // Sort OR
  useEffect(() => {
    const sortOr = async () => {
      try {
        allOrs?.sort((a, b) => {
          return new Date(b.requisitionDate).getTime() - new Date(a.requisitionDate).getTime();
        });
      } catch (error) {
        console.log(error);
      }
    };

    sortOr();
  }, [allOrs]);

  // Sort ROR
  useEffect(() => {
    const sortRor = async () => {
      try {
        allRor?.sort((a, b) => {
          const matchingOrA = allOrs?.find((or) => or.requisitionTypeId === a.rorId);
          const matchingOrB = allOrs?.find((or) => or.requisitionTypeId === b.rorId);

          // If both exist, compare by requisition date
          if (matchingOrA && matchingOrB) {
            return (
              new Date(matchingOrB.requisitionDate).getTime() -
              new Date(matchingOrA.requisitionDate).getTime()
            );
          }

          // If only matchingOrA exists, decide its position
          if (matchingOrA) {
            return 1;
          }
          // If only matchingOrB exists, decide its position
          if (matchingOrB) {
            return -1;
          }

          // If neither exist, they are considered equal
          return 0;
        });
      } catch (error) {
        console.log(error);
      }
    };

    sortRor();
  }, [allRor]);

  // Sort ODOR
  useEffect(() => {
    const sortOdor = async () => {
      try {
        allOdor?.sort((a, b) => {
          const matchingOrA = allOrs?.find((or) => or.requisitionTypeId === a.odorId);
          const matchingOrB = allOrs?.find((or) => or.requisitionTypeId === b.odorId);

          // If both exist, compare by requisition date
          if (matchingOrA && matchingOrB) {
            return (
              new Date(matchingOrB.requisitionDate).getTime() -
              new Date(matchingOrA.requisitionDate).getTime()
            );
          }

          // If only matchingOrA exists, decide its position
          if (matchingOrA) {
            return 1;
          }
          // If only matchingOrB exists, decide its position
          if (matchingOrB) {
            return -1;
          }

          // If neither exist, they are considered equal
          return 0;
        });
      } catch (error) {
        console.log(error);
      }
    };

    sortOdor();
  }, [allOdor]);

  // Sort PO
  useEffect(() => {
    const sortPo = async () => {
      try {
        allPo?.sort((a, b) => {
          const matchingOrA = allOrs?.find((or) => or.purchaseOrderId === a.purchaseOrderId);
          const matchingOrB = allOrs?.find((or) => or.purchaseOrderId === b.purchaseOrderId);

          // If both exist, compare by requisition date
          if (matchingOrA && matchingOrB) {
            return (
              new Date(matchingOrB.requisitionDate).getTime() -
              new Date(matchingOrA.requisitionDate).getTime()
            );
          }

          // If only matchingOrA exists, decide its position
          if (matchingOrA) {
            return 1;
          }
          // If only matchingOrB exists, decide its position
          if (matchingOrB) {
            return -1;
          }

          // If neither exist, they are considered equal
          return 0;
        });
      } catch (error) {
        console.log(error);
      }
    };

    sortPo();
  }, [allPo]);

  // Retrieve employees with active requisitions
  useEffect(() => {
    const retrieveEmployeeWithReq = async () => {
      try {
        const employees = await fetchEmployees();

        // Map out Order Requisitions and return the employee with an active requisition that matches the query
        const matchingEmployees = allOrs
          ?.filter((or) => or.isActive)
          .map((or) => {
            return employees?.find((emp: Employee) => emp.employeeId === or.employeeId);
          });

        //Either provide a valid value or empty array to the setter
        setEmployeeWithRequisitions(matchingEmployees ?? []);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveEmployeeWithReq();
  }, [allOrs]);

  // Map through RORs and return components only for active requisitions
  const mappedRor = allRor?.map((ror) => {
    // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the ror
    const matchingOr = allOrs?.find((or) => or.requisitionTypeId === ror.rorId);
    const matchingEmployee = employeeWithRequisitions.find(
      (emp) => emp.employeeId === matchingOr?.employeeId
    );

    // If the matching order requisition is active, generate a table line containing the modal
    if (matchingOr?.isActive) {
      return [
        <>
          <RorModal
            recurringOrder={ror}
            // Retrieve the actual state of the modal, !! will retrieve it's actual value because default is 'falsey'
            isOpened={!!modalStateTracker[ror.rorId]}
            // Close the modal by setting its opened state to false
            isClosed={() => setModalStateTracker((prev) => ({ ...prev, [ror.rorId]: false }))}
            handleApprovalActivity={handleApprovalActivity}
          />

          {/* When the ID text is clicked, this will toggle the state of the modal visibility.*/}
          <Text
            onClick={() => toggleModalState(ror.rorId)}
            classNames={{ root: classnames.rootTextId }}
          >
            {ror.rorId}
          </Text>
        </>,
        <Text>
          {matchingEmployee?.firstName} {matchingEmployee?.lastName}
        </Text>,
        <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
        <ApprovalBadge isApproved={matchingOr.isApprovedP1} />,
      ];
    }

    // Else return an empty line (array)
    return [];
  });

  // Map through ODORs and return components only for active requisitions
  const mappedOdor = allOdor?.map((odor) => {
    // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the ror
    const matchingOr = allOrs?.find((or) => or.requisitionTypeId === odor.odorId);
    const matchingEmployee = employeeWithRequisitions.find(
      (emp) => emp.employeeId === matchingOr?.employeeId
    );

    // If the matching order requisition is active, generate a table line containing the modal
    if (matchingOr?.isActive && matchingOr.isApprovedE2 && matchingOr.isApprovedE3) {
      return [
        <>
          <OdorModal
            onDemandOrder={odor}
            // Retrieve the actual state of the modal, !! will retrieve it's actual value because default is 'falsey'
            isOpened={!!modalStateTracker[odor.odorId]}
            // Close the modal by directly setting its opened state to false
            isClosed={() => setModalStateTracker((prev) => ({ ...prev, [odor.odorId]: false }))}
            handleApprovalActivity={handleApprovalActivity}
          />

          {/* When the ID text is clicked, this will toggle the state of the modal visibility.*/}
          <Text
            onClick={() => toggleModalState(odor.odorId)}
            classNames={{ root: classnames.rootTextId }}
          >
            {odor.odorId}
          </Text>
        </>,
        <Text>
          {matchingEmployee?.firstName} {matchingEmployee?.lastName}
        </Text>,
        <Text>{formatDate(matchingOr.requisitionDate)}</Text>,
        <ApprovalBadge isApproved={matchingOr.isApprovedP1} />,
      ];
    }

    // Else return an empty line (array)
    return [];
  });

  // Map through Order Requisitions and return components only for active requisitions
  const mappedOr = allOrs?.map((or) => {
    // Cross-reference and retrieve a matching employee based on the requisitionId stored in the ror
    const matchingEmployee = employeeWithRequisitions.find(
      (emp) => emp.employeeId === or?.employeeId
    );
    const matchingPo = allPo?.find((po) => po.purchaseOrderId === or.purchaseOrderId);

    // If the matching order requisition is active and fully approved based on the requisition type, generate a table line containing the modal
    if (
      matchingPo &&
      or?.isActive &&
      ((or?.requisitionType === 'odor' &&
        or?.isApprovedE2 &&
        or?.isApprovedE3 &&
        or?.isApprovedP1) ||
        (or?.requisitionType === 'ror' && or?.isApprovedP1))
    ) {
      return [
        <Text classNames={{ root: classnames.rootTextId }}>{or.requisitionId}</Text>,
        <Text>
          {matchingEmployee?.firstName} {matchingEmployee?.lastName}
        </Text>,
        <Text>{formatDate(or.requisitionDate)}</Text>,
        <ApprovalBadge isApproved={or.isApprovedP1} />,
        poModalOpen[matchingPo.purchaseOrderId] ? (
          <Text classNames={{ root: classnames.rootPoId }}>{matchingPo.purchaseOrderId}</Text>
        ) : (
          <>
            {poModalOpen[matchingPo.purchaseOrderId] && (
              // To Do: Implement modal -- right now it just shows the PO ID without the modal
              <PoModal
                purchaseOrder={matchingPo}
                isOpened={poModalOpen[matchingPo.purchaseOrderId]}
                isClosed={() =>
                  setPoModalOpen((prev) => ({ ...prev, [matchingPo.purchaseOrderId]: false }))
                }
              />
            )}
            <button
              className={classnames.generatePoButton}
              onClick={() => {
                // Open the modal when clicked
                setPoModalOpen((prev) => ({ ...prev, [matchingPo.purchaseOrderId]: true }));
              }}
            >
              + PO
            </button>
          </>
        ),
        <ApprovalBadge isApproved={matchingPo.isApproved} />,

        <Text
          className={classnames.generateSoButton}
          onClick={() => handleStockOutModalOpen(or.requisitionId)}
        >
          + SO
        </Text>,
        <button className={classnames.closeTicketButton}>Close</button>,
      ];
    }

    // Else return an empty line (array)
    return [];
  });

  // Function to generate PO for "+ PO" button
  const generatePo = async (requisitionId: string) => {
    // Check if a PO already exists containing the requisition ID
    if (!allPo?.find((po) => po.requisitionId === requisitionId)) {
      try {
        // Generate PO from object, referencing the requisition ID within the PO object
        const generatedPoId = await postPurchaseOrder(requisitionId);

        // Reference the generated PO's ID within the order requisition
        await patchOrderRequisitionPo(requisitionId, generatedPoId);

        // Create Success Notification
        setNotificationMessage(
          CustomNotification(
            'Success',
            'PO Created!',
            `Purchase Order #${generatedPoId} has been successfully created`,
            setShowNotification
          )
        );
      } catch (error) {
        console.log(error);

        // Create Error Notification
        setNotificationMessage(
          CustomNotification(
            'error',
            'Error Encountered',
            'Unexpected Error encountered. Please try again.',
            setShowNotification
          )
        );

        // Toggle Notification
        revealNotification();
      }
    } else {
      // Create Error Notification
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          `PO for requisition #${requisitionId} already exists`,
          setShowNotification
        )
      );

      // Toggle Notification
      revealNotification();
    }
  };

  // Size or requisition pagination
  const requisitionSize = 5;

  // Clean mapped items to remove blank rows
  const cleanedMappedRor = (mappedRor ?? []).filter((row) => row.length > 0);
  const cleanedMappedOdor = (mappedOdor ?? []).filter((row) => row.length > 0);
  const cleanedMappedOr = (mappedOr ?? []).filter((row) => row.length > 0);

  // Ror Pagination
  const rorTotalPages = Math.ceil((cleanedMappedRor ?? []).length / requisitionSize);
  const rorPagination = usePagination({ total: rorTotalPages, initialPage: 1 });
  const paginatedRor = (cleanedMappedRor ?? []).slice(
    (rorPagination.active - 1) * requisitionSize,
    rorPagination.active * requisitionSize
  );

  // ODOR Pagination
  const odorTotalPages = Math.ceil((cleanedMappedOdor ?? []).length / requisitionSize);
  const odorPagination = usePagination({ total: odorTotalPages, initialPage: 1 });
  const paginatedOdor = (cleanedMappedOdor ?? []).slice(
    (odorPagination.active - 1) * requisitionSize,
    odorPagination.active * requisitionSize
  );

  // PO Pagination
  const poSize = 4;
  const poTotalPages = Math.ceil((cleanedMappedOr ?? []).length / poSize);
  const poPagination = usePagination({ total: poTotalPages, initialPage: 1 });
  const paginatedPo = (cleanedMappedOr ?? []).slice(
    (poPagination.active - 1) * poSize,
    poPagination.active * poSize
  );

  // Sample table to contain line items that can generate the modal
  const rorTableData: TableData = {
    head: ['ROR ID', 'Employee', 'Date Submitted', 'Status'],
    body: paginatedRor,
  };

  const odorTableData: TableData = {
    head: ['ODOR ID', 'Employee', 'Date Submitted', 'Status'],
    body: paginatedOdor,
  };

  const poTableData: TableData = {
    head: [
      'Requisition ID',
      'Employee',
      'Date Submitted',
      'Status',
      'PO ID',
      'PO Status',
      'Generate SO',
      'Close Ticket',
    ],
    body: paginatedPo,
  };

  return (
    <main>
      <Text classNames={{ root: classnames.rootText }}>P1 Access</Text>
      {allOdor && allOrs && allRor && allPo ? (
        <Group classNames={{ root: classnames.rootMainGroup }}>
          <Group classNames={{ root: classnames.rootSectionGroup }}>
            <Text classNames={{ root: classnames.rootSectionText }}>Order Requisitions</Text>
            <Group classNames={{ root: classnames.rootTableGroup }}>
              <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
                <Table
                  stickyHeader
                  striped
                  data={rorTableData}
                  classNames={{
                    table: classnames.rootRequisitionTable,
                    td: classnames.rootRequisitionTd,
                    thead: classnames.rootRequisitionThead,
                  }}
                />
                {cleanedMappedRor && (
                  <Pagination
                    value={rorPagination.active}
                    onChange={rorPagination.setPage}
                    total={rorTotalPages}
                  />
                )}
              </Group>
              <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
                <Table
                  striped
                  data={odorTableData}
                  classNames={{
                    table: classnames.rootRequisitionTable,
                    thead: classnames.rootRequisitionThead,
                  }}
                />
                {cleanedMappedOdor && (
                  <Pagination
                    value={odorPagination.active}
                    onChange={odorPagination.setPage}
                    total={odorTotalPages}
                  />
                )}
              </Group>
            </Group>
          </Group>
          <Group classNames={{ root: classnames.rootSectionGroup }}>
            <Text classNames={{ root: classnames.rootSectionText }}>Purchase Orders</Text>
            <Group classNames={{ root: classnames.rootPaginationGroupPo }}>
              <Table
                stickyHeader
                striped
                data={poTableData}
                classNames={{
                  thead: classnames.rootRequisitionThead,
                }}
              />
              {cleanedMappedOr && (
                <Pagination
                  value={poPagination.active}
                  onChange={poPagination.setPage}
                  total={poTotalPages}
                />
              )}
            </Group>
          </Group>
          {showNotification && notificationMessage}
        </Group>
      ) : (
        <Group classNames={{ root: classnames.loadingContainer }}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </Group>
      )}
      {selectedRequisitionId && (
        <StockOutModal
          opened={openedStockOutModal}
          close={handleStockOutModalClose}
          requisitionId={selectedRequisitionId}
        />
      )}
    </main>
  );
}
