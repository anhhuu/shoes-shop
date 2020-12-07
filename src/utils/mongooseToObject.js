module.exports = {
    multipleMongooseToObject: function(objects) {
        return objects.map(objects => objects.toObject());
    },

    mongooseToObject: function(object) {
        return object ? object.toObject() : object;
    }
}