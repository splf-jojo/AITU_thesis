// helpers/errorMsg.js  (можно прямо в файле)
const toErrorMsg = (err) => {
    if (!err) return "Unknown error";

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
