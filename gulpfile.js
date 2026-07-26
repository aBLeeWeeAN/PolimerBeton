import gulp from 'gulp'

import { dev, prod } from './gulp/tasks/core/main-tasks.js'

import { zip } from './gulp/tasks/utils/zip.js'
import { ftp } from './gulp/tasks/utils/ftp.js'

// * --- EXPORT TASKS
// * ----------------
gulp.task('default', dev)

gulp.task('dev', dev)
gulp.task('prod', prod)

gulp.task('zip', zip)
gulp.task('ftp', ftp)
