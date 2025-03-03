import { Button, Radio } from "@mantine/core";
import classnames from './SelectRorTemplate.module.css';
import { useRouter } from "next/navigation";
import { useInventory } from "@/app/_utils/inventory-context";
import { useEffect, useState } from "react";
import { SelectRorTemplateProps } from "@/app/_utils/schema";



export default function SelectRorTemplate(props: SelectRorTemplateProps) {
    const { push } = useRouter();
    const { rorTemplates } = useInventory();

    const [radioValue, setRadioValue] = useState<string | null>(props.recurringOrder?.rorTemplateId ?? null);

    useEffect(() => {
        const selectedRor = rorTemplates?.find(template => template.rorTemplateId == radioValue);
        if (selectedRor
            && selectedRor.rorTemplateId != props.recurringOrder?.rorTemplateId) {
            props.handleSelectRor(selectedRor);
        }
    }, [radioValue]);

    // If there are existing ror templates, default to the first option
    useEffect(() => {
        if (rorTemplates
            && rorTemplates.length > 0
            && !props.recurringOrder) {

            setRadioValue(rorTemplates[0].rorTemplateId);
        }
    }, [rorTemplates])

    return (
        <div>
            <Radio.Group
                value={radioValue}
                onChange={setRadioValue}
            >
                {
                    rorTemplates ?
                        rorTemplates.map((template) => {
                            return (
                                <Radio
                                    key={template.rorTemplateId}
                                    name={template.templateName}
                                    label={template.templateName}
                                    value={template.rorTemplateId}
                                    checked={template.rorTemplateId == radioValue}
                                    classNames={{
                                        root: classnames.rorRadio,
                                        label: classnames.radioLabel
                                    }}
                                />
                            )
                        })
                        : []
                }
            </Radio.Group>
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