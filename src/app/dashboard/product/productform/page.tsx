"use client"
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

interface productInputType extends FieldValues{
  base64Image: string[],
  productName: string,
  description: string,
  images: {imageUrl: string}[],
  price: string,
}

const ProductForm = () => {
  const [category,setCategory] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [imageName, setImageName] = useState<any>();
  const [filePath, setFilePath] = useState<string[]>([]);
  const {uploadToS3} = useS3Upload();
  const mutation=api.product.createProduct.useMutation({
    onMutate: async (Data: any) => {
      
    },
    onSuccess: async() => {
      toast.success("Product Created");
    },
    onError: async(error, variable, rollback) => {
      toast.error("Product creation failed");
    },
  })

  const convertToBase65String=(file:File)=>{
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result?.toString() || "");
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      
    });
  
  }

  const  convertToBase64Array=async(files:File[]):Promise<Promise<string>[]>=>{
    const base64Images=files.map(async(file)=>{
     const img= await convertToBase65String(file)
     return img
    })
    return base64Images
  }

  const imageUpload = (file: File[]) => {
    setUploadedFile([...uploadedFile,...file])
    console.log(uploadedFile)
    //setImageName(file.map(file => file.name).join(", "))
    setImageName((uploadedFile.length+1) + " Image(s) selected")
  }
 
  useEffect(() => {
    if(uploadedFile !== null){
      const path = uploadedFile.map((file) => "digital_marketplace/product_image/"+file.name)
      setFilePath(path)
      console.log(path)
    }
    else{
      setFilePath([])
    }
  },[uploadedFile])

  const {
    register,
    handleSubmit,
    formState:{errors, isSubmitting,isValid},
  }=useForm<productInputType>();

  const checkBoxHandler=(category:string) => {
     setCategory(category);
     console.log(category)
  }
 
  const onSubmit = handleSubmit(async ({
    base64Image,
    productName,
    description,
    images,
    price,
  }:productInputType) => {
    toast.message("Please Wait...");
    //const uploadPromises = uploadedFile.map((file) => uploadToS3(file))
    //const uploadedFiles = await Promise.all(uploadPromises)
    // const imageUrl = uploadedFiles.map((file) => ({
    //   imageUrl: file.url,
    // }));
   
   convertToBase64Array(uploadedFile)
  .then(promises => Promise.all(promises)) // Wait for all promises to resolve
  .then(base64Strings => {
    // Now 'base64Strings' is an array containing all the base64 encoded strings
    // console.log(base64Strings);
     base64Strings;
    mutation.mutate({
      base64Image: base64Strings,
      name: productName,
      category: category,
      description: description,
      price: price,
      images: filePath.map((url) => ({imageUrl:`https://tollgate-upload.s3.ap-southeast-1.amazonaws.com/${sanitizeKey(url)}`}))
    });
  })
  .catch(error => {
    console.error("Error converting files:", error);
  });
  
    
  })

  return (
    <div className="flex h-full w-full flex-col items-center pl-0">
      <div className="h-[1rem]" aria-hidden="true">
        <div className="ml-4 flex lg:ml-0"></div>
      </div>
      <div className="flex h-[35rem] w-[90%] flex-col md:rounded-md md:border md:shadow-lg lg:w-[60rem]">
      <div className="h-25 flex flex-col items-center py-10">
          {/* <Link href="/">
            <Icons.logo className="h-10 w-10" />
          </Link> */}
          <h1 className="font-bold text-lg">Create your product</h1>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
            <form className="flex w-full flex-col items-center sm:pl-5" onSubmit={onSubmit}>
                <div className="flex w-full flex-col md:flex-row lg:flex-row lg:items-start items-center gap-2">
                <div className="w-full flex flex-col justify-start items-center md:w-1/2 lg:w-1/2">
                    <div className="grid w-[80%] gap-1 py-4">
                        <Label>Product Name</Label>
                        <Input
                        type="text"
                        placeholder="Product Name"
                        {...register("productName")}
                       / >
                    </div>
                    <div className="grid w-[80%] gap-1 py-4">
                    <Label>Category</Label>
                       <ProductComboBox checkBoxHandler={checkBoxHandler}/>
                    </div>
                    <div className="grid w-[80%] gap-1 py-4">
                        <Label>Description</Label>
                        <Input
                        type="text"
                        placeholder="Description"
                        {...register("description")}
                       / >
                    </div>
                </div>
                <div className="w-full flex flex-col items-center justify-start md:w-1/2 lg:w-1/2">
                    <div className="grid w-[80%] gap-1 py-4">
                        <Label>Price</Label>
                        <Input
                        type="text"
                        placeholder="Price"
                        {...register("price")}
                       / >
                    </div>
                    <div className="grid w-[80%] gap-1 py-4">
                        <Label>Image</Label>
                        {/* <Input
                        type="text"
                        placeholder="Upload Image"
                        {...register("image")}
                       / > */}
                       <FileUploadField
                         onFileChosen={imageUpload}
                         multiple={true}
                         errorMessage=""
                         filetypes={["png"]}
                         className="mb-4 h-full"
                         placeholder={imageName==null ? "Upload Images or an image" : imageName}
                       />
                    </div>
                    {/* <UploadButton endpoint="imageUploader"/> */}
                </div>
                </div>  
                <Button className="lg:w-[30%] md:w-[30%] w-[80%] mt-4">Create product</Button>  
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

export default ProductForm;
