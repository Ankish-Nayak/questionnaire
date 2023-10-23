import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
// import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Questionnaire Open Api')
    .setDescription('Questionnaire api description')
    .setVersion('3.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const path = `${__dirname}/swagger.json`;
  try {
    fs.unlink(path, (err) => {
      if (err) {
        console.log('error while deleting ', err);
      } else {
        console.log('deleted');
      }
      fs.writeFile(path, JSON.stringify(document), (err) => {
        if (err) {
          console.log('got error', err);
        } else {
          console.log('written: ', path);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
  // '/home/ankish20000nayak/Projects/personal-projects/questionnaire/apps/api/swagger/swagger.json';
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
