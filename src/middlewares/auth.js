const adminAuth = (req, res, next) => {
    const token = "jhsbfhasbfhdsan";
    const isAuthorized = token === 'xyz';
    if(!isAuthorized){
        res.status(401).send("Unauthorized user");
    }
    else{
        next();
    }
};

const userAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorized = token === 'xyz';
    if(!isAuthorized){
        res.status(401).send("Unauthorized user");
    }
    else{
        next();
    }
};

module.exports = { adminAuth, userAuth };