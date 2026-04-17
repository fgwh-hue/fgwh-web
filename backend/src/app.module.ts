import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    StudentModule,
    TeacherModule
  ]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
