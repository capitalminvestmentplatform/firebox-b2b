"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useParams } from "next/navigation";
import CustomButton from "@/app/components/Button";

type User = {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  role: "Admin" | "User";
  clientCode?: string;
  isVerified: boolean;
  firstLogin: boolean;
};

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const pinSchema = z
  .object({
    password: z.string().refine((val) => /^\d{4}$/.test(val), {
      message: "Pin must be exactly 4 digits (numbers only)",
    }),
    confirmPassword: z.string().refine((val) => /^\d{4}$/.test(val), {
      message: "Pin must be exactly 4 digits (numbers only)",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Pins do not match",
    path: ["confirmPassword"],
  });

const EditUserPage = () => {
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEditProfile, setLoadingEditProfile] = useState(false);
  const [loadingEditPin, setLoadingEditPin] = useState(false);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const {
    register: pinRegister,
    handleSubmit: handlePinSubmit,
    formState: { errors: pinErrors },
    reset: pinReset,
  } = useForm({
    resolver: zodResolver(pinSchema),
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }
      const user = response.data;

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });

      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const onSubmit = async (data: any) => {
    setLoadingEditProfile(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: id }),
      });

      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      toast.success(response.message);
      reset(); // Reset form on success
      getUserProfile(); // Refresh user profile data
    } catch (error: any) {
      // toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingEditProfile(false);
    }
  };

  const onPinSubmit = async (data: any) => {
    setLoadingEditPin(true);

    try {
      const res = await fetch("/api/profile/change-pin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: id }),
      });

      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      toast.success(response.message);
      reset(); // Reset form on success
    } catch (error: any) {
      // toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingEditPin(false);
    }
  };
  return (
    <div className="flex flex-col items-center p-6">
      <Card className="w-full shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Label>First Name</Label>
                    <Input {...register("firstName")} />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input {...register("lastName")} />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Username</Label>
                    <Input value={user.username} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input {...register("phone")} />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={user.role} disabled />
                  </div>
                  <div>
                    <Label>Client Code</Label>
                    <Input value={user.clientCode || "N/A"} disabled />
                  </div>
                </div>
                <CustomButton
                  type="submit"
                  classes="mt-6 bg-primaryBG"
                  name="Edit Profile"
                  state={loadingEditProfile}
                />
              </form>

              <form onSubmit={handlePinSubmit(onPinSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="relative">
                    <Label>Pin</Label>
                    <Input
                      type={!show ? "password" : "text"}
                      {...pinRegister("password")}
                      placeholder="Enter 4-digit pin"
                      inputMode="numeric"
                      pattern="\d{4}"
                    />
                    {!show ? (
                      <EyeOff
                        className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 cursor-pointer"
                        onClick={() => setShow(!show)}
                      />
                    ) : (
                      <Eye
                        className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 cursor-pointer"
                        onClick={() => setShow(!show)}
                      />
                    )}
                    {pinErrors.password && (
                      <p className="text-red-500 text-sm">
                        {pinErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Label>Confirm Pin</Label>
                    <Input
                      type={!show ? "password" : "text"}
                      {...pinRegister("confirmPassword")}
                      placeholder="Confirm 4-digit pin"
                      inputMode="numeric"
                      pattern="\d{4}"
                    />
                    {!show ? (
                      <EyeOff
                        className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 cursor-pointer"
                        onClick={() => setShow(!show)}
                      />
                    ) : (
                      <Eye
                        className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 cursor-pointer"
                        onClick={() => setShow(!show)}
                      />
                    )}
                    {pinErrors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {pinErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <CustomButton
                  type="submit"
                  classes="mt-6 bg-primaryBG"
                  name="Change Pin"
                  state={loadingEditPin}
                />
              </form>
            </div>
          ) : (
            <p className="text-red-500">Failed to load user data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserPage;
