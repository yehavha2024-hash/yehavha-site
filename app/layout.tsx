import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 법률연구소 | AI Law Research Institute",
  description: "AI의 행위효과와 책임귀속, Agentic AI, 법적 지위와 거버넌스를 연구합니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
