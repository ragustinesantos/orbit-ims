import { Button, Radio } from "@mantine/core";
import classnames from './SelectRorTemplate.module.css';
import { useRouter } from "next/navigation";



export default function SelectRorTemplate() {

    const { push } = useRouter();

    return (
        <div
            className={classnames.rorTemplateContainer}
        >
            <Radio
                name="template"
                label="Grocery"
                classNames={{
                    root: classnames.rorRadio,
                    label: classnames.radioLabel
                }}
            />
            <Radio
                name="template"
                label="Food Template"
                classNames={{
                    root: classnames.rorRadio,
                    label: classnames.radioLabel
                }}
            />
            <Radio
                name="template"
                label="Medical Supplies"
                classNames={{
                    root: classnames.rorRadio,
                    label: classnames.radioLabel
                }}
            />
            <Radio
                name="template"
                label="Stationary"
                classNames={{
                    root: classnames.rorRadio,
                    label: classnames.radioLabel
                }}
            />
            <Radio
                name="template"
                label="Nutritional Products"
                classNames={{
                    root: classnames.rorRadio,
                    label: classnames.radioLabel
                }}
            />
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