/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images:{
        domains:[
            "tollgate-upload.s3.ap-southeast-1.amazonaws.com"
        ]
    }
};

export default config;


