import { expect } from 'chai';
import { ContractTransactionResponse } from 'ethers';
import { ethers } from 'hardhat';
import { SimpleCounter } from '../typechain-types';

describe('SimpleCounter', function () {
  let counter: SimpleCounter & { deploymentTransaction(): ContractTransactionResponse; };
  let owner;
  let addr1;

  beforeEach(async function () {
    const Counter = await ethers.getContractFactory('SimpleCounter');
    counter = await Counter.deploy(0);
  });

  describe('Deployment', function () {
    it('Should start with a count of 0', async function () {
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe('Increment', function () {
    it('Should increment the counter', async function () {
      await counter.increment();
      expect(await counter.getCount()).to.equal(1);
    });
  });

  describe('Decrement', function () {
    it('Should decrement the counter', async function () {
      await counter.increment();
      await counter.decrement();
      expect(await counter.getCount()).to.equal(0);
    });

    it('Should fail if decrementing when the counter is 0', async function () {
      await expect(counter.decrement()).to.be.revertedWith('Counter cannot be negative');
    });
  });
});

//it->individual test