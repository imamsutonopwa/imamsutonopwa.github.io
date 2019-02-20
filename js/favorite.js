function getFavorites() {
  const dbPromise = idb.open('balbalan', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('favorite')) {
      upgradeDb.createObjectStore('favorite', { keyPath: 'id' });
    }
  });

  dbPromise.then(function(db) {
    const tx = db.transaction('favorite');
    const store = tx.objectStore('favorite');
    return store.getAll();
  }).then(function(val) {
    if (!val.length) {
      getEl('fav-content').innerText = 'Belum ada tim favorit';
      return;
    }
    
    let item = '<ul id="team-favorite" class="collection"></ul>';
    getEl('fav-content').innerHTML = item;

    val.forEach(function(val) {
      const { id, name, position, logo } = val;

      item += `<li class="collection-item avatar" onclick="location.assign('team.html?id=${id}&position=${position}')">
        <img src="${logo}" alt="${name}" class="circle">
        <b class="title">${name}</b>
        <p>Posisi ${position} di klasemen liga</p>
      </li>`;
    });

    getEl('team-favorite').innerHTML = item;
  });
}
