const {
    EVM_REVERT
} = require('./helpers');

const ZombieAttack = artifacts.require('./ZombieAttack');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ZombieAttack', ([deployer, user1]) => {    
    let zombieattack;
    
    beforeEach(async () => {
        zombieattack = await ZombieAttack.new();
        await zombieattack.createRandomZombie('deployerZombie', { from: deployer} );
        await zombieattack.createRandomZombie('user1Zombie', { from: user1} );
    })
    
    describe('battle between zombies', () => {
        it('failure when non-owner tries to arrack', async() => {
            await zombieattack.attack(0, 1, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        })   

        // it('victory scenario', async() => {
        //     await zombieattack.setAttackVictoryProbability(100);
        //     await zombieattack.attack(0, 1)
        // })
    })
    
})