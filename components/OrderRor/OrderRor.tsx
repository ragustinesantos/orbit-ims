import { OrderRorProps } from "@/app/_utils/schema";
import { Table } from "@mantine/core";


export default function OrderRor(props: OrderRorProps) {

    const itemOrders = props.selectedRorTemplate?.itemOrders;

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
                {
                }
                <Table.Caption>
                    End of line
                </Table.Caption>
            </Table>
        </div>
    );
}