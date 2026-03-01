import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ReportProvider } from "./contexts/ReportContext";
import Landing from "./pages/Landing";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Wizard from "./pages/Wizard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/wizard"} component={Wizard} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/reports/:id"} component={ReportDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ReportProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ReportProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
