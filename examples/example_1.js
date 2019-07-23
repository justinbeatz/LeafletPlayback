document.addEventListener('DOMContentLoaded', function(){
    // setup data
    var coordinates = [];
    var time = [];
    for (var i = 0; i < newData.length; i++) {
        var coords = newData[i].coords.split(",");

        coords = coords.map(function(elem) {
            if (elem.length > 10) {
                return Number(elem.slice(0, -6));
            }
            // return Number(elem.toFixed(7));
            return Number(elem);
        });
        console.log(coords);
        coordinates.push(coords);
        time.push(newData[i].time * 1000);
    }
    var geoJson = {
        type: "Feature",
        geometry: {
          type: "MultiPoint",
          coordinates: coordinates
        },
        properties: {
          path_options: { color: "red" },
          time: time
        }
    };

    // console.log(geoJson);

    // Get start/end times
    // var startTime = new Date(demoTracks[0].properties.time[0]);
    var startTime = new Date(newData[0].time * 1000);
    // var endTime = new Date(demoTracks[0].properties.time[demoTracks[0].properties.time.length - 1]);
    var endTime = new Date(newData[newData.length -1].time * 1000);

    // Create a DataSet with data
    var timelineData = new vis.DataSet([{ start: startTime, end: endTime, content: 'Demo GPS Tracks' }]);

    // Set timeline options
    var timelineOptions = {
      "width":  "100%",
      "height": "120px",
      "type": "box",
    };

    // Setup timeline
    var timeline = new vis.Timeline(document.getElementById('timeline'), timelineData, timelineOptions);

    // Set custom time marker (blue)
    timeline.addCustomTime(startTime);

    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

    // Center map and default zoom level
    // map.setView([44.5, -123.6], 10);
    map.setView([19.1612274, -70.9580545], 10);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // =====================================================
    // =============== Playback ============================
    // =====================================================

    // Playback options
    var playbackOptions = {

        playControl: true,
        dateControl: true,
        showTracksByDefault: true,

        // layer and marker options
        layer : {
            pointToLayer : function(featureData, latlng) {
                var result = {};

                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }

                if (!result.radius){
                    result.radius = 5;
                }

                return new L.CircleMarker(latlng, result);
            }
        },

        marker: {
            getPopup: function(featureData) {
                var result = '';

                if (featureData && featureData.properties && featureData.properties.title) {
                    result = featureData.properties.title;
                }

                return result;
            }
        }

    };

    // Initialize playback
    var playback = new L.Playback(map, null, onPlaybackTimeChange, playbackOptions);

    playback.setData(geoJson);
    // playback.addData(geoJson);

    // Uncomment to test data reset;
    //playback.setData(blueMountain);

    // Set timeline time change event, so cursor is set after moving custom time (blue)
    timeline.on('timechange', onCustomTimeChange);

    // A callback so timeline is set after changing playback time
    function onPlaybackTimeChange (ms) {
        timeline.setCustomTime(new Date(ms));
    };

    //
    function onCustomTimeChange(properties) {
        if (!playback.isPlaying()) {
            playback.setCursor(properties.time.getTime());
        }
    }
});
