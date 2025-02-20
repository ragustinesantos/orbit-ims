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
  price: number;
  isActive: boolean;
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
  price: number;
  isActive: boolean;
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
  price: 0,
  isActive: true,
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
  employeeLevel: string[];
  isActive: boolean;
}

export interface EmployeeToEdit {
  employeeWorkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employeeLevel: string[];
  isActive: boolean;
  [key: string]: any;
}

export const defaultEmployee: Employee = {
  employeeId: '',
  employeeWorkId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  employeeLevel: [],
  isActive: true,
};

export interface Chat {
  chatId: string;
  type: string;
  employeeId: string;
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
  requisitionTypeId: string;
  requisitionDate: string;
  employeeId: string;
  approvalE2: string;
  approvalE3: string;
  approvalP1: string;
  isApprovedE2: boolean | null;
  isApprovedE3: boolean | null;
  isApprovedP1: boolean | null;
  isActive: boolean;
  isComplete: boolean;
  remarks: string;
}

export interface OrderRequisitionToEdit {
  requisitionType: string;
  requisitionTypeId: string;
  requisitionDate: string;
  employeeId: string;
  approvalE2: string;
  approvalE3: string;
  approvalP1: string;
  isApprovedE2: boolean | null;
  isApprovedE3: boolean | null;
  isApprovedP1: boolean | null;
  isActive: boolean;
  isComplete: boolean;
  remarks: string;
  [key: string]: any;
}

export const defaultOrderRequisitionToEdit: OrderRequisitionToEdit = {
  requisitionType: '',
  requisitionTypeId: '',
  requisitionDate: '',
  employeeId: '',
  approvalE2: '',
  approvalE3: '',
  approvalP1: '',
  isApprovedE2: null,
  isApprovedE3: null,
  isApprovedP1: null,
  isActive: true,
  isComplete: false,
  remarks: '',
};

export const defaultOrderRequisition: OrderRequisition = {
  requisitionId: '',
  requisitionType: '',
  requisitionTypeId: '',
  requisitionDate: '',
  employeeId: '',
  approvalE2: '',
  approvalE3: '',
  approvalP1: '',
  isApprovedE2: null,
  isApprovedE3: null,
  isApprovedP1: null,
  isActive: true,
  isComplete: false,
  remarks: '',
};

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

export const defaultRecurringOrder: RecurringOrder = {
  rorId: '',
  rorTemplateId: '',
  requisitionId: '',
  itemOrders: [],
  orderTotal: 0
}

export interface RecurringOrderToEdit {
  rorTemplateId: string;
  requisitionId: string;
  itemOrders: ItemOrder[];
  orderTotal: number;
  [key: string]: any;
}

export const defaultRecurringOrderToEdit: RecurringOrderToEdit = {
  rorTemplateId: '',
  requisitionId: '',
  itemOrders: [],
  orderTotal: 0,
};

export interface RecurringOrderTemplate {
  rorTemplateId: string;
  templateName: string;
  itemList: string[];
  approvalE2: string;
  approvalE3: string;
  isTemplateApprovedE2: boolean;
  isTemplateApprovedE3: boolean;
}

export interface RecurringOrderTemplateToEdit {
  templateName: string;
  itemList: string[];
  approvalE2: string;
  approvalE3: string;
  isTemplateApprovedE2: boolean;
  isTemplateApprovedE3: boolean;
  [key: string]: any;
}

export const defaultRecurringOrderTemplateToEdit: RecurringOrderTemplateToEdit = {
  templateName: '',
  itemList: [],
  approvalE2: '',
  approvalE3: '',
  isTemplateApprovedE2: false,
  isTemplateApprovedE3: false,
};

export interface NewItemOrder {
  itemName: string;
  itemDescription: string;
  productCode: string;
  disposalPlan: string;
  purposeForPurchase: string;
  purchaseQty: number;
  unitPrice: number;
  itemSubtotal: number;
}

export interface OnDemandOrder {
  odorId: string;
  requisitionId: string;
  itemOrders: ItemOrder[];
  newItemOrders: NewItemOrder[];
  orderTotal: number;
  recipientName: string;
  recipientLocation: string;
}

export interface OnDemandOrderToEdit {
  requisitionId: string;
  itemOrders: ItemOrder[];
  newItemOrders: NewItemOrder[];
  orderTotal: number;
  recipientName: string;
  recipientLocation: string;
  [key: string]: any;
}

