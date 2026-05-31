require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8040;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Node.js backend running on port ${PORT}`);
    });
}
module.exports = app;
