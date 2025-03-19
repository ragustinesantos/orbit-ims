/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Pagination, Table, Text } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  Employee,
  OnDemandOrder,
  OrderRequisition,
  RecurringOrderTemplate,
} from '@/app/_utils/schema';
import {
  fetchEmployees,
  fetchOnDemandOrderRequisitions,
  fetchOrderRequisitions,
  fetchRorTemplates,
} from '@/app/_utils/utility';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import OdorModal from '../OdorModal/OdorModal';
import RorTemplateModal from '../RorTemplateModal/RorTemplateModal';
import classnames from './E2Access.module.css';

export default function E2AccessPage() {
  // State for fetching data
  const [rorTemplates, setRorTemplates] = useState<RecurringOrderTemplate[]>([]);
  const [allOdor, setAllOdor] = useState<OnDemandOrder[] | null>(null);
  const [allOrs, setAllOrs] = useState<OrderRequisition[] | null>(null);
  const [employeeWithRequisitions, setEmployeeWithRequisitions] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // State for modal tracking
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);
  const [isE2PageView, setIsE2PageView] = useState(true);

  // Function to show notifications
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Toggle modal state for ROR templates
  const toggleModalState = (templateId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [templateId]: !prev[templateId] }));
  };

  // Toggle modal state for ODOR
  const toggleOdorModalState = (odorId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [odorId]: !prev[odorId] }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-us');
  };

  const handleApproval = async (message: string, templateId: string, isApproved: boolean) => {
    if (message === 'success') {
      // Update the specific template's approval status immediately in local state
      setRorTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.rorTemplateId === templateId
            ? { ...template, isTemplateApprovedE2: isApproved }
            : template
        )
      );

      setNotificationMessage(
        CustomNotification(
          'success',
          'Template Approval',
          `Template ID ${templateId} was ${isApproved ? 'APPROVED' : 'REJECTED'}.`,
          setShowNotification
        )
      );
    } else if (message === 'error') {
      console.error(Error);
      setNotificationMessage(
        CustomNotification(
          'error',
          'Approval Error',
          `Failed to update Template ID ${templateId}.`,
          setShowNotification
        )
      );
    }
    revealNotification();
  };

  // Handle ODOR approval
  const handleOdorApproval = async (message: string, odorId: string, isApproved: boolean) => {
    if (message === 'success') {
      // Update the specific ODOR's approval status immediately in local state
      setAllOrs(
        (prevOrs) =>
          prevOrs?.map((or) =>
            or.requisitionTypeId === odorId ? { ...or, isApprovedE2: isApproved } : or
          ) || null
      );

      setNotificationMessage(
        CustomNotification(
          'success',
          'ODOR Approval',
          `ODOR ID ${odorId} was ${isApproved ? 'APPROVED' : 'REJECTED'}.`,
          setShowNotification
        )
      );
    } else if (message === 'error') {
      console.error(Error);
      setNotificationMessage(
        CustomNotification(
          'error',
          'Approval Error',
          `Failed to update ODOR ID ${odorId}.`,
          setShowNotification
        )
      );
    }
    revealNotification();
  };

  // Use effect to store order requisitions for mapping
  useEffect(() => {
    const retrieveRequisition = async () => {
      setLoading(true);
      try {
        await fetchRorTemplates(setRorTemplates);
        await fetchOnDemandOrderRequisitions(setAllOdor);
        await fetchOrderRequisitions(setAllOrs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    retrieveRequisition();
  }, [refreshTrigger]);

  // Sort ODOR by date
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
  }, [allOdor, allOrs]);

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

  // Map templates to table rows
  const mappedTemplates = rorTemplates.map((template) => [
    <>
      <RorTemplateModal
        recurringOrderTemplate={template}
        isOpened={!!modalStateTracker[template.rorTemplateId]}
        isClosed={() =>
          setModalStateTracker((prev) => ({ ...prev, [template.rorTemplateId]: false }))
        }
        handleApprovalE2={handleApproval}
        handleApprovalE3={undefined}
        isE2Page={isE2PageView}
      />
      {/* Open Modal when clicking the Template ID */}
      <Text
        key={`temp-${template.rorTemplateId}`}
        className={classnames.templateTextId}
        onClick={() => toggleModalState(template.rorTemplateId)}
      >
        {template.rorTemplateId}
      </Text>
    </>,
    <Text key={`name-${template.rorTemplateId}`}>{template.templateName}</Text>,
    <ApprovalBadge
      key={`approval-${template.rorTemplateId}`}
      isApproved={template.isTemplateApprovedE2}
    />,
  ]);

  // Map ODOR data to table rows
  const mappedOdors =
    allOdor
      ?.map((odor) => {
        // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the odor
        const matchingOr = allOrs?.find((or) => or.requisitionTypeId === odor.odorId);
        const matchingEmployee = employeeWithRequisitions.find(
          (emp) => emp.employeeId === matchingOr?.employeeId
        );

        // Only show active requisitions
        if (matchingOr?.isActive) {
          return [
            <>
              <OdorModal
                onDemandOrder={odor}
                isOpened={!!modalStateTracker[odor.odorId]}
                isClosed={() => setModalStateTracker((prev) => ({ ...prev, [odor.odorId]: false }))}
                handleApprovalE2={handleOdorApproval}
                isE2Page={isE2PageView}
              />
              <Text
                key={`odor-${odor.odorId}`}
                className={classnames.odorTextId}
                onClick={() => toggleOdorModalState(odor.odorId)}
              >
                {odor.odorId}
              </Text>
            </>,
            <Text key={`emp-${odor.odorId}`}>
              {matchingEmployee
                ? `${matchingEmployee.firstName} ${matchingEmployee.lastName}`
                : 'Unknown'}
            </Text>,
            <Text key={`date-${odor.odorId}`}>
              {matchingOr ? formatDate(matchingOr.requisitionDate) : 'Unknown'}
            </Text>,
            <ApprovalBadge key={`approval-${odor.odorId}`} isApproved={matchingOr?.isApprovedE2} />,
          ];
        }

        // Return empty array for inactive requisitions
        return [];
      })
      .filter((row) => row.length > 0) || [];

  return (
    <main>
      <Text className={classnames.rootText}>E2 Access</Text>
      <div className={classnames.rootMainGroup}>
        {loading ? (
          <Group classNames={{ root: classnames.loadingContainer }}>
            <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
          </Group>
        ) : (
          <>
            <div className={classnames.rootSectionGroup}>
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <Text className={classnames.rootSectionText}>ROR Template</Text>
              </div>

              <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table stickyHeader striped className={classnames.rootRequisitionTable}>
                  <Table.Thead
                    classNames={{
                      thead: classnames.rootRequisitionThead,
                    }}
                  >
                    <Table.Tr>
                      <Table.Th>Template ID</Table.Th>
                      <Table.Th>Template Name</Table.Th>
                      <Table.Th>Approval Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mappedTemplates.map((row, index) => (
                      <Table.Tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <Table.Td key={cellIndex}>{cell}</Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>

            <div className={classnames.rootSectionGroup} style={{ marginTop: '20px' }}>
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <Text className={classnames.rootSectionText}>ODOR Requisitions</Text>
              </div>

              <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table stickyHeader striped className={classnames.rootRequisitionTable}>
                  <Table.Thead
                    classNames={{
                      thead: classnames.rootRequisitionThead,
                    }}
                  >
                    <Table.Tr>
                      <Table.Th>ODOR ID</Table.Th>
                      <Table.Th>Employee</Table.Th>
                      <Table.Th>Date Submitted</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mappedOdors.map((row, index) => (
                      <Table.Tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <Table.Td key={cellIndex}>{cell}</Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>

      {showNotification && notificationMessage}
    </main>
  );
}
