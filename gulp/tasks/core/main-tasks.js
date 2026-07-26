import gulp from 'gulp'

import { server } from './dev/server.js'
import { watch } from './dev/watch.js'

import { clean } from './clean.js'

import { html } from '../html/html.js'
import { meta } from '../meta/meta.js'

import { styles } from '../styles/styles.js'
import { criticalCss } from '../styles/critical-css.js'
import { obfuscateSelectors } from '../styles/obfuscate-selectors.js'

import { scripts } from '../scripts/scripts.js'
import { libs } from '../scripts/libs.js'

import { audio } from '../assets/media/audio.js'
import { fonts } from '../assets/fonts/fonts.js'
import { icons } from '../assets/pictures/icons.js'
import { images } from '../assets/pictures/images.js'
import { videos } from '../assets/media/videos.js'
import { misc } from '../assets/misc.js'

import { revise } from '../utils/revision.js'

import { env } from '../../config/env.js'

// * --- LOCAL TASKS
// * ---------------
const assets = gulp.parallel(audio, fonts, icons, images, videos)
// const assets = gulp.parallel(audio, fonts, videos)
const mainTasks = gulp.series(gulp.parallel(meta, styles, scripts, assets, libs, misc), html)
const devTools = gulp.parallel(watch, server)

// * --- EXPORT GULP MAIN TASKS PIPELINES
// * ------------------------------------
export const dev = gulp.series(clean, mainTasks, devTools)
export const prod = gulp.series(
    clean,
    mainTasks,
    criticalCss,
    revise,
    // * obfuscation
    env.isObfuscation ? obfuscateSelectors : (cb) => cb(),
    // * run server in staging mode or in full production mode
    env.buildMode.isStaging || env.isProdServer ? server : (cb) => cb(),
)
