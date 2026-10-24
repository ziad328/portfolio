// Type augmentation for @testing-library/react when @testing-library/dom peer dependency is resolving
import '@testing-library/react';

declare module '@testing-library/react' {
  export const screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement | null;
    getByAltText: (text: string | RegExp) => HTMLElement;
    getByTitle: (title: string | RegExp) => HTMLElement;
    queryByTitle: (title: string | RegExp) => HTMLElement | null;
    [key: string]: any;
  };
  export const fireEvent: {
    click: (element: Element | Node | Window) => boolean;
    change: (element: Element | Node | Window, options?: any) => boolean;
    [key: string]: any;
  };
}
