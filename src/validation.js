export const isEmailValid = (email) => {
    return /\S+@\S+\.\S+/.test(email) || "이메일 형식에 맞지 않습니다.";
};

export const isEmailTaken = (email) => {
    const existingEmails = ['test@example.com', 'user@example.com'];
    return existingEmails.includes(email) ? "이미 존재하는 이메일 입니다." : true;
};

export const isPasswordValid = (password) => {
    if(password.length < 8 || password.length > 15){
        if (!/[A-Z]/.test(password)){
            alert("비밀번호에는 대문자가 포함되어야 합니다.");
            return false;
        }
        if(!/[!@#$%^&*]/.test(password)){
            alert("비밀번호에는 특수문자가 포함되어야 합니다.");
            return false;
        }
        return "비밀번호는 8자리 이상 15자리 미만으로 설정해주세요.";
    }
    
    return true;
};

export const isPasswordConfirmValid = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }
    return true;
};


export const isNicknameTaken = (nickname) => {
    const existingNickname = ['testNickname','useNickname'];
    if(existingNickname.includes(nickname)){
        alert("이미 사용중인 닉네임 입니다.");
        return false;
    }
    return true; 
      
};