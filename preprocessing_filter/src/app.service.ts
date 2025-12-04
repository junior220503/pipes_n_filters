import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RunRequest } from './types';

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
        parameter = 300;
        break;
      case 'medium':
        parameter = 800;
        break;
      case 'heavy':
        parameter = 1200;
        break;
      default:
        parameter = 300;
    }

    const processed = this.generateGaussianKernel(parameter, parameter);

    fetch(`http://transformation-filter:${this.port}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({processingType: type}),
    }).catch((error) => {console.log('Error forwarding to transformation filter', error);});

    return 'sent';
  }

  private generateGaussianKernel(size: number, sigma: number): number[][] {
    const kernel = Array.from({ length: size }, () => Array(size).fill(0));
    const mean = size / 2;
    let sum = 0;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const val =
          Math.exp(
            -0.5 *
              ((Math.pow(x - mean, 2) + Math.pow(y - mean, 2)) /
                Math.pow(sigma, 2))
          ) /
          (2 * Math.PI * Math.pow(sigma, 2));

        kernel[x][y] = val;
        sum += val;
      }
    }

    // Normalize
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        kernel[x][y] /= sum;
      }
    }

    return kernel;
  }

}
