// Sec-CH-UA
// : A structured representation of the user agent, including brand and version information. 1  
// 1. Sec-CH-UA - HTTP - MDN Web Docs
// Source icon
// developer.mozilla.org
// Sec-CH-UA-Mobile: A boolean indicating whether the user is on a mobile device.  
// Sec-CH-UA-Platform: The user's platform (operating system).  
// Sec-CH-UA-Platform-Version: The version of the user's platform.  
// Sec-CH-UA-Arch: The architecture of the user's CPU.  
// Sec-CH-UA-Model: The device model (e.g., "iPhone 13").  
// Sec-CH-Full-Version-List: A list of full browser versions.  

// Important Notes about Client Hints:

//     Opt-in Required: The server needs to explicitly request these headers from the browser using the Accept-CH header in its responses.
//     Varying Support: Support for Client Hints varies across browsers.   

// More Reliable Parsing: Client Hints are much easier to parse than the User-Agent string because they have a well-defined structure.