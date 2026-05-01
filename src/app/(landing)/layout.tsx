import LandingNavbar from "@/components/landing-navbar";
import LandingFooter from "@/components/landing-footer";
import { Chatbot } from "@/components/chatbot";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-hidden">
      <LandingNavbar />
      {children}
      <LandingFooter />
      <Chatbot />
    </div>
  );
}

