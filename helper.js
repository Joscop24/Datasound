module.exports = {
    limit: function (ar, max) {
        var db = ar.slice(0, max);
        return db;
    },
    ifImgExist: (data, options) => {
        // console.log('ifImgExist', data)
        if (data) return options.fn(this)
        else return options.inverse(this);
    }
}

