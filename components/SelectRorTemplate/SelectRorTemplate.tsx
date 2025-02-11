import { Button, Radio } from "@mantine/core";
import classnames from './SelectRorTemplate.module.css';
import { useRouter } from "next/navigation";
import { useInventory } from "@/app/_utils/inventory-context";



export default function SelectRorTemplate() {

    const { push } = useRouter();
    const { rorTemplates } = useInventory();

    return (
        <div
            className={classnames.rorTemplateContainer}
        >
            {
                rorTemplates ?
                    rorTemplates.map((template) => {
                        return (
                            <Radio
                                name={template.templateName}
                                label={template.templateName}
                                classNames={{
                                    root: classnames.rorRadio,
                                    label: classnames.radioLabel
                                }}
                            />
                        )
                    })
                    : []
            }
            <Button
                variant="filled"
                color="#1B4965"
                onClick={() => {
                    push('/ror/create-ror-template')
                }}
            >
                Create Template
            </Button>
        </div>
    );
}