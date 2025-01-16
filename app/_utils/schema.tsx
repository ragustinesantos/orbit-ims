import { IconGauge, IconMessage, IconNotes, IconUsers } from '@tabler/icons-react';

export interface Item {
  itemId: string;
  supplierId: string;
  inventoryId: string;
  itemName: string;
  currentStockInStoreRoom: number;
  packageUnit: string;
  supplyUnit: string;
  category: string;
  isCritical: boolean;
  isCriticalThreshold: number;
  minPurchaseQty: number;
}

export interface ItemToEdit {
  supplierId: string;
  inventoryId: string;
  itemName: string;
  currentStockInStoreRoom: number;
  packageUnit: string;
  supplyUnit: string;
  category: string;
  isCritical: boolean;
  isCriticalThreshold: number;
  minPurchaseQty: number;
  [key: string]: any;
}

export const defaultItem: Item = {
  itemId: '',
  supplierId: '',
  inventoryId: '',
  itemName: '',
  currentStockInStoreRoom: 0,
  packageUnit: '',
  supplyUnit: '',
  category: '',
  isCritical: false,
  isCriticalThreshold: 0,
  minPurchaseQty: 0,
};

export interface Supplier {
  supplierId: string;
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
}

export const defaultSupplier: Supplier = {
  supplierId: '',
  supplierName: '',
  contactNumber: '',
  email: '',
  address: '',
};

export interface SupplierToEdit {
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
  [key: string]: any;
}

export interface Employee {
  employeeId: string;
  employeeWorkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  password: string;
  employeeLevel: string;
  chatId: string[];
}

export interface EmployeeToEdit {
  employeeWorkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  password: string;
  employeeLevel: string;
  chatId: string[];
  [key: string]: any;
}

export interface Chat {
  chatId: string;
  type: string;
  userId: string;
  message: string;
  timestamp: string;
}

export interface ChatToEdit {
  type: string;
  employeeId: string;
  message: string;
  timestamp: string;
}

export interface OrderRequisition {
  requisitionId: string;
  requisitionType: string;
  requisitionDate: Date;
  employeeId: string;
  approvalE2: string;
  approvalE3: string;
  approvalP1: string;
  isApprovedE2: boolean;
  isApprovedE3: boolean;
  isApprovedP1: boolean;
  recipientName: string;
  disposalPlan: string;
  remarks: string;
}

export interface OrderRequisitionToEdit {
  requisitionType: string;
  requisitionDate: Date;
  employeeId: string;
  approvalE2: string;
  approvalE3: string;
  approvalP1: string;
  isApprovedE2: boolean;
  isApprovedE3: boolean;
  isApprovedP1: boolean;
  recipientName: string;
  disposalPlan: string;
  remarks: string;
  [key: string]: any;
}

export interface ItemOrder {
  itemId: string;
  orderQty: number;
  pendingQty: number;
  servedQty: number;
}

export interface RecurringOrder {
  rorId: string;
  rorTemplateId: string;
  requisitionId: string;
  itemOrders: ItemOrder[];
  orderTotal: number;
}

export interface RecurringOrderToEdit {
  rorTemplateId: string;
  requisitionId: string;
  itemOrders: ItemOrder[];
  orderTotal: number;
  [key: string]: any;
}

export interface RecurringOrderTemplate {
  rorTemplateId: string;
  templateName: string;
  itemList: string[];
  isTemplateApprovedE2: boolean;
  isTemplateApprovedE3: boolean;
}

export interface RecurringOrderTemplateToEdit {
  templateName: string;
  itemList: string[];
  isTemplateApprovedE2: boolean;
  isTemplateApprovedE3: boolean;
  [key: string]: any;
}

