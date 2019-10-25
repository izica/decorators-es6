const debounce = function (time = 500) {
    let timer = null;
    return function (target, name, descriptor) {
        return {
            value: function (...args) {
                let resolve = null;
                const promise = new Promise((r) => {
                    resolve = r;
                });

                const fn = descriptor.initializer.bind(this)();
                if (timer !== null) {
                    clearTimeout(timer);
                }

                timer = setTimeout(() => {
                    timer = null;

                    const result = fn.apply(this, args);
                    if (typeof result === 'undefined') {
                        resolve();
                    } else {
                        if (typeof result.then === 'undefined') {
                            resolve(result);
                        } else {
                            result.then(result => {
                                resolve(result);
                            });
                        }
                    }
                }, time);

                return promise;
            }
        };
    };
};

export default debounce;
