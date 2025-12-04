import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { RunRequest } from './types';

//Gaussian Kernel Generation
/*
300 light
800 medium
1200?1500 heavy
*/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/run')
    async run(@Body() body: RunRequest) {
    console.log('Running preprocessing_filter with type:', body.processingType);
    this.appService.run(body);
    console.log('preprocessing_filter run completed');
    return { received: true };
  }
}
