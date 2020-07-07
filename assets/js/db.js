var dbPromise = idb.open("football", 1, (upgradeDb) => {
    if (!upgradeDb.objectStoreNames.contains("football")) {
        var team = upgradeDb.createObjectStore("team", {
            keyPath: 'id'
        });
        team.createIndex('date', 'date');
        team.createIndex('flag_favorite', 'flag_favorite');

        var standing = upgradeDb.createObjectStore('standing', {
          keyPath: 'id'
        })
    }
});

const dbTeam = {
    get: async (id) => {
        return (await dbPromise)
            .transaction('team', 'readonly')
            .objectStore('team')
            .get(id);
    },
    getAll: async () => {
      return (await dbPromise)
        .transaction('team', 'readonly')
        .objectStore('team')
        .getAll();
    },
    insert: async (data) => {
        var tx = (await dbPromise).transaction('team', 'readwrite');
        tx.objectStore('team').add(data);

        return tx.complete;
    },

    update: async (data) => {
        var tx = (await dbPromise).transaction('team', 'readwrite');
        tx.objectStore('team').put(data);

        return tx.complete;
    },
    delete: async (id) => {
        return (await dbPromise)
            .transaction('team', 'readwrite')
            .objectStore('team')
            .delete(id);
    },
    getIndex: async (index) => {
      return (await dbPromise)
        .transaction('team', 'readonly')
        .objectStore('team')
        .index('flag_favorite')
        .getAll(index);
    }
};

const dbStanding = {
  get: async (id) => {
      return (await dbPromise)
          .transaction('standing', 'readonly')
          .objectStore('standing')
          .get(id);
  },
  getAll: async () => {
    return (await dbPromise)
      .transaction('standing', 'readonly')
      .objectStore('standing')
      .getAll();
  },
  insert: async (data) => {
      var tx = (await dbPromise).transaction('standing', 'readwrite');
      tx.objectStore('standing').add(data);

      return tx.complete;
  },

  update: async (data) => {
      var tx = (await dbPromise).transaction('standing', 'readwrite');
      tx.objectStore('standing').put(data);

      return tx.complete;
  },
  delete: async (id) => {
      return (await dbPromise)
          .transaction('standing', 'readwrite')
          .objectStore('standing')
          .delete(id);
  }
};

function getTeamFromDb() {
  return dbTeam.getAll();
}

function getFavoritedTeamFromDb(index) {
  return dbTeam.getIndex(index);
}

function addFavoriteTeam(e) {
    const id = e.getAttribute('id');
    const favorite = e.children;

    dbTeam.get(parseInt(id)).then(function(team) {
        if(team) {
            if (team.flag_favorite == 0) {
              dbTeam.update({
                id: team.id,
                name: team.name,
                image: team.image,
                flag_favorite: 1,
                created: team.created
              });

              favorite[0].classList.remove('white-text');
              favorite[0].classList.add('navy-text');
              M.toast({
                html: `${team.name} Added to Favorite`,
                classes: 'green'
              });
              
            } else {
              dbTeam.update({
                id: team.id,
                name: team.name,
                image: team.image,
                flag_favorite: 0,
                created: team.created
              });

              favorite[0].classList.remove('navy-text');
              favorite[0].classList.add('white-text');
              M.toast({
                html: `${team.name} Deleted from Favorite`,
                classes: 'red'
              });
            }
            
        } else {
            M.toast({
                html: 'No Data'
              });
        }
    })
}