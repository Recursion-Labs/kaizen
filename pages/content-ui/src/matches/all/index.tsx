import inlineCss from "../../../dist/all/index.css?inline";
import contentCss from "../../../public/content.css?inline";
import { initAppWithShadow } from "@extension/shared";
import App from "@src/matches/all/App";

// Inject content CSS globally (not in shadow DOM)
const style = document.createElement("style");
style.textContent = contentCss;
document.head.appendChild(style);

initAppWithShadow({ id: "CEB-extension-all", app: <App />, inlineCss });
