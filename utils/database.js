const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://felipestruchel:sosoCACA1@styloerm.2p0xnzw.mongodb.net/?retryWrites=true&w=majority');
}