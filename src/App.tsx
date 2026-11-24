import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ToastProvider } from "./components/ui";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
