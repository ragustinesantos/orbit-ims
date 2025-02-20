import { useInventory } from "@/app/_utils/inventory-context";
import { OrderRorProps } from "@/app/_utils/schema";
import { Table, TableTr } from "@mantine/core";


export default function OrderRor(props: OrderRorProps) {

    const { inventory } = useInventory();
    const itemOrders = props.selectedRorTemplate?.itemOrders;

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
                        <Table.Td>{orderItem.orderQty}</Table.Td>
                    </TableTr>
                );
            }
        }) : []

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