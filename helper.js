module.exports = {
    limit: function (ar, max) {
        var db = ar.slice(0, max);
        return db;
    },
    ifImgExist: (data, options) => {
        // console.log('ifImgExist', data)
        if (data) return options.fn(this)
        else return options.inverse(this);
    },
    /*
    Permet de Modifier le sens des images des artists
    i = place 
    0 = 2
    1 = 1
    2 = 3
    */
    orderImage: (n) => {
        // console.log('ifImgExist', data)

        switch (n.toString()) {
            case '0':
                return '2'
                break;
            case '1':
                return '1'
                break;
            case '2':
                return '3'
                break;
            default:
                return n.toString()
                break
        }
    },

}
