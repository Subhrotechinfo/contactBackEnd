let trim = (x) => {
    let value = String(x);
    return value.replace(/^\s+|\s+$/gm, '');
}

module.exports.isEmpty = (value) => {
    if(value === null || value === undefined || trim(value) === '' || value.length === 0){
        return true;
    } else {
        return false;
    }
}


