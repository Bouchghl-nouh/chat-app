import { StrictMode } from "react";
import { RouterProvider } from "react-router/dom";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import routes from "./router/routes";
import { store } from './store'
import { Provider } from 'react-redux'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="telegram-ui-theme">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={routes} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster richColors closeButton position="top-right" duration={5000}/>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
