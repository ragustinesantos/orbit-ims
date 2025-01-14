/* eslint-disable no-console */
'use client';

import AddEmployee from "@/components/AddEmployee/AddEmployee";
import { NavbarNested } from "@/components/NavbarNested/NavbarNested";

export default function AddEmployeePage() {
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
                <AddEmployee />
            </div>
        </main>
    );
}