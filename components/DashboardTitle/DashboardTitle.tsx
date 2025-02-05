import { Group, Title } from "@mantine/core";
import classnames from "./DashboardTitle.module.css";
import { useInventory } from "@/app/_utils/inventory-context";


export default function DashboardTitle(){
    
    const {currentEmployee } = useInventory();
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;



    return(
        <Group classNames={{ root:classnames.container }}>
            <Title order={2} classNames={{ root:classnames.heading }}>
                Hello, {" "} 
                {currentEmployee?.firstName} {currentEmployee?.lastName}
                !
            </Title>
            <Title order={5} classNames={{ root:classnames.date }}>
                Today is {currentDate}
            </Title>
        </Group>
    );
}