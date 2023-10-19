import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsController } from './students/students.controller';
import { AuthenticateStudentJwtMiddleware } from './common/middleware/authenticateStudentJwt.middleware';
import { QuestionsController } from './questions/questions.controller';
import { TeachersController } from './teachers/teachers.controller';
import { AuthenticateTeacherJwtMiddleware } from './common/middleware/authenticateTeacherJwt.middleware';

@Module({
  imports: [],
  controllers: [
    AppController,
    StudentsController,
    QuestionsController,
    TeachersController,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateStudentJwtMiddleware)
      .exclude(
        { path: 'students/login', method: RequestMethod.ALL },
        { path: 'students/signup', method: RequestMethod.ALL },
      )
      .forRoutes(StudentsController);
    consumer
      .apply(AuthenticateTeacherJwtMiddleware)
      .exclude(
        { path: 'teachers/login', method: RequestMethod.ALL },
        { path: 'teachers/signup', method: RequestMethod.ALL },
      )
      .forRoutes(TeachersController);
  }
}
