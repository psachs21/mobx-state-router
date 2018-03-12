import * as React from 'react';
import { RouterState, RouterStore } from '../router-store';
import { routerStateToUrl } from '../adapters/history-adapter';

function isLeftClickEvent(event: React.MouseEvent<HTMLElement>) {
    return event.button === 0;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

export interface LinkProps {
    routerStore: RouterStore;
    toState: RouterState;
    children:
        | React.ReactNode
        | ((arg: { getAnchorProps: (() => AnchorProps) }) => React.ReactNode);
}

export interface AnchorProps {
    href: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Creates an <a> element that links to a router state. Redirects to the target
 * state without reloading the entire app, thus avoiding potential flickers.
 */
export class Link extends React.Component<LinkProps, {}> {
    render() {
        const { routerStore, toState, children } = this.props;
        // Support optional render function as children
        if (typeof children === 'function') {
            return children({ getAnchorProps: this.getAnchorProps });
        }
        return <a {...this.getAnchorProps()}>{children}</a>;
    }

    handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // Ignore if link is clicked using a modifier key or not left-clicked
        if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

        // Prevent default action which reloads the app
        event.preventDefault();

        // Change the router state to trigger a refresh
        const { routerStore, toState } = this.props;
        routerStore.goTo(toState);
    };

    getAnchorProps = () => {
        const { routerStore, toState } = this.props;
        return {
            href: routerStateToUrl(routerStore, toState),
            onClick: this.handleClick
        };
    };
}
