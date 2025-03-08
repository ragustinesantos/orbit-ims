/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Table, Text } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { Employee, RecurringOrderTemplate } from '@/app/_utils/schema';
import { fetchEmployees, fetchRorTemplates } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import RorModal from '../RorModal/RorModal';
import classnames from './E2Access.module.css';

export default function E2AccessPage() {

  // State for fetching data
  const [rorTemplates, setRorTemplates] = useState<RecurringOrderTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for modal tracking
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});
  
  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);

  useEffect(() => {
    // Fetch Templates & Employees
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchRorTemplates(setRorTemplates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  // Function to show notifications
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Toggle modal state
  const toggleModalState = (templateId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [templateId]: !prev[templateId] }));
  };

  // Map templates to table rows
  const mappedTemplates = rorTemplates.map((template) => [
    <>
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
    isApproved={
    template.approvalE2 === "true" 
      ? true
      : template.approvalE2 === "false"
      ? false
      : null
  } 
/>

  ]);

  return (
    <main>
      <Text className={classnames.rootText}>E2 Access</Text>
      <div className={classnames.rootMainGroup}>
      {loading ? (
            <Group classNames={{ root: classnames.loadingContainer }}>
            <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
          </Group>
          ) : (
        <div className={classnames.rootSectionGroup}>
          <div style={{ width: '100%', marginBottom: '16px' }}>
            <Text className={classnames.rootSectionText}>ROR Template</Text>
          </div>
          
          
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <Table stickyHeader striped className={classnames.rootRequisitionTable}>
                <Table.Thead  classNames={{
                  thead: classnames.rootRequisitionThead,
                }}>
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
        </div>)}
      </div>
      
      {showNotification && notificationMessage}
    </main>
  );
}
