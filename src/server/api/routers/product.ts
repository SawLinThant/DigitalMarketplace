import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Session } from "inspector";
import { QueryValidator } from "~/lib/validators/query-validator";
import { stripe } from "~/lib/stripe";
import aws from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";
import { Product } from "~/types/global";

interface PrismaError extends Error {
  code: string;
  meta?: {
    target?: string[];
  };
}

export const productSubmitInput = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.string(),
  base64Image: z.string().array(),
  images: z
    .array(
      z.object({
        imageUrl: z.string(),
      }),
    )
    .optional(),
});

const validateImageURL = (imgURL: string) => {
  try {
    const buf = Buffer.from(
      imgURL.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );
    return buf;
  } catch (e) {
    return null;
  }
};

const isBase64Image = (base64String: string) => {
  const imageRegex = /^data:image\/(jpeg|jpg|png|gif);base64,/i;

  // Check if the base64 string matches the image format regex
  if (!imageRegex.test(base64String)) {
    return false;
  }

  // Decode the base64 string to a buffer
  const buffer = Buffer.from(base64String.replace(imageRegex, ""), "base64");

  // Check if the decoded buffer has the characteristics of an image file
  // For example, you can check the file signature (magic number)
  const isImage =
    (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) || // JPEG
    (buffer[0] === 0x89 && buffer[1] === 0x50); // PNG

  return isImage;
};

const uploadManager = {
  uploadS3: async (imgURL: string, key: string) => {
    const buf = Buffer.from(
      imgURL.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );

    const extension = imgURL.substring(
      "data:image/".length,
      imgURL.indexOf(";base64"),
    );

    aws.config.update({
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
      region: process.env.S3_UPLOAD_REGION,
    });

    var s3Bucket = new aws.S3();

    var data: PutObjectRequest = {
      Bucket: process.env.S3_UPLOAD_BUCKET || "", // + TODO: your desired path
      Key: `digital_marketplace/product_image/${key}`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: `image/${extension}`,
    };

    return s3Bucket.upload(data).promise();
  },
};

async function createStripeProduct(name: string, price: number) {
  try {
    const product = await stripe.products.create({
      name: name,
    });

    const priceObject = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "usd",
      product: product.id,
    });

    console.log(priceObject.id);

    return {
      stripeProductId: product.id,
      stripePriceId: priceObject.id,
    };
  } catch (error) {
    console.log("Error creating product in Stripe:", error);
    throw new Error("Failed to create product in Stripe");
  }
}

