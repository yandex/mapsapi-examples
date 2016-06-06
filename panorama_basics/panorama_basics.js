ymaps.ready(function () {
    // To begin with, we have to check whether the user's browser supports the panorama player.
    if (!ymaps.panorama.isSupported()) {
        // If it doesn't, we won't do anything.
        return;
    }

    // Searching for a panorama at the point passed.
    ymaps.panorama.locate([55.733685, 37.588264]).done(
        function (panoramas) {
            // Checking that at least one panorama was found.
            if (panoramas.length &gt; 0) {
                // Creating the panorama player with one of the panoramas found.
                var player = new ymaps.panorama.Player(
                        'player1',
                        // The panoramas in the response are sorted by their distance from the point passed in 'panorama.locate'. We are choosing the first one because it will be the closest.
                        panoramas[0],
                        // Setting a viewing direction different from the default value.
                        { direction: [256, 16] }
                    );
            }
        },
        function (error) {
            // If something went wrong, we notify the user.
            alert(error.message);
        }
    );

    // You can also use the 'panorama.createPlayer' method for adding panoramas to a page. This method searches for the nearest panorama and 
if successful, it creates a panorama player with the found panorama.
    ymaps.panorama.createPlayer(
       'player2',
       [59.938557, 30.316198],
       // Searching for an aerial panorama.
       { layer: 'yandex#airPanorama' }
    )
        .done(function (player) {
            // player – a link to the player instance.
        });
});
</p>

