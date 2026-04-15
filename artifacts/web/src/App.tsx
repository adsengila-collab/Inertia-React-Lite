import { Switch, Route, Router as WouterRouter, useParams } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Dmca from "@/pages/Dmca";
import Copyright from "@/pages/Copyright";
import NotFound from "@/pages/not-found";
import SinglePost from "@/pages/SinglePost";

const queryClient = new QueryClient();

function PostWrapper() {
  const params = useParams<{ slug: string }>();
  return <SinglePost slug={params.slug || ""} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/p/contact" component={Contact} />
      <Route path="/p/privacy-policy" component={PrivacyPolicy} />
      <Route path="/p/dmca" component={Dmca} />
      <Route path="/p/copyright" component={Copyright} />
      <Route path="/:slug" component={PostWrapper} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
