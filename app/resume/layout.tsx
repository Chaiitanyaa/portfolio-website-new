import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Chaiitanyaa Chopraa — software developer in Victoria, BC. BSc Computer Science, University of Victoria. Available for full-time and contract work.",
  alternates: { canonical: "/resume" },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
