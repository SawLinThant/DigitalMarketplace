import { APIRoute, sanitizeKey } from "next-s3-upload";

export default APIRoute.configure({
  key(req, filename) {
    //console.log(req.body);
    let path=req.body.path;
    return `digital_marketplace/${path}/${sanitizeKey(filename)}`; //req.userId  req,business-name+userId
  },
});
