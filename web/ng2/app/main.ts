import { bootstrap }    from '@angular/platform-browser-dynamic';
import { ScheduleComponent } from './components/schedule';
import {HTTP_PROVIDERS} from '@angular/http'
import {ScheduleApi} from './services/schedule'
bootstrap(
    ScheduleComponent,
    [
        HTTP_PROVIDERS,
        ScheduleApi
    ]
);
