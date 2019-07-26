import * as React from 'react';
import { WaitHandle } from '../utils';
import { RouterContext } from './RouterContext';

export interface PromptNavigationRenderProps {
    isNavigating: boolean;
    confirm: VoidFunction;
    cancel: VoidFunction;
}

export type PromptNavigationRender = (props: PromptNavigationRenderProps) => React.ReactNode;

export interface PromptNavigationProps {
    enabled?: boolean;
    exitPrompt?: string;
    children?: PromptNavigationRender;
}

interface PromptNavigationState {
    isNavigating: boolean;
    confirmNavigation?: WaitHandle;
}

export function PromptNavigation(props: PromptNavigationProps) {

    const context = React.useContext(RouterContext);
    const [state, setState] = React.useState<PromptNavigationState>({ isNavigating: false });

    React.useEffect(() => {

        // in-app navigation handler
        if (props.enabled !== false && props.children) {
            context.router.onBeforeNavigation = async () => {
                const confirmNavigation = new WaitHandle();
                setState({
                    isNavigating: true,
                    confirmNavigation
                });
                let confirmed = true;
                await confirmNavigation.wait().catch(() => confirmed = false);
                return confirmed;
            };
        }

        // out-of-app navigation handler
        if (props.enabled !== false && props.exitPrompt) {
            context.router.onBeforeUnload = () => props.exitPrompt;
        }

        // dispose
        return () => {
            context.router.onBeforeNavigation = null;
            context.router.onBeforeUnload = null;
        };
    });

    const clearState = () => setState({
        isNavigating: false,
        confirmNavigation: null
    });

    // render
    if (props.enabled !== false && props.children) {
        return props.children({
            isNavigating: state.isNavigating,
            confirm: () => {
                const confirm = state.confirmNavigation;
                clearState();
                confirm && confirm.resolve();
            },
            cancel: () => {
                const confirm = state.confirmNavigation;
                clearState();
                confirm && confirm.reject();
            }
        });
    }

    return null;
};