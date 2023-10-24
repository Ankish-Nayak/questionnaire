# rm -rf ../../packages/openapi/src/;
# npx openapi-typescript-codegen --input ./dist/swagger.json  --output ../../packages/openapi/src/ --client axios
# openapi-generator-cli generate -i ./dist/swagger.json -o ../../packages/openapi -g typescript-axios --additional-properties=npmVersion=9.8.0,typescriptThreePlus=true,npmName="openapi"

rm -rf ../../packages/node-client/openapi;
openapi-generator-cli generate -i ./dist/swagger.json -o ../../packages/node-client/openapi -g typescript-axios --additional-properties=supportsES6=true,npmVersion=9.8.0,typescriptThreePlus=true

cd ../../
npm install node-client
echo $PWD
cd ./apps/student/
npm install node-client
echo $PWD
cd ../../
npm install node-client
echo $PWD
cd ./apps/teacher/
# npm install node-client --workspace="ui"