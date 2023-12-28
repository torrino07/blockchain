import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CarbonCreditToken } from '../typechain-types';
import { Signer } from 'ethers';

describe('CarbonCredit', function () {
  let token: CarbonCreditToken;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('CarbonCreditToken');
    token = await Token.deploy() as CarbonCreditToken;
  });

  describe('Minter Management', function () {
    it('Should allow owner to add a minter', async function () {
      const addr1Address = await addr1.getAddress();
      await token.addMinter(addr1Address, 1);
      const minter = await token.minters(addr1Address);
      expect(minter.isAuthorized).to.be.true;
      expect(minter.id).to.equal(1);
    });

    it('Should allow owner to remove a minter', async function () {
      const addr1Address = await addr1.getAddress();
      await token.addMinter(addr1Address, 1);
      await token.removeMinter(addr1Address);
      const minter = await token.minters(addr1Address);
      expect(minter.isAuthorized).to.be.false;
    });
  });

  describe('Minting', function () {
    it('Should allow authorized minter to mint tokens', async function () {
      const ownerAddress = await owner.getAddress();
      await token.addMinter(ownerAddress, 2);
      await token.mint(ownerAddress, 1, 100, '0x');
      const balance = await token.balanceOf(ownerAddress, 1);
      expect(balance).to.equal(100);
    });

    it('Should not allow unauthorized address to mint tokens', async function () {
      const addr2Address = await addr2.getAddress();
      await expect(token.connect(addr2).mint(addr2Address, 1, 100, '0x')).to.be.revertedWith('Not minter');
    });
  });

  // Additional tests can be added here
});
