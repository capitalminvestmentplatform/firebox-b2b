"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "@/app/components/Button";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    loading,
    showPassword,
    setShowPassword,
  } = useLoginForm();

  return (
    <div className="h-screen w-full bg-primaryColor text-white p-5 flex items-center justify-center">
      <div className="bg-primaryColor_1 p-10 shadow-lg w-full max-w-lg">
        <Image
          src="/icons/logo-with-tagline.png"
          alt="brand"
          width={300}
          height={150}
          className="mx-auto mb-20"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <h1 className="text-4xl font-bold lg:mt-10 mb-10 text-center font-heading">
            Distributor Login
          </h1>

          {/* Email Field */}
          <div className="relative mb-7">
            <Label htmlFor="email" className="font-body">
              Enter your Email/Client code
            </Label>
            <Input
              {...register("email")}
              placeholder="Enter email"
              className="mt-1 ps-10 py-5 rounded-none font-body"
            />
            <Mail className="absolute left-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 text-secondaryColor" />
            {errors.email && (
              <p className="text-red-500 text-sm font-body">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mb-7">
            <Label htmlFor="password" className="font-body">
              Enter your Pin
            </Label>
            <KeyRound className="absolute left-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 text-secondaryColor" />
            <Input
              type={!showPassword ? "password" : "text"}
              {...register("password")}
              placeholder="Enter 4-digit pin"
              className="mt-1 ps-10 py-5 rounded-none font-body"
            />
            {!showPassword ? (
              <EyeOff
                className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 cursor-pointer text-secondaryColor"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 w-5 h-5 cursor-pointer text-secondaryColor"
                onClick={() => setShowPassword(false)}
              />
            )}
            {errors.password && (
              <p className="text-red-500 text-sm font-body">
                {errors.password.message}
              </p>
            )}
          </div>

          <Link
            href="/auth/forgot-pin"
            className="text-sm hover:underline mb-4 block font-body"
          >
            Forgot pin?
          </Link>
          <CustomButton
            type="submit"
            name="Login"
            classes="me-3 bg-secondaryColor rounded-none w-full font-heading"
            state={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
