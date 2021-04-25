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
    })
    
    describe('success', () => {
        beforeEach(async () => {            
            await zombieattack.setCooldownTime(0);
            await zombieattack.createRandomZombie('deployerZombie', { from: deployer} );
            await zombieattack.createRandomZombie('user1Zombie', { from: user1} );
        })
   
        it('victory scenario', async() => {
            await zombieattack.setAttackVictoryProbability(100, { from: deployer });
            await zombieattack.attack(0, 1, { from: deployer });
            const myZombie = await zombieattack.zombies(0);
            myZombie.winCount.toString().should.equal('1');
            myZombie.lossCount.toString().should.equal('0');
            myZombie.level.toString().should.equal('2');
            const enemyZombie = await zombieattack.zombies(1);
            enemyZombie.winCount.toString().should.equal('0');
            enemyZombie.lossCount.toString().should.equal('1');
        })

        it('defeat scenario', async() => {
            await zombieattack.setAttackVictoryProbability(0, { from: deployer });
            await zombieattack.attack(0, 1, { from: deployer });
            const myZombie = await zombieattack.zombies(0);
            myZombie.winCount.toString().should.equal('0');
            myZombie.lossCount.toString().should.equal('1');
            myZombie.level.toString().should.equal('1');
            const enemyZombie = await zombieattack.zombies(1);
            enemyZombie.winCount.toString().should.equal('1');
            enemyZombie.lossCount.toString().should.equal('0');
        })    

        it('feed and multiply', async () => {
            await zombieattack.setAttackVictoryProbability(100, { from: deployer });
            await zombieattack.attack(0, 1, { from: deployer });
            const newZombie = await zombieattack.zombies(2);
            newZombie.name.should.equal("NoName");
            
        })    
    })

    describe('failure', () => {
        it('failure when the zombie is not ready due to the cooldown', async() => {
            await zombieattack.setAttackVictoryProbability(100, { from: deployer });
            await zombieattack.setCooldownTime(1000);
            await zombieattack.createRandomZombie('deployerZombie', { from: deployer} );
            await zombieattack.createRandomZombie('user1Zombie', { from: user1} );
            await zombieattack.attack(0, 1, { from: deployer }).should.be.rejectedWith(EVM_REVERT);
        })
        
        it('failure when non-owner tries to set probability', async() => {
            await zombieattack.setCooldownTime(0);
            await zombieattack.createRandomZombie('deployerZombie', { from: deployer} );
            await zombieattack.createRandomZombie('user1Zombie', { from: user1} );
            await zombieattack.setAttackVictoryProbability(100, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        }) 

        it('failure when non-owner tries to attack', async() => {
            await zombieattack.setCooldownTime(0);
            await zombieattack.createRandomZombie('deployerZombie', { from: deployer} );
            await zombieattack.createRandomZombie('user1Zombie', { from: user1} );           
            await zombieattack.attack(0, 1, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        }) 
    })    
})