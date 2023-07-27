import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { LoggerMiddleware } from 'logger/logger.middleware'
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
      validationSchema: Joi.object<{ [K in keyof typeof process.env]: string }>(
        {
          NODE_ENV: Joi.string()
            .valid('development', 'production', 'test')
            .required(),
        },
      ),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    if (this.configService.get('NODE_ENV') === 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*')
    }
  }
}
