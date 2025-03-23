/* eslint-disable no-console */
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { StockInOrder } from '../_utils/schema';

export async function dbGetAllStockInOrders() {
  try {
    const allStockInOrdersReference = collection(db, 'stock-in-order');
    const allStockInOrders = query(allStockInOrdersReference);
    const querySnapshot = await getDocs(allStockInOrders);
    const stockInOrderList: StockInOrder[] = [];
    querySnapshot.forEach((doc: any) => {
      const stockInOrder = {
        stockInId: doc.id,
        ...doc.data(),
      };
      stockInOrderList.push(stockInOrder);
    });
    return stockInOrderList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbStockInGenerate(stockInObj: StockInOrder) {
  try {
    const newStockInOrder = collection(db, 'stock-in-order');

    await addDoc(newStockInOrder, stockInObj);

    console.log('Item successfully added');
  } catch (error) {
    return console.log(`Error adding item: ${error}`);
  }
}
