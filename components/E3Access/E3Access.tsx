/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Group, Table, Text } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { Employee, RecurringOrderTemplate } from '@/app/_utils/schema';
import { fetchEmployees, fetchRorTemplates } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import CustomNotification from '@/components/CustomNotification/CustomNotification';
import classnames from './E3Access.module.css';
import RorTemplateModal from '../RorTemplateModal/RorTemplateModal';

export default function E3AccessPage() {

  // State for fetching data
  const [rorTemplates, setRorTemplates] = useState<RecurringOrderTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for modal tracking
  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<div />);
  const [isE3PageView, setIsE3PageView] = useState(true);


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
  }, [refreshTrigger]);

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

  const handleApprovalE3 = async (message:string, templateId: string, isApproved: boolean) => {

    if(message==='success'){
      setNotificationMessage(
        CustomNotification(
          'success',
          'Template Approval',
          `Template ID ${templateId} was ${isApproved ? 'APPROVED' : 'REJECTED'}.`,
          setShowNotification
        )
      );
      if (status === 'APPROVED') {
        setRefreshTrigger(prev => prev + 1);
      }
    }else if (message === 'error') {
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
  
  const filteredTemplates = rorTemplates.filter(template => template.isTemplateApprovedE2 === true);

  // Map templates to table rows
  const mappedTemplates = filteredTemplates.map((template) => [
    <>
      <RorTemplateModal
       recurringOrderTemplate = {template}
       isOpened={!!modalStateTracker[template.rorTemplateId]}
       isClosed={() => setModalStateTracker((prev) => ({ ...prev, [template.rorTemplateId]: false }))}
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
    isApproved={
    template.isTemplateApprovedE3
  } 
/>

  ]);

  return (
    <main>
      <Text className={classnames.rootText}>E3 Access</Text>
      <div className={classnames.rootMainGroup}>
        {loading ? (
          <Group className={classnames.loadingContainer}>
            <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
          </Group>
        ) : (
          <div className={classnames.rootSectionGroup}>
            <div style={{ width: '100%', marginBottom: '16px' }}>
              <Text className={classnames.rootSectionText}>ROR Template</Text>
            </div>

            {filteredTemplates.length > 0 ? (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table stickyHeader striped className={classnames.rootRequisitionTable}>
                  <Table.Thead  className={classnames.rootRequisitionThead}>
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
            ) : (
              <Text className={classnames.noTemplatesText}>No Templates Need to be Approved</Text>
            )}
          </div>
        )}
      </div>
      
      {showNotification && notificationMessage}
    </main>
  );
}
