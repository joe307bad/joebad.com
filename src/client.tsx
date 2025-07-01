// client.tsx - Fixed hydration
import { hydrateRoot } from "react-dom/client";
import App from "./pages/index";

// Get the root element that contains the server-rendered HTML
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a div with id="root" in your HTML.'
  );
}

// Get the data that was used for server rendering
// This should be injected by your build script or available globally
const rssData = (window as any).__RSS_DATA__ || { items: [] };

console.log({rssData})

// Hydrate the server-rendered HTML with React using the same props
hydrateRoot(rootElement, <App />);
console.log("🚀 Client-side hydration complete!");