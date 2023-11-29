const port = process.env.PORT || 3001;
const env = process.env.ENV || "dev";
const redisConf  = {
    url :"redis://localhost:6379"
}

module.exports = {
    port, redisConf, env
};