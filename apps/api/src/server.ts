import { app } from "./app";
import errorHandler from 'api-error-handler';
const port = process.env.PORT || 3000;

app.use(errorHandler());
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
