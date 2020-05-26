
function BaseTeam(name)
{
    EventEmitter.call(this);
    this.name = name;
    this.players = new Collection([], 'id', true);
    
}

BaseTeam.prototype = Object.create(EventEmitter.prototype);
BaseTeam.prototype.constructor = BaseTeam;

BaseTeam.prototype.add = function(player) {
    this.players.add(player);
};

BaseTeam.prototype.clear = function() {
    this.players.clear();
};

BaseTeam.prototype.getScore = function () {
    return this.players.reduce(function(score, player) {
        return score + (player.getAvatar().score || 0);
    },0);
};

BaseTeam.prototype.getRoundScore = function () {
    return this.players.reduce(function(score, player) {
        return score + (player.getAvatar().roundScore || 0);
    },0);
};