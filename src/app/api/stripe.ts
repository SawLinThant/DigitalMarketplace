import { NextApiRequest, NextApiResponse } from "next";
import stripeWebHookHandler,{config} from "~/server/stripeWebhookHandler";
export {config};

const handler = async(req: NextApiRequest, res: NextApiResponse) => {
    await stripeWebHookHandler(req,res);
};

export default handler;