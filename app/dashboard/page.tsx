"use client";
import { getLoggedInUser } from "@/utils/client";
import AdminSection from "./AdminSection";
import ClientSection from "./ClientSection";

const DashboardPage: React.FC = () => {
  const { role, firstName, lastName, email } = getLoggedInUser() || {
    role: "",
  };
  console.log("role", role);
  return (
    <div className="container mx-auto max-w-[1440px] px-4">
      <p className="text-2xl mb-10 font-semibold font-heading">
        Welcome {firstName} {lastName}
      </p>
      {role === "Admin" ? <AdminSection /> : <ClientSection />}
    </div>
  );
};

export default DashboardPage;
