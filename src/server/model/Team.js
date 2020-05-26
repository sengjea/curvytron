function Team(name)
{
    BaseTeam.call(this, name);
}

Team.prototype = Object.create(BaseTeam.prototype);
Team.prototype.constructor = Team;
