cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/Umeng/www/Umeng.js",
        "id": "Umeng.Umeng",
        "clobbers": [
            "MobclickAgent"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "Umeng": "1.0.0"
};
// BOTTOM OF METADATA
});