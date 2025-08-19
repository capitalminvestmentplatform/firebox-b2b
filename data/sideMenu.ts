import {
  Files,
  Home,
  Image,
  Newspaper,
  StickyNote,
  Users,
  Video,
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
    icon: Image,
  },
  {
    title: "Videos",
    icon: Video,
    url: "/dashboard/product-videos",
  },
  {
    title: "Documents",
    icon: Files,
    url: "/dashboard/product-documents",
  },
  {
    title: "Catalogue",
    icon: StickyNote,
    url: "/dashboard/product-catalogue",
  },
  {
    title: "User Manuals",
    icon: Newspaper,
    url: "/dashboard/product-manuals",
  },
  {
    title: "Certificates",
    icon: Files,
    url: "/dashboard/product-certificates",
  },
  {
    title: "Users",
    icon: Users,
    url: "/dashboard/users",
    isAdmin: true,
  },
];
