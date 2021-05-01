const {
    EVM_REVERT
} = require('./helpers');

const ZombieOwnership = artifacts.require('./ZombieOwnership');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ZombieOwnership', ([deployer, user1]) => {
    let zombieownership;

    beforeEach(async () => {
        zombieownership = await ZombieOwnership.new();
        await zombieownership.createRandomZombie('testName', { from: deployer });
    })

    it('check balance of owner', async () => {
        const result = await zombieownership.balanceOf(deployer);
        result.toString().should.equal('1');
    })

    it('check the owner of a Zombie', async () => {
        const result = await zombieownership.ownerOf(0);
        result.should.equal(deployer);
    })

    // it('check transfer of a Zombie', async () => {
    //     await zombieownership.
    // })


})
