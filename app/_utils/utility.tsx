/* eslint-disable no-console */
import { getAuth } from 'firebase/auth';
import { marked } from 'marked';
import { dbResetEmpPass } from '../_services/employees-service';
import {
  Chat,
  ChatToEdit,
  EmployeeToEdit,
  Item,
  ItemToEdit,
  OnDemandOrder,
  OnDemandOrderToEdit,
  OrderRequisition,
  OrderRequisitionToEdit,
  PurchaseOrder,
  PurchaseOrderToEdit,
  RecurringOrder,
  RecurringOrderTemplate,
  RecurringOrderToEdit,
  StockInOrder,
  StockOutOrder,
  Supplier,
  EmployeeUpdate
} from './schema';

const auth = getAuth();

// Fetch all inventory items
export const fetchInventory = async (setInventory: (inventoryItems: Item[]) => void) => {
  try {
    const response = await fetch('/api/items');

    const data = await response.json();

    setInventory(data);
  } catch (error) {
    console.log(error);
  }
};

// Fetch all suppliers
export const fetchSuppliers = async (setSupplier: (suppliers: Supplier[]) => void) => {
  try {
    const response = await fetch('/api/suppliers');

    const data = await response.json();

    setSupplier(data);
  } catch (error) {
    console.log(error);
  }
};

// TBD: Get/Fetch categories through api or enums?
export const fetchCategories = async (setCategories: (categories: string[]) => void) => {
  const categories = ['Medical Supplies', 'Food', 'Cleaning Supplies', 'Medicine'];
  setCategories(categories);
};

