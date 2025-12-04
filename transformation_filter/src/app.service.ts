import { Injectable } from '@nestjs/common';
import { RunRequest } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly port: number

  constructor(private configService: ConfigService) {
    this.port = this.configService.get<number>('NEXT_PIPE_PORT') || 3002;
  }

  run(body: RunRequest): string {

    const type = body.processingType;
    let parameter: number;

    switch (type) {
      case 'light':
        parameter = 150;
        break;
      case 'medium':
        parameter = 300;
        break;
      case 'heavy':
        parameter = 600;
        break;
      default:
        parameter = 150;
    }

    const processed =  this.heavyMatrixMultiply(parameter)

    fetch(`http://ai-filter:${this.port}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({processingType: type}),
    }).catch((error) => {console.log('Error forwarding to transformation filter', error);});

    return 'sent';
  }

  private heavyMatrixMultiply(size: number): number[][] {
    const A = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.random())
    );
    const B = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.random())
    );
    const result = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    );

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }

    return result;
  }

}
