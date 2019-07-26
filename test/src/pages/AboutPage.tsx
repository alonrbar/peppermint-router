import * as React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export const AboutPage: React.SFC = () => (
    <>
        <h1>AboutPage</h1>
        <ConfirmDialog enabled={true} />
    </>
);