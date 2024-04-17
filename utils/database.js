const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://StyloAdmin:PaliZmS3T9WXT7OC@styloerm.2p0xnzw.mongodb.net/?retryWrites=true&w=majority&appName=StyloERM');
} 