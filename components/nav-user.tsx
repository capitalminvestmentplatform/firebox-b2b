"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { getLoggedInUser } from "@/utils/client";

export function NavUser() {
  const loggedInUser = getLoggedInUser();

  const { firstName, lastName, email, image } = loggedInUser || {};

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-5 my-5">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={image} alt={firstName} />
            <AvatarFallback className="rounded-full bg-secondaryColor text-textColor">
              {firstName?.charAt(0) || ""} {lastName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight font-body">
            <span className="truncate font-semibold">
              {firstName} {lastName}
            </span>
            <span className="truncate text-xs">{email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
