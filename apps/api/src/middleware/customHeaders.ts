// export const CustomHeaders = (req: Request, res: Response, next: NextFunction) => {
//     // teacher
//     if(typeof req.headers['teacherId'] === "number"){
//         // extends here
//         req.headers as customheaders;
//         next();
//     }
//     // student

// }
// {
//   "entryFile": "src/app.ts",
//   "noImplicitAdditionalProperties": "throw-on-extras",
//   "controllerPathGlobs": ["src/**/*Controller.ts"],
//   "spec": {
//     "outputDirectory": "build",
//     "specVersion": 3,
//     "securityDefinitions": {
//       "api_key": {
//         "type": "apiKey",
//         "name": "access_token",
//         "in": "query"
//       },
//       "tsoa_auth": {
//         "type": "oauth2",
//         "authorizationUrl": "http://swagger.io/api/oauth/dialog",
//         "flow": "implicit",
//         "scopes": {
//           "write:pets": "modify things",
//           "read:pets": "read things"
//         }
//       } 
//     }
//   },
//   "routes": {
//     "routesDir": "build",
//     "authenticationModule": "./src/middleware/auth.ts"
//   }
// }