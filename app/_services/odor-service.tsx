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
import { OnDemandOrder, OnDemandOrderToEdit } from '../_utils/schema';

export async function dbGetAllOnDemandOrders() {
  try {
    const allOnDemandOrdersReference = collection(db, 'odor');
    const allOnDemandOrders = query(allOnDemandOrdersReference);
    const querySnapshot = await getDocs(allOnDemandOrders);
    const onDemandOrderList: OnDemandOrder[] = [];
    querySnapshot.forEach((doc: any) => {
      const onDemandOrder = {
        rorId: doc.id,
        ...doc.data(),
      };
      onDemandOrderList.push(onDemandOrder);
    });
    return onDemandOrderList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddOnDemandOrder(onDemandOrderObj: OnDemandOrderToEdit) {
  try {
    const newOnDemandOrderReference = collection(db, 'odor');
    await addDoc(newOnDemandOrderReference, onDemandOrderObj);
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetOnDemandOrder(odorId: string) {
  try {
    const onDemandOrderReference = doc(db, 'odor', odorId);

    const documentSnapshot = await getDoc(onDemandOrderReference);

    if (!documentSnapshot.exists()) {
      console.log('This ODOR does not exist in the database');
      return null;
    }

    const retrievedOnDemandOrderObject = {
      odorId: documentSnapshot.id,
      ...documentSnapshot.data(),
    };

    console.log('ODOR successfully retrieved');

    return retrievedOnDemandOrderObject;
  } catch (error) {
    return console.log(`Error retrieving ODOR: ${error}`);
  }
}

export async function dbUpdateOnDemandOrder(
  odorId: string,
  updatedOnDemandOrderObject: { [key: string]: any }
) {
  try {
    const onDemandOrderReference = doc(db, 'odor', odorId);

    await updateDoc(onDemandOrderReference, updatedOnDemandOrderObject);

    console.log('ODOR successfully updated');
  } catch (error) {
    return console.log(`Error updating ODOR: ${error}`);
  }
}

export async function dbDeleteOnDemandOrder(odorId: string) {
  try {
    const onDemandOrderReference = doc(db, 'odor', odorId);

    await deleteDoc(onDemandOrderReference);

    console.log('ODOR successfully deleted');
  } catch (error) {
    return console.log(`Error deleting ODOR: ${error}`);
  }
}
