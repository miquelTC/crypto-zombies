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

    describe('deployment', () => {
        it('tracks balance of owner', async () => {
            const result = await zombieownership.balanceOf(deployer);
            result.toString().should.equal('1');
        })
    
        it('tracks the owner of a Zombie', async () => {
            const result = await zombieownership.ownerOf(0);
            result.should.equal(deployer);
        })        
    })

    describe('transfer', () => {
        it('tracks transfer from owner', async () => {
            let balanceOf;
            await zombieownership.transferFrom(deployer, user1, 0, { from: deployer });
            balanceOf = await zombieownership.balanceOf(deployer);
            balanceOf.toString().should.equal('0');
            balanceOf = await zombieownership.balanceOf(user1);
            balanceOf.toString().should.equal('1');
            const owner = await zombieownership.ownerOf(0);
            owner.should.equal(user1);
        })

        it('tracks transfer from approved user', async () => {
            let balanceOf;
            await zombieownership.approve(user1, 0, { from: deployer });
            await zombieownership.transferFrom(deployer, user1, 0, { from: user1 });
            balanceOf = await zombieownership.balanceOf(deployer);
            balanceOf.toString().should.equal('0');
            balanceOf = await zombieownership.balanceOf(user1);
            balanceOf.toString().should.equal('1');
            const owner = await zombieownership.ownerOf(0);
            owner.should.equal(user1);
        })

        it('failure when non-owner tries to approve', async () => {
            await zombieownership.approve(user1, 0, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        })

        it('failure when non-approved tries to transfer', async () => {
            await zombieownership.transferFrom(deployer, user1, 0, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        })
    })

    describe('events', () => {
        it('emits a Transfer event', async () => {
            const result = await zombieownership.transferFrom(deployer, user1, 0, { from: deployer });
            const log = result.logs[0];
            log.event.should.eq('Transfer');
            const event = log.args;
            event._from.should.equal(deployer, 'from is correct');
            event._to.should.equal(user1, 'to is correct');
            event._tokenId.toString().should.equal('0', 'token is correct');
        })

        it('emits an Approval event', async () => {
            const result = await zombieownership.approve(user1, 0, { from: deployer });
            const log = result.logs[0];
            log.event.should.equal('Approval');
            const event = log.args;
            event._owner.should.equal(deployer, 'owner is correct');
            event._approved.should.equal(user1, 'approved is correct');
            event._tokenId.toString().should.equal('0', 'token is correct');
        })
    })



})
