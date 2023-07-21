import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    Logger,
    CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const req = context.switchToHttp().getRequest();
        if (req) {
            const method = req.method;
            const url = req.url;
            return next
                .handle()
                .pipe(
                    tap(() =>
                        Logger.log(
                            `${method} ${url} ${Date.now() - now}ms`,
                            context.getClass().name,
                        ),
                    ),
                );
        } else {
            // GRAPHQL interception
            const ctx: any = GqlExecutionContext.create(context);
            const resolverName = ctx.constructorRef.name;
            const info = ctx.getInfo();

            return next
                .handle()
                .pipe(
                    tap(() =>
                        Logger.log(
                            `${info.parentType} "${info.fieldName}" ${
                                Date.now() - now
                            }ms`,
                            resolverName,
                        ),
                    ),
                );
        }
    }
}
