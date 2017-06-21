var data = '';

var cookie = {
    get(name) {
        return data
    },
    set(name, value) {
        store.set(name, 1)
        data = value
    },
    del(name) {
        store.remove(name)
    }
}


export default cookie
