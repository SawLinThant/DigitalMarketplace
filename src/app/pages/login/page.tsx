"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Icons } from "~/components/Icons";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TAuthCredentialsValidator } from "~/lib/validators/account-credentials";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TAuthCredentialsValidator>();

  // const onSubmit = async({ email, password }: TAuthCredentialsValidator) => {
  //   const res =await signIn({email,password})
  // };

  const router = useRouter();

  const onSubmit = handleSubmit(async (credentials) => {
    const res = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      callbackUrl: "/",
      redirect: true,
    });
    console.log(res?.status);
    if (res?.status === 401) {
      toast.error("Login failed");
    } else if(res?.status==200) {
      toast.success("Login Successful");   
    }
    else{
      toast.success("Login Successful")
    }
  });

  return (
    <div className="flex h-full w-full flex-col items-center pl-0">
      <div className="h-[6rem]" aria-hidden="true">
        <div className="ml-4 flex lg:ml-0"></div>
      </div>

      <div className="flex h-[28rem] w-[90%] flex-col md:rounded-md md:border md:shadow-lg lg:w-[30rem]">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter email"
                  className={cn({
                    "focus-visible:ring-red-500": errors.email,
                  })}
                />
              </div>
              <div className="grid w-[80%] gap-1 py-2 pb-7">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is requiredd",
                  })}
                  placeholder="Enter password"
                  className={cn({
                    "focus-visible:ring-red-500": errors.password,
                  })}
                />
              </div>
              <Button className="w-[80%]">Login</Button>
              <Link
                className={buttonVariants({
                  variant: "link",
                  className: "gap-1.5",
                })}
                href="/pages/register"
              >
                Don&apos;t have an account?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
