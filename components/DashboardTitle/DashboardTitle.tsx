import { Title } from "@mantine/core";
import classnames from "./DashboardTitle.module.css";
import { useInventory } from "@/app/_utils/inventory-context";


export default function DashboardTitle(){
    
    const {currentEmployee } = useInventory();
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;



    return(
        <div style={{  
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", 
            paddingTop: "30px",
            paddingLeft:"30px",
            }}>
            <Title order={2} classNames={{ root:classnames.heading }}>
                Hello, {" "} 
                {currentEmployee?.firstName} {currentEmployee?.lastName}
                !
            </Title>
            <Title order={5} classNames={{ root:classnames.date }}>
                Today is {currentDate}
            </Title>
        </div>
    );
}