export const NAV_ITEMS = {
  E1: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [{ label: 'Chat', link: '/assistant/chat' }],
    },
    {
      label: 'ROR',
      icon: IconNotes,
      links: [{ label: 'Create Recurring Order', link: '/' }],
    },
    {
      label: 'ODOR',
      icon: IconNotes,
      links: [{ label: 'Create On-demand Order Requisition', link: '/' }],
    },
    {
      label: 'Inventory',
      icon: IconNotes,
      links: [{ label: 'Search Item', link: '/' }],
    },
  ],
  E2: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [{ label: 'Chat', link: '/assistant/chat' }],
    },
    {
      label: 'ROR',
      icon: IconNotes,
      links: [{ label: 'Create Recurring Order', link: '/' }],
    },
    {
      label: 'ODOR',
      icon: IconNotes,
      links: [{ label: 'Create On-demand Order Requisition', link: '/' }],
    },
    {
      label: 'Inventory',
      icon: IconNotes,
      links: [{ label: 'Search Item', link: '/' }],
    },
    {
      label: 'E2 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  E3: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [{ label: 'Chat', link: '/assistant/chat' }],
    },
    {
      label: 'ROR',
      icon: IconNotes,
      links: [{ label: 'Create Recurring Order', link: '/' }],
    },
    {
      label: 'ODOR',
      icon: IconNotes,
      links: [{ label: 'Create On-demand Order Requisition', link: '/' }],
    },
    {
      label: 'Inventory',
      icon: IconNotes,
      links: [{ label: 'Search Item', link: '/' }],
    },
    {
      label: 'E3 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  P1: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/' },
      ],
    },
    {
      label: 'ROR',
      icon: IconNotes,
      links: [{ label: 'Create Recurring Order', link: '/' }],
    },
    {
      label: 'ODOR',
      icon: IconNotes,
      links: [{ label: 'Create On-demand Order Requisition', link: '/' }],
    },
    {
      label: 'Manage Inventory',
      icon: IconNotes,
      links: [
        { label: 'Search Item', link: '/inventory/search-item' },
        { label: 'Add Item', link: '/inventory/add-item' },
        { label: 'Update Item', link: '/inventory/update-item' },
        { label: 'Delete Item', link: '/inventory/delete-item' },
        { label: 'Stock In', link: '/' },
        { label: 'Stock Out', link: '/' },
      ],
    },
    {
      label: 'P1 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  P2: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/' },
      ],
    },
    {
      label: 'ROR',
      icon: IconNotes,
      links: [{ label: 'Create Recurring Order', link: '/' }],
    },
    {
      label: 'ODOR',
      icon: IconNotes,
      links: [{ label: 'Create On-demand Order Requisition', link: '/' }],
    },
    {
      label: 'Manage Inventory',
      icon: IconNotes,
      links: [
        { label: 'Search Item', link: '/inventory/search-item' },
        { label: 'Add Item', link: '/inventory/add-item' },
        { label: 'Update Item', link: '/inventory/update-item' },
        { label: 'Delete Item', link: '/inventory/delete-item' },
        { label: 'Stock In', link: '/' },
        { label: 'Stock Out', link: '/' },
      ],
    },
    {
      label: 'P2 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  IA: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/' },
      ],
    },
    {
      label: 'Manage Inventory',
      icon: IconNotes,
      links: [
        { label: 'Search Item', link: '/inventory/search-item' },
        { label: 'Add Item', link: '/inventory/add-item' },
        { label: 'Update Item', link: '/inventory/update-item' },
        { label: 'Delete Item', link: '/inventory/delete-item' },
        { label: 'Stock In', link: '/' },
        { label: 'Stock Out', link: '/' },
      ],
    },
    {
      label: 'Manage Employees',
      icon: IconUsers,
      links: [
        { label: 'Search Employee', link: '/employee/search-employee' },
        { label: 'Add Employee', link: '/employee/add-employee' },
        { label: 'Update Employee', link: '/employee/update-employee' },
        { label: 'Delete Employee', link: '/employee/delete-employee' },
      ],
    },
  ],
  SA: [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/dashboard' },
      ],
    },
    {
      label: 'Manage Inventory',
      icon: IconNotes,
      links: [
        { label: 'Search Item', link: '/inventory/search-item' },
        { label: 'Add Item', link: '/inventory/add-item' },
        { label: 'Update Item', link: '/inventory/update-item' },
        { label: 'Delete Item', link: '/inventory/delete-item' },
      ],
    },
    {
      label: 'Manage Employees',
      icon: IconUsers,
      links: [
        { label: 'Search Employee', link: '/employee/search-employee' },
        { label: 'Add Employee', link: '/employee/add-employee' },
        { label: 'Update Employee', link: '/employee/update-employee' },
        { label: 'Delete Employee', link: '/employee/delete-employee' },
      ],
    },
  ],
};

export const defaultMessage: string = `You are an inventory management and purchasing assistant for Wingkei Nursing Home, 
  a non-profit nursing home that has a focus on chinese language. 
  More details can be found on their website, https://www.wingkeicarecentre.org/.
  
  Task: Your task is to provide an accurate response to the question provided related to the inventory and purchasing systems.
  If the question does not pertain to these topics, you may respond kindly that the question being asked is beyond your knowledge
  or scope as an assistant. Ensure that the response is human - approachable and professional.
  
  Context: Provided are the inventory objects from the database that includes attributes pertaining to the stock item. 
  Use these as context for your responses.

  Formatting guidelines: Format the response to remove Markdown/HTML elements and convert \n to actual linebreaks. 
  `;
