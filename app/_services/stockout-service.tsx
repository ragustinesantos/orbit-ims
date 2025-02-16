import {
    addDoc,
    collection,
    getDocs,
    query,
  } from 'firebase/firestore';
  import { db } from '../_utils/firebase';
  import { StockOutOrder} from '../_utils/schema';

export async function dbGetAllStockOutOrders() {
  try {
    const allStockOutOrdersReference = collection(db, 'stock-out-order');
    const allStockOutOrders = query(allStockOutOrdersReference);
    const querySnapshot = await getDocs(allStockOutOrders);
    const stockOutOrderList: StockOutOrder[] = [];
    querySnapshot.forEach((doc: any) => {
      const stockOutOrder = {
        stockOutId: doc.id,
        ...doc.data(),
      };
      stockOutOrderList.push(stockOutOrder);
    });
    return stockOutOrderList;
  } catch (error) {
    return console.log(error);
  }
}



export async function dbStockOutGenerate(stockOutObj: StockOutOrder) {
  try {
    const newStockOutOrder = collection(db, 'stock-out-order');

    await addDoc(newStockOutOrder, stockOutObj);

    console.log('Item successfully added');

  } catch (error) {
    return console.log(`Error adding item: ${error}`);
  }
}
