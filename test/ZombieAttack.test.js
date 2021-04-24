const {
    EVM_REVERT
} = require('./helpers');

const ZombieAttack = artifacts.require('./ZombieAttack');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('ZombieAttack', ([deployer, user1]) => {
    
})