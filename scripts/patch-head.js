require('dotenv').config()
const replace = require('replace-in-file')

if (process.env.ENVIRONMENT !== 'pro') {
    console.warn("ENVIRONMENT is not pro: patching head is disabled!");
    return;
}

var buildPath = './build/'
if (process.argv.length > 2) {
    buildPath = process.argv[2];
}

const replacements = [
    {
        from: /<\/head>/g,
        to: '<link rel="stylesheet" href="/styles.css">' +
            '<script type="text/javascript">\n' +
            '    (function(c,l,a,r,i,t,y){\n' +
            '        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\n' +
            '        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;\n' +
            '        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\n' +
            '    })(window, document, "clarity", "script", "' + process.env.CLARITY_ID + '");\n' +
            '</script>'+
            '</head>'
    }
]

for (const index in replacements) {
    const options = {
        files: buildPath + '**/*.html',
        from: replacements[index].from,
        to: replacements[index].to,
    };

    try {
        const results = replace.sync(options);
        console.log('Replacement results:', results);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}
