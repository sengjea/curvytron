/**
 * Player List Controller
 *
 * @param {Object} $scope
 * @param {Object} $element
 * @param {SocketClient} client
 */
function PlayerListController($scope, $element, client)
{
    if (!$scope.game) { return; }

    AbstractController.call(this, $scope);

    this.element = $element[0];
    this.client  = client;
    this.game    = this.$scope.game;

    // Binding
    this.onScore      = this.onScore.bind(this);
    this.onRoundScore = this.onRoundScore.bind(this);
    this.onRoundNew   = this.onRoundNew.bind(this);
    this.onRoundEnd   = this.onRoundEnd.bind(this);
    this.onDie        = this.onDie.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
}

PlayerListController.prototype = Object.create(AbstractController.prototype);
PlayerListController.prototype.constructor = PlayerListController;

/**
 * Attach socket Events
 */
PlayerListController.prototype.attachEvents = function()
{
    this.client.on('score', this.onScore);
    this.client.on('score:round', this.onRoundScore);
    this.client.on('game:leave', this.requestDigestScope);
    this.client.on('round:new', this.onRoundNew);
    this.client.on('round:end', this.onRoundEnd);
    this.client.on('die', this.onDie);
};

/**
 * Attach socket Events
 */
PlayerListController.prototype.detachEvents = function()
{
    this.client.off('score', this.onScore);
    this.client.off('score:round', this.onRoundScore);
    this.client.off('game:leave', this.requestDigestScope);
    this.client.off('round:new', this.onRoundNew);
    this.client.off('round:end', this.onRoundEnd);
    this.client.off('die', this.onDie);
};

/**
 * Get avatar related elements in DOM
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.getElements = function(avatar)
{
    if (!avatar.elements.root) {
        avatar.elements.root       = document.getElementById('avatar-' + avatar.id);
        avatar.elements.score      = document.getElementById('avatar-score-' + avatar.id);
        avatar.elements.roundScore = document.getElementById('avatar-round-score-' + avatar.id);

        if (avatar.local) {
            avatar.elements.root.classList.add('local');
        }
    }

    return avatar.elements;
};

PlayerListController.prototype.getTeamElements = function(team)
{
    if (!team.elements.root) {
        team.elements.root       = document.getElementById('team-' + team.id);
        team.elements.score      = document.getElementById('team-score-' + team.id);
        team.elements.roundScore = document.getElementById('team-round-score-' + team.id);

        if (team.local) {
            team.elements.root.classList.add('local');
        }
    }

    return team.elements;
};

/**
 * On score
 *
 * @param {Event} e
 */
PlayerListController.prototype.onScore = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setScore(e.detail[1]);
        this.updateScore(avatar);
        if (this.game.room.config.team) {
            this.updateTeamScore(avatar.player.team)
        }
    }
};

/**
 * On round score
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundScore = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setRoundScore(e.detail[1]);
        this.updateRoundScore(avatar);
        if (this.game.room.config.team) {
            this.updateTeamRoundScore(avatar.player.team);
        }
    }
};

/**
 * On round new
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundNew = function(e)
{
    this.element.classList.add('in-round');

    for (var i = this.game.avatars.items.length - 1; i >= 0; i--) {
        this.getElements(this.game.avatars.items[i]).root.classList.remove('dead');
    }
    if (this.game.room.config.team) {
        this.game.teams.forEach(this.updateTeamRoundScore, this)
    }
};

/**
 * On round dnd
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundEnd = function(e)
{
    this.element.classList.remove('in-round');
    this.reorder();
};

/**
 * On die
 *
 * @param {Event} e
 */
PlayerListController.prototype.onDie = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        this.getElements(avatar).root.classList.add('dead');
    }
};

/**
 * Update score
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.updateScore = function(avatar)
{
    this.getElements(avatar).score.innerHTML = avatar.score;
};


/**
 * Update round score
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.updateRoundScore = function(avatar)
{
    this.getElements(avatar).roundScore.innerHTML = avatar.roundScore ? '+' + avatar.roundScore : '';
};

PlayerListController.prototype.updateTeamScore = function(team)
{
    this.getTeamElements(team).score.innerHTML = team.getScore();
};

PlayerListController.prototype.updateTeamRoundScore = function(team)
{
    this.getTeamElements(team).roundScore.innerHTML = team.getRoundScore() ? '+' + team.getRoundScore() : '';
};
/**
 * Reorder player list
 */
PlayerListController.prototype.reorder = function() {
    var length = this.game.sortAvatars().items.length;

    for (var elements, i = 0; i < length; i++) {
        elements = this.getElements(this.game.avatars.items[i]);
        elements.root.parentNode.appendChild(elements.root);
    }
};