export const defaultOnDemandOrderToEdit: OnDemandOrderToEdit = {
  requisitionId: '',
  itemOrders: [],
  newItemOrders: [],
  orderTotal: 0,
  recipientName: '',
  recipientLocation: '',
}

export interface PurchaseOrderItem {
  itemId: string;
  quantity: number;
}

export interface PurchaseOrder {
  purchaseOrderId: string;
  requisitionId: string;
  supplierId: string;
  orderList: PurchaseOrderItem[];
  recipientCompanyName: string;
  recipientCompanyAddress: string;
  purchaseOrderDate: string;
  purchaseOrderDeliveryDate: string;
  subTotal: number;
  taxRate: number;
  tax: number;
  totalOrderCost: string;
  approvalP2: string;
  isApproved: boolean | null;
  isDelivered: boolean;
  isActive: boolean;
}

export interface PurchaseOrderToEdit {
  requisitionId: string;
  supplierId: string;
  orderList: PurchaseOrderItem[];
  recipientCompanyName: string;
  recipientCompanyAddress: string;
  purchaseOrderDate: string;
  purchaseOrderDeliveryDate: string;
  subTotal: number;
  taxRate: number;
  tax: number;
  totalOrderCost: string;
  approvalP2: string;
  isApproved: boolean | null;
  isDelivered: boolean;
  isActive: boolean;
  [key: string]: any;
}

export interface WizardProgressProps {
  stepList: string[];
  currentStep: number;
}

export interface SelectRorTemplateProps {
  handleSelectRor: (paramRorTemplate: RecurringOrderTemplate) => void;
}

export interface OrderRorProps {
  selectedRorTemplate: RecurringOrder | null;
  handleSelectRor: (paramRorTemplate: RecurringOrderTemplate) => void;
  adjustQuantity: boolean;
}

export interface rorModalProps {
  recurringOrder: RecurringOrder | null;
  isOpened: boolean;
  isClosed: () => void;
  handleApprovalActivity?: (message: string, rorId: string, status: string) => void;
}

export interface odorModalProps {
  onDemandOrder: OnDemandOrder | null;
  isOpened: boolean;
  isClosed: () => void;
  handleApprovalActivity?: (message: string, odorId: string, status: string) => void;
}

export interface StockInOrder {
  stockInId: string;
  itemId: string;
  purchaseOrderId?: string;
  stockInQuantity: number;
  stockInDate: string;
  receivedBy: string;
}

export interface StockOutOrder {
  stockOutId: string;
  itemId: string;
  purchaseOrderId?: string;
  stockOutQuantity: number;
  stockOutDate: string;
  dispatchedBy: string;
}

export interface NavLink {
  label: string;
  link: string;
}

export interface NavFormat {
  label: string;
  icon: React.FC<any>;
  link?: string;
  links?: NavLink[];
}

interface navCollection {
  [key: string]: NavFormat[];
}

export const NAV_ITEMS: navCollection = {
  E1: [
    { label: 'Dashboard', icon: IconGauge, link: '/dashboard/' },
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [{ label: 'Chat', link: '/assistant/chat' }],
    },
    {
      label: 'ROR',
      icon: IconNotes,
      links: [
        { label: 'Create Recurring Order', link: '/ror' },
        { label: 'Create Template', link: '/ror/create-ror-template' },
      ],
    },
    {
      label: 'ODOR',
      icon: IconNotes,
      links: [{ label: 'Create On-demand Order Requisition', link: '/odor' }],
    },
    {
      label: 'Inventory',
      icon: IconNotes,
      links: [{ label: 'Search Item', link: '/' }],
    },
  ],
  E2: [
    {
      label: 'E2 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  E3: [
    {
      label: 'E3 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  // Manage Inventory is accessible to P1, P2, IA, and SA roles
  MI: [
    {
      label: 'Manage Inventory',
      icon: IconNotes,
      links: [
        { label: 'Search Item', link: '/inventory/search-item' },
        { label: 'Add Item', link: '/inventory/add-item' },
        { label: 'Update Item', link: '/inventory/update-item' },
        { label: 'Delete Item', link: '/inventory/delete-item' },
        { label: 'Stock In', link: '/inventory/stock-in' },
        { label: 'Stock Out', link: '/inventory/stock-out' },
      ],
    },
  ],
  P1: [
    {
      label: 'P1 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/access/P1' }],
    },
  ],
  P2: [
    {
      label: 'P2 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/' }],
    },
  ],
  // Inventory Admin and System Admin has the same Navigation items.
  IA_SA: [
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/' },
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
