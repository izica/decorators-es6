const throttle = (time = 500) => {
    return (target, name, descriptor) => {
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: () => function (...args) {
                return new Promise((resolve) => {
                    const delayKey = name + 'ThrottleDelay'
                    if (typeof target[delayKey] === 'undefined') {
                        target[delayKey] = false;
                    }

                    if (target[delayKey] === true) {
                        return;
                    }

                    target[delayKey] = true;

                    const promiseOrResult = descriptor.initializer().apply(this, args);
                    if (typeof promiseOrResult === 'undefined') {
                        resolve();
                        return;
                    }
                    if (typeof promiseOrResult.then === 'undefined') {
                        setTimeout(() => {
                            target[delayKey] = false;
                        }, time);
                        resolve(promiseOrResult);
                    } else {
                        promiseOrResult.then(result => {
                            setTimeout(() => {
                                target[delayKey] = false;
                            }, time);
                            resolve(result);
                        });
                    }
                });
            }
        };
    };
};

export default throttle;
