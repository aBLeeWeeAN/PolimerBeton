import nunjucks from 'nunjucks'

// ! Исправление неправильных окончаний комментариев плагина "Comment headers v1.12.1" | REQUIRED !!!
export default class CleanFileSystemNunjucksLoader extends nunjucks.FileSystemLoader {
    getSource(name) {
        const result = super.getSource(name)

        if (result && result.src) {
            result.src = result.src.replace(/--->/g, '-->')
        }

        return result
    }
}
