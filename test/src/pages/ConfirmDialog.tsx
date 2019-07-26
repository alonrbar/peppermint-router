import * as React from 'react';
import { PromptNavigation } from 'peppermint-router';

const styles = {
    confirmDialog: {
        display: 'inline-block',
        padding: 15,
        border: '1px solid #ddd',
        borderRadius: 15
    },
    confirmDialogText: {
        display: 'block',
        margin: 10
    },
    confirmDialogButton: {
        margin: 5
    }
};

export interface ConfirmDialogProps {
    enabled: boolean;
}

export const ConfirmDialog: React.SFC<ConfirmDialogProps> = (props) => (
    <PromptNavigation enabled={props.enabled}>
        {({ isNavigating, confirm, cancel }) => (
            isNavigating && (
                <div style={styles.confirmDialog}>

                    <span style={styles.confirmDialogText}>
                        Are you sure you want to leave?
                    </span>

                    <button style={styles.confirmDialogButton} onClick={confirm}>
                        Confirm
                    </button>

                    <button style={styles.confirmDialogButton} onClick={cancel}>
                        Cancel
                    </button>

                </div>
            )
        )}
    </PromptNavigation>
);