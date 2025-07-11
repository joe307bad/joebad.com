import { hydrateRoot } from "react-dom/client";
import { MDXProvider } from "@mdx-js/react";
import App from "./content/cv.mdx"; // or your main component
import { SectionHeading } from "./components/SectionHeading";
import { Main } from "./components/Main";

const components = {
  SectionHeading: SectionHeading,
};

hydrateRoot(
  document.getElementById("root")!,
  <MDXProvider components={components}>
    <Main activePage="cv">
      <App components={components} /> 
    </Main>
  </MDXProvider>
);
