/* eslint-disable no-console */
'use client';

import { NavbarNested } from "@/components/NavbarNested/NavbarNested";
import WizardProgress from "@/components/WizardProgress/WizardProgress";
import { useState } from "react";

export default function CreateRORPage() {

    const [currentStep, setCurrentStep] = useState(2);
    const steps: String[] = ['Template', 'Order', 'Confirmation', 'Summary'];

    return (
        <main style={{ display: 'flex', width: '100vw' }}>
            <NavbarNested />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    minWidth: '50vw',
                    height: '100vh',
                    padding: 10,
                }}
            >
                <WizardProgress
                    stepList={steps}
                    currentStep={currentStep}
                />
            </div>
        </main>
    );
}