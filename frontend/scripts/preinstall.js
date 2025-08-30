// frontend/scripts/preinstall.js
(function () {
    function cmp(a, b) {
        var pa = String(a).split('.').map(function (x) { return parseInt(x, 10) || 0 })
        var pb = String(b).split('.').map(function (x) { return parseInt(x, 10) || 0 })
        for (var i = 0; i < 3; i++) { if ((pa[i]||0) > (pb[i]||0)) return 1; if ((pa[i]||0) < (pb[i]||0)) return -1 }
        return 0
    }

    var required = '18.18.0'
    var current = (process.versions && process.versions.node) || '0.0.0'
    if (cmp(current, required) < 0) {
        console.error('\n❌ Node.js sürümün çok eski: ' + current +
            '\n   Bu proje için en az ' + required + ' gerekiyor.\n')
        process.exit(1)
    }

    var isProd = String(process.env.npm_config_production) === 'true'
    var omit = String(process.env.npm_config_omit || '')
    var nodeEnvProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production'
    if (isProd || nodeEnvProd || omit.indexOf('dev') !== -1) {
        console.error('\n❌ devDependencies atlanmış görünüyor.' +
            '\n   Lütfen `npm config delete production` ve `npm config delete omit` sonrasında `npm install` çalıştırın.\n')
        process.exit(1)
    }
})();
