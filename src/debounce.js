const debounce = (time = 500) => {
    return (target, name, descriptor) => {
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: () => function (...args) {
                return new Promise((resolve) => {
                    if (typeof this.timeout !== 'undefined') {
                        clearTimeout(this.timeout);
                    }
                    this.timeout = setTimeout(() => {
                        const promiseOrResult = descriptor.initializer().apply(this, args);
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