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
  picurl: string;
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
  picurl: string;
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
  picurl: '',
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
  purchaseOrderId: string;
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
  purchaseOrderId: string;
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
  purchaseOrderId: '',
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
  purchaseOrderId: '',
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
  orderTotal: 0,
};

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
  isTemplateApprovedE2: boolean | null;
  isTemplateApprovedE3: boolean | null;
}

export interface RecurringOrderTemplateToEdit {
  templateName: string;
  itemList: string[];
  approvalE2: string;
  approvalE3: string;
  isTemplateApprovedE2: boolean | null;
  isTemplateApprovedE3: boolean | null;
  [key: string]: any;
}

export const defaultRecurringOrderTemplateToEdit: RecurringOrderTemplateToEdit = {
  templateName: '',
  itemList: [],
  approvalE2: '',
  approvalE3: '',
  isTemplateApprovedE2: null,
  isTemplateApprovedE3: null,
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
};

export interface PurchaseOrderItem {
  itemId: string;
  quantity: number;
}

export interface PurchaseOrder {
  purchaseOrderId: string;
  requisitionId: string;
  orderList: PurchaseOrderItem[];
  recipientCompanyName: string;
  recipientCompanyAddress: string;
  purchaseOrderDate: string;
  purchaseOrderDeliveryDate: string;
  subTotal: number;
  taxRate: number;
  tax: number;
  totalOrderCost: number;
  approvalP2: string;
  isApproved: boolean | null;
  isDelivered: boolean;
  isActive: boolean;
  isSubmitted: boolean;
}

export interface PurchaseOrderToEdit {
  requisitionId: string;
  orderList: PurchaseOrderItem[];
  recipientCompanyName: string;
  recipientCompanyAddress: string;
  purchaseOrderDate: string;
  purchaseOrderDeliveryDate: string;
  subTotal: number;
  taxRate: number;
  tax: number;
  totalOrderCost: number;
  approvalP2: string;
  isApproved: boolean | null;
  isDelivered: boolean;
  isActive: boolean;
  isSubmitted: boolean;
  [key: string]: any;
}

export interface WizardProgressProps {
  stepList: string[];
  currentStep: number;
}

export interface SelectRorTemplateProps {
  recurringOrder: RecurringOrderToEdit | null;
  handleSelectRor: (paramRorTemplate: RecurringOrderTemplate) => void;
}

export interface OrderRorProps {
  recurringOrder: RecurringOrderToEdit | null;
  setRor: (paramRor: RecurringOrderToEdit) => void;
  adjustQuantity: boolean;
}

export interface rorModalProps {
  recurringOrder: RecurringOrder | null;
  isOpened: boolean;
  isClosed: () => void;
  handleApprovalActivity?: (message: string, rorId: string, status: string) => void;
}

export interface rorTemplateModalProps {
  recurringOrderTemplate: RecurringOrderTemplate;
  isOpened: boolean;
  isClosed: () => void;
  handleApprovalE2?: (message: string, templateId: string, isApproved: boolean) => Promise<void>;
  handleApprovalE3?: (message: string, templateId: string, isApproved: boolean) => Promise<void>;
  isE2Page?: boolean;
  isE3Page?: boolean;
}

export interface odorModalProps {
  onDemandOrder: OnDemandOrder | null;
  isOpened: boolean;
  isClosed: () => void;
  handleApprovalE2?: (message: string, odorId: string, isApproved: boolean) => void;
  handleApprovalE3?: (message: string, odorId: string, isApproved: boolean) => void;
  handleApprovalP1?: (message: string, odorId: string, isApproved: boolean) => void;
  isE2Page?: boolean;
  isE3Page?: boolean;
}

export interface poModalProps {
  purchaseOrder: PurchaseOrder | null;
  isOpened: boolean;
  isClosed: () => void;
  handleApprovalActivity?: (message: string, poId: string, status: string) => void;
  onSubmit?: (purchaseOrderId: string) => void;
}

export interface imgModalProps {
  isOpened: boolean;
  isClosed: () => void;
  item?: Item | null;
  itemid?: string;
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
  requisitionId?: string;
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
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/assistant/generate-report' },
      ],
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
      links: [{ label: 'Search Item', link: '/inventory/search-item' }],
    },
  ],
  E2: [
    {
      label: 'E2 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/access/E2' }],
    },
  ],
  E3: [
    {
      label: 'E3 Access',
      icon: IconNotes,
      links: [{ label: 'Access', link: '/access/E3' }],
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
      links: [{ label: 'Access', link: '/access/P2' }],
    },
  ],
  // Inventory Admin and System Admin has the same Navigation items.
  IA_SA: [
    {
      label: 'Assistant',
      icon: IconMessage,
      links: [
        { label: 'Chat', link: '/assistant/chat' },
        { label: 'Generate Report', link: '/assistant/generate-report' },
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
  
  Task: Your task is to provide an accurate response to the question provided related to the inventory, supplier and purchasing systems. 
  These include, inventory, supplier and requisition information If the question does not pertain to these topics, you may respond 
  kindly that the question being asked is beyond your knowledge or scope as an assistant. Ensure that the response is 
  human - approachable and professional.
  
  Context: Provided are the inventory objects from the database that includes attributes pertaining to the stock item. 
  Use these as context for your responses.

  itemId: the item's stock keeping id.
  supplierId: the supplier's id, match it with the provided list of suppliers to return the actual name of the supplier.
  inventoryId: the id of the inventory where the item is stored.
  itemName: the name of the item.
  currentStockInStoreRoom: the amount of stock currently available.
  packageUnit: the stock keeping unit.
  supplyUnit: the unit in which the item is ordered in.
  category: the item category.
  isCritical: true or false whether the item's quantity is below the critical threshold.
  isCriticalThreshold: the minimum number of stock that should be available, below this number the item is considered in critical condition.
  minPurchaseQty: the minimum quantity this item can be ordered from suppliers.
  price: the price or the item.
  isActive: true or false whether the item is still active or not (archived).

  Also provided are supplier objects for use as context when queried. Below is the sample keys for the supplier.

  supplierName: the name of the supplier
  contactNumber: the phone number of the supplier
  email: the email address of the supplier
  address: the address of the supplier

  Formatting guidelines: Format the response to remove Markdown/HTML elements and convert \n to actual linebreaks. 
  `;
