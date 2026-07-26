import * as nodePath from 'path'

// * --- BASE FOLDERS
// * ----------------
const rootFolderName = nodePath.basename(nodePath.resolve())
const rootFolder = './'

const buildFolder = './dist'
const srcFolder = './src'

// const tempFolder = './temp'

const zipFolder = './archive'

// * --- EXPORT GULP PATHS
// * ---------------------
export const path = {
    projectRootFolderName: rootFolderName,
    clean: buildFolder,
    build: {
        base: `${buildFolder}`,
        // njk: `${buildFolder}/`,
        html: `${buildFolder}/`,
        meta: `${buildFolder}/`,
        styles: `${buildFolder}/css/`,
        scripts: `${buildFolder}/js/`,
        audio: `${buildFolder}/assets/audio/`,
        fonts: `${buildFolder}/assets/fonts/`,
        icons: `${buildFolder}/assets/icons/`,
        images: `${buildFolder}/assets/images/`,
        videos: `${buildFolder}/assets/videos/`,
        misc: `${buildFolder}/assets/misc/`,
        libs: `${buildFolder}/libs/`,
        // i18n: `${buildFolder}/i18n/`,
    },
    // temp: {
    //     base: `${tempFolder}`,
    //     meta: `${tempFolder}/`,
    //     audio: `${tempFolder}/assets/audio/`,
    //     fonts: `${tempFolder}/assets/fonts/`,
    //     icons: `${tempFolder}/assets/icons/`,
    //     images: `${tempFolder}/assets/images/`,
    //     videos: `${tempFolder}/assets/videos/`,
    //     misc: `${tempFolder}/assets/misc/`,
    //     libs: `${tempFolder}/libs/`,
    // },
    src: {
        base: `${srcFolder}`,
        html: `${srcFolder}/html/*.html`,
        njk: `${srcFolder}/html/*.{nj,njk,nunjucks}`,
        meta: {
            favicon: {
                images: `${srcFolder}/meta/favicon/**/*.{ico,svg,png}`,
                webManifest: `${srcFolder}/meta/favicon/**/*.{webmanifest,json}`,
            },
            text: `${srcFolder}/meta/**/*.{txt,xml}`,
        },
        // styles: {
        //     base: `${srcFolder}/scss`,
        //     files: `${srcFolder}/scss/*.scss`,
        // },
        getStyles(mode) {
            return { base: `${srcFolder}/${mode}`, files: `${srcFolder}/${mode}/*.${mode}` }
        },
        // scripts: {
        //     js: `${srcFolder}/js/*.{js,mjs,cjs}`,
        //     ts: `${srcFolder}/ts/*.{ts,mts,cts}`,
        // },
        getScripts(mode) {
            // const extensions = mode === 'ts' ? 'ts,mts,cts' : 'js,mjs,cjs'
            // return `${srcFolder}/${mode}/*.{${extensions}}`

            const extensions = mode === 'ts' ? ['ts', 'mts', 'cts'] : ['js', 'mjs', 'cjs']
            return extensions.map((ext) => `${srcFolder}/${mode}/*.${ext}`)
        },
        audio: `${srcFolder}/assets/audio/**/*.{mp3,webm}`,
        fonts: `${srcFolder}/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}`,
        icons: `${srcFolder}/assets/icons/**/*.svg`,
        images: {
            base: `${srcFolder}/assets/images`,
            files: `${srcFolder}/assets/images/**/*.{avif,webp,jpg,jpeg,png,gif}`,
        },
        videos: `${srcFolder}/assets/videos/**/*.{webm,mp4,mov,avi,mkv,flv,m4v}`,
        misc: `${srcFolder}/assets/misc/**/*.*`,
        libs: `${srcFolder}/libs/**/*.{js,mjs,cjs,ts,mts,cts}`,
        i18n: {
            base: `${srcFolder}/i18n`,
            files: `${srcFolder}/i18n/**/*.json`,
        },
        node_modules: `${rootFolder}/node_modules`,
    },
    watch: {
        base: `${srcFolder}`,
        html: `${srcFolder}/html/**/*.html`,
        njk: `${srcFolder}/html/**/*.{nj,njk,nunjucks}`,
        meta: {
            favicon: {
                images: `${srcFolder}/meta/favicon/**/*.{ico,svg,png}`,
                webManifest: `${srcFolder}/meta/favicon/**/*.{webmanifest,json}`,
            },
            text: `${srcFolder}/meta/**/*.{txt,xml}`,
        },
        // styles: {
        //     base: `${srcFolder}/scss`,
        //     files: `${srcFolder}/scss/**/*.scss`,
        // },
        getStyles(mode) {
            return { base: `${srcFolder}/${mode}`, files: `${srcFolder}/${mode}/**/*.${mode}` }
        },
        // scripts: {
        //     js: `${srcFolder}/js/**/*.{js,mjs,cjs}`,
        //     ts: `${srcFolder}/ts/**/*.{ts,mts,cts}`,
        // },
        getScripts(mode) {
            // const extensions = mode === 'ts' ? 'ts,mts,cts' : 'js,mjs,cjs'
            // return `${srcFolder}/${mode}/**/*.{${extensions}}`

            const extensions = mode === 'ts' ? ['ts', 'mts', 'cts'] : ['js', 'mjs', 'cjs']
            return extensions.map((ext) => `${srcFolder}/${mode}/**/*.${ext}`)
        },
        audio: `${srcFolder}/assets/audio/**/*.{mp3,webm}`,
        fonts: `${srcFolder}/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}`,
        icons: `${srcFolder}/assets/icons/**/*.svg`,
        images: {
            base: `${srcFolder}/assets/images`,
            files: `${srcFolder}/assets/images/**/*.{avif,webp,jpg,jpeg,png,gif}`,
        },
        videos: `${srcFolder}/assets/videos/**/*.{webm,mp4,mov,avi,mkv,flv,m4v}`,
        misc: `${srcFolder}/assets/misc/**/*.*`,
        libs: `${srcFolder}/libs/**/*.{js,mjs,cjs,ts,mts,cts}`,
        i18n: {
            base: `${srcFolder}/i18n`,
            files: `${srcFolder}/i18n/**/*.json`,
        },
    },
    zip: `${zipFolder}`,
}
