rm -rf ../../packages/openapi;
openapi-generator-cli generate -i ./dist/swagger.json -o ../../packages/openapi -g typescript-axios --additional-properties=supportsES6=true,npmVersion=9.8.0,typescriptThreePlus=true,npmName="openapi"