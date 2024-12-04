/* eslint-disable no-console */
import { Item, ItemToEdit, Supplier } from './schema';

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


export const deleteItem = async (itemId: string) => {
  const request = new Request(`http://localhost:3000/api/items/${itemId}`,
    {
      method: 'DELETE'
    }
  );

  await fetch(request);
}