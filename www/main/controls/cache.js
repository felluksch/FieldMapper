export function createCacheBtn(map, OSM) {
    return L.easyButton({
        position: 'topright',
        states: [{
            icon: '<img alt="cache current bounds" src="img/download.svg" height="55%" width="55%" />',
            onClick: function (control) {
                control.setActive();
                setTimeout(function () {
                    cacheBounds(map, OSM);
                    control.setInactive();
                }, 2);
            },
        }]
    });
}

function cacheBounds(map, OSM) {
    let lat = map.getCenter().lat;
    let lng = map.getCenter().lng;
    let zmin = map.getZoom();
    let zmax = 18; // user input!!
    let tile_list = OSM.calculateXYZListFromBounds(map.getBounds(), zmin, zmax);
    let message = "Preparing to cache tiles.\n" + "Zoom level " + zmin + " through " + zmax + "\n" + tile_list.length + " tiles total." + "\nClick OK to proceed.";
    let ok = confirm(message);
    if (!ok) return false;

    var status_block = document.getElementById('status');

    OSM.downloadXYZList(
        tile_list,
        false,
        function (done, total) {
            var percent = Math.round(100 * done / total);
            status_block.innerHTML = done + " / " + total + " = " + percent + "%";
        },
        console.log('downloading...'),
        /*function () {
            // for this demo, on success we use another L.TileLayer.Cordova feature and show the disk usage
            testUsage();
        },*/
        function (error) {
            alert("Failed\nError code: " + error.code);
        }
    );
}