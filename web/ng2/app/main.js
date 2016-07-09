"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var schedule_1 = require('./components/schedule');
var http_1 = require('@angular/http');
var schedule_2 = require('./services/schedule');
platform_browser_dynamic_1.bootstrap(schedule_1.ScheduleComponent, [
    http_1.HTTP_PROVIDERS,
    schedule_2.ScheduleApi
]);
//# sourceMappingURL=main.js.map