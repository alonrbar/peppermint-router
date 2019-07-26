export function removeStart(str: string, ...toRemove: string[]): string {
    return removeSide(
        str,
        /^(\s*[\r\n]*)*/,
        String.prototype.startsWith,
        (s, tr) => s.substring(tr.length),
        ...toRemove
    );
}

export function removeEnd(str: string, ...toRemove: string[]): string {
    return removeSide(
        str,
        /(\s*[\r\n]*)*$/,
        String.prototype.endsWith,
        (s, tr) => s.substring(0, s.length - tr.length),
        ...toRemove
    );
}

function removeSide(
    str: string,
    whitespaceReplacePattern: RegExp,
    shouldRemove: (trimStr: string) => boolean,
    remove: (str: string, trimStr: string) => string,
    ...toRemove: string[]
): string {

    // input validation
    if (typeof str !== "string") {
        throw new Error(`Missing arguement '${nameof(str)}'.`);
    }
    if (!toRemove.every(tr => typeof tr === 'string')) {
        throw new Error(`Invalid argument '${toRemove}'. Only strings expected.`);
    }

    // default behavior: trim white spaces
    if (!toRemove.length) {
        return str.replace(whitespaceReplacePattern, "");
    }

    // trim specified patterns
    let result = str.substring(0);
    let keepRunning = true;
    while (result.length && keepRunning) {
        keepRunning = false;
        for (const trimStr of toRemove) {
            if (!shouldRemove.call(result, trimStr))
                continue;
            result = remove(result, trimStr);
            keepRunning = true;
        }
    }

    return result;
}