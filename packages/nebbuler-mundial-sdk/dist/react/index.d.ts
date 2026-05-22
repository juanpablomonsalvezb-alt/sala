import * as react_jsx_runtime from 'react/jsx-runtime';

/**
 * React component for embedding Nebbuler Mundial data in your site.
 *
 * Usage:
 *   import { MundialWidget } from 'nebbuler-mundial-sdk/react'
 *   <MundialWidget seleccion="argentina" theme="dark" />
 */
interface MundialWidgetProps {
    seleccion: string;
    theme?: 'dark' | 'light';
    showAttribution?: boolean;
    utmSource?: string;
}
declare function MundialWidget({ seleccion, theme, showAttribution, utmSource, }: MundialWidgetProps): react_jsx_runtime.JSX.Element;

export { MundialWidget, type MundialWidgetProps };
