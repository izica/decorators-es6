import md5 from './lib/md5';

const getKey = (args) => {
    const json = JSON.stringify(args);
    return md5(json) + json.substr(0, 5) + json.substr(-5);
};

const memoize = (time = 9999999) => {
    return (target, name, descriptor) => {
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: () => function (...args) {
                return new Promise((resolve) => {
                    if (typeof this.stash === 'undefined') {
                        this.stash = {};
                    }

                    const key = getKey(args);
                    const dateCurrent = Date.now();

                    // get from stash
                    if (typeof this.stash[key] !== 'undefined') {
                        const resultFromStash = this.stash[key];
                        if (resultFromStash.expires > dateCurrent) {
                            resolve(resultFromStash.value);
                            return;
                        }
                    }

                    // get new result
                    const promiseOrResult = descriptor.initializer().apply(this, args);
                    if (typeof promiseOrResult.then === 'undefined') {
                        this.stash[key] = {
                            expires: dateCurrent + time,
                            value: promiseOrResult
                        };
                        resolve(promiseOrResult);
                    } else {
                        promiseOrResult.then(result => {
                            this.stash[key] = {
                                expires: dateCurrent + time,
                                value: result
                            };
                            resolve(result);
                        });
                    }
                });
            }
        };
    };
};

export default memoize;