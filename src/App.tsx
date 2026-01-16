import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ReadIndex from "./pages/ReadIndex";
import Reader from "./pages/Reader";
import GlossaryIndex from "./pages/GlossaryIndex";
import GlossaryTerm from "./pages/GlossaryTerm";
import InteractivesIndex from "./pages/InteractivesIndex";
import InteractiveView from "./pages/InteractiveView";
import Safety from "./pages/Safety";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="crypto-atlas-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/read" element={<ReadIndex />} />
            <Route path="/read/:chapterSlug" element={<Reader />} />
            <Route path="/read/:chapterSlug/:sectionSlug" element={<Reader />} />
            <Route path="/glossary" element={<GlossaryIndex />} />
            <Route path="/glossary/:termSlug" element={<GlossaryTerm />} />
            <Route path="/interactives" element={<InteractivesIndex />} />
            <Route path="/interactives/:slug" element={<InteractiveView />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
