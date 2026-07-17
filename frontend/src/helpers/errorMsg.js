// helpers/errorMsg.js  (можно прямо в файле)
const toErrorMsg = (err) => {
    if (!err) return "Unknown error";

    const knownMessages = {
        "Invalid credentials": "Неверный email или пароль. При первом запуске Docker сначала зарегистрируйтесь.",
        "Missing token": "Войдите в аккаунт, чтобы продолжить.",
        "Invalid / expired token": "Сессия истекла. Войдите в аккаунт снова.",
        "User not found": "Пользователь не найден в текущей базе. Войдите или зарегистрируйтесь снова.",
        "User already exists": "Пользователь с таким email уже существует.",
    };

    if (typeof err === "string" && knownMessages[err]) {
        return knownMessages[err];
    }

    // axios answer with validation error (array)
    if (Array.isArray(err)) {
        return err.map((e) => e.msg || e.message).join("; ");
    }

    // object -> JSON string
    if (typeof err === "object") {
        return err.msg || err.detail || JSON.stringify(err);
    }

    return String(err);
};

export default toErrorMsg;
