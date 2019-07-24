const ConcatPlugin = require('webpack-concat-plugin');
module.exports = [
{
    plugins: [
        new ConcatPlugin(
            {
                uglify: false,
                sourceMap: false,
                name: 'LeafletPlayback',
                fileName: 'LeafletPlayback.js',
                outputPath: './dist/',
                filesToConcat: [
                    './src/prologue.js',
                    './src/Util.js', 
                    './src/MoveableMarker.js',
                    './src/Track.js',
                    './src/TrackController.js',
                    './src/Clock.js',
                    './src/TracksLayer.js',
                    './src/Control.js',
                    './src/Playback.js',
                    './src/epilogue.js'
                ]
            }
        )
    ]
}];