/* eslint-disable no-console */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { item, itemToEdit } from '../_utils/schema';

export async function dbGetAllItems() {
  try {
    const allItemsReference = collection(db, 'items');

    const allItemsQuery = query(allItemsReference);

    const querySnapshot = await getDocs(allItemsQuery);

    const itemList: item[] = [];
    querySnapshot.forEach((doc: any) => {
      const item = {
        id: doc.id,
        ...doc.data(),
      };
      itemList.push(item);
    });

    console.log('Items successfully retrieved');

    return itemList;
  } catch (error) {
    return console.log(`Error retrieving items: ${error}`);
  }
}

export async function dbAddItem(itemObj: itemToEdit) {
  try {
    const newItemReference = collection(db, 'items');

    await addDoc(newItemReference, itemObj);

    console.log('Item successfully added');
  } catch (error) {
    return console.log(`Error adding item: ${error}`);
  }
}

export async function dbGetItem(itemId: string) {
  try {
    const itemRef = doc(db, 'items', itemId);

    const documentSnapshot = await getDoc(itemRef);

    if (!documentSnapshot.exists()) {
      console.log('This item does not exist in the database');
      return null;
    }

    console.log('Item successfully retrieved');

    return documentSnapshot.data();
  } catch (error) {
    return console.log(`Error retrieving item: ${error}`);
  }
}

export async function dbUpdateItem(itemId: string, updatedItemObject: { [key: string]: any }) {
  try {
    const itemReference = doc(db, 'items', itemId);

    await updateDoc(itemReference, updatedItemObject);

    console.log('Item successfully updated');
  } catch (error) {
    return console.log(`Error updating item: ${error}`);
  }
}

export async function dbDeleteItem(itemId: string) {
  try {
    const itemReference = doc(db, 'items', itemId);

    await deleteDoc(itemReference);

    console.log('Item successfully deleted');
  } catch (error) {
    return console.log(`Error deleting item: ${error}`);
  }
}
