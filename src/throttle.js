const throttle = (time = 500) => {
    return (target, name, descriptor) => {
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: () => function (...args) {
                return new Promise((resolve) => {
                    if (typeof this.delay === 'undefined') {
                        this.delay = false;
                    }

                    if (this.delay === true) {
                        return;
                    }

                    this.delay = true;

                    const promiseOrResult = descriptor.initializer().apply(this, args);
                    if (typeof promiseOrResult.then === 'undefined') {
                        setTimeout(() => {
                            this.delay = false;
                        }, time);
                        resolve(promiseOrResult);
                    } else {
                        promiseOrResult.then(result => {
                            setTimeout(() => {
                                this.delay = false;
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