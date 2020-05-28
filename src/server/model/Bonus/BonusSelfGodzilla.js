/**
 * Godzilla Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfGodzilla(x, y)
{
    BonusSelf.call(this, x, y);
}

BonusSelfGodzilla.prototype = Object.create(BonusSelf.prototype);
BonusSelfGodzilla.prototype.constructor = BonusSelfGodzilla;

BonusSelfGodzilla.prototype.probability = 0.05;
/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfGodzilla.prototype.getEffects = function(avatar)
{
    return [
        ['invincible', true],
        ['printing', 100],
        ['radius', 2],
        ['velocity', 6]
    ];
};
