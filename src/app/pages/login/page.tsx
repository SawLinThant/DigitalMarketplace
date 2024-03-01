import Link from "next/link";
import { Icons } from "~/components/Icons";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const Login = () => {
  return (
    <div className="flex h-full w-full flex-col items-center pl-0">
      <div className="h-[8rem]" aria-hidden="true">
        <div className="ml-4 flex lg:ml-0"></div>
      </div>

      <div className="flex h-[30rem] w-[30rem] flex-col md:border md:rounded-md md:shadow-lg">
        <div className="flex h-25 flex-col items-center py-10">
          <Link href="/">
            <Icons.logo className="h-10 w-10" />
          </Link>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
          <form className="flex w-full flex-col items-center sm:pl-5">
            <div className="flex w-full flex-col items-center gap-2">
              <div className="grid w-[80%] gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder="Enter email" />
              </div>
              <div className="grid w-[80%] gap-1 py-2 pb-7">
                <Label htmlFor="password">Password</Label>
                <Input type="password" placeholder="Enter password" />
              </div>
              <Button className="w-[80%]">Sign Up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
