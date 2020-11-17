import {ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
      // dataOrRequest,
      context: ExecutionContext,
      stream$: Observable<any>): Observable<any> {
    return stream$.pipe(
        map(data => ({data}))
    );
  }
}
