function Team(name) {
    BaseTeam.call(this, name);
    this.elements     = {
        root: null,
        roundScore: null,
        score: null
    };
}

Team.prototype = Object.create(BaseTeam.prototype);
Team.prototype.constructor = Team;