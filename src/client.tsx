import { hydrateRoot } from "react-dom/client";
import App from "./pages/index";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a div with id="root" in your HTML.'
  );
}

const rssData = (window as any).__RSS_DATA__ || { items: [] };

hydrateRoot(rootElement, <App rssData={rssData} />);