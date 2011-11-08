var initial_stones = [
        [0, y:0}],
        [{x:1, y:0},{x:0, y:1},{x:1, y:1}],
    ];
goban.set({
    initial_stones: initial_stones
});
var stones = goban.get( 'stones' );
console.dir( goban.group( stones, {x:0, y:0} ) );

