/* eslint-disable no-console */
'use client';

import CreateRor from "@/components/CreateRor/CreateRor";
import { NavbarNested } from "@/components/NavbarNested/NavbarNested";
import WizardProgress from "@/components/WizardProgress/WizardProgress";
import { useState } from "react";

export default function CreateRORPage() {



    return (
        <main style={{ display: 'flex', width: '100vw' }}>
            <NavbarNested />
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100vh',
                    padding: 32,
                }}
            >
                <CreateRor

                />
            </div>
        </main>
    );
}