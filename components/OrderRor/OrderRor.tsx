import { useInventory } from "@/app/_utils/inventory-context";
import { ItemOrder, OrderRorProps, RecurringOrderToEdit } from "@/app/_utils/schema";
import { Button, Table, TableTr } from "@mantine/core";
import { useEffect, useState } from "react";
import classnames from './OrderRor.module.css';


export default function OrderRor(props: OrderRorProps) {

    const { inventory } = useInventory();
    const recurringOrder = props.recurringOrder;
    const [itemOrders, setItemOrders] = useState<ItemOrder[]>(recurringOrder?.itemOrders ?? []);
    const setRor = props.setRor;
    const adjustQuantity = props.adjustQuantity;


    const rows = itemOrders ?
        itemOrders.map((orderItem) => {
            const itemFound = inventory?.find(item => item.itemId == orderItem.itemId);
            if (itemFound) {
                return (
                    <TableTr key={orderItem.itemId}>
                        <Table.Td>{itemFound.itemName}</Table.Td>
                        <Table.Td>{itemFound.category}</Table.Td>
                        <Table.Td>{itemFound.supplyUnit}</Table.Td>
                        <Table.Td>{itemFound.packageUnit}</Table.Td>
                        <Table.Td>{itemFound.supplyUnit}</Table.Td>
                        <Table.Td>
                            {
                                adjustQuantity &&
                                <Button
                                    classNames={{ root: `${classnames.buttonDecrement} ${classnames.button}` }}
                                    onClick={() => (decrement(orderItem.itemId))}
                                    variant="filled"
                                    size="xs"
                                    radius="md"
                                >
                                    -
                                </Button>
                            }
                            <span
                                style={{
                                    width: '30px',
                                    textAlign: 'center',
                                    display: 'inline-block'
                                }}
                            >
                                {orderItem.orderQty}
                            </span>
                            {
                                adjustQuantity &&
                                <Button
                                    classNames={{ root: `${classnames.buttonIncrement} ${classnames.button}` }}
                                    onClick={() => (increment(orderItem.itemId))}
                                    variant="filled"
                                    size="xs"
                                    radius="md" >
                                    +
                                </Button>
                            }
                        </Table.Td>
                    </TableTr>
                );
            }
        }) : []

    const increment = (id: string) => {
        setItemOrders((prevItems) =>
            prevItems?.map((item) => item.itemId === id ?
                { ...item, orderQty: item.orderQty + 1, pendingQty: item.pendingQty + 1 } : item));
    }

    const decrement = (id: string) => {
        setItemOrders((prevItems) =>
            prevItems?.map((item) => item.itemId === id && item.orderQty > 0 ?
                { ...item, orderQty: item.orderQty - 1, pendingQty: item.pendingQty - 1 } : item));
    }

    useEffect(() => {
        if (recurringOrder) {
            const tempRor: RecurringOrderToEdit = { ...recurringOrder, itemOrders: itemOrders };
            setRor(tempRor);
        }
    }, [itemOrders]);

    return (
        <div>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Unit of Measurement</Table.Th>
                        <Table.Th>Package Unit</Table.Th>
                        <Table.Th>Supplier</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
                <Table.Caption>
                    End of line
                </Table.Caption>
            </Table>
        </div>
    );
}