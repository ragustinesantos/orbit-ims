export interface item {
  itemId?: string;
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

export const defaultNewItem = {
  inventoryId: '',
  currentStockInStoreRoom: 0,
  isCritical: false,
  isCriticalThreshold: 0,
  minPurchaseQty: 0,
}

export interface itemToEdit {
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

export interface supplier {
  supplierId: string;
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
}

export interface supplierToEdit {
  supplierName: string;
  contactNumber: string;
  email: string;
  address: string;
  [key: string]: any;
}

export interface employee {
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
}

export interface employeeToEdit {
  employeeWorkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  password: string;
  employeeLevel: string;
  [key: string]: any;
}
