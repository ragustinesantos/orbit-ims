import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { ItemOrder } from '@/app/_utils/schema';
import { Item } from '@/app/_utils/schema';

// provide Employee name Requisition ID#, item list and full inventory object.
export async function SendEmailROR (reqid:string, itemList:ItemOrder[], inventory: Item[], employeename: string) {
            const mailgun = new Mailgun(FormData);
            const mg = mailgun.client({
              username: "api",
              key: process.env.NEXT_PUBLIC_MAILGUN_API_KEY || "API_KEY",
              // When you have an EU-domain, you must specify the endpoint:
              // url: "https://api.eu.mailgun.net/v3"
            });
    
            function mapItemsToNamesAndQuantities(itemOrders: ItemOrder[]) {
              return itemOrders.map(itemOrder => {
                const matchedItem = inventory?.find(item => item.itemId === itemOrder.itemId);
                
                return {
                  itemId: itemOrder.itemId,
                  itemname: matchedItem ? matchedItem.itemName : 'Unknown Item',
                  orderQty: itemOrder.orderQty
                };
              });
            }
            let formattedArray = mapItemsToNamesAndQuantities(itemList)
    
            let formattedString = formattedArray.map(item => {
              return `\n ItemId: ${item.itemId}, Item Name: ${item.itemname}, Quantity: ${item.orderQty}`;
            }).join('');
    
    
            try {
              const data = await mg.messages.create("sandbox890f9fe65f974e4ca66405364dc99b84.mailgun.org", {
                from: "OrbitIMS@sandbox890f9fe65f974e4ca66405364dc99b84.mailgun.org",
                //If we Paid for the service we would place all P1 emails, Or a specific P1 email in this to:[] array.
                to: ["orbit.imsystem@gmail.com"],
                subject: "New Requisition Approval",
                text: `Requisisitons ID# "${reqid}" has been submitted by employee: ${employeename} and is ready for P1 Approval! \n\nItems in this ROR requisition:\n${formattedString}\n\nThank you.`,
              });
              console.log(data); // logs response data
              return true;
            } catch (error) {
              console.log(error); //logs any error
            }

}

export async function SendEmailODOR (reqid:string, itemList:ItemOrder[], inventory: Item[], employeename: string) {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.NEXT_PUBLIC_MAILGUN_API_KEY || "API_KEY",
      // When you have an EU-domain, you must specify the endpoint:
      // url: "https://api.eu.mailgun.net/v3"
    });

    function mapItemsToNamesAndQuantities(itemOrders: ItemOrder[]) {
      return itemOrders.map(itemOrder => {
        const matchedItem = inventory?.find(item => item.itemId === itemOrder.itemId);
        
        return {
          itemId: itemOrder.itemId,
          itemname: matchedItem ? matchedItem.itemName : 'Unknown Item',
          orderQty: itemOrder.orderQty
        };
      });
    }
    let formattedArray = mapItemsToNamesAndQuantities(itemList)

    let formattedString = formattedArray.map(item => {
      return `\n ItemId: ${item.itemId}, Item Name: ${item.itemname}, Quantity: ${item.orderQty}`;
    }).join('');


    try {
      const data = await mg.messages.create("sandbox890f9fe65f974e4ca66405364dc99b84.mailgun.org", {
        from: "OrbitIMS@sandbox890f9fe65f974e4ca66405364dc99b84.mailgun.org",
        //If we Paid for the service we would place all P1 emails, Or a specific P1 email in this to:[] array.
        to: ["orbit.imsystem@gmail.com"],
        subject: "New Requisition Approval",
        text: `Requisisitons ID# "${reqid}" has been submitted by employee: ${employeename} and is ready for P1 Approval! \n\n The items in this ODOR requisition:\n ${formattedString}\n Thank you.`,
      });
      console.log(data); // logs response data
      return true;
    } catch (error) {
      console.log(error); 
    }

}