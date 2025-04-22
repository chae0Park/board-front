const mongoose = require('mongoose');

const searchFrequencySchema = new mongoose.Schema(
    {
        term: { type: String, required: true, unique: true },
        count: { type: Number, required: true, default: 1 }
}
);

const SearchFrequency = mongoose.model('SearchFrequency', searchFrequencySchema, 'searchFrequency');
module.exports = SearchFrequency;