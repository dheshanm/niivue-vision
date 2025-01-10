/**
 * Entry point for the React application.
 * 
 * This file is responsible for rendering the root component of the application
 * into the DOM. It imports necessary dependencies and styles, and then uses
 * React's `createRoot` method to render the `App` component into the HTML element
 * with the id 'app'.
 * 
 * Dependencies:
 * - `react-dom/client`: Provides the `createRoot` method for rendering the React component tree.
 * - `./index.css`: Imports global styles for the application.
 * - `./App.tsx`: Imports the root component of the application.
 * 
 * Usage:
 * This file is automatically executed when the application starts. Ensure that
 * the HTML file contains an element with the id 'app' for the React component
 * tree to be rendered into.
 */
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('app')!).render(
    <App />
)