export const productRouter = createTRPCRouter({
  // createStripeProduct: protectedProcedure
  // .input(z.object({
  //   name: z.string(),
  //   price: z.number()
  // }))
  // .mutation(async ({ctx,input}) => {
  //   try{
  //     const product = await stripe.products.create({
  //       name: input.name
  //     })

  //     const priceObject = await stripe.prices.create({
  //       unit_amount: input.price * 100,
  //       currency: 'usd',
  //       product: product.id
  //     })

  //     return{
  //       stripeProductId: product.id,
  //       stripePriceId: priceObject.id
  //     }

  //   }catch(error){
  //     console.log('Error creating product in Stripe:', error)
  //     throw new Error("Failed to create product in Stripe")
  //   }
  // }),

  createProduct: protectedProcedure
    .input(productSubmitInput)
    // .output(productSubmitInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const sellerInfo = await ctx.db.user.findFirst({
          where: {
            id: ctx.session.user.id,
          },
        });

        const { stripeProductId, stripePriceId } = await createStripeProduct(
          input.name,
          parseInt(input.price),
        );

        if (input.base64Image) {
          for (const image of input.base64Image) {
            if (!isBase64Image(image)) {
              throw new Error("Invalid Image Format");
            }
          }
        }

        //  const uploadpromises = input.images?.map((image) => uploadManager.uploadS3(image.imageUrl,uuidv4()));
        //  const uploadedImages = await Promise.all(uploadpromises || [])
        const uploadPromises = input.base64Image?.map((image) =>
          uploadManager.uploadS3(image, uuidv4()),
        );
        const uploadedImages = await Promise.all(uploadPromises || []);

        const product = await ctx.db.product.create({
          data: {
            name: input.name,
            category: input.category,
            description: input.description,
            price: input.price || "",
            //image: input.image,
            approve: false,
            sellerId: sellerInfo?.id || "",
            sellerName: sellerInfo?.username || "",
            stripeProductId: stripeProductId,
            stripePriceId: stripePriceId,
            images: {
              create: uploadedImages.map((upload, index) => ({
                imageUrl: `https://${process.env.S3_UPLOAD_BUCKET}.s3.ap-southeast-1.amazonaws.com/${upload.Key}`,
              })),
            },
          },
        });
        return { ...product };
      } catch (error: unknown) {
        throw new Error("product creation failed");
      }
    }),

  getProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query, cursor } = input;
        const { sort, limit = 1, ...queryOpts } = query;

        const parsedQueryOpts: Record<string, any> = {};
        Object.entries(queryOpts).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subValue !== undefined) {
                parsedQueryOpts[`${key}.${subKey}`] = subValue;
              }
            });
          } else {
            parsedQueryOpts[key] = value;
          }
        });

        const page = cursor || 1;
        const offset = (page - 1) * limit;

        const products = await ctx.db.product.findMany({
          where: {
            approve: false,
            ...parsedQueryOpts,
          },
          orderBy: {
            id: "asc",
          },
          take: limit,
          skip: offset,
          include: {
            images: true,
          },
        });

        const transformedProduct = products.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          sellerName: product.sellerName,
          images: product.images.map((image) => ({
            id: image.id,
            image: image.imageUrl,
          })),
        }));

        const totalProduct = await ctx.db.product.count({
          where: {
            approve: false,
            ...parsedQueryOpts,
          },
        });

        const hasNextPage = offset + products.length < totalProduct;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
          products: transformedProduct,
          nextPage,
        };
      } catch (e: unknown) {
        console.error("Error fetching products:", e);
        throw new Error("Fail to load proudct");
      }
    }),

  getproductById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findFirst({
          where: {
            id: input.id,
          },
          include: {
            images: true,
          },
        });
        return product;
      } catch (e: unknown) {
        console.error("Error fetching products:", e);
        throw new Error("Fail to load proudct");
      }
    }),

  getCategoryByProductId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.product.findFirst({
        where: {
          id: input.id,
        },
        select: {
          category: true,
        },
      });
    }),

  getCategories: publicProcedure
    .input(
      z.object({
        productIds: z.string().array(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { productIds } = input;
      const categories = await ctx.db.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        select: {
          id: true,
          category: true,
        },
      });
      return categories;
    }),

  getImage: publicProcedure
    .input(
      z.object({
        productIds: z.string().array(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { productIds } = input;
      const products = await ctx.db.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        select: {
          id: true,
          images: true,
        },
      });

      // const imageUrls = products.reduce((acc,product) => {
      //   acc[product.id] = product.images.map((image) => image.imageUrl)
      //   return acc
      // }, {} as {[key:string]:string[]})
      const imageUrls = products.flatMap((product) =>
        product.images.map((image) => ({
          productId: product.id,
          imageUrl: image.imageUrl,
        })),
      );

      return {
        imageUrls,
      };
    }),
  getProductList: publicProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
        name: z.string().default(""),
        category: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const productList = await ctx.db.product.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            name: { contains: input.name },
            category: {
              contains: input.category == "all" ? "" : input.category,
            },
          },
          include: {
            images: true,
          },
        });
        const productListCount = await ctx.db.product.count({
          where: {
            name: { contains: input.name },
            category: {
              contains: input.category == "all" ? "" : input.category,
            },
          },
        });

        const data: Product[] = productList.map((product) => {
          return {
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            sellerName: product.sellerName,
            images: product.images.map((image) => ({
              id: image.id,
              image: image.imageUrl,
            })),
          };
        });
        return { productList: data, count: productListCount };
      } catch (e: unknown) {
        console.error("Error fetching products:", e);
        throw new Error("Fail to load proudct");
      }
    }),
  addReviewForProudct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        comment: z.string().default(""),
        rating: z.string().default("0"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.review.create({
          data: {
            comments: input.comment,
            rating: input.rating,
            productId: input.productId,
            userId: ctx.session.user.id,
          },
        });
      } catch (e: any) {}
    }),
  getReviewForProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const reviews = await ctx.db.review.findMany({
          where: {
            productId: input.productId,
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        });
        return reviews;
      } catch (e: any) {}
    }),
  updateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        category: z.string(),
        price: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.product.update({
          where: {
            id: input.productId,
          },
          data: {
            name: input.name,
            category: input.category,
            description: input.description,
            price: input.price,
          },
        });
      } catch (e: any) {}
    }),
});
