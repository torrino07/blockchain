// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract CarbonCredit is ERC1155 {
    address public owner;

    struct Project {
        string name;
        bool exists;
    }

    struct WalletInfo {
        uint256 id;
        string role;
        mapping(uint256 => bool) canMintProject;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => WalletInfo) public wallets;

    event WalletAdded(address wallet, uint256 id, string role);
    event WalletRemoved(address wallet);
    event ProjectAdded(uint256 projectId, string name);
    event MintingPermissionGranted(address wallet, uint256 projectId);
    event MintingPermissionRevoked(address wallet, uint256 projectId);
    event TokensMinted(address account, uint256 projectId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier canMint(uint256 projectId) {
        require(wallets[msg.sender].canMintProject[projectId], "Wallet cannot mint for this project");
        _;
    }

    constructor() ERC1155("Your_Metadata_URI") {
        owner = msg.sender;
    }

    function addProject(uint256 projectId, string memory projectName) public onlyOwner {
        require(!projects[projectId].exists, "Project already exists");
        projects[projectId] = Project(projectName, true);
        emit ProjectAdded(projectId, projectName);
    }

    function addWallet(address wallet, uint256 id, string memory role) public onlyOwner {
        WalletInfo storage walletInfo = wallets[wallet];
        require(walletInfo.id != id || keccak256(bytes(walletInfo.role)) != keccak256(bytes(role)), "Wallet already exists with same ID and role");
        walletInfo.id = id;
        walletInfo.role = role;
        emit WalletAdded(wallet, id, role);
    }

    function removeWallet(address wallet) public onlyOwner {
        require(wallets[wallet].id != 0 || bytes(wallets[wallet].role).length != 0, "Wallet does not exist");
        delete wallets[wallet];
        emit WalletRemoved(wallet);
    }

    function grantMintingPermission(address wallet, uint256 projectId) public onlyOwner {
        require(projects[projectId].exists, "Project does not exist");
        wallets[wallet].canMintProject[projectId] = true;
        emit MintingPermissionGranted(wallet, projectId);
    }

    function revokeMintingPermission(address wallet, uint256 projectId) public onlyOwner {
        require(projects[projectId].exists, "Project does not exist");
        wallets[wallet].canMintProject[projectId] = false;
        emit MintingPermissionRevoked(wallet, projectId);
    }

    function mint(address account, uint256 projectId, uint256 amount, bytes memory data) public canMint(projectId) {
        require(projects[projectId].exists, "Project does not exist");
        _mint(account, projectId, amount, data);
        emit TokensMinted(account, projectId, amount);
    }
}


