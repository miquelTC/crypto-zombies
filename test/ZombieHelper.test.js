const {
    EVM_REVERT
} = require('./helpers');

const ZombieHelper = artifacts.require('./ZombieHelper');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ZombieFeeding', ([deployer]) => {
    let zombiehelper;
    let zombie;

    beforeEach(async () => {     
        zombiehelper = await ZombieHelper.new();
        await zombiehelper.createRandomZombie('testName', { from: deployer} );
    })

    describe('Level up', () => {        
        it('set level up fee', async () => {
            const fee = 100;
            await zombiehelper.setLevelUpFee(fee, { from: deployer });
            const levelUpFee = await zombiehelper.levelUpFee();
            levelUpFee.toString().should.equal(fee.toString());
        })

        it('level up a zombie', async () => {
            const fee = await zombiehelper.levelUpFee();
            await zombiehelper.levelUp(0, { from: deployer, value: fee} );
            zombie = await zombiehelper.zombies(0);
            const level = zombie.level.toString();
            level.should.equal("2");
        })
    })

})