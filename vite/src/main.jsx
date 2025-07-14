import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import cards from "./cards.json";

const BANNER_IDS = new Set([30028, 30029]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App cards={cards} bannerIds={BANNER_IDS} />
	</StrictMode>,
);
