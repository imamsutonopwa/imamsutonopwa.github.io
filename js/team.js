const dbPromise = idb.open('balbalan', 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains('favorite')) {
    upgradeDb.createObjectStore('favorite', { keyPath: 'id' });
  }
});
let team;

function renderDetail(data) {
  const { address, area, crestUrl, email, name, phone, venue, website, squad } = data;
  team = data;

  getEl('badge').src = crestUrl.replace(/^http:\/\//i, 'https://');
  getEl('name').innerText = name;
  getEl('area').innerText = area.name;
  getEl('address').innerText = address;
  getEl('venue').innerText = venue;
  getEl('email').innerText = email;
  getEl('phone').innerText = phone;
  getEl('website').innerText = website;

  let item = '';
  squad.forEach(function(val) {
    const { name, shirtNumber, position, role, countryOfBirth, dateOfBirth } = val;
    const date = new Intl.DateTimeFormat(['ban', 'id'], {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(dateOfBirth));

    item += `<li class="collection-item">
      <b>${name} - ${(shirtNumber || '')}</b>
      <p>
        ${position || role} <br>
        ${countryOfBirth}, ${date}
      </p>
    </li>`;
  });

  getEl('players').innerHTML = item;
  getFavorite();
}

function getFavorite() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = Number(urlParams.get('id'));

  dbPromise.then(function(db) {
    const tx = db.transaction('favorite');
    const store = tx.objectStore('favorite');
    return store.get(id);
  }).then(function(val) {
    if (val) getEl('fav-icon').innerText = 'favorite';
  });
}

function favorite() {
  if (getEl('fav-icon').innerText === 'favorite_border') {
    addFavorite();
  } else {
    deleteFavorite();
  }
}

function addFavorite() {
  const { id, name, crestUrl } = team;
  const urlParams = new URLSearchParams(window.location.search);
  const position = urlParams.get('position');

  dbPromise.then(function(db) {
    const tx = db.transaction('favorite', 'readwrite');
    const store = tx.objectStore('favorite');
    const item = {
      id,
      name,
      position,
      logo: crestUrl.replace(/^http:\/\//i, 'https://')
    };

    store.add(item);
    return tx.complete;
  }).then(function() {
    getEl('fav-icon').innerText = 'favorite';
    M.toast({ html: 'Tim berhasil disimpan ke favorit!' });
  }).catch(function(e) {
    M.toast({ html: 'Gagal menyimpan ke favorit!' });
    console.log('Error favorite:', e);
  });
}

function deleteFavorite() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = Number(urlParams.get('id'));

  dbPromise.then(function(db) {
    const tx = db.transaction('favorite', 'readwrite');
    const store = tx.objectStore('favorite');

    store.delete(id);
    return tx.complete;
  }).then(function() {
    getEl('fav-icon').innerText = 'favorite_border';
    M.toast({ html: 'Tim berhasil dihapus dari favorit!' });
  });
}
