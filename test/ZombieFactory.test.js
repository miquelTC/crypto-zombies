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
                let result = await zombiefactory.createRandomZombie('testName', { from: deployer });
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
        })
    })
})