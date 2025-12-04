import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { RunRequest } from './types';

//Naive Matrix Multiplication
/*
150 light
300 medium
500-600 heavy
*/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/run')
    async run(@Body() body: RunRequest) {
    console.log('Running transformation_filter with type:', body.processingType);
    this.appService.run(body);
    console.log('transformation_filter run completed');
    return { received: true };
  }
}
