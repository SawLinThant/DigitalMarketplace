import { v4 as uuidv4 } from 'uuid'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { NextRequest, NextResponse } from 'next/server';


const upload=multer()


export const config = {
  api: { bodyParaser: false }
}
export default async function POST(req:any,res: any) {
    if(req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
     return;
    } 
   
    try {
    
     console.log(req.body['filename']+" and "+req.body['contentType'])
    
    // upload.single('fileName')(req,res,()=>{
    //   //console.log(req)
    // })
    //res.status(200).send({message:`Ok`})
    //const { filename, contentType } = await req.json()
    //console.log(filename)
    const client = new S3Client({ region: "ap-southeast-1" })
      const { url, fields } = await createPresignedPost(client, {
        Bucket: process.env.S3_UPLOAD_BUCKET || "",
        Key: uuidv4(),
        Conditions: [
          ['content-length-range', 0, 10485760], // up to 10 MB
          ['starts-with', '$Content-Type', req.body['contentType']],
        ],
        Fields: {
          acl: 'public-read',
          'Content-Type':  req.body['contentType'],
        },
        Expires: 600, // Seconds before the presigned post expires. 3600 by default.
      })
      // console.log(url)
      // console.log(fields)
      
     // return Response.json({ url, fields })
     res.status(200).send({message:`Ok`,url:`${url}`,fields})
    
    } catch(e) {
       console.log(e)
      return res.status(500).send({ message: 'error' });
    }
    }

  // export default async function POST(req: any,res:any) {
  //  // const { filename, contentType } = await req.json()
  //  //const formData=req.body
  //   //console.log(Object.keys(req.body))
  //   try {
  //     // const client = new S3Client({ region: "ap-southeast-1" })
  //     // const { url, fields } = await createPresignedPost(client, {
  //     //   Bucket: process.env.S3_UPLOAD_BUCKET || "",
  //     //   Key: uuidv4(),
  //     //   Conditions: [
  //     //     ['content-length-range', 0, 10485760], // up to 10 MB
  //     //     ['starts-with', '$Content-Type', contentType],
  //     //   ],
  //     //   Fields: {
  //     //     acl: 'public-read',
  //     //     'Content-Type': contentType,
  //     //   },
  //     //   Expires: 600, // Seconds before the presigned post expires. 3600 by default.
  //     // })
      
  //     //return Response.json({ url, fields })

  //     req.status(200).send({ message: "Ok" })
  //   } catch (error) {
  //     // return Response.json({ error: "S3 upload error" })
  //     return res.status(500).send({ message: 'error' });
  //   }
  // }


  

 