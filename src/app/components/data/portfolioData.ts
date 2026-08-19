export interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  image?: string;
  href?: string;
}

export const portfolioData: PortfolioItem[] = [
  {
    title: "Emmaray Law Firm",
    category: "Brand Identity",
    description:
      "Premium branding and digital presence for a modern immigration law firm.",
    image: "",
    href: "#",
  },

  {
    title: "Amanah Quran Academy",
    category: "Education",
    description:
      "Professional branding and social media strategy for an online academy.",
    image: "",
    href: "#",
  },

  {
    title: "Al Habeb Hair Oil",
    category: "E-Commerce",
    description:
      "Complete branding, packaging and digital marketing campaign.",
    image: "",
    href: "#",
  },
];