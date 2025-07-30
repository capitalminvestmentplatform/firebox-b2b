"use client";
import * as React from "react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function TeamSwitcher() {
  return (
    <SidebarMenu className="">
      <SidebarMenuItem className="flex justify-center">
        <Link href={"/"}>
          <div className="relative w-[150px] h-[100px]">
            <Image
              src="/icons/logo-without-tagline.png"
              alt="brand"
              fill
              className="object-contain"
            />
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
