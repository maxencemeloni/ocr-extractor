let test = {};
test.find = (id, next) => {
    let result = {
        id,
        test: test
    };
    next(null, result);
};
module.exports = test;