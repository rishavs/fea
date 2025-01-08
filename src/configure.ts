
        // ------------------------------------------
        // TODO - checklist 1 - https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fb0swczsaltq71.png
        // ------------------------------------------
        // ------------------------------------------
        // TODO - checklist 2 - 12 factor app
        // ------------------------------------------
        // ------------------------------------------
        // TODO - checklist 3 - OWASP - https://cheatsheetseries.owasp.org/
        // ------------------------------------------
        // ------------------------------------------
        // TODO - checklist 4 - https://www.toptal.com/developers/webdevchecklist
        // ------------------------------------------
        // ------------------------------------------
        // TODO - checklist 5 - https://www.sitepoint.com/web-development-checklists/
        // ------------------------------------------
        // ------------------------------------------
        // TODO - integrate Sentry.io or its equivalent for logging
        // ------------------------------------------
        // ------------------------------------------
        // TODO - sanitize. delete all cookies which are not allowed
        // ------------------------------------------
        // ------------------------------------------
        // TODO - Content Security Policy
        // ------------------------------------------
        // see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#content_security_policy
        // https://hono.dev/middleware/builtin/secure-headers#setting-content-security-policy

        // ------------------------------------------
        // COOP - TODO
        // ------------------------------------------
        // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
        // https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#cross_origin_opener_policy
        
        // ------------------------------------------
        // Put on the HELMET!!! TODO
        // ------------------------------------------
        // ------------------------------------------
        // Set Secure headers -  TODO
        // ------------------------------------------
        // see https://hono.dev/middleware/builtin/secure-headers

        // ------------------------------------------
        // Set Max bodysize limit - TODO
        // ------------------------------------------
        // ------------------------------------------
        // Set ETAG - TODO
        // ------------------------------------------
        // ------------------------------------------
        // Set CORS - TODO
        // ------------------------------------------
        
        // ------------------------------------------
        // TODO - serve everything zipped
        // ------------------------------------------

        // ------------------------------------------
        // TODO - set cache headers
        // ------------------------------------------

        // ------------------------------------------
        // TODO - set rate limiting
        // ------------------------------------------

        // ------------------------------------------
        // TODO - set CSRF
        // ------------------------------------------

        // ------------------------------------------
        // TODO - set X-Frame-Options, X-XSS-Protection, X-Content-Type-Options,
        // X-Permitted-Cross-Domain-Policies, Expect-CT, Feature-Policy, Clear-Site-Data
        // ------------------------------------------

        // ------------------------------------------
        // TODO - early hints
        // ------------------------------------------

        // ------------------------------------------
        // TODO - use speculation API - https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API
        // https://www.youtube.com/watch?v=LEF4UaM5m4U
        // ------------------------------------------

        // ------------------------------------------
        // Enable HSTS - TODO
        // ------------------------------------------
        // ctx.res.headers.append('Strict-Transport-Security', 'max-age=3600; includeSubDomains; preload')
        // ctx.res.headers.append('Upgrade-Insecure-Requests', '1')
        // ctx.res.headers.append('Content-Security-Policy', 'upgrade-insecure-requests')

        
        // ------------------------------------------
        // Set Referrer Policy
        // ------------------------------------------
        // ctx.res.headers.append('Referrer-Policy', 'no-referrer-when-downgrade')
        
        //     // Handle TRACE method
        //     if (request.method === "TRACE") {
        //         // Echo back the request for diagnostic purposes
        //         return new Response(request.body, {
        //             headers: request.headers,
        //             status: 200,
        //             statusText: "OK"
        //         });
        //     }

        //     // Handle OPTIONS method
        //     if (request.method === "OPTIONS") {
        //         // Return allowed methods and other CORS headers if needed
        //         return new Response(null, {
        //             headers: {
        //                 'Allow': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, TRACE',
        //                 'Access-Control-Allow-Origin': '*', // Adjust as needed
        //                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, TRACE',
        //                 'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Adjust as needed
        //             },
        //             status: 204,
        //             statusText: "No Content"
        //         });
        //     }
