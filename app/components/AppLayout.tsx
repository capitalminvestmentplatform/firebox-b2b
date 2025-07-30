"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ProfileDropdown from "./ProfileDropdown";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const excludedRoutes = ["/", "/auth/login"];

  const isExcluded = excludedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if the current route is in the excluded list
  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-primaryColor text-textColor">
          <div className="flex items-center justify-between w-full me-8">
            <div className="flex items-center gap-2 px-4 ms-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="flex">
                <BreadcrumbList>
                  {pathSegments.map((segment, index) => {
                    const href =
                      "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;

                    const formatted = segment
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase());

                    return (
                      <BreadcrumbItem key={href}>
                        {!isLast ? (
                          <>
                            <BreadcrumbLink asChild>
                              <Link href={href}>{formatted}</Link>
                            </BreadcrumbLink>
                            <BreadcrumbSeparator />
                          </>
                        ) : (
                          <BreadcrumbPage>{formatted}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex gap-6">
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <div
          className="container mx-auto max-w-[1440px] px-4 bg-primaryColor text-textColor"
          key={pathname}
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
