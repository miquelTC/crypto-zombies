pragma solidity >=0.5.0 <0.6.0;

import "./zombiefactory.sol";

// We will use this function from the famous Crypto Kitties in order to get Kitties data for our zombies to eat them
contract KittyInterface {
    function getKitty(uint256 _id) external view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    );
}

contract ZombieFeeding is ZombieFactory {
    
    KittyInterface kittyContract;

    // Modifier to verify the ownership of the zombie
    modifier onlyOwnerOf(uint _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        _;
    }
    
    // Function to parametrize the Kitties address, in case it changes someday
    function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
    }

    // Function to initiate the Cooldown of a Zombie
    function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
    }

    // Function to verify if the Cooldown is consumed, so then the Zombie is ready
    function _isReady(Zombie storage _zombie) internal view returns(bool) {
        return (_zombie.readyTime <= now);
    }
    
    // Function for my zombie to feed another zombie or a Kitty, and multiply
    function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal onlyOwnerOf(_zombieId) {
        Zombie storage myZombie = zombies[_zombieId];
        require(_isReady(myZombie));
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if(keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
            newDna = newDna - newDna % 100 + 99;
        }
        _createZombie("NoName", newDna);
        _triggerCooldown(myZombie);
    }

    // Function to feed on a kitty
    function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_zombieId, kittyDna, "kitty");
  }

}