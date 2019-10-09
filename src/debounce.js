const debounce = (time = 500) => {
    return (target, name, descriptor) => {
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: () => function (...args) {
                return new Promise((resolve) => {
                    const timeoutKey = name + 'TimeOut';
                    if (typeof target[timeoutKey] !== 'undefined') {
                        clearTimeout(target[timeoutKey]);
                    }
                    target[timeoutKey] = setTimeout(() => {
                        const promiseOrResult = descriptor.initializer().apply(this, args);
                        if (typeof promiseOrResult === 'undefined') {
                            resolve();
                            return;
                        }
                        if (typeof promiseOrResult.then === 'undefined') {
                            resolve(promiseOrResult);
                        } else {
                            promiseOrResult.then(result => {
                                resolve(result);
                            });
                        }
                    }, time);
                });
            }
        };
    };
};

export default debounce;
