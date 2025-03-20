/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Pagination, Table, Text } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
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
import classnames from './E3Access.module.css';

export default function E3AccessPage() {
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
  const isE3PageView = true;

  useEffect(() => {
    // Fetch Templates, ODORs, Order Requisitions & Employees
    const fetchData = async () => {
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
    fetchData();
  }, [refreshTrigger]);

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

  // Function to show notifications
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-us');
  };

  // Toggle modal state
  const toggleModalState = (templateId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [templateId]: !prev[templateId] }));
  };

  const toggleOdorModalState = (odorId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [odorId]: !prev[odorId] }));
  };

  const handleApprovalE3 = async (message: string, templateId: string, isApproved: boolean) => {
    if (message === 'success') {
      setRorTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.rorTemplateId === templateId
            ? { ...template, isTemplateApprovedE3: isApproved }
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
      if (isApproved) {
        setRefreshTrigger((prev) => prev + 1);
      }
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

  const handleOdorApproval = async (message: string, odorId: string, isApproved: boolean) => {
    if (message === 'success') {
      setAllOrs(
        (prevOrs) =>
          prevOrs?.map((or) =>
            or.requisitionTypeId === odorId ? { ...or, isApprovedE3: isApproved } : or
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
      if (isApproved) {
        setRefreshTrigger((prev) => prev + 1);
      }
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

  const filteredTemplates = rorTemplates.filter(
    (template) => template.isTemplateApprovedE2 === true
  );

  // Map templates to table rows
  const mappedTemplates = filteredTemplates.map((template) => [
    <>
      <RorTemplateModal
        recurringOrderTemplate={template}
        isOpened={!!modalStateTracker[template.rorTemplateId]}
        isClosed={() =>
          setModalStateTracker((prev) => ({ ...prev, [template.rorTemplateId]: false }))
        }
        handleApprovalE2={undefined}
        handleApprovalE3={handleApprovalE3}
        isE3Page={isE3PageView}
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
      isApproved={template.isTemplateApprovedE3}
    />,
  ]);

  // Map ODOR data to table rows
  const mappedOdors =
    allOdor
      ?.map((odor) => {
        // Cross-reference and retrieve a matching order requisition based on the requisitionId stored in the odor
        const matchingOr = allOrs?.find((or) => or.requisitionTypeId === odor.odorId);
        const matchingEmployee = employeeWithRequisitions.find(
          (emp) => emp && emp.employeeId === matchingOr?.employeeId
        );

        // Only show active requisitions that have been approved by E2
        if (matchingOr?.isActive && matchingOr?.isApprovedE2 === true) {
          return [
            <>
              <OdorModal
                onDemandOrder={odor}
                isOpened={!!modalStateTracker[odor.odorId]}
                isClosed={() => setModalStateTracker((prev) => ({ ...prev, [odor.odorId]: false }))}
                handleApprovalE3={handleOdorApproval}
                isE3Page={isE3PageView}
              />
              <Text
                key={`odor-${odor.odorId}`}
                className={classnames.templateTextId}
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
              {matchingOr ? formatDate(matchingOr.requisitionDate) : ''}
            </Text>,
            <ApprovalBadge key={`approval-${odor.odorId}`} isApproved={matchingOr?.isApprovedE3} />,
          ];
        }
        return [];
      })
      .filter((row) => row.length > 0) || [];

  // Size for pagination
  const pageSize = 5;

  // Template Pagination
  const templateTotalPages = Math.ceil(mappedTemplates.length / pageSize);
  const templatePagination = usePagination({ total: templateTotalPages, initialPage: 1 });
  const paginatedTemplates = mappedTemplates.slice(
    (templatePagination.active - 1) * pageSize,
    templatePagination.active * pageSize
  );

  // ODOR Pagination
  const odorTotalPages = Math.ceil(mappedOdors.length / pageSize);
  const odorPagination = usePagination({ total: odorTotalPages, initialPage: 1 });
  const paginatedOdors = mappedOdors.slice(
    (odorPagination.active - 1) * pageSize,
    odorPagination.active * pageSize
  );

  return (
    <main>
      <Text className={classnames.rootText}>E3 Access</Text>
      <div className={classnames.rootMainGroup}>
        {loading ? (
          <Group className={classnames.loadingContainer}>
            <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
          </Group>
        ) : (
          <>
            <div className={classnames.rootSectionGroup}>
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <Text className={classnames.rootSectionText}>ROR Template</Text>
              </div>

              {filteredTemplates.length > 0 ? (
                <div style={{ width: '100%' }}>
                  <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
                    <Table stickyHeader striped className={classnames.rootRequisitionTable}>
                      <Table.Thead className={classnames.rootRequisitionThead}>
                        <Table.Tr>
                          <Table.Th>Template ID</Table.Th>
                          <Table.Th>Template Name</Table.Th>
                          <Table.Th>Approval Status</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {paginatedTemplates.map((row, index) => (
                          <Table.Tr key={index}>
                            {row.map((cell, cellIndex) => (
                              <Table.Td key={cellIndex}>{cell}</Table.Td>
                            ))}
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                    {mappedTemplates.length > 0 && (
                      <Pagination
                        value={templatePagination.active}
                        onChange={templatePagination.setPage}
                        total={templateTotalPages}
                      />
                    )}
                  </Group>
                </div>
              ) : (
                <Text className={classnames.noTemplatesText}>No Templates Need to be Approved</Text>
              )}
            </div>

            <div className={classnames.rootSectionGroup} style={{ marginTop: '20px' }}>
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <Text className={classnames.rootSectionText}>ODOR Requisitions</Text>
              </div>

              {mappedOdors.length > 0 ? (
                <div style={{ width: '100%' }}>
                  <Group classNames={{ root: classnames.rootPaginationGroupRequisition }}>
                    <Table stickyHeader striped className={classnames.rootRequisitionTable}>
                      <Table.Thead className={classnames.rootRequisitionThead}>
                        <Table.Tr>
                          <Table.Th>ODOR ID</Table.Th>
                          <Table.Th>Employee</Table.Th>
                          <Table.Th>Date Submitted</Table.Th>
                          <Table.Th>Status</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {paginatedOdors.map((row, index) => (
                          <Table.Tr key={index}>
                            {row.map((cell, cellIndex) => (
                              <Table.Td key={cellIndex}>{cell}</Table.Td>
                            ))}
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                    {mappedOdors.length > 0 && (
                      <Pagination
                        value={odorPagination.active}
                        onChange={odorPagination.setPage}
                        total={odorTotalPages}
                      />
                    )}
                  </Group>
                </div>
              ) : (
                <Text className={classnames.noTemplatesText}>No ODORs Need to be Approved</Text>
              )}
            </div>
          </>
        )}
      </div>

      {showNotification && notificationMessage}
    </main>
  );
}
