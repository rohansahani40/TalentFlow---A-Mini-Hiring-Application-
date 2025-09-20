import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { worker } from "./mocks/browser.js";
import { seedAll } from "./db/seed.js";

async function prepare() {
  await worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
  await seedAll();
}

const queryClient = new QueryClient();

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
