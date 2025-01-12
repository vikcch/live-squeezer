
export const post = function (path, params, method = 'post') {

    const form = document.createElement('form');
    form.method = method;
    form.action = path;

    form.setAttribute('target', '_blank');

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
};

export const elFactory = function (type, attributes, ...children) {

    const element = document.createElement(type);

    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }

    children.forEach(child => {

        if (typeof child === 'string') {

            element.appendChild(document.createTextNode(child));

        } else element.appendChild(child);
    });

    return element;
};

export const getLocalStorageMaxSize = function (errorr) {

    return new Promise((resolve, reject) => {

        if (localStorage) {
            let max = 10 * 1024 * 1024,
                i = 64,
                string1024 = '',
                string = '',
                // generate a random key
                testKey = 'size-test-' + Math.random().toString(),
                minimalFound = 0,
                error = errorr || 25e4;

            // fill a string with 1024 symbols / bytes    
            while (i--) string1024 += 1e16;

            i = max / 1024;

            // fill a string with 'max' amount of symbols / bytes    
            while (i--) string += string1024;

            i = max;

            // binary search implementation
            while (i > 1) {
                try {
                    localStorage.setItem(testKey, string.substr(0, i));
                    localStorage.removeItem(testKey);

                    if (minimalFound < i - error) {
                        minimalFound = i;
                        i = i * 1.5;
                    }
                    else break;
                } catch (e) {
                    localStorage.removeItem(testKey);
                    i = minimalFound + (i - minimalFound) / 2;
                }
            }

            resolve(minimalFound);

        } else {

            reject('Oops, something went wrong!');
        }

    });

};

// https://www.youtube.com/watch?v=s2W6Bce_T30
export const mkCombinations = (items, slots) => {

    const result = [];

    const makeCombinations = (prefix, start) => {

        if (prefix.length === slots) {

            result.push(prefix);
            return;
        }

        for (let i = start; i < items.length; i++) {

            makeCombinations([...prefix, items.at(i)], i + 1);
        }
    };

    makeCombinations([], 0);

    return result;
}