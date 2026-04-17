import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ConfigModule {}
