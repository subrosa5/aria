import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
  useRouter: vi.fn(() => ({ push: vi.fn(), refresh: vi.fn() })),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/store/language", () => ({
  useLanguageStore: vi.fn(() => ({ lang: "en", toggle: vi.fn() })),
}));

vi.mock("@/lib/i18n", () => ({
  translations: {
    en: {
      nav_dashboard: "Dashboard",
      nav_chat: "AI Chat",
      nav_tools: "Tools",
      nav_settings: "Settings",
      nav_signout: "Sign out",
    },
  },
}));

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation links", () => {
    render(<Sidebar />);
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI Chat").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tools").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
  });

  it("renders the sign out button", () => {
    render(<Sidebar />);
    expect(screen.getAllByText("Sign out").length).toBeGreaterThan(0);
  });

  it("renders the Aria brand logo", () => {
    render(<Sidebar />);
    expect(screen.getAllByText("Aria").length).toBeGreaterThan(0);
  });

  it("opens the mobile drawer when hamburger is clicked", () => {
    render(<Sidebar />);
    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    // Drawer should now be visible (translate-x-0)
    const drawer = hamburger.closest("div")?.parentElement?.querySelector("aside:last-of-type");
    expect(drawer?.className).toContain("translate-x-0");
  });

  it("renders the language toggle button", () => {
    render(<Sidebar />);
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);
  });
});