// Fetch a supplier
export const fetchSupplier = async (supplierId: string) => {
  try {
    const response = await fetch(`/api/suppliers/${supplierId}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postItem = async (item: Item) => {
  try {
    const request = {
      method: 'POST',
      body: JSON.stringify(item),
    };

    const response = await fetch(`/api/items/`, request);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText} - ${errorText}`);
    }
    return response;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

// Update item through PUT
export const putItem = async (itemId: string, updatedItem: ItemToEdit) => {
  try {
    const request = {
      method: 'PUT',
      body: JSON.stringify(updatedItem),
    };

    const response = await fetch(`/api/items/${itemId}`, request);

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Delete inventory item
export const deleteItem = async (itemId: string) => {
  const request = new Request(`/api/items/${itemId}`, {
    method: 'DELETE',
  });

  await fetch(request);
};

// Fetch one or all employees
export const fetchEmployees = async () => {
  try {
    const response = await fetch('/api/employees');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Fetch a single order requisition based on the requisitionId parameter
export const fetchEmployee = async (employeeId: string) => {
  const response = await fetch(`/api/employees/${employeeId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  const data = await response.json();

  return data;
};

export const putEmployee = async (employeeId: string, updatedEmployee: EmployeeToEdit) => {
  const request = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedEmployee),
  };

  const response = await fetch(`/api/employees/${employeeId}`, request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }
};

export async function sendResetEmail(email: string) {
  try {
    const returnmsg = await dbResetEmpPass(auth, email);

    return returnmsg;
  } catch (error) {
    //console.error("An error occurred in sendResetEmail:", error);
    throw error;
  }
}

export const patchEmployee = async (employeeId: string, updatedEmployee: EmployeeUpdate) => {
  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedEmployee),
  };

  const response = await fetch(`/api/employees/${employeeId}`, request);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }
  return response;
};

// Fetch all recurring order templates
export const fetchRorTemplates = async (
  setRorTemplates: (rorTemplates: RecurringOrderTemplate[]) => void
) => {
  try {
    const response = await fetch('/api/ror-templates');

    const data = await response.json();

    setRorTemplates(data);
  } catch (error) {
    console.log(error);
  }
};

export const patchRorTemplateApproval = async (
  templateId: string,
  isTemplateApprovedByE2: boolean | null,
  isTemplateApprovedByE3: boolean | null,
  approvalE2Id: string | '',
  approvalE3Id: string | ''
) => {
  console.log(
    `Approving Template ${templateId} as E2: ${isTemplateApprovedByE2}, E3: ${isTemplateApprovedByE3}`
  );

  const requestBody: Record<string, any> = {
    ...(isTemplateApprovedByE2 !== null && { isTemplateApprovedE2: isTemplateApprovedByE2 }),
    ...(isTemplateApprovedByE3 !== null && { isTemplateApprovedE3: isTemplateApprovedByE3 }),
    ...(approvalE2Id && { approvalE2: approvalE2Id }),
    ...(approvalE3Id && { approvalE3: approvalE3Id }),
  };

  Object.keys(requestBody).forEach(
    (key) => requestBody[key] === undefined && delete requestBody[key]
  );

  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(`/api/ror-templates/${templateId}`, request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }
};

// Fetch all order requisitions and set to the provided state parameter
export const fetchOrderRequisitions = async (
  setOrderRequisitions: (orderRequisitions: OrderRequisition[]) => void
) => {
  const response = await fetch(`/api/order-requisitions`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  const data = await response.json();

  setOrderRequisitions(data);
};

export const postOrderRequisition = async (newOrderObj: OrderRequisitionToEdit) => {
  try {
    // Create a new request
    const request = {
      method: 'POST',
      body: JSON.stringify(newOrderObj),
    };

    const response = await fetch(`/api/order-requisitions/`, request);
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Fetch a single order requisition based on the requisitionId parameter
export const patchOrderRequisition = async (requisitionId: string, requisitionTypeId: string) => {
  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requisitionTypeId: requisitionTypeId }),
  };

  const response = await fetch(`/api/order-requisitions/${requisitionId}`, request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }
};

// Fetch a single order requisition based on the requisitionId parameter
export const patchOrderRequisitionPo = async (requisitionId: string, purchaseOrderId: string) => {
  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ purchaseOrderId: purchaseOrderId }),
  };

  const response = await fetch(`/api/order-requisitions/${requisitionId}`, request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }
};

// Fetch a single order requisition based on the requisitionId parameter
export const fetchOrderRequisition = async (requisitionId: string) => {
  const response = await fetch(`/api/order-requisitions/${requisitionId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  const data = await response.json();

  return data;
};

export const fetchRecurringOrderRequisitions = async (
  setRecurringOrders: (recurringOrders: RecurringOrder[]) => void
) => {
  const response = await fetch(`/api/ror`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  const data = await response.json();

  setRecurringOrders(data);
};

// Fetch a single order requisition based on the requisitionId parameter
export const fetchRecurringOrderRequisition = async (rorId: string) => {
  const response = await fetch(`/api/ror/${rorId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  const data = await response.json();

  return data;
};

// Fetch a single order requisition based on the requisitionId parameter
export const patchRorApproval = async (
  requisitionId: string,
  isApproved: boolean,
  approverId: string
) => {
  console.log(isApproved);

  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isApprovedP1: isApproved, approvalP1: approverId }),
  };

  const response = await fetch(`/api/order-requisitions/${requisitionId}`, request);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
  }
};

export const fetchOnDemandOrderRequisitions = async (
  setOnDemandOrders: (onDemandOrders: OnDemandOrder[]) => void
) => {
  try {
    const response = await fetch(`/api/odor`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    setOnDemandOrders(data);
  } catch (error) {
    console.log(error);
  }
};

// Fetch a single on-demand order requisition based on the odorId parameter
export const fetchOnDemandOrderRequisition = async (odorId: string) => {
  try {
    const response = await fetch(`/api/odor/${odorId}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postOnDemandOrderRequisition = async (odorObj: OnDemandOrderToEdit) => {
  try {
    // Create a new request
    const request = {
      method: 'POST',
      body: JSON.stringify(odorObj),
    };
    const response = await fetch(`/api/odor`, request);
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postRecurringOrderRequisition = async (rorObj: RecurringOrderToEdit) => {
  try {
    // Create a new request
    const request = new Request('/api/ror/', {
      method: 'POST',
      body: JSON.stringify(rorObj),
    });

    // Fetch the request created
    const response = await fetch(request);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Fetch all purchase orders
export const fetchPurchaseOrders = async (
  setPurchaseOrders: (purchaseOrders: PurchaseOrder[]) => void
) => {
  try {
    const response = await fetch(`/api/purchase-orders`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    setPurchaseOrders(data);
  } catch (error) {
    console.log(error);
  }
};

// Post a Purchase Order database entry
export const postPurchaseOrder = async (requisitionId: string) => {
  // Create a purchase order object for persistence
  const purchaseOrder: PurchaseOrderToEdit = {
    requisitionId,
    orderList: [],
    recipientCompanyName: '',
    recipientCompanyAddress: '',
    purchaseOrderDate: new Date().toLocaleString('en-us'),
    purchaseOrderDeliveryDate: '',
    subTotal: 0,
    taxRate: 0,
    tax: 0,
    totalOrderCost: 0,
    approvalP2: '',
    isApproved: null,
    isDelivered: false,
    isActive: false,
    isSubmitted: false,
  };

  try {
    // Create a new request
    const request = {
      method: 'POST',
      body: JSON.stringify(purchaseOrder),
    };
    const response = await fetch(`/api/purchase-orders`, request);
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const patchPurchaseOrder = async (
  purchaseOrderId: string,
  approvalP2: string,
  isApproved: boolean
) => {
  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      approvalP2,
      isApproved,
    }),
  };

  try {
    const response = await fetch(`/api/purchase-orders/${purchaseOrderId}`, request);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Fetch all employee chats
export const fetchChats = async (
  employeeId: string | undefined,
  setChats: (chats: Chat[]) => void
) => {
  try {
    const response = await fetch(`/api/chats/${employeeId}`);

    const data = await response.json();

    setChats(data);
  } catch (error) {
    console.log(error);
  }
};

// Add to employee chats
export const addChats = async (employeeId: string, message: string, type: string) => {
  const newChat: ChatToEdit = {
    type,
    employeeId,
    message,
    timestamp: new Date().toString(),
  };

  const request = new Request('/api/chats', { method: 'POST', body: JSON.stringify(newChat) });
  try {
    await fetch(request);
  } catch (error) {
    console.log(error);
  }
};

// Communicate with AI assistant
export const queryAssistant = async (newChatRequest: object) => {
  // Create a request to send to the api
  const request = new Request('/api/assistant', {
    method: 'POST',
    body: JSON.stringify(newChatRequest),
  });

  try {
    // API call and response
    const response = await fetch(request);
    const data = await response.text();

    const formattedText = await markdownToPlainText(data);

    return formattedText;
  } catch (error) {
    console.log(error);
  }
};

export const markdownToPlainText = async (text: string) => {
  const html = await marked.parse(text);
  const newText = html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\n/g, '\n');
  return newText;
};

//add stock in order
export const postStockInOrder = async (newStockInOrderObj: StockInOrder) => {
  try {
    // Create a new request
    const request = {
      method: 'POST',
      body: JSON.stringify(newStockInOrderObj),
    };

    const response = await fetch(`/api/stockin/`, request);
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Fetch all stock in orders
export const fetchStockInOrders = async (
  setStockInOrders: (stockInOrders: StockInOrder[]) => void
) => {
  try {
    const response = await fetch(`/api/stockin`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    setStockInOrders(data);
  } catch (error) {
    console.log(error);
  }
};

//add stock out order
export const postStockOutOrder = async (newStockOutOrderObj: StockOutOrder) => {
  try {
    // Create a new request
    const request = {
      method: 'POST',
      body: JSON.stringify(newStockOutOrderObj),
    };

    const response = await fetch(`/api/stockout/`, request);
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Fetch all stock out orders
export const fetchStockOutOrders = async (
  setStockOutOrders: (stockOutOrders: StockOutOrder[]) => void
) => {
  try {
    const response = await fetch(`/api/stockout`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    setStockOutOrders(data);
  } catch (error) {
    console.log(error);
  }
};

export const patchOdorApproval = async (
  requisitionId: string,
  isApproved: boolean,
  approverId: string,
  isE2User: boolean = false,
  isE3User: boolean = false
) => {
  try {
    // Update the approval fields based on the type of employee
    let updateFields = {};
    if (isE2User) {
      updateFields = {
        isApprovedE2: isApproved,
        approvalE2: approverId,
      };
    } else if (isE3User) {
      updateFields = {
        isApprovedE3: isApproved,
        approvalE3: approverId,
      };
    } else {
      updateFields = {
        isApprovedP1: isApproved,
        approvalP1: approverId,
      };
    }

    const request = {
      method: 'PATCH',
      body: JSON.stringify(updateFields),
    };

    const response = await fetch(`/api/order-requisitions/${requisitionId}`, request);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Update a purchase order's isSubmitted status
export const submitPurchaseOrder = async (purchaseOrderId: string) => {
  const request = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isSubmitted: true,
    }),
  };

  try {
    const response = await fetch(`/api/purchase-orders/${purchaseOrderId}`, request);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const patchCloseTicket = async (requisitionId: string) => {
  try {
    const response = await fetch(`/api/order-requisitions/${requisitionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isActive: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to close ticket');
    }

    return true;
  } catch (error) {
    console.error('Error closing ticket:', error);
    throw error;
  }
};
