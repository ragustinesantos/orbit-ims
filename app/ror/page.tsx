/* eslint-disable no-console */
'use client';

import { NavbarNested } from "@/components/NavbarNested/NavbarNested";
import WizardProgress from "@/components/WizardProgress/WizardProgress";
import { useState } from "react";

export default function CreateRORPage() {

    const [currentStep, setCurrentStep] = useState(3);
    const steps: String[] = ['Template', 'Order', 'Confirmation', 'Summary', 'Extra'];

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