const {
    EVM_REVERT
} = require('./helpers');

const ZombieHelper = artifacts.require('./ZombieHelper');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ZombieHelper', ([deployer, user1]) => {
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

        it('level up failing if not paying fees', async () => {
            const fee = await zombiehelper.levelUpFee();
            await zombiehelper.levelUp(0, { from: deployer, value: fee-10} ).should.be.rejectedWith(EVM_REVERT);
        })
    })

    describe('withdraws', () => {
        beforeEach(async () => {
            const fee = await zombiehelper.levelUpFee();
            await zombiehelper.levelUp(0, { from: deployer, value: fee} );
        })
        
        it('owner withdrawing fees', async () => {
            await zombiehelper.withdraw({ from: deployer });
            let contractBalance = await web3.eth.getBalance(zombiehelper.address);
            contractBalance.toString().should.equal("0");
        })

        it('failure when someone else withdraws fees', async () => {
            await zombiehelper.withdraw({ from: user1 }).should.be.rejectedWith(EVM_REVERT);                     
        })
    })

    describe ('change name of a zombie', () => {
        it('owner changes the name', async () => {
            const fee = await zombiehelper.levelUpFee();
            await zombiehelper.levelUp(0, { from: deployer, value: fee} );
            await zombiehelper.changeName(0, "newName", { from: deployer });
            zombie = await zombiehelper.zombies(0);
            zombie.name.should.equal("newName");
        })

        it('failure when someone else changes name', async () => {
            const fee = await zombiehelper.levelUpFee();
            await zombiehelper.levelUp(0, { from: deployer, value: fee} );
            await zombiehelper.changeName(0, "newName", { from: user1 }).should.be.rejectedWith(EVM_REVERT);           
        })

        it('failure when below level 2', async () => {
            await zombiehelper.changeName(0, "newName", { from: deployer }).should.be.rejectedWith(EVM_REVERT);           
        })               
    })

    describe('change dna of a zombie', () => {
        it('owner changes the dna', async () => {
            const fee = await zombiehelper.levelUpFee();
            for(let i = 0; i < 20; i++) {
                await zombiehelper.levelUp(0, { from: deployer, value: fee} ); 
            }
            await zombiehelper.changeDna(0, 123, { from: deployer });
            zombie = await zombiehelper.zombies(0);
            zombie.dna.toString().should.equal("123");
        })

        it('failure when someone else changes dna', async () => {
            const fee = await zombiehelper.levelUpFee();
            for(let i = 0; i < 19; i++) {
                await zombiehelper.levelUp(0, { from: deployer, value: fee} ); 
            }
            await zombiehelper.changeDna(0, 123, { from: user1 }).should.be.rejectedWith(EVM_REVERT);          
        })

        it('failure when below level 20', async () => {
            const fee = await zombiehelper.levelUpFee();
            for(let i = 0; i < 18; i++) {
                await zombiehelper.levelUp(0, { from: deployer, value: fee} ); 
            }
            await zombiehelper.changeDna(0, 123, { from: deployer }).should.be.rejectedWith(EVM_REVERT);           
        })
    })

})