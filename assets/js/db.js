var dbPromise = idb.open("football", 1, (upgradeDb) => {
    if (!upgradeDb.objectStoreNames.contains("football")) {
        // var team = upgradeDb.createObjectStore("team", {
        //     keyPath: 'id'
        // });
        // team.createIndex('date', 'date');

        var favorite = upgradeDb.createObjectStore("team_favorite", {
            keyPath: 'id'
        });
        favorite.createIndex('date', 'date');
    }
});

// const dbTeam = {
//     get: async (id) => {
//         return (await dbPromise)
//             .transaction('team')
//             .objectStore('team')
//             .get(id);
//     },

//     insert: async (data) => {
//         var tx = (await dbPromise).transaction('team', 'readwrite');
//         tx.objectStore('team').add(data);

//         return tx.complete;
//     },

//     update: async (data) => {
//         var tx = (await dbPromise).transaction('team', 'readwrite');
//         tx.objectStore('team').put(data);

//         return tx.complete;
//     },
//     delete: async (id) => {
//         return (await dbPromise)
//             .transaction('team', 'readwrite')
//             .objectStore('team')
//             .delete(id);
//     }
// };

const dbFavorite = {
    get: async (id) => {
      return (await dbPromise)
        .transaction('team_favorite', 'readonly')
        .objectStore('team_favorite')
        .get(id);
    },
    getAll: async () => {
      return (await dbPromise)
        .transaction('team_favorite')
        .objectStore('team_favorite')
        .getAll();
    },
    insert: async (data) => {
      var tx = (await dbPromise).transaction('team_favorite', 'readwrite');
      tx.objectStore('team_favorite').add(data);
  
      return tx.complete;
    },
    update: async (data) => {
      var tx = (await dbPromise).transaction('team_favorite', 'readwrite');
      tx.objectStore('team_favorite').put(data);
  
      return tx.complete;
    },
    delete: async (id) => {
      return (await dbPromise)
        .transaction('team_favorite', 'readwrite')
        .objectStore('team_favorite')
        .delete(id);
    }
  };

function addFavoriteTeam(e) {
    const id = e.getAttribute('id');
    const favorite = e.children;

    dbFavorite.get(parseInt(id)).then(function(item) {
        if(item) {
            dbFavorite.delete(id);
            favorite[0].classList.remove('navy-text');
            favorite[0].classList.add('white-text');
            M.toast({
                html: 'Berhasi di hapus dari tim favorite'
              });
        } else {
            dbFavorite.insert({
                id: parseInt(id),
                name: 'tes'+id,
                image: 'badge'+id,
                created: new Date().getTime()
            })

            favorite[0].classList.remove('white-text');
            favorite[0].classList.add('navy-text');
            M.toast({
                html: 'Berhasi tambah ke tim favorite'
              });
        }
    })
}