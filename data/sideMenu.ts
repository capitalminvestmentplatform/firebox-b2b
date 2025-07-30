import {
  Activity,
  Book,
  BookCheck,
  CalendarCheck,
  Files,
  FileStack,
  Home,
  Landmark,
  Newspaper,
  Phone,
  Receipt,
  Shield,
  StickyNote,
  Users,
} from "lucide-react";

export const sideMenu = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Images",
    url: "/dashboard/product-images",
    icon: Home,
  },
  {
    title: "Videos",
    icon: Landmark,
    url: "/dashboard/product-videos",
  },
  {
    title: "Documents",
    icon: Files,
    url: "/dashboard/product-documents",
  },
  {
    title: "Catalogs",
    icon: StickyNote,
    url: "/dashboard/product-catalogs",
  },
  {
    title: "User Manuals",
    icon: Newspaper,
    url: "/dashboard/product-manuals",
  },
  {
    title: "Certificates",
    icon: Newspaper,
    url: "/dashboard/product-certificates",
  },
  {
    title: "Users",
    icon: Users,
    url: "/dashboard/users",
    isAdmin: true,
  },
];
