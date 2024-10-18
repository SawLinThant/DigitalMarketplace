"use client";

import Link from "next/link";
import { Icons } from "~/components/Icons";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm } from "react-hook-form";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "~/lib/validators/account-credentials";
import { api } from "~/trpc/react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { ArrowRight } from "lucide-react";
import ComboBox from "~/components/UserTypeComboBox";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const [userType,setUserType]=useState<string>("");

  const checkBoxHandler=(userType:string)=>{
    
       setUserType(userType);
  }

  const router = useRouter();

  const mutation = api.auth.register.useMutation({
    onMutate: async (data: any) => {
      console.log(data);
    },
    onSuccess: async () => {
      toast.success("Registration successful");
      // router.push('/')
    },
    onError: async (error, variable, rollback) => {
      toast.error("Registration Failed");
    },
  });

  const onSubmit2=()=>{
      console.log("clicked");
  }

  const onSubmit = handleSubmit(async({
    username,
    email,
    password,
    confirmpassword,
  }: TAuthCredentialsValidator) => {
    console.log("before confirm password")
    if (password !== confirmpassword) {
      toast.warning("Please confirm password");
      return;
    } else {
      toast.message("Please wait...");
    }
   
    mutation.mutate({
      username: username,
      email: email,
      password: password,
      userType: "buyer",
    });
  });

  return (
    <div className="flex h-full w-full flex-col items-center pl-0">
      <div className="h-[1rem]" aria-hidden="true">
        <div className="ml-4 flex lg:ml-0"></div>
      </div>

      <div className="flex h-[39rem] w-[90%] flex-col md:rounded-md md:border md:shadow-lg lg:w-[30rem]">
        <div className="h-25 flex flex-col items-center py-10">
          <Link href="/">
            <Icons.logo className="h-10 w-10" />
          </Link>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
          <form
            className="flex w-full flex-col items-center sm:pl-5"
            onSubmit={onSubmit}
          >
            <div className="flex w-full flex-col items-center gap-2">
              <div className="grid w-[80%] gap-1 py-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  {...register("username")}
                />
              </div>
              <div className="grid w-[80%] gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...register("email")}
                  className={cn({
                    "focus-visible:ring-red-500": errors.email,
                  })}
                />
                {errors?.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid w-[80%] gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...register("password")}
                  className={cn({
                    "focus-visible:ring-red-500": errors?.password,
                  })}
                />
                {errors?.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid w-[80%] gap-1 py-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...register("confirmpassword")}
                  className={cn({
                    "focus-visible:ring-red-500": errors?.password,
                  })}
                />
              </div>
              {/* <div className="w-[80%] pb-7 pt-2">
                <ComboBox checkBoxHandler={checkBoxHandler} />
              </div> */}

              <Button className="w-[80%]">Register</Button>
              <Link
                className={buttonVariants({
                  variant: "link",
                  className: "gap-1.5",
                })}
                href="/pages/login"
              >
                Already have an account?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
