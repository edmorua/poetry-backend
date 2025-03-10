import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD, //Ensure this is explicitly set
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, //Use false in production
    }),
    AuthModule,
  ],

  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
