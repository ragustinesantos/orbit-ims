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
import { OrderRequisition, OrderRequisitionToEdit } from '../_utils/schema';

export async function dbGetAllOrderRequisitions() {
  try {
    const allOrderRequisitionsReference = collection(db, 'order-requisitions');
    const allOrderRequisitions = query(allOrderRequisitionsReference);
    const querySnapshot = await getDocs(allOrderRequisitions);
    const orderRequisitionList: OrderRequisition[] = [];
    querySnapshot.forEach((doc: any) => {
      const orderRequisition = {
        requisitionId: doc.id,
        ...doc.data(),
      };
      orderRequisitionList.push(orderRequisition);
    });
    return orderRequisitionList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddOrderRequisition(orderRequisitionObj: OrderRequisitionToEdit) {
  try {
    const newOrderRequisitionReference = collection(db, 'order-requisitions');
    await addDoc(newOrderRequisitionReference, orderRequisitionObj);
  } catch (error) {
    return console.log(error);
  }
}

export async function dbGetOrderRequisition(requisitionId: string) {
  try {
    const orderRequisitionReference = doc(db, 'order-requisitions', requisitionId);

    const documentSnapshot = await getDoc(orderRequisitionReference);

    if (!documentSnapshot.exists()) {
      console.log('This order requisition does not exist in the database');
      return null;
    }

    const retrievedOrderRequisitionObject = {
      requisitionId: documentSnapshot.id,
      ...documentSnapshot.data(),
    };

    console.log('Order Requisition successfully retrieved');

    return retrievedOrderRequisitionObject;
  } catch (error) {
    return console.log(`Error retrieving order requisition: ${error}`);
  }
}

export async function dbUpdateOrderRequisition(
  requisitionId: string,
  updatedOrderRequisitionObject: { [key: string]: any }
) {
  try {
    const orderRequisitionReference = doc(db, 'order-requisitions', requisitionId);

    await updateDoc(orderRequisitionReference, updatedOrderRequisitionObject);

    console.log('Order requisition successfully updated');
  } catch (error) {
    return console.log(`Error updating order requisition: ${error}`);
  }
}

export async function dbDeleteOrderRequisition(requisitionId: string) {
  try {
    const orderRequisitionReference = doc(db, 'order-requisitions', requisitionId);

    await deleteDoc(orderRequisitionReference);

    console.log('Order requisition successfully deleted');
  } catch (error) {
    return console.log(`Error deleting order requisition: ${error}`);
  }
}
