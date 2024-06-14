import { useEffect, useState } from "react";
import { promise } from "zod";
import { api } from "~/trpc/react";

type Category = {
    name:string
}

const fetchCategoryByProductId = async (productId: string) => {
    const { data } = await api.product.getCategoryByProductId.useQuery({ id: productId });
    return data;
  };

const useCategories = (productIds: string[]) => {
    const [categories,setCategories] = useState<{[key:string]:Category | null}>({})

    useEffect(() => {
        const fetchCategories = async () =>  {
            const categoryMap: {[key: string]:Category | null} = {};
            await Promise.all(productIds.map(async(productId) => {
                const { data: categoryData, error } = await api.product.getCategoryByProductId.useQuery({ id: productId });
                categoryMap[productId] = categoryData ?? null;
            }));
            setCategories(categoryMap);
        };
        if(productIds.length>0){
            fetchCategories()
        }
    })
    return categories;
}
export default useCategories;