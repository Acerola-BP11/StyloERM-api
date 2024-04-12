const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://styloerm:FXxL8v9hwHOgoniJ@styloerm.2p0xnzw.mongodb.net/?retryWrites=true&w=majority&appName=StyloERM');
} 