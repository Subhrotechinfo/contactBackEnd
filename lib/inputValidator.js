module.exports.Email = (email) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(regex)){
        return email;
    }else {
        return false;
    }
}

/* Minimum 8 characters which contain only characters,numeric digits, underscore and first character must be a letter */
// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a

module.exports.Password = (password) => {
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(password.match(regex)){
        return true;
    }else {
        return false;
    }
}

