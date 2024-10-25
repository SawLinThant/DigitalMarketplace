"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import { ArrowRight, Variable } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "~/components/Icons";
import ProductComboBox from "~/components/ProductCategoryComboBox";
import FileUploadField from "~/components/file-upload-field";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import { sanitizeKey, useS3Upload } from "next-s3-upload";
import path from "path";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import TextArea from "~/components/TextArea";

interface productInputType extends FieldValues {
  name: string;
  description: string;
  price: string;
  category: string;
}

const ProductDetailPage = () => {
  const searchParam = useSearchParams();
  const productId = searchParam.get("id");
  const [category, setCategory] = useState<string>("");

  const productUpdateMutation = api.product.updateProduct.useMutation({
    onMutate: async (Data: any) => {},
    onSuccess: async () => {
      toast.success("Product updated");
    },
    onError: async (error, variable, rollback) => {
      toast.error("Product update failed");
    },
  });

  const { data: productInfo, isLoading } = api.product.getproductById.useQuery({
    id: productId || "",
  });

  const { register, handleSubmit, reset, setValue } =
    useForm<productInputType>();

  useEffect(() => {
    if (productInfo !== null) {
      reset(productInfo);
      setCategory(productInfo?.category || "");
    }
  }, [productInfo]);

  const onCategoryChange = (category: string) => {
    setCategory(category);
    setValue("category", category);
  };

  const onSubmit = handleSubmit(async (credentials: productInputType) => {
    productUpdateMutation.mutate({
      productId: productId || "",
      ...credentials,
    });
  });

  return (
    <div className="flex h-full w-full flex-col items-center pl-0">
      <div className="h-[1rem]" aria-hidden="true">
        <div className="ml-4 flex lg:ml-0"></div>
      </div>
      <div className="flex w-[90%] flex-col py-5 md:rounded-md md:border md:shadow-lg lg:w-[60rem]">
        <div className="h-25 flex flex-col items-center py-10">
          {/* <Link href="/">
            <Icons.logo className="h-10 w-10" />
          </Link> */}
          <h1 className="text-lg font-bold">Product Information</h1>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
          <form
            className="flex w-full flex-col items-center sm:pl-5"
            onSubmit={onSubmit}
          >
            <div className="flex w-full flex-col items-center gap-2 md:flex-row lg:flex-row lg:items-start">
              <div className="flex w-full flex-col items-center justify-start md:w-1/2 lg:w-1/2">
                <div className="grid w-[80%] gap-1 py-4">
                  <Label>Product Name</Label>
                  <Input
                    className="border-black"
                    type="text"
                    placeholder="Product Name"
                    {...register("name")}
                  />
                </div>
                <div className="grid w-[80%] gap-1 py-4">
                  <Select
                    onValueChange={(value) => onCategoryChange(value)}
                    value={category}
                  >
                    <SelectTrigger className="w-full border-black outline-none focus:outline-none focus:ring-0">
                      <SelectValue placeholder="set status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="pc_laptop">PC/Laptop</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="foodAndDrink">Food&Drink</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-[80%] gap-1 py-4">
                  <Label>Description</Label>
                  <TextArea label="Description" {...register("description")} />
                </div>
                <div className="grid w-[80%] gap-1 py-4">
                  <Label>Price</Label>
                  <Input
                    className="border-black"
                    type="text"
                    placeholder="Price"
                    {...register("price")}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-start md:w-1/2 lg:w-1/2">
                <Image
                  src={productInfo?.images[0]?.imageUrl || ""}
                  alt="product-image"
                  height={256}
                  width={256}
                  className=" rounded-md  object-center sm:h-48 sm:w-48"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="mt-4 w-[80%] md:w-[30%] lg:w-[30%]"
            >
              {productUpdateMutation?.isLoading ? (
                <>
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="size-4 animate-spin fill-green-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                </>
              )}
            </Button>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/dashboard/product/list"
            >
              View Product List
              <ArrowRight className="h-4 w-4" />
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
