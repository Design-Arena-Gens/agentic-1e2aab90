import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Agentic Travel Planner",
  description: "Persona-aware agent that remembers flights and enforces hotel for rich persona"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Agentic Travel Planner</h1>
            <p className="subtitle">Rich vs Business personas with memory</p>
          </header>
          <main>{children}</main>
          <footer className="footer">? {new Date().getFullYear()} Agentic</footer>
        </div>
      </body>
    </html>
  );
}
