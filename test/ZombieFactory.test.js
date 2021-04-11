const {
    EVM_REVERT
} = require('./helpers');

const ZombieFactory = artifacts.require('./ZombieFactory');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ZombieFactory', ([deployer]) => {
    let zombiefactory;

    beforeEach(async () => {     
        zombiefactory = await ZombieFactory.new();
    })

    describe('success', () => {        
        let result;
        const name = "testName";

        describe('create zombie', () => {
            beforeEach(async () => {
                result = await zombiefactory.createRandomZombie('testName', { from: deployer });
            })
            
            it('tracks the name', async() => {                
                let zombie = await zombiefactory.zombies(0);
                zombie.name.should.equal(name);
            })

            it('tracks the level', async() => {                
                let zombie = await zombiefactory.zombies(0);
                zombie.level.toString().should.equal("1");
            }) 

            it('emits a NewZombie event', async() => {                
                const log = result.logs[0];
                log.event.should.equal("NewZombie");
                const event = log.args;
                event.zombieId.toString().should.equal("0");
                event.name.should.equal(name);
            })

            it('tracks the zombie-owner mapping', async() => {                
                let mapping = await zombiefactory.zombieToOwner(0);
                mapping.should.equal(deployer);
            })            
        })

        describe('failure', () => {
            it('rejects creation of more than 1 zombie', async() => {
                await zombiefactory.createRandomZombie('testName', { from: deployer });
                await zombiefactory.createRandomZombie('testName2', { from: deployer }).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })

})