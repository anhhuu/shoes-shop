module.exports.parseCaching = (promise)=>{
    return new Promise((resolve,reject) => {
        promise.then(r=>{
            resolve(JSON.parse(r))
        })
            .catch(e=>{
                resolve(null)
            });
    });

}