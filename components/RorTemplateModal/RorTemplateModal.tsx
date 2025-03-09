'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  ScrollArea,
  SimpleGrid,
  Table,
  TableData,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInventory } from '@/app/_utils/inventory-context';
import {
  defaultEmployee,
  RecurringOrderTemplate,
  Employee,
  rorTemplateModalProps,
} from '@/app/_utils/schema';
import { fetchEmployee, fetchRorTemplate, patchRorTemplateApproval } from '@/app/_utils/utility';
import ApprovalBadge from '../ApprovalBadge/ApprovalBadge';
import classnames from './RorTemplateModal.module.css';
import ImgModal from '../ImgModal/ImgModal';

export default function RorTemplateModal({
  recurringOrderTemplate,
  isOpened,
  isClosed,
  handleApprovalE2,
  handleApprovalE3,
  isE2Page=false,
  isE3Page=false
}: rorTemplateModalProps) {
  const { currentEmployee, inventory, supplierList, setRefresh } = useInventory();
  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] = useDisclosure(false);

  const [modalStateTracker, setModalStateTracker] = useState<Record<string, boolean>>({});
  const [approvalNameE2, setApprovalNameE2] = useState<string | null>(null);
  const [approvalNameE3, setApprovalNameE3] = useState<string | null>(null);
  const [approvalSelection, setApprovalSelection] = useState<boolean | null>(null);
  const [approvingE2, setApprovingE2] = useState<boolean>(false);
  const [approvingE3, setApprovingE3] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);

  useEffect(() => {
    const fetchApproverNames = async () => {
      if (recurringOrderTemplate) {
        if (recurringOrderTemplate.approvalE2) {
          const approverE2 = await fetchEmployee(recurringOrderTemplate.approvalE2);
          setApprovalNameE2(`${approverE2.firstName} ${approverE2.lastName}`);
        }
        if (recurringOrderTemplate.approvalE3) {
          const approverE3 = await fetchEmployee(recurringOrderTemplate.approvalE3);
          setApprovalNameE3(`${approverE3.firstName} ${approverE3.lastName}`);
        }
      }
    };
    fetchApproverNames();
  }, [recurringOrderTemplate]);


  const handleApproval = async (isApprovedE2: boolean | null, isApprovedE3: boolean | null) => {
    try {
      if (recurringOrderTemplate && currentEmployee) {
        const isE2 = currentEmployee.employeeLevel.includes('E2');
        const isE3 = currentEmployee.employeeLevel.includes('E3');
  
        if (!isE2 && !isE3) {
          console.error("User does not have approval permissions.");
          return;
        }
  
        const updatedE2 = isE2 ? isApprovedE2 : recurringOrderTemplate.isTemplateApprovedE2;
        const updatedE3 = isE3 ? isApprovedE3 : recurringOrderTemplate.isTemplateApprovedE3;
  
        const updatedE2Approver = isE2 ? currentEmployee.employeeId : recurringOrderTemplate.approvalE2;
        const updatedE3Approver = isE3 ? currentEmployee.employeeId : recurringOrderTemplate.approvalE3;
  
        await patchRorTemplateApproval(
          recurringOrderTemplate.rorTemplateId,
          updatedE2, 
          updatedE3, 
          updatedE2Approver,
          updatedE3Approver
        );
  
        if (isE2) {
          handleApprovalE2?.(recurringOrderTemplate.rorTemplateId, isApprovedE2);
          setApprovalNameE2(`${currentEmployee.firstName} ${currentEmployee.lastName}`);
          recurringOrderTemplate.isTemplateApprovedE2 = isApprovedE2; 
        }
        if (isE3) {
          handleApprovalE3?.(recurringOrderTemplate.rorTemplateId, isApprovedE3);
          setApprovalNameE3(`${currentEmployee.firstName} ${currentEmployee.lastName}`);
          recurringOrderTemplate.isTemplateApprovedE3 = isApprovedE3;
        }
  
        setRefresh((prev: number) => prev + 1);
      }
    } catch (error) {
      console.error("Approval error:", error);
    }

    // Close the main modal
    isClosed();

    //Close the confirmation modal
    close();
    
    // Return confirmation value to default
    setConfirmation(false);

    setRefresh((prev: number) => prev + 1);
  
  };
  
    // Execute approval after confirmation
    const confirmApproval = async () => {
      try {
        if (recurringOrderTemplate && currentEmployee && approvalSelection !== null) {
          const isE2 = approvingE2 && currentEmployee.employeeLevel.includes('E2');
          const isE3 = approvingE3 && currentEmployee.employeeLevel.includes('E3');
  
          if (!isE2 && !isE3) {
            console.error("User does not have approval permissions.");
            return;
          }
  
          const updatedE2 = isE2 ? approvalSelection : recurringOrderTemplate.isTemplateApprovedE2;
          const updatedE3 = isE3 ? approvalSelection : recurringOrderTemplate.isTemplateApprovedE3;
          const updatedE2Approver = isE2 ? currentEmployee.employeeId : recurringOrderTemplate.approvalE2;
          const updatedE3Approver = isE3 ? currentEmployee.employeeId : recurringOrderTemplate.approvalE3;
  
          await patchRorTemplateApproval(
            recurringOrderTemplate.rorTemplateId,
            updatedE2,
            updatedE3,
            updatedE2Approver,
            updatedE3Approver
          );
  
          if (isE2) {
            handleApprovalE2?.(recurringOrderTemplate.rorTemplateId, approvalSelection);
            setApprovalNameE2(`${currentEmployee.firstName} ${currentEmployee.lastName}`);
            recurringOrderTemplate.isTemplateApprovedE2 = approvalSelection;
          }
          if (isE3) {
            handleApprovalE3?.(recurringOrderTemplate.rorTemplateId, approvalSelection);
            setApprovalNameE3(`${currentEmployee.firstName} ${currentEmployee.lastName}`);
            recurringOrderTemplate.isTemplateApprovedE3 = approvalSelection;
          }
  
          setRefresh((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Approval error:", error);
      }
  
      closeConfirmation();
    };
  

  // Toggle image modal state
  const toggleImgModalState = (itemId: string) => {
    setModalStateTracker((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const [itemDetails, setItemDetails] = useState<Record<string, any>>({});


  useEffect(() => {
    const fetchItemDetails = async () => {
      if (recurringOrderTemplate?.itemList) {
        const itemsData: Record<string, any> = {};
  
        for (const itemId of recurringOrderTemplate.itemList) {
          const fetchedItem = inventory?.find((invItem) => invItem.itemId === itemId);
          if (fetchedItem) {
            itemsData[itemId] = fetchedItem;
          }
        }
        setItemDetails(itemsData);
      }
    };
  
    fetchItemDetails();
  }, [recurringOrderTemplate, inventory]);

  useEffect(()=>{},[]);
  

  const mappedItemList = (recurringOrderTemplate?.itemList ?? []).map((itemId: string) => {
    const currentItem = itemDetails[itemId] || {};
    const currentSupplier = supplierList?.find((supplier) => supplier.supplierId === currentItem?.supplierId);
  
    return [
      <Text key={`item-${itemId}`} onClick={() => toggleImgModalState(itemId)}>
        {currentItem?.itemName ?? "Unknown Item"}
      </Text>,
      currentItem?.category ?? "N/A",
      currentItem?.supplyUnit ?? "N/A",
      currentItem?.packageUnit ?? "N/A",
      currentSupplier?.supplierName ?? "Unknown Supplier",
      <ImgModal
        key={`img-${itemId}`}
        item={currentItem}
        isOpened={!!modalStateTracker[itemId]}
        isClosed={() => setModalStateTracker((prev) => ({ ...prev, [itemId]: false }))}
      />,
    ];
  });
  

  // Table structure for item details
  const tableData: TableData = {
    caption: 'End of Order List',
    head: ['Item', 'Category', 'Unit of Measurement', 'Package Unit', 'Supplier'],
    body: mappedItemList,
  };


  return (
    <Modal
      centered
      opened={isOpened}
      onClose={isClosed}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {recurringOrderTemplate ? (
        <>
        {/* Confirmation Modal */}
        <Modal opened={confirmationOpened} onClose={closeConfirmation} title="Confirmation" centered>
            <Text>Are you sure you want to {approvalSelection ? 'approve' : 'reject'} this request?</Text>
            <Group>
              <Button onClick={confirmApproval} color="#1B4965">
                Confirm
              </Button>
              <Button onClick={closeConfirmation} color="red">
                Cancel
              </Button>
            </Group>
          </Modal>

          <Text classNames={{ root: classnames.rootText }}>Recurring Order Template</Text>

          <SimpleGrid cols={2} classNames={{ root: classnames.rootSection }}>
            <TextInput disabled label="Template ID" value={recurringOrderTemplate.rorTemplateId} size="md" />
            <TextInput disabled label="Template Name" value={recurringOrderTemplate.templateName || "Unnamed Template"} size="md" />
          </SimpleGrid>
          <Table striped classNames={{ table: classnames.rootTable }} data={tableData} />
          <Text classNames={{ root: classnames.rootHeaderTxt }}>Approvals:</Text>
          <div className={classnames.approvalCardContainer}>
          <div className={classnames.approvalCard}>
          <Text classNames={{ root: classnames.rootHeaderTxt }}>
            {recurringOrderTemplate.isTemplateApprovedE2 === null
              ? "E2 Approval" 
              : recurringOrderTemplate.isTemplateApprovedE2 === true
              ? `Approved by ${approvalNameE2}` 
              : `Rejected by ${approvalNameE2}`} 
          </Text>
            <ApprovalBadge 
            key={`approval-${recurringOrderTemplate.rorTemplateId}`} 
            isApproved={
              recurringOrderTemplate.isTemplateApprovedE2
            } 
            /> 
         </div>
         <div className={classnames.approvalCard}>
         <Text classNames={{ root: classnames.rootHeaderTxt }}>
          {recurringOrderTemplate.isTemplateApprovedE3 === null
            ? "E3 Approval"
            : recurringOrderTemplate.isTemplateApprovedE3 === true
            ? `Approved by ${approvalNameE3}`
            : `Rejected by ${approvalNameE3}`}
        </Text>
          <ApprovalBadge 
          key={`approval-${recurringOrderTemplate.rorTemplateId}`} 
          isApproved={
            recurringOrderTemplate.isTemplateApprovedE3
            } 
          /> 
        </div>  
        </div>      
      </>
      ) : (
        <Group classNames={{ root: classnames.loadingContainer }}>
          <img src="/assets/loading/Spin@1x-1.0s-200px-200px.gif" alt="Loading..." />
        </Group>
      )}

{(currentEmployee?.employeeLevel.includes("E2") && recurringOrderTemplate.isTemplateApprovedE2 === null) ||
 (currentEmployee?.employeeLevel.includes("E3") && recurringOrderTemplate.isTemplateApprovedE3 === null) ? (
  <Group classNames={{ root: classnames.rootBtnArea }}>
    {/* E2 Approval */}
    {isE2Page&&currentEmployee?.employeeLevel.includes("E2") &&
      recurringOrderTemplate.isTemplateApprovedE2 === null && (
        <>
          <Button
            classNames={{ root: classnames.rootBtn }}
            onClick={() =>
              {
                setApprovalSelection(true); setApprovingE2(isE2Page); setApprovingE3(isE3Page); openConfirmation(); }
            }
            color="#1B4965"
          >
            Approve
          </Button>
          <Button
            classNames={{ root: classnames.rootBtn }}
            onClick={() =>
              {
                setApprovalSelection(false); setApprovingE2(isE2Page); setApprovingE3(isE3Page); openConfirmation(); }
            }
            color="red"
          >
            Reject
          </Button>
        </>
    )}

    {/* E3 Approval */}
    {isE3Page&&currentEmployee?.employeeLevel.includes("E3") &&
      recurringOrderTemplate.isTemplateApprovedE3 === null && (
        <>
          <Button
            classNames={{ root: classnames.rootBtn }}
            onClick={() =>{
             setApprovalSelection(true); setApprovingE2(isE2Page); setApprovingE3(isE3Page); openConfirmation(); }
            }
            color="#1B4965"
          >
            Approve
          </Button>
          <Button
            classNames={{ root: classnames.rootBtn }}
            onClick={() =>{
              setApprovalSelection(false); setApprovingE2(isE2Page); setApprovingE3(isE3Page); openConfirmation(); }
            }
            color="red"
          >
            Reject
          </Button>
        </>
    )}
  </Group>
) : null}

    </Modal>
  );
}
