/* eslint-disable no-console */
import { marked } from 'marked';
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
  RecurringOrder,
  RecurringOrderTemplate,
  Supplier,
} from './schema';

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
  const request = new Request(`http://localhost:3000/api/items/${itemId}`, {
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
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\n/g, '\n');
  return newText;
};
