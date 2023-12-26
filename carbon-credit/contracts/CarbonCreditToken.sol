// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract CarbonCreditToken is ERC1155 {
    address public owner;

    struct AddressInfo {
        bool isMinter;
        uint256 id;
    }

    mapping(address => AddressInfo) public addresses;
    address[] private addressList;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() ERC1155("") {
        owner = msg.sender;
        addAddress(msg.sender, 0, true);
    }

    function addAddress(address _address, uint256 _id, bool _isMinter) public onlyOwner {
        addresses[_address] = AddressInfo(_isMinter, _id);
        addressList.push(_address);
    }

    function updateAddressStatus(address _address, bool _isMinter) public onlyOwner {
        require(_address != address(0), "Invalid address");
        require(addresses[_address].id != 0, "Address not found");
        addresses[_address].isMinter = _isMinter;
    }

    function removeAddress(address _address) public onlyOwner {
        require(_address != address(0), "Invalid address");
        delete addresses[_address];
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
        require(addresses[msg.sender].isMinter, "Not minter");
        _mint(account, id, amount, data);
    }

    function getAllAddresses() public view returns (address[] memory) {
        return addressList;
    }
}
