"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sideMenu } from "@/data/sideMenu";
import { getLoggedInUser } from "@/utils/client";

export function NavMain() {
  const pathname = usePathname();
  const user = getLoggedInUser(); // must be synchronous or already loaded
  const isAdmin = user?.role === "Admin";

  const filteredMenu = sideMenu.filter((item) => !item.isAdmin || isAdmin);

  // Find the longest matching URL
  const activeItem = filteredMenu.reduce(
    (acc, item) => {
      return pathname.startsWith(item.url) &&
        item.url.length > (acc?.url.length || 0)
        ? item
        : acc;
    },
    null as (typeof sideMenu)[0] | null
  );
  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredMenu.map((item) => {
          const isActive = activeItem?.url === item.url;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={
                  isActive
                    ? "bg-secondaryColor hover:bg-secondaryColor text-textColor hover:text-textColor"
                    : ""
                }
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-2 font-body"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
