const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`${MONGO_URI}/?retryWrites=true&w=majority`);
}